'use client';
import React, { useState } from 'react';

const GOAL_LABELS = {
    weight_loss: { ar: 'خسارة وزن / تنشيف', en: 'Weight Loss / Cutting' },
    muscle_gain: { ar: 'زيادة كتلة عضلية / تضخيم', en: 'Muscle Gain / Bulking' },
    fitness: { ar: 'لياقة بدنية وتحمل', en: 'Fitness & Endurance' },
    health: { ar: 'صحة عامة ومرونة', en: 'General Health & Flexibility' },
    other: { ar: 'أخرى', en: 'Other' }
};

const getDynamicGoal = (weight, height, bodyFat, gender, lang) => {
    if (!weight || !height) {
        return {
            text: lang === 'ar' ? 'لياقة بدنية (افتراضي - أدخل الوزن والطول)' : 'Fitness (Default - Enter Weight & Height)',
            key: 'fitness'
        };
    }
    const isAr = lang === 'ar';
    const bmi = weight / ((height / 100) ** 2);
    
    // 1. Bulking/Weight Gain: weight < height - 110 OR BMI < 18.5
    if (weight < (height - 110) || bmi < 18.5) {
        return {
            text: isAr ? 'زيادة الوزن والضخامة العضلية (تضخيم)' : 'Weight Gain & Muscle Bulking (Bulking)',
            key: 'muscle_gain'
        };
    }
    
    // 2. Cutting/Fat Loss: weight > height - 95 OR BMI >= 27
    if (weight > (height - 95) || bmi >= 27) {
        return {
            text: isAr ? 'تنشيف الدهون وفقدان الوزن مع الحفاظ على العضلات' : 'Fat Loss & Muscle Preservation (Cutting)',
            key: 'weight_loss'
        };
    }
    
    // 3. Recomposition: if body fat is high in normal weight
    if (bodyFat) {
        const fatVal = parseFloat(bodyFat);
        const isHighFat = gender === 'female' ? fatVal > 28 : fatVal > 20;
        if (isHighFat) {
            return {
                text: isAr ? 'إعادة تركيب الجسم (خسارة دهون وبناء عضلات معاً)' : 'Body Recomposition (Lose Fat & Gain Muscle)',
                key: 'weight_loss'
            };
        }
    }
    
    // 4. Default: normal fit
    return {
        text: isAr ? 'تحسين اللياقة البدنية والتحمل والبناء العضلي المتوازن' : 'Fitness, Endurance & Lean Muscle Building',
        key: 'fitness'
    };
};

const getBodyFatCategory = (fat, gender, lang) => {
    if (!fat) return '-';
    const val = parseFloat(fat);
    const isAr = lang === 'ar';
    if (gender === 'female') {
        if (val < 14) return isAr ? 'منخفض جداً (أساسي)' : 'Essential Fat';
        if (val < 21) return isAr ? 'رياضي مميز' : 'Athletic';
        if (val < 25) return isAr ? 'لياقة عالية' : 'Fit/Normal';
        if (val < 32) return isAr ? 'مقبول/متوسط' : 'Average';
        return isAr ? 'مرتفع (سمنة)' : 'Obese';
    } else {
        // Male
        if (val < 6) return isAr ? 'منخفض جداً (أساسي)' : 'Essential Fat';
        if (val < 14) return isAr ? 'رياضي مميز' : 'Athletic';
        if (val < 18) return isAr ? 'لياقة عالية' : 'Fit/Normal';
        if (val < 25) return isAr ? 'مقبول/متوسط' : 'Average';
        return isAr ? 'مرتفع (سمنة)' : 'Obese';
    }
};

const getDetailedTips = (gender, goal, bmiVal, fatVal, lang) => {
    const isAr = lang === 'ar';
    let tips = [];

    // General BMR / Calories direction
    if (goal === 'weight_loss') {
        tips.push(isAr 
            ? `تطبيق عجز سعرات حرارية بمقدار ${gender === 'female' ? '300-500' : '500-700'} سعرة حرارية من معدل الحرق اليومي.`
            : `Apply a caloric deficit of ${gender === 'female' ? '300-500' : '500-700'} kcal from total daily expenditure.`);
    } else if (goal === 'muscle_gain') {
        tips.push(isAr
            ? `تطبيق فائض سعرات حرارية بمقدار ${gender === 'female' ? '150-250' : '300-500'} سعرة حرارية لدعم البناء العضلي وتجنب تخزين الدهون بشكل مفرط.`
            : `Apply a caloric surplus of ${gender === 'female' ? '150-250' : '300-500'} kcal to support muscle growth while avoiding excess fat.`);
    } else {
        tips.push(isAr
            ? 'توازن في السعرات الحرارية المستهلكة (سعرات المحافظة) لضمان ثبات الوزن وتحسين التركيبة العضلية.'
            : 'Maintain caloric balance (maintenance calories) to optimize body composition.');
    }

    // Training direction based on Goal
    if (goal === 'weight_loss') {
        if (gender === 'female') {
            tips.push(isAr
                ? 'تمارين المقاومة لجميع عضلات الجسم (Full Body) 3 مرات أسبوعياً للحفاظ على العضلات، يليها 20-30 دقيقة كارديو منخفض الشدة (LISS) لحماية المفاصل.'
                : 'Full body resistance training 3 times a week, followed by 20-30 mins of low-intensity cardio (LISS) to protect joints.');
        } else {
            tips.push(isAr
                ? 'تمارين مقاومة مكثفة (4-5 أيام) مع التركيز على التمارين المركبة (السكوات، الرفعة المميتة) للحفاظ على التستوستيرون، ودمج HIIT مرتين أسبوعياً.'
                : 'Intense strength training (4-5 days) focusing on compound movements, combined with HIIT cardio twice a week.');
        }
    } else if (goal === 'muscle_gain') {
        if (gender === 'female') {
            tips.push(isAr
                ? 'التركيز على زيادة الأحمال التدريجية (Progressive Overload) مع أوزان تتيح أداء 8-12 تكرار بجودة عالية. الاهتمام الشديد بتمارين الجزء السفلي والقوة الأساسية.'
                : 'Focus on progressive overload with weights allowing 8-12 clean reps. Put emphasis on lower body and core strength.');
        } else {
            tips.push(isAr
                ? 'تدريب بـ شدة عالية (RPE 8-9) مع تكرارات من 6-12 في تمارين الضخامة. فترات راحة من 90-120 ثانية بين المجموعات لزيادة تدفق الدم واستشفاء الألياف.'
                : 'High-intensity training (RPE 8-9) with 6-12 rep ranges. Rest 90-120 seconds between sets to optimize hypertrophy and recovery.');
        }
    } else if (goal === 'fitness') {
        tips.push(isAr
            ? 'دمج تدريبات وظيفية (Functional Training) والـ Circuits لرفع كفاءة الجهاز التنفسي والتحمل العضلي والمرونة.'
            : 'Integrate functional training and circuit training to boost cardiovascular capacity, muscular endurance, and agility.');
    } else {
        tips.push(isAr
            ? 'التركيز على تحسين التوازن العضلي، مرونة المفاصل والمدى الحركي الكامل لتقليل فرص الإصابات وتقوية الظهر والرقبة.'
            : 'Focus on muscular balance, joint mobility, and full range of motion to prevent injury and strengthen core/back.');
    }

    // Nutrition & protein direction
    if (gender === 'female') {
        tips.push(isAr
            ? `استهلاك بروتين يومي بمعدل 1.5 - 1.8 جم لكل كيلوجرام من الوزن (المصدر: اللحوم البيضاء، الأسماك، البيض، البقوليات).`
            : `Consume 1.5 - 1.8g of protein per kg of bodyweight daily (poultry, fish, eggs, legumes).`);
    } else {
        tips.push(isAr
            ? `استهلاك بروتين يومي بمعدل 1.8 - 2.2 جم لكل كيلوجرام من الوزن لتعزيز القوة والاستشفاء العضلي.`
            : `Consume 1.8 - 2.2g of protein per kg of bodyweight daily to promote strength and hypertrophy.`);
    }

    // Body fat specific advice
    if (fatVal) {
        if (gender === 'female') {
            if (fatVal > 32) {
                tips.push(isAr
                    ? 'تقليل الكربوهيدرات البسيطة والسكريات، والتركيز على شرب ما لا يقل عن 3 لترات من الماء يومياً للمساعدة في زيادة معدلات الحرق.'
                    : 'Reduce simple carbs/sugars, and ensure at least 3 liters of water intake daily to support metabolism.');
            }
        } else {
            if (fatVal > 25) {
                tips.push(isAr
                    ? 'الحد من تناول الدهون المشبعة والوجبات السريعة، وزيادة الألياف (الخضروات الورقية) لتحسين الحرق وضبط نسب الأنسولين.'
                    : 'Limit saturated fats and fast foods; increase dietary fiber (leafy greens) to optimize insulin sensitivity.');
            }
        }
    }

    return tips;
};

export default function MeasurementsTab({
    lang, t, subscribers, addMeasurement, updateMeasurement, deleteMeasurement, getSubscriberMeasurements
}) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const [selectedSubscriber, setSelectedSubscriber] = useState('');
    const [measurements, setMeasurements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingMeasurement, setEditingMeasurement] = useState(null);

    const handleSubscriberChange = async (subscriberId) => {
        setSelectedSubscriber(subscriberId);
        setShowForm(false);
        setEditingMeasurement(null);
        if (subscriberId) {
            try {
                const data = await getSubscriberMeasurements(subscriberId);
                setMeasurements(data);
            } catch (err) {
                console.error(err);
            }
        } else {
            setMeasurements([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            subscriber: selectedSubscriber,
            weight: parseFloat(formData.get('weight')),
            height: parseFloat(formData.get('height')),
            bodyFat: parseFloat(formData.get('bodyFat')) || null,
            muscleMass: parseFloat(formData.get('muscleMass')) || null,
            chest: parseFloat(formData.get('chest')) || null,
            waist: parseFloat(formData.get('waist')) || null,
            hips: parseFloat(formData.get('hips')) || null,
            arms: parseFloat(formData.get('arms')) || null,
            thighs: parseFloat(formData.get('thighs')) || null,
            notes: formData.get('notes') || ''
        };

        try {
            if (editingMeasurement) {
                await updateMeasurement(editingMeasurement._id, data);
                alert(trans('updatedSuccessfully', 'تم التعديل بنجاح', 'Measurement updated successfully'));
            } else {
                await addMeasurement(data);
                alert(trans('measurementsAdded', 'تم إضافة القياسات بنجاح', 'Measurements added successfully'));
            }
            e.target.reset();
            setShowForm(false);
            setEditingMeasurement(null);
            // Reload measurements
            const updatedData = await getSubscriberMeasurements(selectedSubscriber);
            setMeasurements(updatedData);
        } catch (err) {
            console.error(err);
            alert(trans('errorOccurred', 'حدث خطأ', 'An error occurred'));
        }
    };

    const handleEdit = (m) => {
        setEditingMeasurement(m);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm(trans('confirmDeleteMeasurements', 'هل أنت متأكد من حذف هذه القياسات؟', 'Are you sure you want to delete these measurements?'))) return;
        try {
            await deleteMeasurement(id);
            const updatedData = await getSubscriberMeasurements(selectedSubscriber);
            setMeasurements(updatedData);
        } catch (err) {
            console.error(err);
            alert(trans('errorOccurred', 'حدث خطأ', 'An error occurred'));
        }
    };

    const calculateBMI = (weight, height) => {
        if (!weight || !height) return '-';
        const bmi = weight / ((height / 100) ** 2);
        return bmi.toFixed(1);
    };

    const getBMICategory = (bmi) => {
        if (bmi === '-') return '-';
        const value = parseFloat(bmi);
        if (value < 18.5) return trans('underweight', 'نحيف', 'Underweight');
        if (value < 25) return trans('normal', 'طبيعي', 'Normal');
        if (value < 30) return trans('overweight', 'زيادة وزن', 'Overweight');
        return trans('obese', 'سمنة', 'Obese');
    };

    return (
        <section className="panel">
            <h2>{trans('bodyMeasurementsProgress', '📊 قياسات الجسم والتقدم', '📊 Body Measurements & Progress')}</h2>

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

            {selectedSubscriber && (
                <>
                    <button
                        onClick={() => {
                            if (showForm) {
                                setShowForm(false);
                                setEditingMeasurement(null);
                            } else {
                                setShowForm(true);
                            }
                        }}
                        style={{ marginBottom: 20 }}
                    >
                        {showForm
                            ? trans('cancel', '❌ إلغاء', '❌ Cancel')
                            : trans('addNewMeasurements', '➕ إضافة قياسات جديدة', '➕ Add New Measurements')
                        }
                    </button>

                    {showForm && (
                        <form key={editingMeasurement ? editingMeasurement._id : 'new'} onSubmit={handleSubmit} className="form-grid" style={{ marginBottom: 30 }}>
                            <input
                                name="weight"
                                type="number"
                                step="0.1"
                                placeholder={trans('weightKg', 'الوزن (كجم)', 'Weight (kg)')} title={trans('weightTooltip', 'وزن المشترك بالكيلوجرام', 'Member weight in kilograms')}
                                defaultValue={editingMeasurement?.weight || ''}
                                required
                            />
                            <input
                                name="height"
                                type="number"
                                step="0.1"
                                placeholder={trans('heightCm', 'الطول (سم)', 'Height (cm)')}
                                defaultValue={editingMeasurement?.height || ''}
                                required
                            />
                            <input
                                name="bodyFat"
                                type="number"
                                step="0.1"
                                placeholder={trans('bodyFatPercent', 'نسبة الدهون %', 'Body Fat %')} title={trans('bodyFatTooltip', 'نسبة الدهون من جهاز InBody', 'Body fat percentage from InBody')}
                                defaultValue={editingMeasurement?.bodyFat || ''}
                            />
                            <input
                                name="muscleMass"
                                type="number"
                                step="0.1"
                                placeholder={trans('muscleMassKg', 'كتلة العضلات (كجم)', 'Muscle Mass (kg)')} title={trans('muscleMassTooltip', 'كتلة العضلات بالكيلوجرام', 'Muscle mass in kg')}
                                defaultValue={editingMeasurement?.muscleMass || ''}
                            />
                            <input
                                name="chest"
                                type="number"
                                step="0.1"
                                placeholder={trans('chestCm', 'محيط الصدر (سم)', 'Chest (cm)')}
                                defaultValue={editingMeasurement?.chest || ''}
                            />
                            <input
                                name="waist"
                                type="number"
                                step="0.1"
                                placeholder={trans('waistCm', 'محيط الخصر (سم)', 'Waist (cm)')}
                                defaultValue={editingMeasurement?.waist || ''}
                            />
                            <input
                                name="hips"
                                type="number"
                                step="0.1"
                                placeholder={trans('hipsCm', 'محيط الأرداف (سم)', 'Hips (cm)')}
                                defaultValue={editingMeasurement?.hips || ''}
                            />
                            <input
                                name="arms"
                                type="number"
                                step="0.1"
                                placeholder={trans('armsCm', 'محيط الذراع (سم)', 'Arms (cm)')}
                                defaultValue={editingMeasurement?.arms || ''}
                            />
                            <input
                                name="thighs"
                                type="number"
                                step="0.1"
                                placeholder={trans('thighsCm', 'محيط الفخذ (سم)', 'Thighs (cm)')}
                                defaultValue={editingMeasurement?.thighs || ''}
                            />
                            <textarea
                                name="notes"
                                placeholder={trans('notes', 'ملاحظات', 'Notes')}
                                rows="2"
                                defaultValue={editingMeasurement?.notes || ''}
                            />
                            <button type="submit" style={{ gridColumn: '1 / -1' }}>
                                {editingMeasurement ? trans('updateMeasurements', 'تعديل القياسات', 'Update Measurements') : t.save}
                            </button>
                        </form>
                    )}

                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>{trans('date', 'التاريخ', 'Date')}</th>
                                    <th>{trans('weight', 'الوزن', 'Weight')}</th>
                                    <th>{trans('height', 'الطول', 'Height')}</th>
                                    <th>BMI</th>
                                    <th>{trans('category', 'التصنيف', 'Category')}</th>
                                    <th>{trans('fatPercent', 'دهون %', 'Fat %')}</th>
                                    <th>{trans('muscle', 'عضلات', 'Muscle')}</th>
                                    <th>{trans('chest', 'صدر', 'Chest')}</th>
                                    <th>{trans('waist', 'خصر', 'Waist')}</th>
                                    <th>{trans('notes', 'ملاحظات', 'Notes')}</th>
                                    <th>{trans('actions', 'إجراءات', 'Actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {measurements.length > 0 ? measurements.map((m, idx) => {
                                    const bmi = calculateBMI(m.weight, m.height);
                                    return (
                                        <tr key={m._id}>
                                            <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                                            <td>{m.weight} kg</td>
                                            <td>{m.height} cm</td>
                                            <td>{bmi}</td>
                                            <td>{getBMICategory(bmi)}</td>
                                            <td>{m.bodyFat ? `${m.bodyFat}%` : '-'}</td>
                                            <td>{m.muscleMass ? `${m.muscleMass} kg` : '-'}</td>
                                            <td>{m.chest ? `${m.chest} cm` : '-'}</td>
                                            <td>{m.waist ? `${m.waist} cm` : '-'}</td>
                                            <td>{m.notes || '-'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 5 }}>
                                                    <button onClick={() => handleEdit(m)} className="btn-edit" title={trans('edit', 'تعديل', 'Edit')}>
                                                        ✏️
                                                    </button>
                                                    <button onClick={() => handleDelete(m._id)} className="btn-delete" title={trans('delete', 'حذف', 'Delete')}>
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="11" style={{ textAlign: 'center', padding: 20 }}>
                                            {trans('noMeasurementsRecorded', 'لا توجد قياسات مسجلة', 'No measurements recorded')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {measurements.length > 0 && (
                        <div style={{ marginTop: 30, padding: 25, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{trans('progressSummaryVitalData', '📈 ملخص التقدم والبيانات الحيوية', '📈 Progress Summary & Vital Data')}</h3>
                                    {(() => {
                                        const sub = subscribers.find(s => s._id === selectedSubscriber);
                                        if (!sub) return null;
                                        const latest = measurements[0];
                                        const dynamicGoal = getDynamicGoal(latest?.weight, latest?.height, latest?.bodyFat, sub.gender, lang);
                                        return (
                                            <>
                                                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                                                    {trans('traineeProgressInfo', 
                                                        `المتدرب: ${sub.name} | الجنس: ${sub.gender === 'female' ? 'أنثى' : 'ذكر'} | الهدف المسجل: ${GOAL_LABELS[sub.goal || 'fitness']?.ar || sub.goal || 'عام'}`, 
                                                        `Trainee: ${sub.name} | Gender: ${sub.gender} | Registered Goal: ${GOAL_LABELS[sub.goal || 'fitness']?.en || sub.goal || 'General'}`)}
                                                </div>
                                                <div style={{ fontSize: 13, color: '#0ee6b7', fontWeight: 'bold', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    🎯 {trans('suggestedGoalLabel', 'الهدف المحلل ديناميكياً:', 'Dynamic Analyzed Goal:')} <span style={{ textDecoration: 'underline' }}>{dynamicGoal.text}</span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                <div className="badge">
                                    {trans('lastUpdated', 'آخر تحديث: ', 'Last updated: ')}
                                    {new Date(measurements[0].createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15 }}>
                                {(() => {
                                    const latest = measurements[0];
                                    const oldest = measurements[measurements.length - 1];
                                    const sub = subscribers.find(s => s._id === selectedSubscriber);
                                    const gender = sub?.gender || 'male';

                                    const weightChange = latest.weight - oldest.weight;
                                    const muscleChange = latest.muscleMass && oldest.muscleMass ? latest.muscleMass - oldest.muscleMass : null;
                                    const bodyFatCategory = getBodyFatCategory(latest.bodyFat, gender, lang);

                                    // Calculate BMR (Mifflin-St Jeor Equation)
                                    const getAge = (dob) => {
                                        if (!dob) return 25;
                                        const diff = Date.now() - new Date(dob).getTime();
                                        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
                                    };
                                    const age = getAge(sub?.dateOfBirth);
                                    let bmr = (10 * latest.weight) + (6.25 * latest.height) - (5 * age);
                                    bmr = gender === 'female' ? bmr - 161 : bmr + 5;

                                    return (
                                        <>
                                            {/* BMI Stats */}
                                            <div style={{ padding: 15, background: 'rgba(0,0,0,0.2)', borderRadius: 8, borderLeft: '4px solid #60a5fa' }}>
                                                <div style={{ fontSize: 12, opacity: 0.7 }}>BMI ({trans('current', 'الحالي', 'Current')})</div>
                                                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{calculateBMI(latest.weight, latest.height)}</div>
                                                <div style={{ fontSize: 12, color: '#60a5fa', fontWeight: 600 }}>{getBMICategory(calculateBMI(latest.weight, latest.height))}</div>
                                            </div>

                                            {/* Weight Change */}
                                            <div style={{ padding: 15, background: 'rgba(0,0,0,0.2)', borderRadius: 8, borderLeft: `4px solid ${weightChange <= 0 ? '#4ade80' : '#f87171'}` }}>
                                                <div style={{ fontSize: 12, opacity: 0.7 }}>{trans('totalWeightChange', 'تغير الوزن الكلي', 'Total Weight Change')}</div>
                                                <div style={{ fontSize: 24, fontWeight: 'bold', color: weightChange <= 0 ? '#4ade80' : '#f87171' }}>
                                                    {weightChange > 0 ? '↑ +' : '↓ '}{weightChange.toFixed(1)} kg
                                                </div>
                                                <div style={{ fontSize: 11, opacity: 0.5 }}>{trans('sinceStarting', 'منذ البداية', 'Since starting')}</div>
                                            </div>
 
                                            {/* BMR Estimation */}
                                            <div style={{ padding: 15, background: 'rgba(0,0,0,0.2)', borderRadius: 8, borderLeft: '4px solid #fbbf24' }}>
                                                <div style={{ fontSize: 12, opacity: 0.7 }}>BMR ({trans('basalMetabolism', 'معدل الحرق الأساسي', 'Basal Metabolism')})</div>
                                                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fbbf24' }}>{~~bmr} <span style={{ fontSize: 14 }}>kcal</span></div>
                                                <div style={{ fontSize: 11, opacity: 0.5 }}>{trans('caloriesToStayAlive', 'السعرات المطلوبة للبقاء', 'Calories to stay alive')}</div>
                                            </div>

                                            {/* Fat Status */}
                                            <div style={{ padding: 15, background: 'rgba(0,0,0,0.2)', borderRadius: 8, borderLeft: '4px solid #a78bfa' }}>
                                                <div style={{ fontSize: 12, opacity: 0.7 }}>{trans('bodyFatStatus', 'حالة نسبة الدهون', 'Body Fat Status')}</div>
                                                <div style={{ fontSize: 24, fontWeight: 'bold', color: latest.bodyFat ? '#a78bfa' : 'inherit' }}>
                                                    {latest.bodyFat ? `${latest.bodyFat}%` : '-'}
                                                </div>
                                                <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600 }}>{bodyFatCategory}</div>
                                            </div>
 
                                            {/* Muscle Status */}
                                            <div style={{ padding: 15, background: 'rgba(0,0,0,0.2)', borderRadius: 8, borderLeft: '4px solid #34d399' }}>
                                                <div style={{ fontSize: 12, opacity: 0.7 }}>{trans('muscleMass', 'كتلة العضلات', 'Muscle Mass')}</div>
                                                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#34d399' }}>
                                                    {latest.muscleMass ? `${latest.muscleMass} kg` : '-'}
                                                </div>
                                                <div style={{ fontSize: 11, opacity: 0.5 }}>
                                                    {muscleChange !== null ? `${trans('change', 'تغير:', 'Change:')} ${muscleChange >= 0 ? '+' : ''}${muscleChange.toFixed(1)} kg` : '-'}
                                                </div>
                                            </div>


                                        </>
                                    );
                                })()}
                            </div>

                            {/* Differentiated Trainer Tips and Reference Table */}
                            {(() => {
                                const latest = measurements[0];
                                const sub = subscribers.find(s => s._id === selectedSubscriber);
                                if (!sub) return null;
                                const gender = sub.gender || 'male';
                                const dynamicGoal = getDynamicGoal(latest.weight, latest.height, latest.bodyFat, gender, lang);
                                const bmiVal = parseFloat(calculateBMI(latest.weight, latest.height));
                                const fatVal = latest.bodyFat;

                                const tips = getDetailedTips(gender, dynamicGoal.key, bmiVal, fatVal, lang);

                                return (
                                    <div style={{ marginTop: 25, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                                        {/* Guide ranges based on gender */}
                                        <div style={{ padding: 15, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', fontSize: 12 }}>
                                            <h4 style={{ margin: '0 0 10px 0', color: '#60a5fa' }}>
                                                📊 {trans('idealFatRanges', `النسب النموذجية للدهون (${gender === 'female' ? 'نساء' : 'رجال'}):`, `Ideal Fat Ranges (${gender === 'female' ? 'Women' : 'Men'}):`)}
                                            </h4>
                                            <ul style={{ paddingLeft: 20, margin: 0, lineHeight: '1.6', opacity: 0.8 }}>
                                                {gender === 'female' ? (
                                                    <>
                                                        <li>{trans('essentialFat', 'الحد الأدنى الحيوي: 10% - 13%', 'Essential: 10% - 13%')}</li>
                                                        <li>{trans('athletesFat', 'الرياضيات: 14% - 20%', 'Athletes: 14% - 20%')}</li>
                                                        <li>{trans('fitnessFat', 'اللياقة البدنية: 21% - 24%', 'Fitness: 21% - 24%')}</li>
                                                        <li>{trans('acceptableFat', 'المدى المتوسط المقبول: 25% - 31%', 'Acceptable: 25% - 31%')}</li>
                                                        <li>{trans('obeseFat', 'السمنة: أعلى من 32%', 'Obese: 32%+')}</li>
                                                    </>
                                                ) : (
                                                    <>
                                                        <li>{trans('essentialFatMale', 'الحد الأدنى الحيوي: 2% - 5%', 'Essential: 2% - 5%')}</li>
                                                        <li>{trans('athletesFatMale', 'الرياضيون: 6% - 13%', 'Athletes: 6% - 13%')}</li>
                                                        <li>{trans('fitnessFatMale', 'اللياقة البدنية: 14% - 17%', 'Fitness: 14% - 17%')}</li>
                                                        <li>{trans('acceptableFatMale', 'المدى المتوسط المقبول: 18% - 24%', 'Acceptable: 18% - 24%')}</li>
                                                        <li>{trans('obeseFatMale', 'السمنة: أعلى من 25%', 'Obese: 25%+')}</li>
                                                    </>
                                                )}
                                            </ul>
                                        </div>

                                        {/* Detailed coach guidelines */}
                                        <div style={{ padding: 15, background: 'rgba(11, 107, 138, 0.05)', borderRadius: 10, border: '1px solid rgba(11, 107, 138, 0.15)', fontSize: 13 }}>
                                            <h4 style={{ margin: '0 0 10px 0', color: '#1496b0' }}>
                                                💡 {trans('trainerGuidanceDynamic', `توجيهات للمدرب بناءً على الهدف المقترح (${dynamicGoal.text}):`, `Trainer Guidance based on Suggested Goal (${dynamicGoal.text}):`)}
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                {tips.map((tip, idx) => (
                                                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                                        <span style={{ color: '#1496b0' }}>📌</span>
                                                        <span style={{ opacity: 0.9 }}>{tip}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
