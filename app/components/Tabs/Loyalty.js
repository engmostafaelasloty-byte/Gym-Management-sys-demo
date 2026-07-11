'use client';
import React, { useState } from 'react';

export default function LoyaltyTab({
    lang, t, subscribers, getLoyaltyInfo, addLoyaltyPoints, redeemLoyaltyPoints
}) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const [selectedSubscriber, setSelectedSubscriber] = useState('');
    const [loyaltyInfo, setLoyaltyInfo] = useState(null);
    const [showAddPoints, setShowAddPoints] = useState(false);
    const [showRedeemPoints, setShowRedeemPoints] = useState(false);

    const handleSubscriberChange = async (subscriberId) => {
        setSelectedSubscriber(subscriberId);
        if (subscriberId) {
            try {
                const data = await getLoyaltyInfo(subscriberId);
                setLoyaltyInfo(data);
            } catch (err) {
                console.error(err);
                setLoyaltyInfo(null);
            }
        } else {
            setLoyaltyInfo(null);
        }
    };

    const handleAddPoints = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const points = parseInt(formData.get('points'));
        const reason = formData.get('reason');

        try {
            await addLoyaltyPoints(selectedSubscriber, points, reason);
            e.target.reset();
            setShowAddPoints(false);
            // Reload loyalty info
            const updatedData = await getLoyaltyInfo(selectedSubscriber);
            setLoyaltyInfo(updatedData);
            alert(trans('pointsAdded', 'تم إضافة النقاط بنجاح', 'Points added successfully'));
        } catch (err) {
            console.error(err);
            alert(trans('errorOccurred', 'حدث خطأ', 'An error occurred'));
        }
    };

    const handleRedeemPoints = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const points = parseInt(formData.get('points'));

        if (!loyaltyInfo || points > loyaltyInfo.points) {
            alert(trans('insufficientPoints', 'نقاط غير كافية', 'Insufficient points'));
            return;
        }

        try {
            await redeemLoyaltyPoints(selectedSubscriber, points);
            e.target.reset();
            setShowRedeemPoints(false);
            // Reload loyalty info
            const updatedData = await getLoyaltyInfo(selectedSubscriber);
            setLoyaltyInfo(updatedData);
            alert(trans('pointsRedeemed', 'تم استبدال النقاط بنجاح', 'Points redeemed successfully'));
        } catch (err) {
            console.error(err);
            alert(trans('errorOccurred', 'حدث خطأ', 'An error occurred'));
        }
    };

    const getTierInfo = (tier) => {
        const tiers = {
            bronze: {
                name: trans('bronze', 'برونزي', 'Bronze'),
                color: '#cd7f32',
                icon: '🥉'
            },
            silver: {
                name: trans('silver', 'فضي', 'Silver'),
                color: '#c0c0c0',
                icon: '🥈'
            },
            gold: {
                name: trans('gold', 'ذهبي', 'Gold'),
                color: '#ffd700',
                icon: '🥇'
            },
            platinum: {
                name: trans('platinum', 'بلاتيني', 'Platinum'),
                color: '#e5e4e2',
                icon: '💎'
            }
        };
        return tiers[tier] || tiers.bronze;
    };

    return (
        <section className="panel">
            <h2>{trans('loyaltyPointsSystem', '⭐ نظام الولاء والنقاط', '⭐ Loyalty & Points System')}</h2>

            <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 10 }}>
                    {trans('selectSubscriber', 'اختر المشترك:', 'Select Subscriber:')}
                </label>
                <select
                    value={selectedSubscriber}
                    onChange={(e) => handleSubscriberChange(e.target.value)}
                    style={{ width: '100%', maxWidth: 400 }}
                >
                    <option value="">{trans('selectOption', '-- اختر --', '-- Select --')}</option>
                    {subscribers.map(sub => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                </select>
            </div>

            {loyaltyInfo && (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 20,
                        marginBottom: 30
                    }}>
                        <div style={{
                            padding: 20,
                            background: `linear-gradient(135deg, ${getTierInfo(loyaltyInfo.tier).color}20, ${getTierInfo(loyaltyInfo.tier).color}10)`,
                            border: `2px solid ${getTierInfo(loyaltyInfo.tier).color}`,
                            borderRadius: 12,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: 40, marginBottom: 10 }}>
                                {getTierInfo(loyaltyInfo.tier).icon}
                            </div>
                            <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 5 }}>
                                {trans('tier', 'المستوى', 'Tier')}
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 'bold', color: getTierInfo(loyaltyInfo.tier).color }}>
                                {getTierInfo(loyaltyInfo.tier).name}
                            </div>
                        </div>

                        <div style={{
                            padding: 20,
                            background: 'rgba(74, 222, 128, 0.1)',
                            border: '2px solid #4ade80',
                            borderRadius: 12,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: 40, marginBottom: 10 }}>🎯</div>
                            <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 5 }}>
                                {trans('currentPoints', 'النقاط الحالية', 'Current Points')}
                            </div>
                            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#4ade80' }}>
                                {loyaltyInfo.points}
                            </div>
                        </div>

                        <div style={{
                            padding: 20,
                            background: 'rgba(96, 165, 250, 0.1)',
                            border: '2px solid #60a5fa',
                            borderRadius: 12,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
                            <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 5 }}>
                                {trans('totalEarned', 'إجمالي النقاط المكتسبة', 'Total Earned')}
                            </div>
                            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#60a5fa' }}>
                                {loyaltyInfo.totalEarned}
                            </div>
                        </div>

                        <div style={{
                            padding: 20,
                            background: 'rgba(251, 191, 36, 0.1)',
                            border: '2px solid #fbbf24',
                            borderRadius: 12,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: 40, marginBottom: 10 }}>🎁</div>
                            <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 5 }}>
                                {trans('totalRedeemed', 'النقاط المستبدلة', 'Total Redeemed')}
                            </div>
                            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#fbbf24' }}>
                                {loyaltyInfo.totalRedeemed}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
                        <button onClick={() => setShowAddPoints(!showAddPoints)}>
                            {showAddPoints
                                ? trans('cancel', '❌ إلغاء', '❌ Cancel')
                                : trans('addPoints', '➕ إضافة نقاط', '➕ Add Points')
                            }
                        </button>
                        <button
                            onClick={() => setShowRedeemPoints(!showRedeemPoints)}
                            className="secondary"
                        >
                            {showRedeemPoints
                                ? trans('cancel', '❌ إلغاء', '❌ Cancel')
                                : trans('redeemPoints', '🎁 استبدال نقاط', '🎁 Redeem Points')
                            }
                        </button>
                    </div>

                    {showAddPoints && (
                        <form onSubmit={handleAddPoints} className="form-grid" style={{ marginBottom: 30 }}>
                            <input
                                name="points"
                                type="number"
                                min="1"
                                placeholder={trans('pointsAmount', 'عدد النقاط', 'Points Amount')}
                                required
                            />
                            <input
                                name="reason"
                                placeholder={trans('reason', 'السبب', 'Reason')}
                                required
                            />
                            <button type="submit" style={{ gridColumn: '1 / -1' }}>
                                {t.save}
                            </button>
                        </form>
                    )}

                    {showRedeemPoints && (
                        <form onSubmit={handleRedeemPoints} className="form-grid" style={{ marginBottom: 30 }}>
                            <input
                                name="points"
                                type="number"
                                min="1"
                                max={loyaltyInfo.points}
                                placeholder={trans('pointsToRedeem', 'عدد النقاط للاستبدال', 'Points to Redeem')}
                                required
                            />
                            <button type="submit" style={{ gridColumn: '1 / -1' }}>
                                {trans('redeem', 'استبدال', 'Redeem')}
                            </button>
                        </form>
                    )}

                    {loyaltyInfo.history && loyaltyInfo.history.length > 0 && (
                        <div>
                            <h3>{trans('pointsHistory', '📜 سجل النقاط', '📜 Points History')}</h3>
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{trans('date', 'التاريخ', 'Date')}</th>
                                            <th>{trans('type', 'النوع', 'Type')}</th>
                                            <th>{trans('points', 'النقاط', 'Points')}</th>
                                            <th>{trans('reason', 'السبب', 'Reason')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loyaltyInfo.history.slice(0, 20).map((entry, idx) => (
                                            <tr key={idx}>
                                                <td>{new Date(entry.date).toLocaleDateString()}</td>
                                                <td>
                                                    <span style={{
                                                        color: entry.type === 'earned' ? '#4ade80' : '#f87171',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {entry.type === 'earned'
                                                            ? trans('earned', '➕ مكتسب', '➕ Earned')
                                                            : trans('redeemed', '➖ مستبدل', '➖ Redeemed')
                                                        }
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: 'bold' }}>{entry.points}</td>
                                                <td>{entry.reason}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div style={{
                        marginTop: 30,
                        padding: 20,
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 8
                    }}>
                        <h4>{trans('tierInformation', 'ℹ️ معلومات المستويات', 'ℹ️ Tier Information')}</h4>
                        <div style={{ display: 'grid', gap: 10, marginTop: 15 }}>
                            <div>🥉 <strong>{trans('bronze', 'برونزي', 'Bronze')}:</strong> 0 - 99 {trans('points', 'نقطة', 'points')}</div>
                            <div>🥈 <strong>{trans('silver', 'فضي', 'Silver')}:</strong> 100 - 499 {trans('points', 'نقطة', 'points')}</div>
                            <div>🥇 <strong>{trans('gold', 'ذهبي', 'Gold')}:</strong> 500 - 999 {trans('points', 'نقطة', 'points')}</div>
                            <div>💎 <strong>{trans('platinum', 'بلاتيني', 'Platinum')}:</strong> 1000+ {trans('points', 'نقطة', 'points')}</div>
                        </div>
                    </div>
                </>
            )}

            {!loyaltyInfo && selectedSubscriber && (
                <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
                    {trans('noLoyaltyData', 'لا توجد بيانات ولاء لهذا المشترك', 'No loyalty data for this subscriber')}
                </div>
            )}
        </section>
    );
}
