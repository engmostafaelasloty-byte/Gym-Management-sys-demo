'use client';
import React, { useState, useEffect } from 'react';
import { addMeasurement, getSubscriberMeasurements, getLoyaltyInfo, redeemLoyaltyPoints } from '../../actions';

export default function SubscriberModal({
    lang, t, selectedSub, setSelectedSub, currentUser
}) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const [subTab, setSubTab] = useState('info');
    const [measurements, setMeasurements] = useState([]);
    const [loyalty, setLoyalty] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (selectedSub) {
            loadSubData();
        }
    }, [selectedSub]);

    async function loadSubData() {
        try {
            const [m, l] = await Promise.all([
                getSubscriberMeasurements(selectedSub._id),
                getLoyaltyInfo(selectedSub._id)
            ]);
            setMeasurements(m);
            setLoyalty(l);
        } catch (e) {
            console.error(e);
        }
    }

    async function handleRedeem() {
        if (loyalty?.points < 1000) {
            alert(trans('needPointsToRedeem', 'تحتاج على الأقل 1000 نقطة للاستبدال', 'You need at least 1000 points to redeem'));
            return;
        }
        if (confirm(trans('redeemConfirm', 'هل تود استبدال 1000 نقطة بخصم 50 ج.م؟', 'Redeem 1000 points for 50 EGP discount?'))) {
            try {
                await redeemLoyaltyPoints(selectedSub._id, 1000);
                alert(trans('redeemSuccess', 'تم الاستبدال بنجاح! سيتم تطبيق الخصم يدوياً', 'Redeem successful! Apply discount manually.'));
                loadSubData();
            } catch (err) {
                alert(err.message);
            }
        }
    }

    async function handleAddMeasurement(e) {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target);
        const data = {
            subscriber: selectedSub._id,
            weight: parseFloat(formData.get('weight')),
            bodyFat: parseFloat(formData.get('bodyFat')),
            muscleMass: parseFloat(formData.get('muscleMass')),
            notes: formData.get('notes'),
        };

        try {
            await addMeasurement(data, currentUser?._id);
            e.target.reset();
            await loadSubData();
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    }

    const handlePrintCard = () => {
        const logo = localStorage.getItem('gymLogo');
        const gymName = localStorage.getItem('gymName') || 'GYM SYSTEM';
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(selectedSub.qrCode || selectedSub._id)}`;
        
        const win = window.open('', '_blank');
        win.document.write(`
            <!DOCTYPE html>
            <html dir="${lang === 'ar' ? 'rtl' : 'ltr'}" lang="${lang}">
            <head>
                <meta charset="UTF-8">
                <title>${trans('subscriberCard', 'كارنيه المشترك', 'Subscriber Card')}</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 0;
                        padding: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background-color: #f5f5f5;
                    }
                    .card {
                        width: 380px;
                        height: 220px;
                        background: linear-gradient(135deg, #08121a 0%, #062a3d 100%);
                        color: #ffffff;
                        border-radius: 12px;
                        padding: 16px;
                        box-sizing: border-box;
                        border: 2px solid #0ee6b7;
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                        overflow: hidden;
                    }
                    .card::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(14,230,183,0.05) 0%, transparent 60%);
                        pointer-events: none;
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                        padding-bottom: 8px;
                    }
                    .header img {
                        width: 40px;
                        height: 40px;
                        object-fit: contain;
                        border-radius: 6px;
                        border: 1px solid rgba(255,255,255,0.2);
                    }
                    .header h2 {
                        margin: 0;
                        font-size: 16px;
                        font-weight: 700;
                        letter-spacing: 0.5px;
                    }
                    .header p {
                        margin: 2px 0 0 0;
                        font-size: 10px;
                        opacity: 0.7;
                    }
                    .content {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 10px;
                        flex: 1;
                    }
                    .info {
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                    }
                    .info-row {
                        font-size: 11px;
                        text-align: ${lang === 'ar' ? 'right' : 'left'};
                    }
                    .info-row span {
                        opacity: 0.6;
                        display: block;
                        font-size: 9px;
                        text-transform: uppercase;
                        margin-bottom: 1px;
                    }
                    .info-row strong {
                        font-size: 12px;
                        color: #ffffff;
                    }
                    .info-row.name strong {
                        font-size: 14px;
                        color: #0ee6b7;
                    }
                    .qr-container {
                        background: #ffffff;
                        padding: 6px;
                        border-radius: 8px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                    .qr-container img {
                        width: 80px;
                        height: 80px;
                        display: block;
                    }
                    .qr-container span {
                        color: #000000;
                        font-size: 8px;
                        font-weight: bold;
                        margin-top: 4px;
                    }
                    .footer-tag {
                        font-size: 9px;
                        text-align: center;
                        opacity: 0.5;
                        border-top: 1px solid rgba(255,255,255,0.1);
                        padding-top: 6px;
                        margin-top: 4px;
                    }
                    @media print {
                        body {
                            background-color: transparent;
                            padding: 0;
                            margin: 0;
                        }
                        .card {
                            box-shadow: none;
                            border: 2px solid #000;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="header">
                        ${logo ? `<img src="${logo}" alt="Gym Logo" />` : '<span style="font-size: 28px;">🏋️</span>'}
                        <div>
                            <h2>${gymName}</h2>
                            <p>${trans('memberCardTag', 'عضوية النادي الرياضي', 'Gym Membership Card')}</p>
                        </div>
                    </div>
                    <div class="content">
                        <div class="info">
                            <div class="info-row name">
                                <span>${trans('name', 'الاسم', 'Name')}</span>
                                <strong>${selectedSub.name}</strong>
                            </div>
                            <div class="info-row">
                                <span>${trans('category', 'الفئة', 'Category')}</span>
                                <strong>${selectedSub.category || 'Regular'}</strong>
                            </div>
                            <div style="display: flex; gap: 15px;">
                                <div class="info-row">
                                    <span>${trans('startDate', 'البدء', 'Start')}</span>
                                    <strong>${selectedSub.startDate?.split('T')[0] || '---'}</strong>
                                </div>
                                <div class="info-row">
                                    <span>${trans('endDate', 'الانتهاء', 'End')}</span>
                                    <strong style="color: #ff6b6b;">${selectedSub.endDate?.split('T')[0] || '---'}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="qr-container">
                            <img src="${qrCodeUrl}" alt="QR Code" />
                            <span>${selectedSub.qrCode?.substring(0, 8) || selectedSub._id?.substring(0, 8)}</span>
                        </div>
                    </div>
                    <div class="footer-tag">
                        💪 ${trans('thankYouClub', 'شكراً لاختياركم نادينا', 'Thank you for choosing our gym!')}
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(() => {
                            window.print();
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `);
        win.document.close();
    };

    if (!selectedSub) return null;

    return (
        <div className="modal">
            <div className="modal-content" style={{ maxWidth: 850, height: '85vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
                        <div>
                            <h3 style={{ margin: 0 }}>{selectedSub.name}</h3>
                            <span style={{ fontSize: 12, opacity: 0.6 }}>{selectedSub.category} • {selectedSub.phone}</span>
                        </div>
                    </div>
                    <button onClick={() => setSelectedSub(null)} style={{ background: 'none', boxShadow: 'none', fontSize: 24, cursor: 'pointer', color: 'white', border: 'none' }}>×</button>
                </div>

                {/* Sub-Tabs */}
                <div className="sub-tabs" style={{ display: 'flex', gap: 15, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>
                    <button className={subTab === 'info' ? 'active' : ''} onClick={() => setSubTab('info')} style={{ background: 'none', border: 'none', color: subTab === 'info' ? 'var(--accent-light)' : '#aaa', cursor: 'pointer', fontSize: 14 }}>ℹ️ {trans('infoTab', 'البيانات', 'Info')}</button>
                    <button className={subTab === 'measurements' ? 'active' : ''} onClick={() => setSubTab('measurements')} style={{ background: 'none', border: 'none', color: subTab === 'measurements' ? 'var(--accent-light)' : '#aaa', cursor: 'pointer', fontSize: 14 }}>📊 {t.measurements}</button>
                    <button className={subTab === 'loyalty' ? 'active' : ''} onClick={() => setSubTab('loyalty')} style={{ background: 'none', border: 'none', color: subTab === 'loyalty' ? 'var(--accent-light)' : '#aaa', cursor: 'pointer', fontSize: 14 }}>💎 {trans('loyaltyTab', 'الولاء', 'Loyalty')}</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: 10 }}>
                    {subTab === 'info' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 30 }}>
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                    <div className="info-card">
                                        <label>{t.startDate}</label>
                                        <p>{selectedSub.startDate?.split('T')[0]}</p>
                                    </div>
                                    <div className="info-card">
                                        <label>{t.endDate}</label>
                                        <p style={{ color: 'var(--accent-light)' }}>{selectedSub.endDate?.split('T')[0]}</p>
                                    </div>
                                    <div className="info-card">
                                        <label>{trans('visitsLabel', 'الزيارات', 'Visits')}</label>
                                        <p>{selectedSub.stats?.totalVisits || 0}</p>
                                    </div>
                                    <div className="info-card">
                                        <label>{trans('totalPaidLabel', 'الرصيد المدفوع', 'Total Paid')}</label>
                                        <p>{selectedSub.stats?.totalPaid || 0} EGP</p>
                                    </div>
                                </div>

                                <div style={{ marginTop: 25 }}>
                                    <h4>📜 {trans('subscriptionHistoryTitle', 'سجل الاشتراكات', 'Subscription History')}</h4>
                                    <div className="history-list">
                                        {selectedSub.subscriptionHistory?.map((h, i) => (
                                            <div key={i} className="history-item">
                                                <span>📅 {h.startDate?.split('T')[0]} ➡️ {h.endDate?.split('T')[0]}</span>
                                                <strong>{h.price} EGP</strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{ background: 'white', padding: '15px 10px', borderRadius: 10, marginBottom: 15, display: 'inline-block', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(selectedSub.qrCode || selectedSub._id)}`} 
                                        alt="QR Code" 
                                        style={{ width: 130, height: 130, display: 'block', margin: '0 auto' }} 
                                    />
                                    <div style={{ color: '#333', fontSize: 11, marginTop: 8, fontWeight: 'bold' }}>{selectedSub.qrCode?.substring(0, 8) || selectedSub._id?.substring(0, 8)}</div>
                                </div>
                                <button className="primary" style={{ width: '100%' }} onClick={handlePrintCard}>🖨️ {trans('printCardBtn', 'طباعة الكارنيه', 'Print Card')}</button>
                            </div>
                        </div>
                    )}

                    {subTab === 'measurements' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                            <form onSubmit={handleAddMeasurement} className="form-grid" style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 12 }}>
                                <h4>➕ {trans('addMeasurementTitle', 'إضافة قياس جديد', 'Add Measurement')}</h4>
                                <input name="weight" type="number" step="0.1" placeholder={t.weight} required />
                                <input name="bodyFat" type="number" step="0.1" placeholder={t.bodyFat} />
                                <input name="muscleMass" type="number" step="0.1" placeholder={t.muscleMass} />
                                <textarea name="notes" placeholder={t.note} style={{ gridColumn: '1 / -1' }}></textarea>
                                <button type="submit" style={{ gridColumn: '1 / -1' }}>{t.save}</button>
                            </form>

                            <div>
                                <h4>📉 {t.inbody}</h4>
                                <div className="history-list">
                                    {measurements.map((m, i) => (
                                        <div key={i} className="history-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 5 }}>
                                                <span>📅 {new Date(m.createdAt).toLocaleDateString()}</span>
                                                <strong style={{ color: 'var(--accent-light)' }}>{m.weight} kg</strong>
                                            </div>
                                            <div style={{ fontSize: 11, opacity: 0.7 }}>
                                                🔥 BF: {m.bodyFat || 0}% | 💪 MM: {m.muscleMass || 0}kg
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {subTab === 'loyalty' && (
                        <div style={{ textAlign: 'center', padding: 30 }}>
                            <div style={{ fontSize: 60 }}>🏆</div>
                            <h2 style={{ fontSize: 40, margin: '10px 0' }}>{loyalty?.points || 0}</h2>
                            <p style={{ opacity: 0.7 }}>{trans('loyaltyPointsLabel', 'نقطة ولاء', 'Loyalty Points')}</p>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 12, marginTop: 20 }}>
                                <p>⭐ {trans('tierLabel', 'المستوى', 'Tier')}: <span style={{ color: 'var(--accent-light)', fontWeight: 'bold' }}>
                                    {loyalty?.tier === 'platinum' ? trans('platinum', 'بلاتيني', 'Platinum') :
                                     loyalty?.tier === 'gold' ? trans('gold', 'ذهبي', 'Gold') :
                                     loyalty?.tier === 'silver' ? trans('silver', 'فضي', 'Silver') :
                                     trans('bronze', 'برونزي', 'Bronze')}
                                </span></p>
                                <div style={{ height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 5, overflow: 'hidden', marginTop: 10 }}>
                                    <div style={{ height: '100%', width: `${(loyalty?.points % 1000) / 10}%`, background: 'var(--accent)' }}></div>
                                </div>
                                <button
                                    className="secondary small"
                                    style={{ marginTop: 20, width: '100%' }}
                                    onClick={handleRedeem}
                                    disabled={loyalty?.points < 1000}
                                >
                                    🎁 {trans('redeemPointsBtn', 'استبدل 1000 نقطة', 'Redeem 1000 Points')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <style jsx>{`
                    .info-card {
                        background: rgba(255,255,255,0.03);
                        padding: 12px;
                        border-radius: 8px;
                        border: 1px solid rgba(255,255,255,0.05);
                    }
                    .info-card label {
                        display: block;
                        font-size: 11px;
                        opacity: 0.6;
                        margin-bottom: 4px;
                    }
                    .info-card p {
                        margin: 0;
                        font-weight: 600;
                    }
                    .history-list {
                        max-height: 250px;
                        overflow-y: auto;
                        background: rgba(255,255,255,0.02);
                        border-radius: 12px;
                    }
                    .history-item {
                        padding: 12px;
                        border-bottom: 1px solid rgba(255,255,255,0.05);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 13px;
                    }
                    .history-item:last-child { border-bottom: none; }
                    .sub-tabs button.active {
                        border-bottom: 2px solid var(--accent-light) !important;
                        color: var(--accent-light) !important;
                        padding-bottom: 8px !important;
                    }
                `}</style>
            </div>
        </div>
    );
}
