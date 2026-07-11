export default function DashboardStats({ stats, lang, t: tDict, mode, subscribers, currency, currentUser, smartNotifications }) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (tDict && tDict[key]) return tDict[key];
        return enText;
    };

    const t = {
        dashboard: trans('dashboard', 'لوحة التحكم', 'Dashboard'),
        totalSubscribers: trans('totalSubscribers', 'إجمالي المشتركين', 'Total Subscribers'),
        activeSubscribers: trans('activeSubscribers', 'المشتركين النشطين', 'Active Subscribers'),
        expiredSubscribers: trans('expiredSubscribers', 'المشتركين المنتهين', 'Expired Subscribers'),
        todayAttendance: trans('todayAttendance', 'حضور اليوم', 'Today Attendance'),
        monthlyRevenue: trans('monthlyRevenue', 'أرباح الاشتراكات', 'Subscription Profits'),
        monthlyExpenses: trans('monthlyExpenses', 'المصروفات الشهرية', 'Monthly Expenses'),
        totalSalaries: trans('totalSalaries', 'إجمالي الرواتب', 'Total Salaries'),
        netProfit: trans('netProfit', 'صافي الربح', 'Net Profit'),
        genderBreakdown: trans('genderBreakdown', 'توزيع الجنسين', 'Gender Breakdown'),
        men: trans('male', 'رجال', 'Men'),
        women: trans('female', 'نساء', 'Women'),
        goodsProfit: trans('goodsProfit', 'أرباح البضائع', 'Goods Profit'),
    };

    const canViewSalaries = currentUser?.role === 'admin' || currentUser?.permissions?.canViewSalaries;

    const netProfitValue = canViewSalaries 
        ? (stats?.netProfit || 0) 
        : (stats?.netProfit || 0) + (stats?.totalSalaries || 0);

    let profitColor = '#ffffff';
    let profitEmoji = '💎';

    if (netProfitValue > 0) {
        profitColor = '#4cd137'; // Green color for positive net profit
        profitEmoji = '😊';
    } else if (netProfitValue < 0) {
        profitColor = '#ff6b6b'; // Red color for negative net profit
        profitEmoji = '😟';
    }

    const menCount = subscribers?.filter(s => s.gender === 'male').length || 0;
    const womenCount = subscribers?.filter(s => s.gender === 'female').length || 0;

    return (
        <section className="panel">
            <h2>{t.dashboard}</h2>
            <div className="dashboard-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.totalSubscribers || 0}</div>
                        <div className="stat-label">{t.totalSubscribers}</div>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.activeSubscribers || 0}</div>
                        <div className="stat-label">{t.activeSubscribers}</div>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.expiredSubscribers || 0}</div>
                        <div className="stat-label">{t.expiredSubscribers}</div>
                    </div>
                </div>

                <div className="stat-card info">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.todayAttendance || 0}</div>
                        <div className="stat-label">{t.todayAttendance}</div>
                    </div>
                </div>

                <div className="stat-card revenue">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.monthlyRevenue?.toFixed(2) || '0.00'} {currency}</div>
                        <div className="stat-label">{t.monthlyRevenue}</div>
                    </div>
                </div>

                <div className="stat-card expense">
                    <div className="stat-icon">💸</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.monthlyExpenses?.toFixed(2) || '0.00'} {currency}</div>
                        <div className="stat-label">{t.monthlyExpenses}</div>
                    </div>
                </div>

                {canViewSalaries && (
                    <div className="stat-card salary">
                        <div className="stat-icon">💵</div>
                        <div className="stat-content">
                            <div className="stat-value">{stats?.totalSalaries?.toFixed(2) || '0.00'} {currency}</div>
                            <div className="stat-label">{t.totalSalaries}</div>
                        </div>
                    </div>
                )}

                <div className="stat-card profit">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.goodsProfit?.toFixed(2) || '0.00'} {currency}</div>
                        <div className="stat-label">{t.goodsProfit}</div>
                    </div>
                </div>

                <div className="stat-card net-profit">
                    <div className="stat-icon">{profitEmoji}</div>
                    <div className="stat-content">
                        <div className="stat-value" style={{ background: 'none', WebkitBackgroundClip: 'unset', WebkitTextFillColor: 'unset', color: profitColor }}>
                            {netProfitValue.toFixed(2)} {currency}
                        </div>
                        <div className="stat-label">{t.netProfit}</div>
                    </div>
                </div>
            </div>

            {mode === 'mix' && (
                <div style={{ marginTop: 30, padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ marginTop: 0, fontSize: 18, color: '#fff' }}>📊 {t.genderBreakdown}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginTop: 15 }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                                <span>♂️ {t.men}</span>
                                <span style={{ fontWeight: 'bold' }}>{menCount} ({((menCount / Math.max(1, subscribers?.length || 0)) * 100).toFixed(1)}%)</span>
                            </div>
                            <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${(menCount / Math.max(1, subscribers?.length || 0)) * 100}%`, background: 'linear-gradient(90deg, #1e88e5, #42a5f5)', boxShadow: '0 0 10px rgba(30,136,229,0.5)' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                                <span>♀️ {t.women}</span>
                                <span style={{ fontWeight: 'bold' }}>{womenCount} ({((womenCount / Math.max(1, subscribers?.length || 0)) * 100).toFixed(1)}%)</span>
                            </div>
                            <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${(womenCount / Math.max(1, subscribers?.length || 0)) * 100}%`, background: 'linear-gradient(90deg, #e91e63, #f06292)', boxShadow: '0 0 10px rgba(233,30,99,0.5)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Smart Insights & Alerts Section */}
            {smartNotifications && (
                (smartNotifications.birthdays?.length > 0 || 
                 smartNotifications.absent?.length > 0 || 
                 smartNotifications.lowStock?.length > 0) ? (
                    <div className="smart-alerts-panel" style={{ marginTop: 30, padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ marginTop: 0, fontSize: 18, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>💡 {trans('smartNotificationsTitle', 'تنبيهات ذكية وتحليلات', 'Smart Insights & Alerts')}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 15 }}>
                            {/* Birthdays */}
                            {smartNotifications.birthdays?.length > 0 && (
                                <div style={{ background: 'rgba(255, 184, 108, 0.05)', border: '1px solid rgba(255, 184, 108, 0.15)', borderRadius: 12, padding: 15 }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#ffb86c', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                                        <span>🎉</span> {trans('todayBirthdays', 'أعياد ميلاد اليوم', "Today's Birthdays")}
                                    </h4>
                                    <div style={{ maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {smartNotifications.birthdays.map((sub, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: 6, fontSize: 12 }}>
                                                <span style={{ color: '#fff' }}>🎂 <strong>{sub.name}</strong> ({sub.phone || 'N/A'})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Absent Members */}
                            {smartNotifications.absent?.length > 0 && (
                                <div style={{ background: 'rgba(255, 121, 198, 0.05)', border: '1px solid rgba(255, 121, 198, 0.15)', borderRadius: 12, padding: 15 }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#ff79c6', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                                        <span>⚠️</span> {trans('absentMembersAlert', 'مشتركين غائبين (>7 أيام)', "Absent Members (>7 days)")}
                                    </h4>
                                    <div style={{ maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {smartNotifications.absent.map((sub, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: 6, fontSize: 12 }}>
                                                <span style={{ color: '#fff' }}>🏃‍♂️ <strong>{sub.name}</strong></span>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                                                    {sub.stats?.lastVisit ? new Date(sub.stats.lastVisit).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Low Stock Goods */}
                            {smartNotifications.lowStock?.length > 0 && (
                                <div style={{ background: 'rgba(255, 85, 85, 0.05)', border: '1px solid rgba(255, 85, 85, 0.15)', borderRadius: 12, padding: 15 }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#ff5555', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                                        <span>📦</span> {trans('lowStockAlert', 'نواقص البضائع والمخزون', "Low Stock Goods")}
                                    </h4>
                                    <div style={{ maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {smartNotifications.lowStock.map((good, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: 6, fontSize: 12 }}>
                                                <span style={{ color: '#fff' }}>🏷️ <strong>{good.name}</strong></span>
                                                <span style={{ color: '#ff5555', fontWeight: 'bold' }}>
                                                    {good.qty} / {good.minStock || 5}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null
            )}

            <style jsx>{`
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .stat-card {
                    background: linear-gradient(135deg, rgba(11, 107, 138, 0.1), rgba(6, 42, 61, 0.2));
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #0b6b8a, #1496b0);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(11, 107, 138, 0.3);
                }

                .stat-card:hover::before {
                    opacity: 1;
                }

                .stat-icon {
                    font-size: 48px;
                    opacity: 0.8;
                }

                .stat-content {
                    flex: 1;
                }

                .stat-value {
                    font-size: 32px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #ffffff, #cccccc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 4px;
                }

                .stat-label {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 500;
                }

                .stat-card.primary { border-left: 4px solid #1e88e5; }
                .stat-card.success { border-left: 4px solid #4caf50; }
                .stat-card.warning { border-left: 4px solid #ff9800; }
                .stat-card.info { border-left: 4px solid #00bcd4; }
                .stat-card.revenue { border-left: 4px solid #9c27b0; }
                .stat-card.expense { border-left: 4px solid #f44336; }
                .stat-card.salary { border-left: 4px solid #ff5722; }
                .stat-card.profit { border-left: 4px solid #8bc34a; }
                .stat-card.net-profit { 
                    border-left: 4px solid #ffd700;
                    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 193, 7, 0.1));
                }

                @media (max-width: 768px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </section>
    );
}
