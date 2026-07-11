'use client';
import React, { useState } from 'react';

export default function StockDashboard({
    lang, t, mode, goods, recentSales, sellGoodsByBarcode, loadAllData, getSalesByMonth, undoSale, currentUser
}) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const [barcode, setBarcode] = useState('');
    const [qty, setQty] = useState(1);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [monthlySales, setMonthlySales] = useState(recentSales || []);

    const handleMonthChange = async (month, year) => {
        setSelectedMonth(month);
        setSelectedYear(year);
        try {
            const sales = await getSalesByMonth(month, year);
            setMonthlySales(sales);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSale = async (e) => {
        if (e) e.preventDefault();
        const currentBarcode = barcode.trim();
        if (!currentBarcode) return;

        try {
            // Pass mode directly to handle filtering in action
            await sellGoodsByBarcode(currentBarcode, mode, parseInt(qty));
            setMsg({ text: trans('saleSuccessful', 'تمت عملية البيع بنجاح', 'Sale successful'), type: 'success' });
            setBarcode('');
            setQty(1);
            loadAllData();
            // Refresh sales for current month
            const sales = await getSalesByMonth(selectedMonth, selectedYear);
            setMonthlySales(sales);
        } catch (err) {
            setMsg({ text: err.message, type: 'error' });
        }
        setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    };

    const handleUndo = async (saleId) => {
        if (!confirm(trans('confirmUndoSale', 'هل أنت متأكد من التراجع عن هذه العملية؟', 'Are you sure you want to undo this sale?'))) return;

        try {
            await undoSale(saleId);
            loadAllData();
            // Refresh sales for current month
            const sales = await getSalesByMonth(selectedMonth, selectedYear);
            setMonthlySales(sales);
            alert(trans('saleUndoneSuccessfully', 'تم التراجع عن البيع بنجاح', 'Sale undone successfully'));
        } catch (err) {
            alert(err.message);
        }
    };

    const lowStockItems = goods.filter(g => g.qty <= (g.minStock || 5));

    return (
        <section className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>{trans('stockTrackingQuickSale', 'متابعة المخزون والبيع السريع', 'Stock Tracking & Quick Sale')}</h2>
            </div>

            <div className="grid-2">
                {/* Quick Sale Section */}
                <div className="card" style={{ padding: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                    <h3>{trans('quickSaleBarcode', 'بيع سريع (بواسطة الباركود)', 'Quick Sale (By Barcode)')}</h3>
                    <form onSubmit={handleSale} style={{ marginTop: 15, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 100%', display: 'flex', gap: 10 }}>
                            <input
                                type="text"
                                placeholder={trans('scanBarcodeHere', 'امسح الباركود هنا...', 'Scan Barcode here...')} title={trans('barcodeTooltip', 'امسح أو اكتب الباركود لبيع المنتج', 'Product barcode number')}
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                autoFocus
                                style={{ flex: 3, fontSize: '1.2rem', padding: '12px' }}
                            />
                            <input
                                type="number"
                                min="1"
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                style={{ flex: 1, fontSize: '1.2rem', padding: '12px' }}
                                placeholder={t.qty}
                            />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '12px', fontSize: '1.1rem', background: '#2e7d32' }}>
                            {trans('confirmSale', 'تأكيد البيع', 'Confirm Sale')}
                        </button>
                        {msg.text && (
                            <div style={{
                                width: '100%',
                                marginTop: 10,
                                padding: '10px',
                                borderRadius: '5px',
                                background: msg.type === 'success' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                                border: `1px solid ${msg.type === 'success' ? '#4caf50' : '#f44336'}`,
                                color: msg.type === 'success' ? '#81c784' : '#e57373',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}>
                                {msg.text === 'Product not found' ? trans('productNotFound', 'المنتج غير موجود', 'Product not found') : msg.text}
                            </div>
                        )}
                    </form>
                </div>

                {/* Totals Section */}
                <div className="card" style={{ padding: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                    <h3>{trans('quickStats', 'إحصائيات سريعة', 'Quick Stats')}</h3>
                    <div style={{ marginTop: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{trans('totalItems', 'إجمالي الأصناف:', 'Total Items:')}</span>
                            <strong>{goods.length}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{trans('itemsLowOnStock', 'أصناف قاربت على الانتهاء:', 'Items Low on Stock:')}</span>
                            <strong style={{ color: lowStockItems.length > 0 ? '#ff9800' : 'inherit' }}>{lowStockItems.length}</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Low Stock Table */}
            <div className="table-wrap" style={{ marginTop: 30 }}>
                <h3>{trans('lowStockItems', 'الأصناف المنخفضة المخزون', 'Low Stock Items')}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t.item}</th>
                            <th>{t.qty}</th>
                            <th>{trans('minStock', 'الحد الأدنى', 'Min Stock')}</th>
                            <th>{t.status}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowStockItems.length > 0 ? lowStockItems.map((g, idx) => (
                            <tr key={g._id}>
                                <td>{idx + 1}</td>
                                <td>{g.title}</td>
                                <td style={{ color: g.qty === 0 ? 'red' : 'orange', fontWeight: 'bold' }}>{g.qty}</td>
                                <td>{g.minStock || 5}</td>
                                <td>
                                    <span className={g.qty === 0 ? 'status-expired' : 'status-warning'}>
                                        {g.qty === 0 ? trans('outOfStock', 'نفذت', 'Out of Stock') : trans('low', 'منخفض', 'Low')}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', opacity: 0.5 }}>
                                    {trans('noLowStockItems', 'لا توجد نواقص حالياً', 'No low stock items currently')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Recent Sales Table */}
            <div className="table-wrap" style={{ marginTop: 30 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <h3>{trans('monthlySalesHistory', 'سجل المبيعات الشهرية', 'Monthly Sales History')}</h3>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <select
                            value={selectedMonth}
                            onChange={(e) => handleMonthChange(parseInt(e.target.value), selectedYear)}
                            style={{ padding: '8px', fontSize: '1rem' }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                <option key={m} value={m}>
                                    {trans('month_' + m, 
                                        ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][m - 1],
                                        ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1])}
                                    {m === new Date().getMonth() + 1 && ` (${trans('current', 'الشهر الحالي', 'Current')})`}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => handleMonthChange(selectedMonth, parseInt(e.target.value))}
                            style={{ padding: '8px', fontSize: '1rem' }}
                        >
                            {[2024, 2025, 2026].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t.item}</th>
                            <th>{t.qty}</th>
                            <th>{t.salePrice}</th>
                            <th>{trans('date', 'التاريخ', 'Date')}</th>
                            <th>{trans('salePeriod', 'فترة البيع', 'Sale Period')}</th>
                            <th>{trans('actions', 'إجراءات', 'Actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlySales && monthlySales.length > 0 ? monthlySales.map((s, idx) => (
                            <tr key={s._id}>
                                <td>{idx + 1}</td>
                                <td>{s.title}</td>
                                <td>{s.qty}</td>
                                <td>{s.salePrice}</td>
                                <td>{new Date(s.date).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</td>
                                <td>
                                    {s.gender === 'male' || s.gender === 'men' ? trans('menPeriod', 'رجالي', "Men's Period") : 
                                     s.gender === 'female' || s.gender === 'women' ? trans('womenPeriod', 'حريمي', "Women's Period") : 
                                     s.gender === 'mix' ? trans('mixed', 'مختلط', 'Mixed') : 
                                     s.gender === 'admin' ? trans('adminAllPeriods', 'المدير (كل الفترات)', 'Admin (All)') : s.gender}
                                </td>
                                <td>
                                    {(currentUser?.role === 'admin' || currentUser?.role === 'data_entry') ? (
                                        <button
                                            className="small"
                                            style={{ background: '#f44336' }}
                                            onClick={() => handleUndo(s._id)}
                                        >
                                            {trans('undo', 'تراجع', 'Undo')}
                                        </button>
                                    ) : (
                                        <span style={{ opacity: 0.5 }}>-</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', opacity: 0.5 }}>
                                    {trans('noSalesRecordedMonth', 'لا توجد مبيعات مسجلة لهذا الشهر', 'No sales recorded for this month')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
