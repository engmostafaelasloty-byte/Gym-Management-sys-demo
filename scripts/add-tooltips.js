const fs = require('fs');
const path = require('path');

// ==========================================
// Helper: wrap an input/select with tooltip
// ==========================================
function wrapWithTooltip(html, inputPattern, tipAr, tipEn) {
    const regex = new RegExp(`(\\s*)(${inputPattern})`, 'g');
    return html.replace(regex, (match, indent, input) => {
        return `${indent}<div className="tooltip-field" data-tooltip={lang === 'ar' ? '${tipAr}' : '${tipEn}'}>\n${indent}    ${input}\n${indent}</div>`;
    });
}

// ==========================================
// Subscribers.js — Form fields tooltips
// ==========================================
function updateSubscribers() {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', 'Subscribers.js');
    let content = fs.readFileSync(filePath, 'utf8');

    const replacements = [
        {
            old: '<input name="name" placeholder={t.name} required />',
            new: `<div className="tooltip-field" data-tooltip={lang === 'ar' ? 'اكتب الاسم الرباعي للمشترك' : 'Enter subscriber full name'}><input name="name" placeholder={t.name} required /></div>`
        },
        {
            old: '<input name="email" type="email" placeholder={t.email} />',
            new: `<div className="tooltip-field" data-tooltip={lang === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email address (optional)'}><input name="email" type="email" placeholder={t.email} /></div>`
        },
        {
            old: '<input name="phone" placeholder={t.phone} />',
            new: `<div className="tooltip-field" data-tooltip={lang === 'ar' ? 'رقم هاتف المشترك' : 'Subscriber phone number'}><input name="phone" placeholder={t.phone} /></div>`
        },
        {
            old: '<input name="category" placeholder={t.category} />',
            new: `<div className="tooltip-field" data-tooltip={lang === 'ar' ? 'فئة العضوية: VIP, عادي, طالب...' : 'Category: VIP, Regular, Student...'}><input name="category" placeholder={t.category} /></div>`
        },
        {
            old: '<input name="price" type="number" placeholder={t.price} required />',
            new: `<div className="tooltip-field" data-tooltip={lang === 'ar' ? 'سعر الاشتراك بالعملة المحلية' : 'Subscription price in local currency'}><input name="price" type="number" placeholder={t.price} required /></div>`
        },
        {
            old: '<input name="count" type="number" defaultValue="1" placeholder={t.count} />',
            new: `<div className="tooltip-field" data-tooltip={lang === 'ar' ? 'عدد الأشخاص (للتسجيل الجماعي)' : 'Number of people (bulk registration)'}><input name="count" type="number" defaultValue="1" placeholder={t.count} /></div>`
        },
        {
            old: `<input name="sessions" type="number" placeholder={lang === 'ar' ? 'عدد الحصص' : 'Sessions Count'} />`,
            new: `<div className="tooltip-field" data-tooltip={lang === 'ar' ? 'عدد الحصص المسموحة (لخطة الحصص)' : 'Allowed sessions (session plan only)'}><input name="sessions" type="number" placeholder={lang === 'ar' ? 'عدد الحصص' : 'Sessions Count'} /></div>`
        },
        {
            old: '<input name="startDate" type="date" />',
            new: `<div className="tooltip-field" data-tooltip={lang === 'ar' ? 'تاريخ البدء (اتركه فارغ = اليوم)' : 'Start date (leave empty = today)'}><input name="startDate" type="date" /></div>`
        }
    ];

    let count = 0;
    for (const r of replacements) {
        if (content.includes(r.old)) {
            content = content.replace(r.old, r.new);
            count++;
        }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Subscribers.js: ${count} tooltips added`);
}

// ==========================================
// Goods.js
// ==========================================
function updateGoods() {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', 'Goods.js');
    let content = fs.readFileSync(filePath, 'utf8');

    const replacements = [
        { old: 'placeholder={t.name}', new: `placeholder={t.name} title={lang === 'ar' ? 'اسم المنتج أو الصنف' : 'Product or item name'}` },
        { old: `placeholder={lang === 'ar' ? 'سعر البيع' : 'Selling Price'}`, new: `placeholder={lang === 'ar' ? 'سعر البيع' : 'Selling Price'} title={lang === 'ar' ? 'السعر الذي يُباع به للعميل' : 'Price sold to customer'}` },
        { old: `placeholder={lang === 'ar' ? 'سعر التكلفة' : 'Cost Price'}`, new: `placeholder={lang === 'ar' ? 'سعر التكلفة' : 'Cost Price'} title={lang === 'ar' ? 'السعر اللي اشتريت بيه المنتج' : 'Your purchase/cost price'}` },
        { old: `placeholder={lang === 'ar' ? 'الكمية' : 'Quantity'}`, new: `placeholder={lang === 'ar' ? 'الكمية' : 'Quantity'} title={lang === 'ar' ? 'عدد القطع المتاحة في المخزون' : 'Available stock quantity'}` },
        { old: `placeholder={lang === 'ar' ? 'الباركود' : 'Barcode'}`, new: `placeholder={lang === 'ar' ? 'الباركود' : 'Barcode'} title={lang === 'ar' ? 'كود الباركود الموجود على المنتج' : 'Product barcode number'}` },
    ];

    let count = 0;
    for (const r of replacements) {
        if (content.includes(r.old) && !content.includes(r.new)) {
            content = content.replace(r.old, r.new);
            count++;
        }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Goods.js: ${count} tooltips added`);
}

// ==========================================
// Expenses.js
// ==========================================
function updateExpenses() {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', 'Expenses.js');
    let content = fs.readFileSync(filePath, 'utf8');

    const replacements = [
        { old: 'placeholder={t.name}', new: `placeholder={t.name} title={lang === 'ar' ? 'اسم المصروف: إيجار، كهرباء، رواتب...' : 'Expense name: Rent, Electricity, Salaries...'}` },
        { old: `placeholder={t.amount || 'Amount'}`, new: `placeholder={t.amount || 'Amount'} title={lang === 'ar' ? 'المبلغ المصروف بالعملة المحلية' : 'Amount spent in local currency'}` },
    ];

    let count = 0;
    for (const r of replacements) {
        if (content.includes(r.old) && !content.includes(r.new)) {
            content = content.replace(r.old, r.new);
            count++;
        }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Expenses.js: ${count} tooltips added`);
}

// ==========================================
// Classes.js
// ==========================================
function updateClasses() {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', 'Classes.js');
    let content = fs.readFileSync(filePath, 'utf8');

    const replacements = [
        { old: `placeholder={lang === 'ar' ? 'اسم الحصة' : 'Class Name'}`, new: `placeholder={lang === 'ar' ? 'اسم الحصة' : 'Class Name'} title={lang === 'ar' ? 'اسم الحصة: يوجا، زومبا، كروس فت...' : 'Class name: Yoga, Zumba, CrossFit...'}` },
        { old: `placeholder={lang === 'ar' ? 'المدرب' : 'Trainer'}`, new: `placeholder={lang === 'ar' ? 'المدرب' : 'Trainer'} title={lang === 'ar' ? 'اسم المدرب المسؤول عن الحصة' : 'Trainer responsible for this class'}` },
        { old: `placeholder={lang === 'ar' ? 'السعة' : 'Capacity'}`, new: `placeholder={lang === 'ar' ? 'السعة' : 'Capacity'} title={lang === 'ar' ? 'العدد الأقصى للمشتركين في الحصة' : 'Maximum number of participants'}` },
    ];

    let count = 0;
    for (const r of replacements) {
        if (content.includes(r.old) && !content.includes(r.new)) {
            content = content.replace(r.old, r.new);
            count++;
        }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Classes.js: ${count} tooltips added`);
}

// ==========================================
// Staff.js
// ==========================================
function updateStaff() {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', 'Staff.js');
    let content = fs.readFileSync(filePath, 'utf8');

    const replacements = [
        { old: `placeholder={lang === 'ar' ? 'الاسم' : 'Name'}`, new: `placeholder={lang === 'ar' ? 'الاسم' : 'Name'} title={lang === 'ar' ? 'الاسم الكامل للموظف' : 'Employee full name'}` },
        { old: `placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}`, new: `placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} title={lang === 'ar' ? 'البريد الذي سيستخدمه لتسجيل الدخول' : 'Email used for login'}` },
        { old: `placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}`, new: `placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'} title={lang === 'ar' ? 'كلمة المرور (6 أحرف على الأقل)' : 'Password (min 6 characters)'}` },
        { old: `placeholder={lang === 'ar' ? 'الهاتف' : 'Phone'}`, new: `placeholder={lang === 'ar' ? 'الهاتف' : 'Phone'} title={lang === 'ar' ? 'رقم هاتف الموظف' : 'Employee phone number'}` },
    ];

    let count = 0;
    for (const r of replacements) {
        if (content.includes(r.old) && !content.includes(r.new)) {
            content = content.replace(r.old, r.new);
            count++;
        }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Staff.js: ${count} tooltips added`);
}

// ==========================================
// Equipment.js
// ==========================================
function updateEquipment() {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', 'Equipment.js');
    let content = fs.readFileSync(filePath, 'utf8');

    const replacements = [
        { old: `placeholder={lang === 'ar' ? 'اسم المعدة' : 'Equipment Name'}`, new: `placeholder={lang === 'ar' ? 'اسم المعدة' : 'Equipment Name'} title={lang === 'ar' ? 'اسم الجهاز أو المعدة: تريدميل، دمبل...' : 'Equipment name: Treadmill, Dumbbell...'}` },
        { old: `placeholder={lang === 'ar' ? 'الموقع' : 'Location'}`, new: `placeholder={lang === 'ar' ? 'الموقع' : 'Location'} title={lang === 'ar' ? 'مكان المعدة في الجيم (الطابق/القاعة)' : 'Location in gym (floor/hall)'}` },
    ];

    let count = 0;
    for (const r of replacements) {
        if (content.includes(r.old) && !content.includes(r.new)) {
            content = content.replace(r.old, r.new);
            count++;
        }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Equipment.js: ${count} tooltips added`);
}

// ==========================================
// Payments.js
// ==========================================
function updatePayments() {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', 'Payments.js');
    let content = fs.readFileSync(filePath, 'utf8');

    // Search field
    const searchOld = `placeholder={lang === 'ar' ? 'بحث بالاسم...' : 'Search by name...'}`;
    const searchNew = `placeholder={lang === 'ar' ? 'بحث بالاسم...' : 'Search by name...'} title={lang === 'ar' ? 'ابحث عن مدفوعات بالاسم' : 'Search payments by name'}`;

    let count = 0;
    if (content.includes(searchOld) && !content.includes(searchNew)) {
        content = content.replace(searchOld, searchNew);
        count++;
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Payments.js: ${count} tooltips added`);
}

// ==========================================
// Attendance.js
// ==========================================
function updateAttendance() {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', 'Attendance.js');
    let content = fs.readFileSync(filePath, 'utf8');

    const searchOld = `placeholder={lang === 'ar' ? 'بحث بالاسم...' : 'Search by name...'}`;
    const searchNew = `placeholder={lang === 'ar' ? 'بحث بالاسم...' : 'Search by name...'} title={lang === 'ar' ? 'فلتر الحضور بالاسم' : 'Filter attendance by name'}`;

    let count = 0;
    if (content.includes(searchOld) && !content.includes(searchNew)) {
        content = content.replace(searchOld, searchNew);
        count++;
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Attendance.js: ${count} tooltips added`);
}

// ==========================================
// Login form in page.js
// ==========================================
function updateLoginForm() {
    const filePath = path.join(__dirname, '..', 'app', 'page.js');
    let content = fs.readFileSync(filePath, 'utf8');

    const replacements = [
        {
            old: `placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}`,
            new: `placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} title={lang === 'ar' ? 'أدخل البريد الإلكتروني المسجّل في النظام' : 'Enter your registered email address'}`
        },
        {
            old: `placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}`,
            new: `placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'} title={lang === 'ar' ? 'أدخل كلمة مرور حسابك' : 'Enter your account password'}`
        }
    ];

    let count = 0;
    for (const r of replacements) {
        if (content.includes(r.old) && !content.includes(r.new)) {
            content = content.replace(r.old, r.new);
            count++;
        }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`page.js (login): ${count} tooltips added`);
}

// ==========================================
// Settings.js
// ==========================================
function updateSettings() {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', 'Settings.js');
    let content = fs.readFileSync(filePath, 'utf8');

    const replacements = [
        { old: `placeholder={lang === 'ar' ? 'اسم النادي' : 'Gym Name'}`, new: `placeholder={lang === 'ar' ? 'اسم النادي' : 'Gym Name'} title={lang === 'ar' ? 'اسم الصالة الرياضية (يظهر في الوصل والتقارير)' : 'Gym name (shown on receipts and reports)'}` },
    ];

    let count = 0;
    for (const r of replacements) {
        if (content.includes(r.old) && !content.includes(r.new)) {
            content = content.replace(r.old, r.new);
            count++;
        }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Settings.js: ${count} tooltips added`);
}

// ==========================================
// Measurements.js
// ==========================================
function updateMeasurements() {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', 'Measurements.js');
    let content = fs.readFileSync(filePath, 'utf8');

    const replacements = [
        { old: `placeholder={lang === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}`, new: `placeholder={lang === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'} title={lang === 'ar' ? 'وزن المشترك بالكيلوجرام' : 'Member weight in kilograms'}` },
        { old: `placeholder={lang === 'ar' ? 'نسبة الدهون %' : 'Body Fat %'}`, new: `placeholder={lang === 'ar' ? 'نسبة الدهون %' : 'Body Fat %'} title={lang === 'ar' ? 'نسبة الدهون من جهاز InBody' : 'Body fat percentage from InBody'}` },
        { old: `placeholder={lang === 'ar' ? 'كتلة العضلات' : 'Muscle Mass'}`, new: `placeholder={lang === 'ar' ? 'كتلة العضلات' : 'Muscle Mass'} title={lang === 'ar' ? 'كتلة العضلات بالكيلوجرام (InBody)' : 'Muscle mass in kg (InBody)'}` },
    ];

    let count = 0;
    for (const r of replacements) {
        if (content.includes(r.old) && !content.includes(r.new)) {
            content = content.replace(r.old, r.new);
            count++;
        }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Measurements.js: ${count} tooltips added`);
}

// ==========================================
// StockDashboard.js
// ==========================================
function updateStock() {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', 'StockDashboard.js');
    let content = fs.readFileSync(filePath, 'utf8');

    const old1 = `placeholder={lang === 'ar' ? 'امسح الباركود...' : 'Scan barcode...'}`;
    const new1 = `placeholder={lang === 'ar' ? 'امسح الباركود...' : 'Scan barcode...'} title={lang === 'ar' ? 'امسح أو اكتب باركود المنتج لبيعه' : 'Scan or type product barcode to sell'}`;

    let count = 0;
    if (content.includes(old1) && !content.includes(new1)) {
        content = content.replace(old1, new1);
        count++;
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`StockDashboard.js: ${count} tooltips added`);
}

// ==========================================
// Run all
// ==========================================
try { updateSubscribers(); } catch(e) { console.log('Subscribers error:', e.message); }
try { updateGoods(); } catch(e) { console.log('Goods error:', e.message); }
try { updateExpenses(); } catch(e) { console.log('Expenses error:', e.message); }
try { updateClasses(); } catch(e) { console.log('Classes error:', e.message); }
try { updateStaff(); } catch(e) { console.log('Staff error:', e.message); }
try { updateEquipment(); } catch(e) { console.log('Equipment error:', e.message); }
try { updatePayments(); } catch(e) { console.log('Payments error:', e.message); }
try { updateAttendance(); } catch(e) { console.log('Attendance error:', e.message); }
try { updateLoginForm(); } catch(e) { console.log('Login error:', e.message); }
try { updateSettings(); } catch(e) { console.log('Settings error:', e.message); }
try { updateMeasurements(); } catch(e) { console.log('Measurements error:', e.message); }
try { updateStock(); } catch(e) { console.log('Stock error:', e.message); }

console.log('\n✅ All tooltip updates complete!');
