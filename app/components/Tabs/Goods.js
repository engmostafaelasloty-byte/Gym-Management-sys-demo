'use client';
import React from 'react';

export default function GoodsTab({
    lang, t, mode, currentUser, goods, editGoodsId, setEditGoodsId, goodsFormRef,
    handleGoodsSubmit, handleDelete, exportToCSV, currency, handleManualSale
}) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    return (
        <section className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>{t.goods}</h2>
                <button className="secondary small" onClick={() => exportToCSV(goods, 'inventory')}>
                    📤 {t.export}
                </button>
            </div>
            {(currentUser?.role === 'admin' || currentUser?.role === 'data_entry') && (
                <form ref={goodsFormRef} onSubmit={handleGoodsSubmit} className="form-grid">
                    <input name="title" placeholder={t.item} required />
                    <input name="qty" type="number" placeholder={t.qty} />
                    <input name="minStock" type="number" placeholder={trans('minStock', 'الحد الأدنى', 'Min Stock')} />
                    <div className="tooltip-field" data-tooltip={trans('barcodeTooltip', 'كود الباركود الموجود على المنتج', 'Product barcode number')}><input name="barcode" placeholder={trans('barcode', 'الباركود', 'Barcode')} /></div>
                    <input name="salePrice" type="number" placeholder={t.salePrice} required />
                    <input name="costPrice" type="number" placeholder={t.costPrice} required />
                    <div className="tooltip-field" data-tooltip={trans('noteTooltip', 'ملاحظات إضافية (اختياري)', 'Additional notes (optional)')}><input name="note" placeholder={t.note} /></div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
                        <button type="submit" style={{ flex: 1 }}>{editGoodsId ? t.save : t.save}</button>
                        {editGoodsId && (
                            <button type="button" onClick={() => { setEditGoodsId(null); goodsFormRef.current?.reset(); }} style={{ background: 'gray' }}>{t.cancel}</button>
                        )}
                    </div>
                </form>
            )}

            <div className="table-wrap" style={{ marginTop: 20 }}>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t.item}</th>
                            <th>{t.qty}</th>
                            <th>{t.salePrice}</th>
                            <th>{t.costPrice}</th>
                            <th>{t.profit}</th>
                            <th>{trans('barcode', 'الباركود', 'Barcode')}</th>
                            <th>{t.note}</th>
                            <th>{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goods.map((g, idx) => (
                            <tr key={g._id}>
                                <td>{idx + 1}</td>
                                <td>{g.title}</td>
                                <td>{g.qty}</td>
                                <td>{g.salePrice} {currency}</td>
                                <td>{g.costPrice} {currency}</td>
                                <td>{g.profit?.toFixed(2)} {currency}</td>
                                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{g.barcode || '-'}</td>
                                <td>{g.note}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 5 }}>
                                        <button className="small" onClick={() => handleManualSale && handleManualSale(g._id)} style={{ background: '#2e7d32' }}>
                                            {trans('sell', 'بيع', 'Sell')}
                                        </button>
                                        {(currentUser?.role === 'admin' || currentUser?.role === 'data_entry') && (
                                            <>
                                                <button className="small" onClick={() => {
                                                    setEditGoodsId(g._id);
                                                    const f = goodsFormRef.current;
                                                    if (f) {
                                                        f.elements['title'].value = g.title;
                                                        f.elements['qty'].value = g.qty ?? '';
                                                        f.elements['salePrice'].value = g.salePrice;
                                                        f.elements['costPrice'].value = g.costPrice;
                                                        f.elements['barcode'].value = g.barcode || '';
                                                        f.elements['minStock'].value = g.minStock ?? '';
                                                        f.elements['note'].value = g.note || '';
                                                    }
                                                }}>{t.edit}</button>
                                                <button className="small" onClick={() => handleDelete('goods', g._id)} style={{ background: 'darkred' }}>{t.delete}</button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
