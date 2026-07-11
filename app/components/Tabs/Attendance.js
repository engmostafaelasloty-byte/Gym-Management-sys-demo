'use client';
import React, { useState } from 'react';

export default function AttendanceTab({ lang, t, todayAttendance, handleCheckOut }) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const [search, setSearch] = useState('');

    const filtered = todayAttendance.filter(att =>
        att.subscriber?.name?.toLowerCase().includes(search.toLowerCase())
    );

    // Stats
    const totalIn = todayAttendance.length;
    const totalOut = todayAttendance.filter(a => a.checkOut).length;
    const stillIn = totalIn - totalOut;

    const calcDuration = (att) => {
        if (!att.checkOut) {
            const mins = Math.floor((new Date() - new Date(att.checkIn)) / 60000);
            return `${mins} ${trans('minutesActive', 'دقيقة (جاري)', 'min (active)')}`;
        }
        const mins = Math.floor((new Date(att.checkOut) - new Date(att.checkIn)) / 60000);
        if (mins < 60) return `${mins} ${trans('minutes', 'دقيقة', 'min')}`;
        return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    };

    const exportAttendance = () => {
        const rows = todayAttendance.map(a => ({
            name: a.subscriber?.name || '---',
            checkIn: new Date(a.checkIn).toLocaleTimeString(),
            checkOut: a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : '---',
        }));
        const headers = [
            trans('name', 'الاسم', 'Name'),
            trans('checkIn', 'دخول', 'Check In'),
            trans('checkOut', 'خروج', 'Check Out'),
        ].join(',');
        const body = rows.map(r => `${r.name},${r.checkIn},${r.checkOut}`).join('\n');
        const blob = new Blob(['\uFEFF' + headers + '\n' + body], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <section className="panel">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <h2 style={{ margin: 0 }}>
                    {t.attendance} — <span style={{ color: '#1496b0', fontSize: '0.7em' }}>
                        {new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </h2>
                <button
                    onClick={exportAttendance}
                    className="small"
                    style={{ background: 'rgba(20,150,176,0.15)', border: '1px solid rgba(20,150,176,0.3)', color: '#1496b0' }}
                >
                    📤 {trans('export', 'تصدير', 'Export')}
                </button>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                    { label: trans('totalToday', 'إجمالي الحضور', 'Total Today'), value: totalIn, color: '#1496b0', icon: '👥' },
                    { label: trans('stillInside', 'لا يزالون داخل', 'Still Inside'), value: stillIn, color: '#0ee6b7', icon: '🟢' },
                    { label: trans('checkedOut', 'غادروا', 'Checked Out'), value: totalOut, color: '#9fb3be', icon: '🚪' },
                ].map(stat => (
                    <div key={stat.label} style={{
                        padding: '14px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid rgba(255,255,255,0.06)`,
                        borderRadius: 12,
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div style={{ marginBottom: 14 }}>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={trans('searchByNamePlaceholder', '🔍 بحث بالاسم...', '🔍 Search by name...')} title={trans('searchByNameTitle', 'الاسم الكامل للموظف', 'Search by member name')}
                    style={{ maxWidth: 300 }}
                />
            </div>

            {/* Table */}
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t.name}</th>
                            <th>{t.checkIn}</th>
                            <th>{t.checkOut}</th>
                            <th>{trans('duration', 'المدة', 'Duration')}</th>
                            <th>{trans('status', 'الحالة', 'Status')}</th>
                            <th>{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((att, idx) => (
                            <tr key={att._id}>
                                <td style={{ opacity: 0.5 }}>{idx + 1}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            background: att.checkOut ? 'rgba(159,179,190,0.2)' : 'linear-gradient(135deg,#0b6b8a,#0ee6b7)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 13, fontWeight: 700, flexShrink: 0
                                        }}>
                                            {att.subscriber?.name?.charAt(0) || '?'}
                                        </div>
                                        <span style={{ fontWeight: 600 }}>{att.subscriber?.name || '---'}</span>
                                    </div>
                                </td>
                                <td style={{ fontFamily: 'monospace', color: '#0ee6b7' }}>
                                    {new Date(att.checkIn).toLocaleTimeString()}
                                </td>
                                <td style={{ fontFamily: 'monospace', opacity: att.checkOut ? 1 : 0.4 }}>
                                    {att.checkOut ? new Date(att.checkOut).toLocaleTimeString() : '---'}
                                </td>
                                <td style={{ fontSize: 13, opacity: 0.7 }}>{calcDuration(att)}</td>
                                <td>
                                    {att.checkOut ? (
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                                            background: 'rgba(159,179,190,0.1)', border: '1px solid rgba(159,179,190,0.2)',
                                            color: '#9fb3be'
                                        }}>
                                            🚪 {trans('left', 'خارج', 'Left')}
                                        </span>
                                    ) : (
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                                            background: 'rgba(14,230,183,0.15)', border: '1px solid rgba(14,230,183,0.3)',
                                            color: '#0ee6b7'
                                        }}>
                                            🟢 {trans('inside', 'داخل', 'Inside')}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {!att.checkOut && (
                                        <button
                                            className="small"
                                            onClick={() => handleCheckOut(att._id)}
                                            style={{
                                                background: 'rgba(255,152,0,0.15)',
                                                border: '1px solid rgba(255,152,0,0.3)',
                                                color: '#ff9800', fontSize: 12
                                            }}
                                        >
                                            🚪 {t.checkOut}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ padding: 40, opacity: 0.4, textAlign: 'center' }}>
                                    {search ? trans('noResults', 'لا توجد نتائج', 'No results') : trans('noAttendanceToday', '📭 لا يوجد حضور اليوم', '📭 No attendance records today')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
