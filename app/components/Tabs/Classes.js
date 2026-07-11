'use client';
import React, { useState } from 'react';

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ClassesTab({ lang, t, classes, handleClassSubmit, handleDelete, loadAllData }) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const [view, setView] = useState('grid'); // 'grid' | 'schedule'
    const [selectedDay, setSelectedDay] = useState(new Date().getDay());

    const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const DAYS_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const DAYS = DAYS_KEYS.map((key, i) => trans(key, DAYS_AR[i], DAYS_EN[i]));

    const classesOnDay = classes.filter(c =>
        c.schedule && c.schedule.some(s => s.day === selectedDay)
    );

    const cardStyle = {
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        transition: 'all 0.2s',
    };

    return (
        <section className="panel">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <h2 style={{ margin: 0 }}>{t.classes}</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        className="small"
                        onClick={() => setView('grid')}
                        style={{
                            background: view === 'grid' ? 'linear-gradient(135deg,#0b6b8a,#1496b0)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)', fontSize: 12
                        }}
                    >
                        ⊞ {trans('gridView', 'بطاقات', 'Grid')}
                    </button>
                    <button
                        className="small"
                        onClick={() => setView('schedule')}
                        style={{
                            background: view === 'schedule' ? 'linear-gradient(135deg,#0b6b8a,#1496b0)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)', fontSize: 12
                        }}
                    >
                        📅 {trans('scheduleView', 'جدول', 'Schedule')}
                    </button>
                </div>
            </div>

            {/* Add Class Form */}
            <div style={{
                background: 'rgba(11,107,138,0.06)',
                border: '1px solid rgba(11,107,138,0.15)',
                borderRadius: 14,
                padding: 20,
                marginBottom: 24
            }}>
                <h3 style={{ margin: '0 0 14px', fontSize: 14, opacity: 0.7 }}>
                    ➕ {trans('addNewClass', 'إضافة حصة جديدة', 'Add New Class')}
                </h3>
                <form onSubmit={handleClassSubmit} className="form-grid">
                    <input name="name" placeholder="Class Name (EN)" required />
                    <input name="nameAr" placeholder="اسم الحصة (AR)" required />
                    <div className="tooltip-field" data-tooltip={trans('maxCapacityTooltip', 'الحد الأقصى لعدد المشتركين في الحصة', 'Max participants allowed')}><input name="capacity" type="number" placeholder={trans('maxCapacity', 'السعة القصوى', 'Max Capacity')} required min="1" /></div>
                    <input name="duration" type="number" placeholder={trans('durationMinutes', 'المدة (دقيقة)', 'Duration (min)')} required min="15" />
                    <select name="gender">
                        <option value="mixed">{trans('genderMixed', '⚡ مختلط', '⚡ Mixed')}</option>
                        <option value="male">{trans('genderMale', '♂️ رجال', '♂️ Men')}</option>
                        <option value="female">{trans('genderFemale', '♀️ نساء', '♀️ Women')}</option>
                    </select>
                    <input name="time" type="time" placeholder={trans('classTime', 'وقت الحصة', 'Class Time')} />
                    <div className="tooltip-field" data-tooltip={trans('trainerNameTooltip', 'اسم المدرب المسؤول عن الحصة', 'Trainer responsible for this class')}><input name="trainer" placeholder={trans('trainerName', 'اسم المدرب', 'Trainer Name')} /></div>
                    <button type="submit" style={{
                        gridColumn: '1 / -1',
                        background: 'linear-gradient(135deg,#0b6b8a,#1496b0)',
                        border: 'none', padding: 12, borderRadius: 10, fontWeight: 700, cursor: 'pointer'
                    }}>
                        ✅ {t.save}
                    </button>
                </form>
            </div>

            {/* Schedule View - Day Tabs */}
            {view === 'schedule' && (
                <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                        {DAYS.map((day, idx) => (
                            <button
                                key={idx}
                                className="small"
                                onClick={() => setSelectedDay(idx)}
                                style={{
                                    background: selectedDay === idx ? 'linear-gradient(135deg,#0b6b8a,#1496b0)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${selectedDay === idx ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                                    color: selectedDay === idx ? 'white' : 'rgba(255,255,255,0.6)',
                                    fontSize: 12
                                }}
                            >
                                {day}
                                {idx === new Date().getDay() && ' 🔵'}
                            </button>
                        ))}
                    </div>
                    {classesOnDay.length === 0 ? (
                        <div style={{ padding: 30, textAlign: 'center', opacity: 0.4 }}>
                            {trans('noClassesOnDay', `لا توجد حصص يوم ${DAYS[selectedDay]}`, `No classes on ${DAYS[selectedDay]}`)}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
                            {classesOnDay.map(c => (
                                <ClassCard key={c._id} c={c} lang={lang} t={t} handleDelete={handleDelete} loadAllData={loadAllData} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Grid View */}
            {view === 'grid' && (
                <>
                    {classes.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', opacity: 0.4 }}>
                            {trans('noClassesYet', '📭 لا توجد حصص بعد', '📭 No classes yet')}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
                            {classes.map(c => (
                                <ClassCard key={c._id} c={c} lang={lang} t={t} handleDelete={handleDelete} loadAllData={loadAllData} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

function ClassCard({ c, lang, t, handleDelete, loadAllData }) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const genderColors = {
        male: { bg: 'rgba(100,181,246,0.1)', border: 'rgba(100,181,246,0.25)', color: '#64b5f6', label: trans('genderMale', '♂️ رجال', '♂️ Men') },
        female: { bg: 'rgba(240,98,146,0.1)', border: 'rgba(240,98,146,0.25)', color: '#f06292', label: trans('genderFemale', '♀️ نساء', '♀️ Women') },
        mixed: { bg: 'rgba(14,230,183,0.1)', border: 'rgba(14,230,183,0.25)', color: '#0ee6b7', label: trans('genderMixed', '⚡ مختلط', '⚡ Mixed') },
    };
    const gc = genderColors[c.gender] || genderColors.mixed;

    return (
        <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${gc.border}`,
            borderRadius: 14,
            padding: 18,
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Top glow */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${gc.color},transparent)` }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                    <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 2 }}>
                        {lang === 'ar' ? c.nameAr : c.name}
                    </div>
                    {c.trainer && (
                        <div style={{ fontSize: 12, opacity: 0.5 }}>
                            👤 {c.trainer}
                        </div>
                    )}
                </div>
                <span style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: gc.bg, border: `1px solid ${gc.border}`, color: gc.color
                }}>
                    {gc.label}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                    { icon: '👥', label: trans('capacity', 'السعة', 'Capacity'), value: c.capacity },
                    { icon: '⏱️', label: trans('duration', 'المدة', 'Duration'), value: `${c.duration} ${trans('minutes', 'دقيقة', 'min')}` },
                    c.time && { icon: '🕐', label: trans('time', 'الوقت', 'Time'), value: c.time },
                ].filter(Boolean).map(info => (
                    <div key={info.label} style={{
                        padding: '8px 10px', background: 'rgba(255,255,255,0.03)',
                        borderRadius: 8, fontSize: 12
                    }}>
                        <div style={{ opacity: 0.4, marginBottom: 2 }}>{info.icon} {info.label}</div>
                        <div style={{ fontWeight: 700 }}>{info.value}</div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => handleDelete && handleDelete('class', c._id, trans('deleteClassConfirm', `هل أنت متأكد من حذف الحصة "${c.nameAr || c.name}"؟`, `Are you sure you want to delete class "${c.name}"?`))}
                style={{
                    width: '100%', background: 'rgba(255,75,75,0.08)',
                    border: '1px solid rgba(255,75,75,0.2)', color: '#ff7f7f',
                    padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer'
                }}
            >
                🗑️ {t.delete}
            </button>
        </div>
    );
}
