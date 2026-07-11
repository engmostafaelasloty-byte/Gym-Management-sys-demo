'use client';
import React, { useState } from 'react';

export default function PaymentsTab({ lang, t, payments, pendingInstallments, updatePaymentStatus, exportToCSV, currency }) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'completed' | 'pending'

    const filtered = (payments || []).filter(p => {
        const matchSearch = !search || p.subscriber?.name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || p.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const totalCompleted = (payments || []).filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0);
    const totalPending = (payments || []).filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0);
    const fmt = n => Number(n || 0).toLocaleString();

    const printReceipt = (p) => {
        const logo = localStorage.getItem('gymLogo');
        const gymName = localStorage.getItem('gymName') || 'GYM SYSTEM';
        const win = window.open('', '_blank');
        win.document.write(`
            <!DOCTYPE html>
            <html dir="${lang === 'ar' ? 'rtl' : 'ltr'}" lang="${lang}">
            <head>
                <meta charset="UTF-8">
                <title>${trans('paymentReceipt', 'وصل دفع', 'Payment Receipt')}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; max-width: 400px; margin: auto; }
                    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 16px; margin-bottom: 16px; }
                    .header .logo-container { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; margin-bottom: 12px; }
                    .header img { max-width: 70px; max-height: 70px; object-fit: contain; border-radius: 8px; }
                    .header h1 { margin: 0; font-size: 22px; font-weight: bold; }
                    .header p { margin: 4px 0; color: #666; font-size: 13px; }
                    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
                    .label { color: #666; }
                    .value { font-weight: bold; }
                    .total { font-size: 18px; color: #0b6b8a; margin-top: 8px; }
                    .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #999; }
                    @media print { button { display: none !important; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo-container">
                        ${logo ? `<img src="${logo}" alt="Gym Logo" />` : '<span style="font-size: 40px;">🏋️</span>'}
                        <h1>${gymName}</h1>
                    </div>
                    <p>${trans('officialReceipt', 'وصل دفع رسمي', 'Official Payment Receipt')}</p>
                    <p>#${p._id?.slice(-8)?.toUpperCase()}</p>
                </div>
                <div class="row"><span class="label">${trans('member', 'العضو', 'Member')}:</span><span class="value">${p.subscriber?.name || '---'}</span></div>
                <div class="row"><span class="label">${trans('amount', 'المبلغ', 'Amount')}:</span><span class="value total">${fmt(p.amount)} ${currency}</span></div>
                <div class="row"><span class="label">${trans('type', 'النوع', 'Type')}:</span><span class="value">${p.type || '---'}</span></div>
                <div class="row"><span class="label">${trans('status', 'الحالة', 'Status')}:</span><span class="value" style="color:green">${trans('paid', '✅ مدفوع', '✅ Paid')}</span></div>
                <div class="row"><span class="label">${trans('date', 'التاريخ', 'Date')}:</span><span class="value">${new Date(p.createdAt).toLocaleDateString()}</span></div>
                <div class="footer">
                    ${trans('thankYouClub', 'شكراً لاختياركم نادينا 💪', 'Thank you for choosing our gym! 💪')}
                </div>
                <script>setTimeout(() => window.print(), 500);</script>
            </body>
            </html>
        `);
        win.document.close();
    };

    return (
        <div>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 14, marginBottom: 20 }}>
                {[
                    { label: trans('totalCollected', 'إجمالي المحصّل', 'Total Collected'), value: fmt(totalCompleted), color: '#4cd137', icon: '✅' },
                    { label: trans('totalPending', 'إجمالي المعلّق', 'Total Pending'), value: fmt(totalPending), color: '#ff9800', icon: '⏳' },
                    { label: trans('overdueInstallmentsCount', 'عدد الأقساط المتأخرة', 'Overdue Installments'), value: pendingInstallments?.length || 0, color: '#ff6b6b', icon: '🔴' },
                ].map(card => (
                    <div key={card.label} style={{
                        padding: '16px 20px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 14,
                    }}>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>{card.icon}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: card.color }}>{card.value}</div>
                        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>{card.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
                {/* Main Payments */}
                <section className="panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                        <h2 style={{ margin: 0 }}>{t.payments}</h2>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="small" onClick={() => exportToCSV(payments, 'payments')} style={{
                                background: 'rgba(14,230,183,0.1)', border: '1px solid rgba(14,230,183,0.2)', color: '#0ee6b7', fontSize: 12
                            }}>
                                📤 {t.export}
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={trans('searchByName', '🔍 بحث بالاسم...', '🔍 Search by name...')} title={trans('searchByMemberName', 'الاسم الكامل للعضو', 'Search by member name')}
                            style={{ maxWidth: 220, flex: 1 }}
                        />
                        {['all', 'completed', 'pending'].map(s => (
                            <button key={s} className="small" onClick={() => setFilterStatus(s)} style={{
                                background: filterStatus === s ? 'linear-gradient(135deg,#0b6b8a,#1496b0)' : 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)', fontSize: 12
                            }}>
                                {s === 'all' ? trans('all', 'الكل', 'All') : s === 'completed' ? trans('paid', '✅ مدفوع', '✅ Paid') : trans('pending', '⏳ معلق', '⏳ Pending')}
                            </button>
                        ))}
                    </div>

                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t.name}</th>
                                    <th>{t.amount}</th>
                                    <th>{trans('type', 'النوع', 'Type')}</th>
                                    <th>{t.status}</th>
                                    <th>{trans('date', 'التاريخ', 'Date')}</th>
                                    <th>{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 && (
                                    <tr><td colSpan={6} style={{ padding: 30, opacity: 0.4 }}>
                                        {trans('noPayments', 'لا توجد مدفوعات', 'No payments found')}
                                    </td></tr>
                                )}
                                {filtered.map(p => (
                                    <tr key={p._id}>
                                        <td style={{ fontWeight: 600 }}>{p.subscriber?.name || '---'}</td>
                                        <td style={{ fontWeight: 700, color: '#0ee6b7' }}>{fmt(p.amount)} {currency}</td>
                                        <td style={{ fontSize: 12, opacity: 0.7 }}>{p.type}</td>
                                        <td>
                                            {p.status === 'completed' ? (
                                                <span style={{
                                                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                                                    background: 'rgba(76,209,55,0.15)', border: '1px solid rgba(76,209,55,0.3)', color: '#4cd137'
                                                }}>✅ {t.paid}</span>
                                            ) : (
                                                <span style={{
                                                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                                                    background: 'rgba(255,152,0,0.15)', border: '1px solid rgba(255,152,0,0.3)', color: '#ff9800'
                                                }}>⏳ {t.pending}</span>
                                            )}
                                        </td>
                                        <td style={{ fontSize: 12, opacity: 0.6 }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 5 }}>
                                                {p.status === 'pending' && (
                                                    <button className="small" onClick={() => updatePaymentStatus(p._id, 'completed')} style={{
                                                        background: 'rgba(76,209,55,0.1)', border: '1px solid rgba(76,209,55,0.2)', color: '#4cd137', fontSize: 11
                                                    }}>
                                                        ✅ {t.paid}
                                                    </button>
                                                )}
                                                {p.status === 'completed' && (
                                                    <button className="small" onClick={() => printReceipt(p)} style={{
                                                        background: 'rgba(11,107,138,0.1)', border: '1px solid rgba(11,107,138,0.2)', color: '#1496b0', fontSize: 11
                                                    }}>
                                                        🖨️ {trans('receipt', 'وصل', 'Receipt')}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Pending Installments Sidebar */}
                <aside>
                    <section className="panel" style={{
                        border: '1px solid rgba(255,152,0,0.2)',
                        background: 'rgba(255,152,0,0.03)'
                    }}>
                        <h3 style={{ margin: '0 0 16px', color: '#ff9800', fontSize: 15 }}>
                            ⏳ {trans('dueInstallments', 'أقساط مستحقة', 'Due Installments')}
                            {pendingInstallments?.length > 0 && (
                                <span style={{
                                    marginRight: 8, marginLeft: 8,
                                    background: '#ff6b6b', color: 'white',
                                    borderRadius: '50%', width: 20, height: 20,
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 700
                                }}>{pendingInstallments.length}</span>
                            )}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {(pendingInstallments || []).length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 20, opacity: 0.4, fontSize: 13 }}>
                                    ✅ {trans('noOverdueInstallments', 'لا يوجد أقساط متأخرة', 'No overdue installments')}
                                </div>
                            ) : (pendingInstallments || []).map(inst => (
                                <div key={inst._id} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,152,0,0.15)',
                                    padding: 12, borderRadius: 10, fontSize: 13
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <strong>{inst.subscriber?.name}</strong>
                                        <span style={{ color: '#ff9800', fontWeight: 700 }}>{fmt(inst.amount)} {currency}</span>
                                    </div>
                                    {inst.dueDate && (
                                        <div style={{ opacity: 0.5, fontSize: 11, marginBottom: 8 }}>
                                            📅 {new Date(inst.dueDate).toLocaleDateString()}
                                        </div>
                                    )}
                                    <button
                                        className="small"
                                        style={{ width: '100%', background: 'rgba(76,209,55,0.1)', border: '1px solid rgba(76,209,55,0.2)', color: '#4cd137' }}
                                        onClick={() => updatePaymentStatus(inst._id, 'completed')}
                                    >
                                        ✅ {trans('markAsPaid', 'تحديد كمدفوع', 'Mark as Paid')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
