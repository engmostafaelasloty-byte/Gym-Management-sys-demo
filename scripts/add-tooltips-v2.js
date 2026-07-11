const fs = require('fs');
const path = require('path');

function addTitles(fileName, replacements) {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', fileName);
    let content = fs.readFileSync(filePath, 'utf8');
    let count = 0;

    // Also remove unused Tooltip imports if present
    content = content.replace(/import \{[^}]*\} from '\.\.\/Tooltip';\n?/g, () => { count++; return ''; });

    for (const [searchStr, titleAttr] of replacements) {
        // Skip if already has title
        if (content.includes(searchStr) && !content.includes(searchStr.replace('/>', ` ${titleAttr} />`)) && !content.includes(titleAttr)) {
            // For self-closing tags
            if (searchStr.includes('/>')) {
                content = content.replace(searchStr, searchStr.replace('/>', ` ${titleAttr} />`));
                count++;
            }
            // For opening tags with >
            else if (searchStr.includes(' required>') || searchStr.endsWith('>')) {
                content = content.replace(searchStr, searchStr.replace('>', ` ${titleAttr}>`));
                count++;
            }
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`${fileName}: ${count} tooltips added`);
}

// ===================== Expenses.js =====================
addTitles('Expenses.js', [
    [`name="name" placeholder={lang === 'ar' ? 'اسم المصروف' : 'Expense Name'} required`, `title={lang === 'ar' ? 'اسم المصروف: إيجار، كهرباء، رواتب...' : 'Expense: Rent, Electricity, Salaries...'}`],
    [`name="amount" type="number" step="0.01" placeholder={t.amount} required`, `title={lang === 'ar' ? 'المبلغ المصروف بالعملة المحلية' : 'Amount spent in local currency'}`],
    [`name="note" placeholder={t.note}`, `title={lang === 'ar' ? 'ملاحظة اختيارية عن هذا المصروف' : 'Optional note about this expense'}`],
    [`name="date" type="date"`, `title={lang === 'ar' ? 'تاريخ المصروف' : 'Expense date'}`],
    [`name="category" defaultValue="other"`, `title={lang === 'ar' ? 'تصنيف المصروف (إيجار، كهرباء...)' : 'Category (rent, electricity...)'}`],
    [`name="period" defaultValue="general"`, `title={lang === 'ar' ? 'الفترة: رجال، سيدات، ميكس، أو عام' : 'Period: Men, Women, Mix, or General'}`],
    [`placeholder={lang === 'ar' ? '🔍 بحث في المصروفات...' : '🔍 Search expenses...'}`, `title={lang === 'ar' ? 'ابحث باسم المصروف أو الملاحظة' : 'Search by expense name or note'}`],
]);

// ===================== Classes.js =====================
addTitles('Classes.js', [
    [`placeholder={lang === 'ar' ? 'اسم الحصة' : 'Class Name'}`, `title={lang === 'ar' ? 'اسم الحصة: يوجا، زومبا، كروس فت...' : 'Class: Yoga, Zumba, CrossFit...'}`],
    [`placeholder={lang === 'ar' ? 'المدرب' : 'Trainer'}`, `title={lang === 'ar' ? 'اسم المدرب المسؤول عن الحصة' : 'Trainer responsible for this class'}`],
    [`placeholder={lang === 'ar' ? 'السعة' : 'Capacity'}`, `title={lang === 'ar' ? 'الحد الأقصى لعدد المشتركين' : 'Max participants allowed'}`],
]);

// ===================== Staff.js =====================
addTitles('Staff.js', [
    [`placeholder={lang === 'ar' ? 'الاسم' : 'Name'}`, `title={lang === 'ar' ? 'الاسم الكامل للموظف' : 'Employee full name'}`],
    [`placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}`, `title={lang === 'ar' ? 'البريد الذي سيستخدمه لتسجيل الدخول' : 'Email used for login'}`],
    [`placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}`, `title={lang === 'ar' ? 'كلمة المرور (6 أحرف على الأقل)' : 'Password (min 6 characters)'}`],
    [`placeholder={lang === 'ar' ? 'الهاتف' : 'Phone'}`, `title={lang === 'ar' ? 'رقم هاتف الموظف' : 'Employee phone number'}`],
]);

// ===================== Goods.js =====================
addTitles('Goods.js', [
    [`placeholder={lang === 'ar' ? 'سعر التكلفة' : 'Cost Price'}`, `title={lang === 'ar' ? 'سعر شراء المنتج' : 'Product purchase/cost price'}`],
    [`placeholder={lang === 'ar' ? 'الكمية' : 'Quantity'}`, `title={lang === 'ar' ? 'عدد القطع في المخزون' : 'Stock quantity'}`],
    [`placeholder={lang === 'ar' ? 'الباركود' : 'Barcode'}`, `title={lang === 'ar' ? 'كود الباركود على المنتج' : 'Product barcode number'}`],
    [`placeholder={lang === 'ar' ? 'سعر البيع' : 'Selling Price'}`, `title={lang === 'ar' ? 'السعر الذي يباع به للعميل' : 'Selling price to customer'}`],
]);

// ===================== Payments.js =====================
addTitles('Payments.js', [
    [`placeholder={lang === 'ar' ? 'بحث بالاسم...' : 'Search by name...'}`, `title={lang === 'ar' ? 'ابحث في المدفوعات بالاسم' : 'Search payments by name'}`],
]);

// ===================== Attendance.js =====================
addTitles('Attendance.js', [
    [`placeholder={lang === 'ar' ? 'بحث بالاسم...' : 'Search by name...'}`, `title={lang === 'ar' ? 'فلتر الحضور بالاسم' : 'Filter attendance by name'}`],
]);

// ===================== Settings.js =====================
addTitles('Settings.js', [
    [`placeholder={lang === 'ar' ? 'اسم النادي' : 'Gym Name'}`, `title={lang === 'ar' ? 'اسم النادي الذي يظهر في الوصولات والتقارير' : 'Gym name shown on receipts and reports'}`],
]);

// ===================== StockDashboard.js =====================
addTitles('StockDashboard.js', [
    [`placeholder={lang === 'ar' ? 'امسح الباركود...' : 'Scan barcode...'}`, `title={lang === 'ar' ? 'امسح أو اكتب باركود المنتج لبيعه' : 'Scan or type barcode to sell'}`],
]);

// ===================== Measurements.js =====================
addTitles('Measurements.js', [
    [`placeholder={lang === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}`, `title={lang === 'ar' ? 'وزن المشترك بالكيلوجرام' : 'Weight in kilograms'}`],
    [`placeholder={lang === 'ar' ? 'نسبة الدهون %' : 'Body Fat %'}`, `title={lang === 'ar' ? 'نسبة الدهون من جهاز InBody' : 'Body fat % from InBody'}`],
    [`placeholder={lang === 'ar' ? 'كتلة العضلات' : 'Muscle Mass'}`, `title={lang === 'ar' ? 'كتلة العضلات بالكيلوجرام' : 'Muscle mass in kg'}`],
]);

// ===================== Equipment.js =====================
addTitles('Equipment.js', [
    [`placeholder={lang === 'ar' ? 'اسم المعدة' : 'Equipment Name'}`, `title={lang === 'ar' ? 'اسم الجهاز: تريدميل، دمبل...' : 'Equipment: Treadmill, Dumbbell...'}`],
    [`placeholder={lang === 'ar' ? 'الموقع' : 'Location'}`, `title={lang === 'ar' ? 'مكان المعدة (الطابق/القاعة)' : 'Location in gym (floor/hall)'}`],
]);

// ===================== page.js (login) =====================
{
    const filePath = path.join(__dirname, '..', 'app', 'page.js');
    let content = fs.readFileSync(filePath, 'utf8');
    let count = 0;

    const reps = [
        [`placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}`, `title={lang === 'ar' ? 'أدخل البريد الإلكتروني المسجّل' : 'Enter your registered email'}`],
        [`placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}`, `title={lang === 'ar' ? 'أدخل كلمة مرور حسابك' : 'Enter your account password'}`],
    ];

    for (const [searchStr, titleAttr] of reps) {
        if (content.includes(searchStr) && !content.includes(titleAttr)) {
            // Add title after placeholder
            content = content.replace(searchStr, searchStr + '\n                                ' + titleAttr);
            count++;
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`page.js: ${count} tooltips added`);
}

console.log('\n✅ All tooltips complete!');
