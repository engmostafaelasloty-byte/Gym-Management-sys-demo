'use client';
import React, { useState } from 'react';

const PRESET_BRANDS = ['Technogym', 'Life Fitness', 'Matrix', 'Precor', 'Hammer Strength', 'Rogue', 'Body-Solid', 'Cybex'];

const EMPTY_FORM = {
    name: '',
    brand: '',
    category: '',
    purchaseDate: '',
    purchasePrice: '',
    serialNumber: '',
    location: '',
    condition: '',
    notes: '',
};

export default function EquipmentTab({
    lang, t, equipment, systemType, addEquipment, updateEquipment, handleDelete, addMaintenance, loadAllData
}) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const [showEquipmentForm, setShowEquipmentForm] = useState(false);
    const [editEquipmentId, setEditEquipmentId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null); // full object
    const [showBrandList, setShowBrandList] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Get unique brands from existing equipment + preset list (no duplicates)
    const existingBrands = (equipment || []).map(eq => eq.brand).filter(Boolean);
    const allBrands = [...new Set([...PRESET_BRANDS, ...existingBrands])];

    const ar = lang === 'ar';

    const handleFormChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const openAddForm = () => {
        setEditEquipmentId(null);
        setFormData(EMPTY_FORM);
        setShowEquipmentForm(true);
    };

    const openEditForm = (eq) => {
        setEditEquipmentId(eq._id);
        setFormData({
            name: eq.name || '',
            brand: eq.brand || '',
            category: eq.category || '',
            purchaseDate: eq.purchaseDate ? eq.purchaseDate.split('T')[0] : '',
            purchasePrice: eq.purchasePrice ?? '',
            serialNumber: eq.serialNumber || '',
            location: eq.location || '',
            condition: eq.condition || '',
            notes: eq.notes || '',
        });
        setShowEquipmentForm(true);
    };

    const closeForm = () => {
        setShowEquipmentForm(false);
        setEditEquipmentId(null);
        setFormData(EMPTY_FORM);
    };

    const handleEquipmentSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = {
            name: formData.name,
            nameAr: formData.name,
            brand: formData.brand,
            category: formData.category,
            purchaseDate: new Date(formData.purchaseDate),
            purchasePrice: parseFloat(formData.purchasePrice),
            serialNumber: formData.serialNumber || undefined,
            location: formData.location,
            condition: formData.condition,
            notes: formData.notes,
            systemType: systemType || 'separate',
        };

        try {
            if (editEquipmentId) {
                await updateEquipment(editEquipmentId, data);
            } else {
                await addEquipment(data);
            }
            closeForm();
            loadAllData();
            alert(trans('savedSuccessfully', '✅ تم الحفظ بنجاح', '✅ Saved successfully'));
        } catch (err) {
            console.error(err);
            alert(trans('equipmentError', '❌ حدث خطأ (ربما الرقم التسلسلي مكرر)', '❌ Error: serial number may be duplicate'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleMaintenanceSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const fd = new FormData(e.target);
        const data = {
            equipment: selectedEquipment._id,
            type: fd.get('type'),
            description: fd.get('description'),
            cost: parseFloat(fd.get('cost')) || 0,
            performedBy: fd.get('performedBy'),
            nextScheduled: fd.get('nextScheduled') ? new Date(fd.get('nextScheduled')) : null,
            notes: fd.get('notes'),
        };

        try {
            await addMaintenance(data);
            e.target.reset();
            setShowMaintenanceForm(false);
            setSelectedEquipment(null);
            loadAllData();
            alert(trans('maintenanceRecorded', '✅ تم تسجيل الصيانة بنجاح', '✅ Maintenance recorded'));
        } catch (err) {
            console.error(err);
            alert(trans('errorOccurred', '❌ حدث خطأ', '❌ An error occurred'));
        } finally {
            setSubmitting(false);
        }
    };

    const getConditionColor = (c) => ({
        excellent: '#4ade80',
        good: '#60a5fa',
        fair: '#fbbf24',
        poor: '#f87171',
        broken: '#dc2626',
    }[c] || '#9ca3af');

    const getConditionText = (c) => ({
        excellent: trans('excellent', 'ممتاز', 'Excellent'),
        good: trans('good', 'جيد', 'Good'),
        fair: trans('fair', 'مقبول', 'Fair'),
        poor: trans('poor', 'سيء', 'Poor'),
        broken: trans('broken', 'معطوب', 'Broken'),
    }[c] || c || '-');

    const getCategoryText = (c) => ({
        cardio: trans('cardio', 'كارديو', 'Cardio'),
        strength: trans('strength', 'قوة', 'Strength'),
        free_weights: trans('freeWeights', 'أوزان حرة', 'Free Weights'),
        functional: trans('functional', 'وظيفي', 'Functional'),
        other: trans('other', 'أخرى', 'Other'),
    }[c] || c || '-');

    const isMaintenanceDue = (eq) => {
        if (!eq.nextMaintenance) return false;
        return new Date(eq.nextMaintenance) <= new Date();
    };

    return (
        <div style={{ display: 'grid', gap: 20 }}>
            {/* ── Equipment List Panel ── */}
            <section className="panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                    <h2 style={{ margin: 0 }}>{trans('gymEquipment', '🏋️ المعدات الرياضية', '🏋️ Gym Equipment')}</h2>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: 13, opacity: 0.6, alignSelf: 'center' }}>
                            {(equipment || []).length} {trans('items', 'معدة', 'items')}
                        </span>
                        <button onClick={showEquipmentForm ? closeForm : openAddForm}>
                            {showEquipmentForm
                                ? trans('cancel', '❌ إلغاء', '❌ Cancel')
                                : trans('addEquipment', '➕ إضافة معدة', '➕ Add Equipment')
                            }
                        </button>
                    </div>
                </div>

                {/* ── Add / Edit Form ── */}
                {showEquipmentForm && (
                    <form onSubmit={handleEquipmentSubmit} className="form-grid" style={{ marginBottom: 30, padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                        <h3 style={{ gridColumn: '1 / -1', margin: '0 0 4px', fontSize: 15, opacity: 0.8 }}>
                            {editEquipmentId ? trans('editEquipment', '✏️ تعديل المعدة', '✏️ Edit Equipment') : trans('newEquipment', '➕ معدة جديدة', '➕ New Equipment')}
                        </h3>

                        {/* Name */}
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            placeholder={trans('equipmentName', 'اسم المعدة *', 'Equipment Name *')}
                            required
                        />

                        {/* Brand with dropdown */}
                        <div style={{ position: 'relative' }}>
                            <input
                                name="brand"
                                value={formData.brand}
                                onChange={handleFormChange}
                                placeholder={trans('brand', 'الماركة', 'Brand')}
                                autoComplete="off"
                                onFocus={() => setShowBrandList(true)}
                                onBlur={() => setTimeout(() => setShowBrandList(false), 200)}
                            />
                            {showBrandList && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    background: '#062a3d',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 8,
                                    marginTop: 4,
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                    zIndex: 100,
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                }}>
                                    {allBrands.map((b, i) => (
                                        <div
                                            key={i}
                                            onMouseDown={() => {
                                                setFormData(prev => ({ ...prev, brand: b }));
                                                setShowBrandList(false);
                                            }}
                                            style={{
                                                padding: '10px 15px',
                                                cursor: 'pointer',
                                                color: 'white',
                                                fontSize: 14,
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            {b}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Category */}
                        <select name="category" value={formData.category} onChange={handleFormChange} required>
                            <option value="">{trans('categoryOption', '-- الفئة --', '-- Category --')}</option>
                            <option value="cardio">{trans('cardio', 'كارديو', 'Cardio')}</option>
                            <option value="strength">{trans('strength', 'قوة', 'Strength')}</option>
                            <option value="free_weights">{trans('freeWeights', 'أوزان حرة', 'Free Weights')}</option>
                            <option value="functional">{trans('functional', 'وظيفي', 'Functional')}</option>
                            <option value="other">{trans('other', 'أخرى', 'Other')}</option>
                        </select>

                        {/* Condition */}
                        <select name="condition" value={formData.condition} onChange={handleFormChange} required>
                            <option value="">{trans('conditionOption', '-- الحالة --', '-- Condition --')}</option>
                            <option value="excellent">{trans('excellent', 'ممتاز', 'Excellent')}</option>
                            <option value="good">{trans('good', 'جيد', 'Good')}</option>
                            <option value="fair">{trans('fair', 'مقبول', 'Fair')}</option>
                            <option value="poor">{trans('poor', 'سيء', 'Poor')}</option>
                            <option value="broken">{trans('broken', 'معطوب', 'Broken')}</option>
                        </select>

                        {/* Purchase Date */}
                        <input
                            name="purchaseDate"
                            type="date"
                            value={formData.purchaseDate}
                            onChange={handleFormChange}
                            required
                        />

                        {/* Purchase Price */}
                        <input
                            name="purchasePrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.purchasePrice}
                            onChange={handleFormChange}
                            placeholder={trans('purchasePrice', 'سعر الشراء *', 'Purchase Price *')}
                            required
                        />

                        {/* Serial Number */}
                        <input
                            name="serialNumber"
                            value={formData.serialNumber}
                            onChange={handleFormChange}
                            placeholder={trans('serialNumberOptional', 'الرقم التسلسلي (اختياري)', 'Serial Number (optional)')}
                        />

                        {/* Location */}
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleFormChange}
                            placeholder={trans('locationInGym', 'الموقع داخل الجيم', 'Location in gym')}
                        />

                        {/* Notes */}
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleFormChange}
                            placeholder={trans('notes', 'ملاحظات', 'Notes')}
                            rows="2"
                            style={{ gridColumn: '1 / -1' }}
                        />

                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
                            <button type="submit" disabled={submitting} style={{ flex: 1 }}>
                                {submitting ? trans('saving', 'جاري الحفظ...', 'Saving...') : t.save}
                            </button>
                            <button type="button" onClick={closeForm} style={{ flex: 1, background: 'rgba(255,255,255,0.06)' }}>
                                {t.cancel}
                            </button>
                        </div>
                    </form>
                )}

                {/* ── Equipment Table ── */}
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>{trans('name', 'الاسم', 'Name')}</th>
                                <th>{trans('brand', 'الماركة', 'Brand')}</th>
                                <th>{trans('category', 'الفئة', 'Category')}</th>
                                <th>{trans('condition', 'الحالة', 'Condition')}</th>
                                <th>{trans('location', 'الموقع', 'Location')}</th>
                                <th>{trans('purchaseDate', 'تاريخ الشراء', 'Purchase Date')}</th>
                                <th>{trans('nextMaintenance', 'الصيانة القادمة', 'Next Maintenance')}</th>
                                <th>{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(equipment || []).length > 0 ? (equipment || []).map((eq, idx) => (
                                <tr key={eq._id} style={{ opacity: eq.active === false ? 0.5 : 1 }}>
                                    <td>{idx + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{eq.name}</td>
                                    <td>{eq.brand || '-'}</td>
                                    <td>{getCategoryText(eq.category)}</td>
                                    <td>
                                        <span style={{
                                            color: getConditionColor(eq.condition),
                                            fontWeight: 'bold',
                                            padding: '2px 8px',
                                            borderRadius: 6,
                                            background: getConditionColor(eq.condition) + '22',
                                            fontSize: 12,
                                        }}>
                                            {getConditionText(eq.condition)}
                                        </span>
                                    </td>
                                    <td>{eq.location || '-'}</td>
                                    <td>{eq.purchaseDate ? new Date(eq.purchaseDate).toLocaleDateString() : '-'}</td>
                                    <td>
                                        {eq.nextMaintenance ? (
                                            <span style={{
                                                color: isMaintenanceDue(eq) ? '#f87171' : '#fbbf24',
                                                fontWeight: isMaintenanceDue(eq) ? 700 : 400,
                                            }}>
                                                {isMaintenanceDue(eq) ? '⚠️ ' : ''}
                                                {new Date(eq.nextMaintenance).toLocaleDateString()}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 5 }}>
                                            <button
                                                className="small"
                                                onClick={() => {
                                                    setSelectedEquipment(eq);
                                                    setShowMaintenanceForm(true);
                                                }}
                                                title={trans('recordMaintenance', 'تسجيل صيانة', 'Record Maintenance')}
                                                style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)' }}
                                            >
                                                🔧
                                            </button>
                                            <button
                                                className="small"
                                                style={{ background: 'var(--accent)' }}
                                                onClick={() => openEditForm(eq)}
                                                title={t.edit}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="small"
                                                style={{ background: 'darkred' }}
                                                onClick={() => handleDelete('equipment', eq._id)}
                                                title={t.delete}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center', padding: 30, opacity: 0.5 }}>
                                        🏋️ {trans('noEquipmentYet', 'لا توجد معدات مسجلة بعد', 'No equipment registered yet')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ── Maintenance Form Panel ── */}
            {showMaintenanceForm && selectedEquipment && (
                <section className="panel" style={{ border: '2px solid var(--accent)' }}>
                    {/* Header showing which equipment */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div>
                            <h3 style={{ margin: 0 }}>🔧 {trans('recordMaintenance', 'تسجيل صيانة', 'Record Maintenance')}</h3>
                            <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.6 }}>
                                {trans('equipmentLabel', 'المعدة: ', 'Equipment: ')}
                                <strong style={{ color: 'var(--accent)' }}>{selectedEquipment.name}</strong>
                                {selectedEquipment.brand ? ` — ${selectedEquipment.brand}` : ''}
                            </p>
                        </div>
                        <button
                            className="small"
                            style={{ background: 'rgba(255,255,255,0.06)' }}
                            onClick={() => { setShowMaintenanceForm(false); setSelectedEquipment(null); }}
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleMaintenanceSubmit} className="form-grid">
                        <select name="type" required>
                            <option value="">{trans('maintenanceTypeOption', '-- نوع الصيانة --', '-- Maintenance Type --')}</option>
                            <option value="routine">{trans('routine', 'دورية', 'Routine')}</option>
                            <option value="repair">{trans('repair', 'إصلاح', 'Repair')}</option>
                            <option value="inspection">{trans('inspection', 'فحص', 'Inspection')}</option>
                            <option value="replacement">{trans('replacement', 'استبدال', 'Replacement')}</option>
                        </select>

                        <input
                            name="performedBy"
                            placeholder={trans('performedBy', 'تم بواسطة *', 'Performed By *')}
                            required
                        />

                        <input
                            name="cost"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder={trans('cost', 'التكلفة', 'Cost')}
                        />

                        <input
                            name="nextScheduled"
                            type="date"
                            placeholder={trans('nextScheduled', 'الصيانة القادمة', 'Next Scheduled')}
                        />

                        <textarea
                            name="description"
                            placeholder={trans('maintenanceDescription', 'وصف أعمال الصيانة *', 'Maintenance description *')}
                            rows="2"
                            required
                            style={{ gridColumn: '1 / -1' }}
                        />

                        <textarea
                            name="notes"
                            placeholder={trans('additionalNotes', 'ملاحظات إضافية', 'Additional Notes')}
                            rows="2"
                            style={{ gridColumn: '1 / -1' }}
                        />

                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
                            <button type="submit" disabled={submitting} style={{ flex: 1 }}>
                                {submitting ? trans('saving', 'جاري الحفظ...', 'Saving...') : t.save}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowMaintenanceForm(false); setSelectedEquipment(null); }}
                                style={{ flex: 1, background: 'rgba(255,255,255,0.06)' }}
                            >
                                {t.cancel}
                            </button>
                        </div>
                    </form>
                </section>
            )}
        </div>
    );
}
