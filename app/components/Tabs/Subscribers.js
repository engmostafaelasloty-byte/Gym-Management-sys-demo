'use client';
import React, { useState, useEffect } from 'react';

export default function SubscribersTab({
    lang, t, mode, currentUser, currency,
    subscribers, searchTerm, setSearchTerm,
    filterType, setFilterType, filteredSubs,
    filterMonth, setFilterMonth,
    editSubId, setEditSubId, subFormRef,
    handleSubSubmit, handleDelete, handleRenew, handleExtend,
    handleCheckIn, handleFreeze, handleUnfreeze,
    setSelectedSub, getStatus, exportToCSV
}) {
    const [payStatus, setPayStatus] = useState('completed');

    useEffect(() => {
        if (editSubId) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const f = subFormRef.current;
            if (f) {
                setTimeout(() => {
                    f.elements['name']?.focus();
                }, 50);
            }
        }
    }, [editSubId, subFormRef]);

    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const canAdd = currentUser?.role === 'admin' || currentUser?.permissions?.canAddSubscribers;
    const canEdit = currentUser?.role === 'admin' || currentUser?.permissions?.canEditSubscribers;
    const canDelete = currentUser?.role === 'admin' || currentUser?.permissions?.canDeleteSubscribers;
    const canRenew = currentUser?.role === 'admin' || currentUser?.permissions?.canRenewSubscribers;
    const canFreeze = currentUser?.role === 'admin' || currentUser?.permissions?.canFreezeSubscribers;
    const canCheckIn = currentUser?.role === 'admin' || currentUser?.permissions?.canCheckInSubscribers;

    return (
        <section className="panel">
            <h2>{t.subscribers}</h2>

            {/* Form */}
            {canAdd && (
                <form ref={subFormRef} onSubmit={handleSubSubmit} className="form-grid">
                    <div className="tooltip-field" data-tooltip={trans('subscriberNameTooltip', 'اكتب الاسم الرباعي للمشترك', 'Enter subscriber full name')}><input name="name" placeholder={t.name} required /></div>
                    <div className="tooltip-field" data-tooltip={trans('subscriberEmailTooltip', 'البريد الإلكتروني (اختياري)', 'Email address (optional)')}><input name="email" type="email" placeholder={t.email} /></div>
                    <div className="tooltip-field" data-tooltip={trans('subscriberPhoneTooltip', 'رقم هاتف المشترك', 'Subscriber phone number')}><input name="phone" placeholder={t.phone} /></div>
                    <div className="tooltip-field" data-tooltip={trans('subscriberCategoryTooltip', 'فئة العضوية: VIP, عادي, طالب...', 'Category: VIP, Regular, Student...')}><input name="category" placeholder={t.category} /></div>
                    <div className="tooltip-field" data-tooltip={trans('subscriberPriceTooltip', 'سعر الاشتراك بالعملة المحلية', 'Subscription price in local currency')}><input name="price" type="number" placeholder={t.price} required /></div>
                    <div className="tooltip-field" data-tooltip={trans('subscriberCountTooltip', 'عدد الأشخاص (للتسجيل الجماعي)', 'Number of people (bulk registration)')}><input name="count" type="number" defaultValue="1" placeholder={t.count} /></div>
                    <select name="gender" defaultValue={mode === 'women' ? 'female' : 'male'} disabled={mode !== 'admin' && mode !== 'mix'}>
                        <option value="male">{t.male}</option>
                        <option value="female">{t.female}</option>
                    </select>
                    <select name="months" defaultValue="1">
                        <option value="0">{t.day}</option>
                        <option value="0.25">{t.week}</option>
                        <option value="0.5">{t.halfMonth}</option>
                        <option value="1">1 {t.month}</option>
                        <option value="2">2 {t.months}</option>
                        <option value="3">3 {t.months}</option>
                        <option value="6">6 {t.months}</option>
                        <option value="12">12 {t.months}</option>
                        <option value="18">18 {t.months}</option>
                        <option value="24">24 {t.months}</option>
                        <option value="36">36 {t.months}</option>
                    </select>
                    <select name="planType" defaultValue="time">
                        <option value="time">{trans('planTypeTime', 'وقت', 'Time')}</option>
                        <option value="sessions">{trans('planTypeSessions', 'حصص', 'Sessions')}</option>
                    </select>
                    <div className="tooltip-field" data-tooltip={trans('allowedSessionsTooltip', 'عدد الحصص المسموحة (لخطة الحصص)', 'Allowed sessions (session plan only)')}><input name="sessions" type="number" placeholder={trans('sessionsCountPlaceholder', 'عدد الحصص', 'Sessions Count')} /></div>
                    <div className="tooltip-field" data-tooltip={trans('startDateTooltip', 'تاريخ البدء (اتركه فارغ = اليوم)', 'Start date (leave empty = today)')}><input name="startDate" type="date" /></div>
                    {!editSubId && (
                        <>
                            <select name="paymentStatus" value={payStatus} onChange={(e) => setPayStatus(e.target.value)}>
                                <option value="completed">{trans('paymentCompleted', 'مدفوع بالكامل', 'Paid in Full')}</option>
                                <option value="pending">{trans('paymentPending', 'دفع لاحقاً (معلق)', 'Pay Later (Pending)')}</option>
                                <option value="installments">{trans('paymentInstallments', 'تقسيط', 'Installments')}</option>
                            </select>
                            {payStatus === 'installments' && (
                                <div className="tooltip-field" data-tooltip={trans('installmentsCountTooltip', 'عدد الأقساط', 'Number of installments')}>
                                    <select name="installmentsCount" defaultValue="3">
                                        <option value="2">2 {trans('installmentsOpt', 'أقساط', 'Installments')}</option>
                                        <option value="3">3 {trans('installmentsOpt', 'أقساط', 'Installments')}</option>
                                        <option value="4">4 {trans('installmentsOpt', 'أقساط', 'Installments')}</option>
                                        <option value="6">6 {trans('installmentsOpt', 'أقساط', 'Installments')}</option>
                                        <option value="12">12 {trans('installmentsOpt', 'قسطاً', 'Installments')}</option>
                                    </select>
                                </div>
                            )}
                        </>
                    )}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
                        <button type="submit" style={{ flex: 1 }}>
                            {editSubId ? t.save : t.save}
                        </button>
                        {editSubId && (
                            <button type="button" onClick={() => { setEditSubId(null); subFormRef.current?.reset(); }} style={{ background: 'gray' }}>
                                {t.cancel}
                            </button>
                        )}
                    </div>
                </form>
            )}

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: 10, marginTop: 20, marginBottom: 10 }}>
                <input
                    type="text"
                    placeholder={t.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 3 }}
                />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ flex: 1, minWidth: '120px' }}>
                    <option value="all">{t.filterAll}</option>
                    <option value="active">{t.filterActive}</option>
                    <option value="expired">{t.filterExpired}</option>
                    <option value="soon">{t.filterSoon}</option>
                    <option value="frozen">{t.filterFrozen}</option>
                </select>
                <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={{ flex: 1, minWidth: '120px' }}>
                    <option value="all">{trans('filterByMonth', 'فلترة بالشهور', 'Filter by Month')}</option>
                    <option value="1">{trans('january', 'يناير (1)', 'January (1)')}</option>
                    <option value="2">{trans('february', 'فبراير (2)', 'February (2)')}</option>
                    <option value="3">{trans('march', 'مارس (3)', 'March (3)')}</option>
                    <option value="4">{trans('april', 'أبريل (4)', 'April (4)')}</option>
                    <option value="5">{trans('may', 'مايو (5)', 'May (5)')}</option>
                    <option value="6">{trans('june', 'يونيو (6)', 'June (6)')}</option>
                    <option value="7">{trans('july', 'يوليو (7)', 'July (7)')}</option>
                    <option value="8">{trans('august', 'أغسطس (8)', 'August (8)')}</option>
                    <option value="9">{trans('september', 'سبتمبر (9)', 'September (9)')}</option>
                    <option value="10">{trans('october', 'أكتوبر (10)', 'October (10)')}</option>
                    <option value="11">{trans('november', 'نوفمبر (11)', 'November (11)')}</option>
                    <option value="12">{trans('december', 'ديسمبر (12)', 'December (12)')}</option>
                </select>
                <button className="secondary" onClick={() => exportToCSV(filteredSubs, 'subscribers')} style={{ flex: '0 0 auto' }}>
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
                            <th>{t.phone}</th>
                            <th>{t.category}</th>
                            <th>{t.price}</th>
                            <th>{t.startDate}</th>
                            <th>{t.endDate}</th>
                            <th>{t.status}</th>
                            <th>{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubs.map((sub, idx) => {
                            const status = getStatus(sub.endDate);
                            const isExpired = (sub.planType === 'time' && new Date(sub.endDate) <= new Date()) || (sub.planType === 'sessions' && sub.remainingSessions <= 0);
                            return (
                                <tr key={sub._id}>
                                    <td>{idx + 1}</td>
                                    <td>{sub.name}</td>
                                    <td>{sub.phone}</td>
                                    <td>{sub.category}</td>
                                    <td>{sub.price} {currency}</td>
                                    <td>{sub.startDate?.split('T')[0]}</td>
                                    <td>{sub.endDate?.split('T')[0]}</td>
                                    <td>
                                        {sub.isFrozen ? (
                                            <span className="status-warning">
                                                {trans('frozen', 'مجمد', 'Frozen')}
                                                {(() => {
                                                    const lastFreeze = sub.freezeHistory?.[sub.freezeHistory.length - 1];
                                                    if (lastFreeze && lastFreeze.endDate) {
                                                        const freezeDaysLeft = Math.ceil((new Date(lastFreeze.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                                                        return freezeDaysLeft > 0 
                                                            ? ` (${lang === 'ar' ? 'متبقي' : 'left'} ${freezeDaysLeft} ${lang === 'ar' ? 'يوم' : 'days'})` 
                                                            : '';
                                                    }
                                                    return '';
                                                })()}
                                                {sub.freezeHistory?.length > 0 && sub.freezeHistory[sub.freezeHistory.length - 1]?.reason && (
                                                    <div style={{ fontSize: '0.75em', opacity: 0.85, marginTop: 2 }}>
                                                        📝 {sub.freezeHistory[sub.freezeHistory.length - 1].reason}
                                                    </div>
                                                )}
                                            </span>
                                        ) : sub.planType === 'sessions' ? (
                                            <span className="status-active">{sub.remainingSessions} {trans('sessions', 'حصص', 'Sessions')}</span>
                                        ) : (
                                            <span className={status.cls}>{status.text}</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, minWidth: '120px' }}>
                                            <button className="small" style={{ background: '#0b6b8a' }} onClick={() => setSelectedSub(sub)}>👁️</button>
                                            {canEdit && !isExpired && (
                                                <button className="small" onClick={() => {
                                                    setEditSubId(sub._id);
                                                    const f = subFormRef.current;
                                                    if (f) {
                                                        f.elements['name'].value = sub.name;
                                                        f.elements['email'].value = sub.email || '';
                                                        f.elements['phone'].value = sub.phone || '';
                                                        f.elements['category'].value = sub.category || '';
                                                        f.elements['price'].value = sub.price;
                                                        f.elements['months'].value = sub.months;
                                                        f.elements['gender'].value = sub.gender;
                                                        f.elements['planType'].value = sub.planType || 'time';
                                                        f.elements['sessions'].value = sub.totalSessions || '';
                                                        if (sub.startDate) f.elements['startDate'].value = sub.startDate.split('T')[0];
                                                    }
                                                }}>{t.edit}</button>
                                            )}
                                            {canDelete && (
                                                <button className="small" onClick={() => handleDelete('sub', sub._id)} style={{ background: 'darkred' }}>{t.delete}</button>
                                            )}

                                            {canFreeze && sub.isFrozen && (
                                                <button className="small" onClick={() => handleUnfreeze(sub._id)} style={{ background: 'blue' }}>{trans('unfreeze', 'إلغاء التجميد', 'Unfreeze')}</button>
                                            )}
                                            {canFreeze && !sub.isFrozen && !isExpired && (
                                                <button className="small" onClick={() => handleFreeze(sub._id)} style={{ background: 'gray' }}>{trans('freeze', 'تجميد', 'Freeze')}</button>
                                            )}

                                            {canRenew && (
                                                isExpired ? (
                                                    <button className="small" onClick={() => handleRenew(sub._id)} style={{ background: 'orange', color: 'black' }}>{t.renew}</button>
                                                ) : (
                                                    <button className="small" onClick={() => handleExtend(sub._id)} style={{ background: '#1496b0' }}>{t.extend}</button>
                                                )
                                            )}

                                            {canCheckIn && !sub.isFrozen && !isExpired && (
                                                <button className="small" onClick={() => handleCheckIn(sub._id)} style={{ background: 'green' }}>{t.checkIn}</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
