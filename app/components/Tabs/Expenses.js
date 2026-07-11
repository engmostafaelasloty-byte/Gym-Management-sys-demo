'use client';
import React, { useState, useMemo } from 'react';

const CATEGORIES = {

    electricity: { icon: '⚡', ar: 'كهرباء', en: 'Electricity' },
    water: { icon: '💧', ar: 'مياه', en: 'Water' },
    rent: { icon: '🏠', ar: 'إيجار', en: 'Rent' },
    maintenance: { icon: '🔧', ar: 'صيانة أجهزة', en: 'Maintenance' },
    new_equipment: { icon: '🏋️', ar: 'شراء أجهزة جديدة', en: 'New Equipment' },
    equipment_exchange: { icon: '🔄', ar: 'تبديل أجهزة', en: 'Equipment Exchange' },
    cleaning: { icon: '🧹', ar: 'نظافة', en: 'Cleaning' },
    marketing: { icon: '📢', ar: 'تسويق وإعلانات', en: 'Marketing' },
    insurance: { icon: '🛡️', ar: 'تأمين', en: 'Insurance' },
    taxes: { icon: '📋', ar: 'ضرائب', en: 'Taxes' },
    supplies: { icon: '📦', ar: 'مستلزمات', en: 'Supplies' },
    returns: { icon: '↩️', ar: 'مرتجعات', en: 'Returns' },
    other: { icon: '📌', ar: 'أخرى', en: 'Other' },
};

const PERIODS = {
    men: { icon: '🔵', ar: 'فترة الرجال', en: 'Men Period' },
    women: { icon: '🟣', ar: 'فترة النساء', en: 'Women Period' },
    mix: { icon: '🟢', ar: 'فترة الميكس', en: 'Mix Period' },
    general: { icon: '⚪', ar: 'عام', en: 'General' },
};

export default function ExpensesTab({
    t, mode, lang, expenses, currentUser, editExpId, setEditExpId, expFormRef,
    handleExpSubmit, handleDelete, exportToCSV, currency
}) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const isAdmin = currentUser?.role === 'admin';
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterPeriod, setFilterPeriod] = useState('all');
    const [filterMonth, setFilterMonth] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const getCategoryLabel = (cat) => {
        const c = CATEGORIES[cat] || CATEGORIES.other;
        return `${c.icon} ${lang === 'ar' ? c.ar : (t && t[cat] ? t[cat] : c.en)}`;
    };

    const getPeriodLabel = (period) => {
        const p = PERIODS[period] || PERIODS.general;
        return `${p.icon} ${lang === 'ar' ? p.ar : (t && t[period] ? t[period] : p.en)}`;
    };

    const getPeriodBadgeStyle = (period) => {
        const colors = {
            men: { bg: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' },
            women: { bg: 'rgba(168,85,247,0.2)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' },
            mix: { bg: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' },
            general: { bg: 'rgba(156,163,175,0.2)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.3)' },
        };
        const s = colors[period] || colors.general;
        return { background: s.bg, color: s.color, border: s.border, padding: '2px 8px', borderRadius: 6, fontSize: '0.8em', display: 'inline-block' };
    };

    // Filtered expenses
    const filteredExpenses = useMemo(() => {
        let result = [...expenses];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(e =>
                e.name?.toLowerCase().includes(term) ||
                e.note?.toLowerCase().includes(term)
            );
        }

        if (filterCategory !== 'all') {
            result = result.filter(e => e.category === filterCategory);
        }

        if (filterPeriod !== 'all') {
            result = result.filter(e => e.period === filterPeriod);
        }

        if (filterMonth !== 'all') {
            result = result.filter(e => {
                if (!e.date) return false;
                const d = new Date(e.date);
                const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                return monthKey === filterMonth;
            });
        }

        return result;
    }, [expenses, searchTerm, filterCategory, filterPeriod, filterMonth]);

    // Summary stats
    const summary = useMemo(() => {
        const total = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        const byCategory = {};
        const byPeriod = {};
        filteredExpenses.forEach(e => {
            const cat = e.category || 'other';
            const per = e.period || 'general';
            byCategory[cat] = (byCategory[cat] || 0) + (e.amount || 0);
            byPeriod[per] = (byPeriod[per] || 0) + (e.amount || 0);
        });
        return { total, byCategory, byPeriod };
    }, [filteredExpenses]);

    // Available months for filter
    const availableMonths = useMemo(() => {
        const months = new Set();
        expenses.forEach(e => {
            if (e.date) {
                const d = new Date(e.date);
                months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
            }
        });
        return Array.from(months).sort().reverse();
    }, [expenses]);

    const formatMonthLabel = (monthKey) => {
        const [year, month] = monthKey.split('-');
        const d = new Date(year, parseInt(month) - 1);
        return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <section className="panel">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                💸 {t.expenses}
            </h2>

            {/* Form */}
            <form ref={expFormRef} onSubmit={handleExpSubmit} className="form-grid" style={{ background: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="tooltip-field" data-tooltip={trans('expenseNameTooltip', 'اسم المصروف: إيجار، كهرباء، مياه...', 'Expense: Rent, Electricity, Water...')}><input name="name" placeholder={trans('expenseNamePlaceholder', 'اسم المصروف', 'Expense Name')} required /></div>
                <div className="tooltip-field" data-tooltip={trans('amountTooltip', 'المبلغ بالعملة المحلية', 'Amount in local currency')}><input name="amount" type="number" step="0.01" placeholder={t.amount} required /></div>

                <select name="category" defaultValue="other">
                    {Object.entries(CATEGORIES).map(([key, val]) => (
                        <option key={key} value={key}>{val.icon} {lang === 'ar' ? val.ar : (t && t[key] ? t[key] : val.en)}</option>
                    ))}
                </select>

                {isAdmin ? (
                    <select name="period" defaultValue="general">
                        {Object.entries(PERIODS).map(([key, val]) => (
                            <option key={key} value={key}>{val.icon} {lang === 'ar' ? val.ar : (t && t[key] ? t[key] : val.en)}</option>
                        ))}
                    </select>
                ) : (
                    <select name="period" value={mode === 'men' ? 'men' : mode === 'women' ? 'women' : 'mix'} disabled>
                        <option value={mode === 'men' ? 'men' : mode === 'women' ? 'women' : 'mix'}>
                            {getPeriodLabel(mode === 'men' ? 'men' : mode === 'women' ? 'women' : 'mix')}
                        </option>
                    </select>
                )}

                <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                <div className="tooltip-field" data-tooltip={trans('additionalNotesTooltip', 'ملاحظات إضافية (اختياري)', 'Additional notes (optional)')}><input name="note" placeholder={t.note} /></div>



                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input name="isRecurring" type="checkbox" />
                    <span>{trans('recurringMonthly', 'مصروف متكرر (شهري)', 'Recurring (monthly)')}</span>
                </label>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
                    <button type="submit" style={{ flex: 1 }}>{editExpId ? t.save : t.save}</button>
                    {editExpId && (
                        <button type="button" onClick={() => { setEditExpId(null); expFormRef.current?.reset(); }} style={{ background: 'gray' }}>{t.cancel}</button>
                    )}
                </div>
            </form>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 20 }}>
                {/* Total */}
                <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: 15, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.85em', opacity: 0.7 }}>{trans('totalExpenses', 'إجمالي المصروفات', 'Total Expenses')}</div>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#f87171' }}>{summary.total.toLocaleString()} {currency}</div>
                    <div style={{ fontSize: '0.75em', opacity: 0.5, marginTop: 4 }}>{filteredExpenses.length} {trans('itemsCount', 'عنصر', 'items')}</div>
                </div>

                {/* By Period */}
                {Object.entries(summary.byPeriod).map(([period, amount]) => (
                    <div key={period} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 15, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.85em', opacity: 0.7 }}>{getPeriodLabel(period)}</div>
                        <div style={{ fontSize: '1.3em', fontWeight: 'bold' }}>{amount.toLocaleString()} {currency}</div>
                    </div>
                ))}
            </div>

            {/* Category Breakdown */}
            {Object.keys(summary.byCategory).length > 0 && (
                <div style={{ marginTop: 15, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 15, border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '0.9em', opacity: 0.7 }}>{trans('expensesByCategoryBreakdown', '📊 توزيع المصروفات حسب التصنيف', '📊 Expenses by Category')}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {Object.entries(summary.byCategory)
                            .sort(([, a], [, b]) => b - a)
                            .map(([cat, amount]) => {
                                const percentage = ((amount / summary.total) * 100).toFixed(1);
                                return (
                                    <div key={cat} style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: 8,
                                        padding: '8px 12px',
                                        fontSize: '0.85em',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        border: '1px solid rgba(255,255,255,0.06)'
                                    }}>
                                        <span>{getCategoryLabel(cat)}</span>
                                        <span style={{ fontWeight: 'bold' }}>{amount.toLocaleString()} {currency}</span>
                                        <span style={{ opacity: 0.5, fontSize: '0.85em' }}>({percentage}%)</span>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20, marginBottom: 10 }}>
                <input
                    type="text"
                    placeholder={trans('searchExpensesPlaceholder', '🔍 بحث في المصروفات...', '🔍 Search expenses...')} title={trans('searchExpensesTitle', 'ابحث باسم المصروف أو الملاحظة', 'Search by expense name or note')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 2, minWidth: '150px' }}
                />
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ flex: 1, minWidth: '130px' }}>
                    <option value="all">{trans('allCategories', 'كل التصنيفات', 'All Categories')}</option>
                    {Object.entries(CATEGORIES).map(([key, val]) => (
                        <option key={key} value={key}>{val.icon} {lang === 'ar' ? val.ar : (t && t[key] ? t[key] : val.en)}</option>
                    ))}
                </select>
                <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)} style={{ flex: 1, minWidth: '120px' }}>
                    <option value="all">{trans('allPeriods', 'كل الفترات', 'All Periods')}</option>
                    {Object.entries(PERIODS).map(([key, val]) => (
                        <option key={key} value={key}>{val.icon} {lang === 'ar' ? val.ar : (t && t[key] ? t[key] : val.en)}</option>
                    ))}
                </select>
                <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={{ flex: 1, minWidth: '130px' }}>
                    <option value="all">{trans('allMonths', 'كل الشهور', 'All Months')}</option>
                    {availableMonths.map(m => (
                        <option key={m} value={m}>{formatMonthLabel(m)}</option>
                    ))}
                </select>
                <button className="secondary" onClick={() => exportToCSV(filteredExpenses, 'expenses')} style={{ flex: '0 0 auto' }}>
                    📤 {t.export}
                </button>
            </div>

            {/* Table */}
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t.name}</th>
                            <th>{trans('category', 'التصنيف', 'Category')}</th>
                            <th>{t.amount}</th>
                            <th>{trans('period', 'الفترة', 'Period')}</th>
                            <th>{trans('date', 'التاريخ', 'Date')}</th>
                            <th>{t.note}</th>
                            <th>{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((e, idx) => (
                            <tr key={e._id}>
                                <td>{idx + 1}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {e.isRecurring && <span title={trans('recurring', 'متكرر', 'Recurring')} style={{ fontSize: '0.8em' }}>🔁</span>}
                                        {e.name}
                                    </div>
                                </td>
                                <td>{getCategoryLabel(e.category)}</td>
                                <td style={{ fontWeight: 'bold', color: '#f87171' }}>{e.amount?.toLocaleString()} {currency}</td>
                                <td><span style={getPeriodBadgeStyle(e.period)}>{getPeriodLabel(e.period)}</span></td>
                                <td>{e.date?.split('T')[0] || '—'}</td>
                                <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.note || '—'}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 5 }}>
                                        <button className="small" onClick={() => {
                                            setEditExpId(e._id);
                                            setTimeout(() => {
                                                const f = expFormRef.current;
                                                if (f) {
                                                    f.elements['name'].value = e.name;
                                                    f.elements['amount'].value = e.amount;
                                                    f.elements['note'].value = e.note || '';
                                                    f.elements['date'].value = e.date?.split('T')[0] || new Date().toISOString().split('T')[0];
                                                    f.elements['category'].value = e.category || 'other';
                                                    f.elements['period'].value = e.period || 'general';
                                                    if (f.elements['gender']) f.elements['gender'].value = e.gender || 'general';
                                                    if (f.elements['isRecurring']) f.elements['isRecurring'].checked = e.isRecurring || false;
                                                    f.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                    f.elements['name'].focus({ preventScroll: true });
                                                }
                                            }, 100);
                                        }}>{t.edit}</button>
                                        <button className="small" onClick={() => handleDelete('exp', e._id)} style={{ background: 'darkred' }}>{t.delete}</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredExpenses.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
                    {trans('noMatchingExpenses', 'لا توجد مصروفات مطابقة', 'No matching expenses')}
                </div>
            )}
        </section>
    );
}
