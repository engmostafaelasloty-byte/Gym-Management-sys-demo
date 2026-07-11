const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'chatbotData.js');
let content = fs.readFileSync(filePath, 'utf8');

// إزالة الـ ]; من النهاية وإضافة المدخلات الجديدة
const newEntries = [
    {
        id: "staff-permissions",
        question_en: ["How do I set staff permissions?", "permissions", "what can staff do", "access controls"],
        answer_en: "Go to the 'Staff' tab, find the employee, and click '🔐 Permissions'. A modal opens with toggle switches grouped into: Subscribers, Finance & Reports, and Management. Toggle each permission on/off and click Save.",
        keywords_en: ["permissions", "access", "staff permissions", "toggle", "what staff can do", "controls"],
        question_ar: ["كيف أضبط صلاحيات الموظف؟", "صلاحيات الموظف", "ازاي احدد الصلاحيات", "يعمل ايه الموظف"],
        answer_ar: "اذهب لتبويب 'الموظفين'، ابحث عن الموظف، واضغط '🔐 الصلاحيات'. ستفتح نافذة بمفاتيح تبديل مجمّعة في: المشتركين، المالية والتقارير، والإدارة. شغّل/أوقف حسب الحاجة ثم اضغط حفظ.",
        keywords_ar: ["صلاحيات", "تحكم", "الموظف", "مفتاح", "تشغيل", "يشوف ايه", "يعمل ايه", "تفعيل", "ايقاف"]
    },
    {
        id: "change-staff-password",
        question_en: ["How do I change a staff member's password?", "staff password reset", "employee password change"],
        answer_en: "Go to the 'Staff' tab, find the employee, and click '🔑 Password'. Enter the current password, the new password, confirm it, and click Save. The password must be at least 6 characters.",
        keywords_en: ["staff password", "employee password", "change password", "reset password", "new password"],
        question_ar: ["كيف أغير كلمة مرور موظف؟", "تغيير باسورد موظف", "كلمة مرور الموظف", "تغيير الباسورد"],
        answer_ar: "اذهب لتبويب 'الموظفين'، ابحث عن الموظف، واضغط '🔑 كلمة المرور'. أدخل كلمة المرور الحالية ثم الجديدة مرتين واضغط حفظ. يجب أن تكون 6 أحرف على الأقل.",
        keywords_ar: ["باسورد موظف", "كلمة سر موظف", "تغيير كلمة مرور", "تغيير الباسورد", "حساب الموظف"]
    },
    {
        id: "attendance-today",
        question_en: ["How do I view today's attendance?", "who came today", "attendance list", "daily attendance tab"],
        answer_en: "Click the 'Daily Attendance' tab. You'll see 3 summary cards (Total Today, Still Inside, Checked Out), a search box by name, and a full table with each member's check-in time, check-out time, duration, and status. Export as CSV is also available.",
        keywords_en: ["attendance", "today", "who came", "checkin", "checkout", "present", "inside"],
        question_ar: ["كيف أشوف حضور اليوم؟", "مين وصل النهارده؟", "قائمة الحضور اليومي", "حضور اليوم"],
        answer_ar: "اضغط على تبويب 'الحضور اليومي'. ستجد 3 بطاقات ملخص (إجمالي اليوم، لا يزالون داخل، غادروا)، صندوق بحث بالاسم، وجدول بوقت دخول وخروج ومدة حضور وحالة كل عضو. يمكنك تصدير القائمة كـ CSV.",
        keywords_ar: ["حضور", "اليوم", "مين جه", "وصل", "دخل", "خرج", "الحضور اليومي", "قائمة الحضور"]
    },
    {
        id: "reports-charts",
        question_en: ["How do I view financial reports and charts?", "monthly chart", "KPIs view", "profit chart"],
        answer_en: "Go to the 'Reports' tab. It shows: 4 annual summary cards (Income, Goods Profit, Expenses, Net Profit), a color-coded monthly bar chart, KPIs view (Retention Rate, Profit Margin, Average Revenue), and a Peak Hours chart. Switch views with top buttons. CSV export available.",
        keywords_en: ["reports", "charts", "kpi", "monthly report", "annual", "financial graph", "profit chart"],
        question_ar: ["كيف أشوف التقارير والرسوم البيانية؟", "رسم بياني الارباح", "مؤشرات الاداء KPI"],
        answer_ar: "اذهب لتبويب 'التقارير'. يعرض: 4 بطاقات ملخص سنوي، مخطط شريطي شهري بالألوان، مؤشرات الأداء (معدل الاحتفاظ، هامش الربح)، ومخطط ساعات الذروة. بدّل بين 'شهري' و'مؤشرات الأداء' بالأزرار في الأعلى.",
        keywords_ar: ["تقارير", "رسم بياني", "KPI", "شهري", "مالي", "احصائيات", "ارباح الشهر", "الارباح السنوية"]
    },
    {
        id: "payment-receipt",
        question_en: ["How do I print a payment receipt?", "print invoice", "payment proof", "billing document"],
        answer_en: "Go to the 'Payments' tab. Find a completed payment (marked ✅ Paid) and click '🖨️ Receipt'. A professional bilingual (Arabic/English) receipt opens in a new tab with the gym name and payment details, and the print dialog opens automatically.",
        keywords_en: ["receipt", "print", "invoice", "proof", "billing", "payment document", "paper"],
        question_ar: ["كيف أطبع وصل دفع؟", "طباعة فاتورة", "وصل استلام", "ايصال دفع", "اطبع الوصل"],
        answer_ar: "اذهب لتبويب 'المدفوعات'. ابحث عن الدفعة المكتملة (✅ مدفوع) واضغط '🖨️ وصل'. سيفتح وصل استلام احترافي في نافذة جديدة باسم الجيم وتفاصيل الدفع بالعربي والإنجليزي، ويفتح حوار الطباعة تلقائياً.",
        keywords_ar: ["وصل", "فاتورة", "طباعة", "ايصال", "اثبات دفع", "ورقة", "اطبع"]
    },
    {
        id: "settings-gym-info",
        question_en: ["How do I configure gym name and settings?", "set gym name", "change currency", "opening hours setup"],
        answer_en: "Go to 'Settings' tab (Admin only). In 'Gym Information': set gym name, currency (EGP, SAR, AED, USD, EUR), and opening/closing hours. Click Save. Other sections: Data Management (backup/restore), Security (change passwords), Danger Zone (clear all data), and System Info.",
        keywords_en: ["settings", "gym name", "config", "currency", "hours", "configure", "setup gym"],
        question_ar: ["كيف أضبط معلومات وإعدادات الجيم؟", "تعديل اسم الجيم", "تغيير العملة", "ساعات العمل"],
        answer_ar: "اذهب لتبويب 'الإعدادات' (للمدير فقط). في 'معلومات النادي': عيّن اسم الجيم، العملة (جنيه، ريال، درهم، دولار)، وأوقات الفتح والإغلاق ثم اضغط حفظ. توجد أيضاً: إدارة البيانات، الأمان، ومنطقة الخطر.",
        keywords_ar: ["اعدادات", "اسم الجيم", "عملة", "ساعات العمل", "فتح", "اغلاق", "ضبط"]
    },
    {
        id: "what-tabs-exist",
        question_en: ["What tabs or sections does the system have?", "list all sections", "navigation menu"],
        answer_en: "The system has 14 main tabs: Dashboard, Subscribers, Goods, Stock, Expenses, Daily Attendance, Group Classes, Staff, Reports, Payments, Measurements, Loyalty, Equipment, and Settings.",
        keywords_en: ["tabs", "sections", "navigation", "features", "menu", "all features", "what is available"],
        question_ar: ["ما هي أقسام وتبويبات النظام؟", "الشاشات المتاحة", "ايه اللي في النظام", "كل الاقسام"],
        answer_ar: "النظام يحتوي على 14 تبويب رئيسي: لوحة التحكم، المشتركين، البضائع، المخزون، المصروفات، الحضور اليومي، الحصص الجماعية، الموظفين، التقارير، المدفوعات، القياسات، الولاء، المعدات، والإعدادات.",
        keywords_ar: ["تبويبات", "اقسام", "شاشات", "ايه موجود", "القائمة", "اقسام النظام", "عدد التبويبات"]
    },
    {
        id: "login-no-role",
        question_en: ["Do I need to select a role when logging in?", "automatic role detection", "how to login now"],
        answer_en: "No! The new system automatically detects your role from the database. Just enter your email and password — your role (Admin, Trainer, Accountant, Reception, etc.) is detected automatically and shown as a colored badge in the header after login.",
        keywords_en: ["role", "login", "select role", "automatic", "email login", "how to login", "sign in"],
        question_ar: ["هل أحتاج لاختيار الدور عند الدخول؟", "دور تلقائي", "دخول بالبريد والباسورد فقط"],
        answer_ar: "لا! النظام يكتشف دورك تلقائياً من قاعدة البيانات. فقط أدخل بريدك الإلكتروني وكلمة المرور — سيتم اكتشاف دورك (مدير، مدرب، محاسب، استقبال...) تلقائياً ويظهر كـ badge ملوّن في الهيدر.",
        keywords_ar: ["دور", "اختيار دور", "تلقائي", "بدون دور", "ادخل ازاي", "طريقة الدخول", "سجل دخول"]
    }
];

// استخراج المصفوفة الحالية وإضافة المدخلات الجديدة
const trimmed = content.trimEnd();
// إزالة آخر ]; والسطر الفارغ
const withoutClose = trimmed.slice(0, trimmed.lastIndexOf('];'));

const newContent = withoutClose 
    + newEntries.map(e => ',\n    ' + JSON.stringify(e, null, 4).split('\n').join('\n    ')).join('')
    + '\n];\n';

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Done! Added', newEntries.length, 'new FAQ entries.');
console.log('File size:', fs.statSync(filePath).size, 'bytes');
