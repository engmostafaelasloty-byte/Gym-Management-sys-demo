const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'chatbotData.js');
let content = fs.readFileSync(filePath, 'utf8');

const updates = [
    // profit-system — old answer mentions "Men and Women modes"
    {
        old: `The system calculates profits automatically: Monthly Profit = (Total Subscriptions Income + Goods Profit) - Total Expenses. Subscriptions income is the sum of all subscription prices for that month. Goods profit is calculated as (Selling Price - Cost) × Quantity for each item. Expenses are subtracted from the total. The system tracks profits separately for Men and Women modes, and the Admin can see combined annual totals. Profits accumulate month by month and are displayed in the Dashboard.`,
        new: `The system calculates profits automatically: Monthly Profit = (Total Subscriptions Income + Goods Profit) - Total Expenses. Subscriptions income is the sum of all subscription prices for that month. Goods profit is calculated as (Selling Price - Cost) × Quantity for each item. Expenses are subtracted from the total. The system tracks profits by system type (Men/Women/Mix). You can view detailed charts, KPIs, and monthly breakdowns in the Reports tab. Profits accumulate month by month and are displayed in the Dashboard and Reports.`
    },
    {
        old: `النظام يحسب الأرباح تلقائياً: الربح الشهري = (إجمالي إيرادات الاشتراكات + ربح البضائع) - إجمالي المصروفات. إيرادات الاشتراكات هي مجموع أسعار جميع الاشتراكات لذلك الشهر. ربح البضائع يُحسب كـ (سعر البيع - التكلفة) × الكمية لكل منتج. المصروفات تُطرح من الإجمالي. النظام يتتبع الأرباح بشكل منفصل لأوضاع الرجال والنساء، والمدير يمكنه رؤية الإجماليات السنوية المجمعة. الأرباح تتراكم شهراً بعد شهر وتُعرض في لوحة التحكم.`,
        new: `النظام يحسب الأرباح تلقائياً: الربح الشهري = (إجمالي إيرادات الاشتراكات + ربح البضائع) - إجمالي المصروفات. إيرادات الاشتراكات هي مجموع أسعار جميع الاشتراكات لذلك الشهر. ربح البضائع يُحسب كـ (سعر البيع - التكلفة) × الكمية لكل منتج. المصروفات تُطرح من الإجمالي. يمكنك عرض رسوم بيانية شهرية ملونة ومؤشرات الأداء (KPI) في تبويب التقارير، بما في ذلك هامش الربح ومعدل الاحتفاظ. الأرباح تتراكم شهراً بعد شهر وتُعرض في لوحة التحكم والتقارير.`
    },

    // system-features — old answer mentions localStorage, offline, Men/Women/Admin
    {
        old: `مميزات نظام إدارة الجيم: 1) إدارة المشتركين - إضافة وتعديل وحذف الأعضاء مع اشتراكات يومية/شهرية وتتبع الحالة، 2) تتبع البضائع والمصروفات - تسجيل المبيعات والتكاليف وحساب الأرباح تلقائياً، 3) تقارير مالية - لوحات شهرية وسنوية مع الإيرادات والمصروفات وصصافي الربح، 4) شات بوت تفاعلي - إجابات فورية على الأسئلة الشائعة، 5) تخزين محلي آمن - كل البيانات مخزنة على جهازك، يعمل 100% بدون إنترنت، 6) نسخ احتياطي واستيراد - تصدير/استعادة البيانات كملفات JSON، 7) أوضاع مستخدمين متعددة - وصول منفصل للرجال والنساء والمدير بصلاحيات مختلفة، 8) واجهة ثنائية اللغة - دعم كامل للعربية والإنجليزية، 9) تصميم متجاوب - يعمل على جميع الأجهزة وأحجام الشاشات.`,
        new: `مميزات نظام إدارة الجيم الاحترافي: 1) إدارة المشتركين — إضافة وتعديل وحذف الأعضاء مع اشتراكات يومية/شهرية وتتبع الحالة وتسجيل الحضور بالباركود، 2) إدارة الموظفين — حسابات حقيقية بأدوار مختلفة (مدير، مدرب، محاسب، استقبال) وصلاحيات مفصّلة بالـ Toggle Switches، 3) تقارير مالية — رسوم بيانية شهرية ملونة ومؤشرات أداء KPI وتصدير CSV، 4) المدفوعات — أقساط وتتبع المعلق ووصلات دفع قابلة للطباعة، 5) الحضور اليومي — إحصائيات فورية مع بحث وتصدير، 6) الحصص الجماعية — بطاقات وجدول يومي مع المدرب والوقت، 7) شات بوت ذكي — يفهم الأسئلة بأي صياغة بالعربي والإنجليزي، 8) قاعدة بيانات MongoDB آمنة مع تشفير bcrypt لكلمات المرور، 9) نسخ احتياطي واستعادة، 10) الولاء والقياسات وإدارة المعدات، 11) واجهة ثنائية اللغة بتصميم Glassmorphism عصري`
    },
    {
        old: `The Gym Management System features: 1) Subscriber Management - add, edit, delete members with daily/monthly subscriptions and status tracking, 2) Goods & Expense Tracking - record sales, costs, and calculate profits automatically, 3) Financial Reports - monthly and annual dashboards with revenue, expenses, and net profit, 4) Interactive Chatbot - instant answers to common questions, 5) Secure Local Storage - all data stored on your device, works 100% offline, 6) Backup & Import - export/restore data as JSON files, 7) Multiple User Modes - separate Men, Women, and Admin access with different privileges, 8) Bilingual Interface - full Arabic and English support, 9) Responsive Design - works on all devices and screen sizes.`,
        new: `The Professional Gym Management System features: 1) Subscriber Management — add, edit, delete members with daily/monthly subscriptions, status tracking, and QR attendance, 2) Staff Management — real accounts with roles (Admin, Trainer, Accountant, Reception) and granular permissions via Toggle Switches, 3) Financial Reports — color-coded monthly bar charts, KPIs (retention rate, profit margin), and CSV export, 4) Payments — installments tracking, pending payments, and printable professional receipts, 5) Daily Attendance — real-time stats with search and CSV export, 6) Group Classes — card and schedule views with trainer and time, 7) Smart Chatbot — understands questions in any format in Arabic and English, 8) Secure MongoDB database with bcrypt-encrypted passwords, 9) Backup & Restore, 10) Loyalty points, Measurements, and Equipment management, 11) Bilingual Glassmorphism UI design`
    },

    // reports-dashboard — old answer mentions "Men/Women mode"
    {
        old: `لوحة التحكم تعرض: 1) الإجمالي الشهري لوضعك الحالي (رجال/نساء) مع الإيرادات والمصروفات وصافي الربح، 2) وضع المدير يعرض الإجمالي السنوي الذي يجمع كل البيانات، 3) جدول شهري مفصل (للمدير فقط) بأعمدة: الشهر، الدخل (الاشتراكات)، المصروفات، ربح البضائع، وصافي الربح. كل صف يمثل شهراً واحداً. الأرقام الخضراء تشير للربح، الحمراء تشير للخسارة. استخدم هذا لتتبع الأداء المالي عبر الوقت.`,
        new: `لوحة التحكم تعرض: 1) بطاقات إحصائية بإجمالي المشتركين والنشطين والمنتهين وحضور اليوم والإيرادات والمصروفات الشهرية، 2) تبويب التقارير يعرض 4 بطاقات ملخص سنوي + رسم بياني شهري ملوّن + مؤشرات أداء KPI (معدل الاحتفاظ، هامش الربح) + مخطط ساعات الذروة. الأرقام الخضراء تشير للربح والحمراء للخسارة. يمكنك التبديل بين عرض شهري وعرض مؤشرات الأداء وتصدير CSV.`
    },
    {
        old: `The Dashboard shows: 1) Monthly Total for your current mode (Men/Women) with revenue, expenses, and net profit, 2) Admin Mode shows Annual Total combining all data, 3) Detailed monthly table (Admin only) with columns: Month, Income (subscriptions), Expenses, Goods Profit, and Net Profit. Each row represents one month. Green numbers indicate profit, red indicates loss. Use this to track financial performance over time.`,
        new: `The Dashboard shows: 1) stat cards for total subscribers, active, expired, today's attendance, monthly revenue and expenses. 2) The Reports tab shows 4 annual summary cards + color-coded monthly bar chart + KPIs (retention rate, profit margin) + peak hours chart. Green numbers = profit, red = loss. Switch between Monthly and KPIs views and export CSV anytime.`
    },

    // backup directions — old button names
    {
        old: `للنسخ الاحتياطي: سجل دخول كمدير، اضغط 'تنزيل النسخة الاحتياطية' لحفظ ملف JSON. احفظ النسخ في مكان آمن (تخزين سحابي، قرص خارجي). يمكنك الاستعادة في أي وقت بالضغط على 'استيراد النسخة الاحتياطية' واختيار الملف.`,
        new: `للنسخ الاحتياطي: سجل دخول كمدير، اذهب لتبويب 'الإعدادات' → قسم 'إدارة البيانات' → اضغط '📥 تحميل نسخة احتياطية' لحفظ ملف JSON. احفظ النسخ في مكان آمن. يمكنك الاستعادة بالضغط على '📤 استعادة نسخة احتياطية' واختيار الملف.`
    },
    {
        old: `Recommended backup schedule: 1) Weekly backups for active gyms with daily changes, 2) Monthly backups at month-end before reviewing reports, 3) Before making major changes (deleting data, changing many passwords), 4) Before starting a new year. To backup: Login as Admin, click 'Download Backup' to save a JSON file. Store backups in a safe location (cloud storage, external drive). You can restore anytime by clicking 'Import Backup' and selecting the file.`,
        new: `Recommended backup schedule: 1) Weekly for active gyms, 2) Monthly at month-end, 3) Before major changes, 4) Before starting a new year. To backup: Login as Admin → Settings tab → Data Management → click '📥 Export Backup' to save a JSON file. Store safely. Restore via '📤 Import Backup'.`
    },

    // fresh start — old mentions
    {
        old: `للمسح: سجل دخول كمدير، اضغط 'مسح كل البيانات'، أكد الإجراء.`,
        new: `للمسح: سجل دخول كمدير → تبويب 'الإعدادات' → قسم 'منطقة الخطر' ⚠️ → اضغط '🗑️ مسح جميع البيانات' وأكّد الإجراء.`
    },
    {
        old: `To clear: Login as Admin, click 'Clear All Data', confirm the action.`,
        new: `To clear: Login as Admin → Settings tab → Danger Zone ⚠️ → click '🗑️ Reset System' and confirm.`
    }
];

let count = 0;
for (const u of updates) {
    if (content.includes(u.old)) {
        content = content.replace(u.old, u.new);
        count++;
    } else {
        console.log('⚠️ NOT FOUND:', u.old.substring(0, 60) + '...');
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`✅ Updated ${count} outdated answers.`);
console.log('File size:', fs.statSync(filePath).size, 'bytes');
