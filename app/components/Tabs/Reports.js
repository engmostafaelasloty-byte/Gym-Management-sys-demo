'use client';
import React, { useState } from 'react';

export default function ReportsTab({ lang, t, mode, currentUser, monthlyComparison, advStats, currency }) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const [view, setView] = useState('monthly'); // 'monthly' | 'kpis'

    const canViewSalaries = currentUser?.role === 'admin' || currentUser?.permissions?.canViewSalaries;

    // Adjust monthlyComparison so if salaries are hidden, we do NOT deduct salaries from profits!
    const adjustedComparison = (monthlyComparison || []).map(m => {
        if (canViewSalaries) return m;
        return {
            ...m,
            salaries: 0,
            profit: (m.profit || 0) + (m.salaries || 0)
        };
    });

    const maxIncome = Math.max(...(adjustedComparison || []).map(m => m.income || 0), 1);
    const maxProfit = Math.max(...(adjustedComparison || []).map(m => Math.abs(m.profit || 0)), 1);

    const totalIncome = (adjustedComparison || []).reduce((s, m) => s + (m.income || 0), 0);
    const totalExpenses = (adjustedComparison || []).reduce((s, m) => s + (m.expenses || 0), 0);
    const totalSalaries = (adjustedComparison || []).reduce((s, m) => s + (m.salaries || 0), 0);
    const totalProfit = (adjustedComparison || []).reduce((s, m) => s + (m.profit || 0), 0);
    const totalGoods = (adjustedComparison || []).reduce((s, m) => s + (m.goodsProfit || 0), 0);

    const fmt = (n) => `${Number(n || 0).toLocaleString()} ${currency}`;

    const exportReport = () => {
        const headers = [
            trans('month', 'الشهر', 'Month'),
            trans('subscriptionIncome', 'دخل الاشتراكات', 'Subscription Income'),
            trans('goodsProfit', 'أرباح البضائع', 'Goods Profit'),
            trans('expenses', 'المصروفات', 'Expenses'),
            ...(canViewSalaries ? [trans('salaries', 'الرواتب', 'Salaries')] : []),
            trans('netProfit', 'صافي الربح', 'Net Profit'),
        ].join(',');
        const rows = (adjustedComparison || []).map(m => {
            const rowFields = [
                m.month,
                m.income,
                m.goodsProfit,
                m.expenses,
                ...(canViewSalaries ? [m.salaries || 0] : []),
                m.profit
            ];
            return rowFields.join(',');
        }).join('\n');
        const blob = new Blob(['\uFEFF' + headers + '\n' + rows], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `report_${new Date().getFullYear()}.csv`;
        a.click();
    };

    return (
        <section className="panel">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <h2 style={{ margin: 0 }}>{t.reports}</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="small" onClick={() => setView('monthly')} style={{
                        background: view === 'monthly' ? 'linear-gradient(135deg,#0b6b8a,#1496b0)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', fontSize: 12
                    }}>
                        📊 {trans('monthly', 'شهري', 'Monthly')}
                    </button>
                    <button className="small" onClick={() => setView('kpis')} style={{
                        background: view === 'kpis' ? 'linear-gradient(135deg,#0b6b8a,#1496b0)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', fontSize: 12
                    }}>
                        🎯 {trans('kpis', 'مؤشرات الأداء', 'KPIs')}
                    </button>
                    <button className="small" onClick={exportReport} style={{
                        background: 'rgba(14,230,183,0.1)', border: '1px solid rgba(14,230,183,0.2)',
                        color: '#0ee6b7', fontSize: 12
                    }}>
                        📤 {trans('exportCSV', 'تصدير CSV', 'Export CSV')}
                    </button>
                </div>
            </div>

            {/* Annual Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 14, marginBottom: 28 }}>
                {[
                    { label: trans('totalIncome', 'إجمالي الدخل', 'Total Income'), value: fmt(totalIncome), color: '#0ee6b7', icon: '💰' },
                    { label: trans('goodsProfit', 'أرباح البضائع', 'Goods Profit'), value: fmt(totalGoods), color: '#1496b0', icon: '📦' },
                    { label: trans('totalExpenses', 'إجمالي المصروفات', 'Total Expenses'), value: fmt(totalExpenses), color: '#ff9800', icon: '💸' },
                    ...(canViewSalaries ? [{ label: trans('totalSalaries', 'إجمالي الرواتب', 'Total Salaries'), value: fmt(totalSalaries), color: '#ff5722', icon: '💵' }] : []),
                    { label: trans('netAnnualProfit', 'صافي الربح السنوي', 'Net Annual Profit'), value: fmt(totalProfit), color: totalProfit >= 0 ? '#4cd137' : '#ff6b6b', icon: totalProfit >= 0 ? '📈' : '📉' },
                ].map(card => (
                    <div key={card.label} style={{
                        padding: '16px 20px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 14,
                        position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${card.color},transparent)` }} />
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{card.icon}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: card.color }}>{card.value}</div>
                        <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>{card.label}</div>
                    </div>
                ))}
            </div>

            {/* Monthly View */}
            {view === 'monthly' && (
                <>
                    {/* Bar Chart */}
                    <div style={{ marginBottom: 28 }}>
                        <h3 style={{ fontSize: 14, opacity: 0.7, marginBottom: 12 }}>
                            📊 {trans('monthlyIncomeChart', 'مخطط الدخل الشهري', 'Monthly Income Chart')}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160, padding: '0 4px' }}>
                            {(adjustedComparison || []).map((m, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <div style={{ fontSize: 9, opacity: 0.5, fontWeight: 600 }}>
                                        {m.income > 0 ? fmt(m.income) : ''}
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: `${Math.max(4, (m.income / maxIncome) * 130)}px`,
                                        background: m.profit >= 0
                                            ? 'linear-gradient(to top, #0b6b8a, #0ee6b7)'
                                            : 'linear-gradient(to top, #8b0000, #ff6b6b)',
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height 0.5s ease',
                                        cursor: 'help',
                                        opacity: m.income === 0 ? 0.2 : 1,
                                    }} title={`${m.month}: ${fmt(m.income)} - Profit: ${fmt(m.profit)}`} />
                                    <div style={{ fontSize: 9, opacity: 0.5, textAlign: 'center', transform: 'rotate(-30deg)', transformOrigin: 'top center', marginTop: 2 }}>
                                        {m.month?.slice(0, 3)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Table */}
                    <h3 style={{ fontSize: 14, opacity: 0.7, marginBottom: 12 }}>
                        📋 {trans('monthlyComparisonDetails', 'تفاصيل المقارنة الشهرية', 'Monthly Comparison Details')}
                    </h3>
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>{trans('month', 'الشهر', 'Month')}</th>
                                    <th>{trans('subsIncome', 'دخل الاشتراكات', 'Subs Income')}</th>
                                    <th>{trans('goodsProfit', 'أرباح البضائع', 'Goods')}</th>
                                    <th>{trans('expenses', 'المصروفات', 'Expenses')}</th>
                                    {canViewSalaries && <th>{trans('salaries', 'الرواتب', 'Salaries')}</th>}
                                    <th>{trans('netProfit', 'صافي الربح', 'Net Profit')}</th>
                                    <th>{trans('performance', 'الأداء', 'Performance')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(adjustedComparison || []).map((m, i) => {
                                    const perfPct = totalIncome > 0 ? Math.round((m.income / (totalIncome / 12)) * 100) : 0;
                                    return (
                                        <tr key={i} style={{ opacity: m.income === 0 && m.expenses === 0 && m.salaries === 0 ? 0.4 : 1 }}>
                                            <td style={{ fontWeight: 700 }}>{m.month}</td>
                                            <td style={{ color: '#0ee6b7' }}>{fmt(m.income)}</td>
                                            <td style={{ color: '#1496b0' }}>{fmt(m.goodsProfit)}</td>
                                            <td style={{ color: '#ff9800' }}>{fmt(m.expenses)}</td>
                                            {canViewSalaries && <td style={{ color: '#ff5722' }}>{fmt(m.salaries)}</td>}
                                            <td style={{ fontWeight: 800, color: m.profit >= 0 ? '#4cd137' : '#ff6b6b' }}>
                                                {m.profit >= 0 ? '+' : ''}{fmt(m.profit)}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                                        <div style={{
                                                            width: `${Math.min(100, perfPct)}%`, height: '100%',
                                                            background: perfPct >= 100 ? '#4cd137' : perfPct >= 60 ? '#1496b0' : '#ff6b6b',
                                                            borderRadius: 3
                                                        }} />
                                                    </div>
                                                    <span style={{ fontSize: 11, opacity: 0.6 }}>{perfPct}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* KPIs View */}
            {view === 'kpis' && (
                <div>
                    <h3 style={{ fontSize: 14, opacity: 0.7, marginBottom: 16 }}>
                        🎯 {trans('keyPerformanceIndicators', 'مؤشرات الأداء الرئيسية', 'Key Performance Indicators')}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
                        {[
                            { label: trans('churnedMembers30d', 'المشتركين المنقطعين (30 يوم)', 'Churned Members (30d)'), value: advStats?.churnedCount || 0, color: '#ff6b6b', icon: '📉', unit: '' },
                            { label: trans('retentionRate', 'معدل الاحتفاظ', 'Retention Rate'), value: advStats?.churnedCount ? Math.max(0, 100 - advStats.churnedCount).toFixed(0) : '—', color: '#4cd137', icon: '🎯', unit: '%' },
                            { label: trans('avgSubRevenue', 'متوسط دخل الاشتراك', 'Avg Sub Revenue'), value: fmt(totalIncome / 12), color: '#0ee6b7', icon: '💰', unit: '' },
                            { label: trans('profitMargin', 'هامش الربح', 'Profit Margin'), value: totalIncome > 0 ? ((totalProfit / totalIncome) * 100).toFixed(1) : 0, color: totalProfit >= 0 ? '#4cd137' : '#ff6b6b', icon: '📊', unit: '%' },
                        ].map(kpi => (
                            <div key={kpi.label} style={{
                                padding: '20px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 14, textAlign: 'center'
                            }}>
                                <div style={{ fontSize: 32, marginBottom: 8 }}>{kpi.icon}</div>
                                <div style={{ fontSize: 32, fontWeight: 900, color: kpi.color }}>
                                    {kpi.value}{kpi.unit}
                                </div>
                                <div style={{ fontSize: 12, opacity: 0.5, marginTop: 6 }}>{kpi.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Peak Hours Chart */}
                    {advStats?.peakHours && (
                        <div style={{ marginTop: 28 }}>
                            <h3 style={{ fontSize: 14, opacity: 0.7, marginBottom: 12 }}>
                                ⏰ {trans('peakHoursDailyAvg', 'ساعات الذروة (يومياً)', 'Peak Hours (Daily Average)')}
                            </h3>
                            <div style={{
                                display: 'flex', alignItems: 'flex-end', gap: 3, height: 120,
                                background: 'rgba(255,255,255,0.02)', padding: '10px 10px 0', borderRadius: 10
                            }}>
                                {advStats.peakHours.map((count, hr) => {
                                    const maxCount = Math.max(...advStats.peakHours, 1);
                                    const h = Math.max(4, (count / maxCount) * 100);
                                    const isActive = hr === new Date().getHours();
                                    return (
                                        <div key={hr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div style={{
                                                width: '100%', height: `${h}px`,
                                                background: isActive ? '#0ee6b7' : 'linear-gradient(to top, #0b6b8a40, #1496b080)',
                                                borderRadius: '3px 3px 0 0', minWidth: 3,
                                                border: isActive ? '1px solid #0ee6b7' : 'none',
                                            }} title={`${hr}:00 — ${count} ${trans('visits', 'زيارة', 'visits')}`} />
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, opacity: 0.4, marginTop: 4, padding: '0 10px' }}>
                                <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
