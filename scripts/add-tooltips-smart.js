const fs = require('fs');
const path = require('path');

// Map of placeholder text → tooltip text
const TOOLTIP_MAP_AR = {
    'اسم المصروف': 'اسم المصروف: إيجار، كهرباء، رواتب...',
    'اسم الحصة': 'اسم الحصة: يوجا، زومبا، كروس فت...',
    'المدرب': 'اسم المدرب المسؤول عن الحصة',
    'السعة': 'الحد الأقصى لعدد المشتركين في الحصة',
    'الاسم': 'الاسم الكامل للموظف',
    'البريد الإلكتروني': 'البريد الذي يستخدمه لتسجيل الدخول',
    'كلمة المرور': 'كلمة المرور (6 أحرف على الأقل)',
    'الهاتف': 'رقم هاتف الموظف',
    'بحث بالاسم': 'ابحث بالاسم في القائمة',
    'بحث في المصروفات': 'ابحث باسم المصروف أو الملاحظة',
    'اسم النادي': 'اسم الصالة الرياضية (يظهر في الوصولات)',
    'امسح الباركود': 'امسح أو اكتب الباركود لبيع المنتج',
    'الوزن': 'وزن المشترك بالكيلوجرام',
    'نسبة الدهون': 'نسبة الدهون من جهاز InBody',
    'كتلة العضلات': 'كتلة العضلات بالكيلوجرام',
    'اسم المعدة': 'اسم الجهاز: تريدميل، دمبل، بار...',
    'الموقع': 'مكان المعدة في الجيم',
    'سعر البيع': 'السعر الذي يُباع به للعميل',
    'سعر التكلفة': 'سعر شراء المنتج من المورّد',
    'الكمية': 'عدد القطع في المخزون',
    'الباركود': 'كود الباركود على غلاف المنتج',
};

const TOOLTIP_MAP_EN = {
    'Expense Name': 'Expense: Rent, Electricity, Salaries...',
    'Class Name': 'Class: Yoga, Zumba, CrossFit...',
    'Trainer': 'Trainer responsible for this class',
    'Capacity': 'Max participants allowed',
    'Name': 'Full name',
    'Email': 'Email used for login',
    'Password': 'Password (min 6 characters)',
    'Phone': 'Phone number',
    'Search by name': 'Search by member name',
    'Search expenses': 'Search by expense name or note',
    'Gym Name': 'Gym name shown on receipts',
    'Scan barcode': 'Scan or type barcode to sell',
    'Weight': 'Weight in kilograms',
    'Body Fat': 'Body fat percentage from InBody',
    'Muscle Mass': 'Muscle mass in kg',
    'Equipment Name': 'Equipment: Treadmill, Dumbbell...',
    'Location': 'Equipment location in gym',
    'Selling Price': 'Selling price to customer',
    'Cost Price': 'Your purchase/cost price',
    'Quantity': 'Available stock quantity',
    'Barcode': 'Product barcode number',
};

// For each file, find <input and <select tags that have placeholder but no title, and add title
const tabFiles = [
    'Expenses.js', 'Classes.js', 'Staff.js', 'Goods.js', 'Payments.js',
    'Attendance.js', 'Settings.js', 'StockDashboard.js', 'Measurements.js', 'Equipment.js'
];

let totalAdded = 0;

for (const fileName of tabFiles) {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', fileName);
    let content = fs.readFileSync(filePath, 'utf8');
    let count = 0;

    // Remove unused Tooltip import
    const oldLen = content.length;
    content = content.replace(/import \{[^}]*\} from '\.\.\/Tooltip';?\n?/g, '');
    if (content.length !== oldLen) count++;

    // Process each input/select that has a placeholder and no title
    // Match patterns like: placeholder={lang === 'ar' ? 'ARABIC' : 'ENGLISH'}
    const regex = /placeholder=\{lang === 'ar' \? '([^']+)' : '([^']+)'\}/g;
    let match;
    const matches = [];
    while ((match = regex.exec(content)) !== null) {
        matches.push({
            fullMatch: match[0],
            arText: match[1],
            enText: match[2],
            index: match.index
        });
    }

    for (const m of matches.reverse()) {
        // Check if this tag already has a title attribute nearby
        const context = content.substring(Math.max(0, m.index - 100), m.index + m.fullMatch.length + 100);
        if (context.includes('title={')) continue;

        // Find matching tooltip
        let arTip = null, enTip = null;
        for (const [key, val] of Object.entries(TOOLTIP_MAP_AR)) {
            if (m.arText.includes(key)) { arTip = val; break; }
        }
        for (const [key, val] of Object.entries(TOOLTIP_MAP_EN)) {
            if (m.enText.includes(key)) { enTip = val; break; }
        }

        if (arTip && enTip) {
            const titleAttr = ` title={lang === 'ar' ? '${arTip}' : '${enTip}'}`;
            // Insert title just after the placeholder
            content = content.slice(0, m.index + m.fullMatch.length) + titleAttr + content.slice(m.index + m.fullMatch.length);
            count++;
        }
    }

    // Also handle simple placeholder={t.xxx} patterns
    const simpleRegex = /placeholder=\{t\.(\w+)\}/g;
    let simpleMatch;
    const simpleMatches = [];
    while ((simpleMatch = simpleRegex.exec(content)) !== null) {
        simpleMatches.push({
            fullMatch: simpleMatch[0],
            key: simpleMatch[1],
            index: simpleMatch.index
        });
    }

    const tTooltips = {
        name: { ar: 'اسم العنصر', en: 'Item name' },
        amount: { ar: 'المبلغ بالعملة المحلية', en: 'Amount in local currency' },
        note: { ar: 'ملاحظات إضافية (اختياري)', en: 'Additional notes (optional)' },
        search: { ar: 'ابحث بالاسم أو الرقم', en: 'Search by name or number' },
    };

    for (const m of simpleMatches.reverse()) {
        const context = content.substring(Math.max(0, m.index - 100), m.index + m.fullMatch.length + 100);
        if (context.includes('title={')) continue;

        const tip = tTooltips[m.key];
        if (tip) {
            const titleAttr = ` title={lang === 'ar' ? '${tip.ar}' : '${tip.en}'}`;
            content = content.slice(0, m.index + m.fullMatch.length) + titleAttr + content.slice(m.index + m.fullMatch.length);
            count++;
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`${fileName}: ${count} tooltips processed`);
    totalAdded += count;
}

console.log(`\n✅ Total: ${totalAdded} tooltips added across all files`);
