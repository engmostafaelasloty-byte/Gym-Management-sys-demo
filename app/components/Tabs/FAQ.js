'use client';
import React, { useState } from 'react';

export default function FAQTab({ lang }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedItem, setExpandedItem] = useState(null);

    const trans = (arText, enText) => {
        return lang === 'ar' ? arText : enText;
    };

    const categories = [
        { id: 'all', label: trans('الكل', 'All') },
        { id: 'setup', label: trans('التشغيل والتثبيت', 'Setup & Launch') },
        { id: 'general', label: trans('إرشادات عامة', 'General Help') },
        { id: 'backup', label: trans('البيانات والنسخ', 'Data & Backup') },
        { id: 'troubleshoot', label: trans('المشاكل الفنية وعلاجها', 'Technical Troubleshooting') }
    ];

    const faqItems = [
        {
            category: 'setup',
            q_ar: 'كيف يمكنني تشغيل النظام بسرعة بنقرة واحدة؟',
            q_en: 'How do I start the system quickly with one click?',
            a_ar: 'يمكنك إنشاء ملف تشغيل سريع (.bat) على ويندوز بالخطوات التالية:\n1. قم بإنشاء ملف نصي جديد على سطح المكتب وتسميته `start_gym.bat`.\n2. افتح الملف وحرر محتواه، ثم الصق الكود التالي:\n```bat\n@echo off\ncd /d "مسار مجلد المشروع الفعلي هنا"\nstart "" npm run dev\ntimeout /t 3 /nobreak > nul\nstart http://localhost:3000\n```\n3. احفظ الملف، وبمجرد النقر المزدوج عليه سيتم فتح وتشغيل النظام في 3 ثوانٍ.',
            a_en: 'You can create a Windows startup shortcut (.bat) by following these steps:\n1. Create a new text file on your Desktop and rename it to `start_gym.bat`.\n2. Edit it and paste the following code:\n```bat\n@echo off\ncd /d "C:\\path\\to\\your\\project"\nstart "" npm run dev\ntimeout /t 3 /nobreak > nul\nstart http://localhost:3000\n```\n3. Save the file. Double-clicking it will launch the server and open the web app instantly.'
        },
        {
            category: 'setup',
            q_ar: 'كيف أقوم بتشغيل النظام على أكثر من جهاز ومشاركة نفس البيانات؟',
            q_en: 'How do I run the system on multiple devices sharing the same data?',
            a_ar: 'يمكنك القيام بذلك بطريقتين:\n\nأولاً: التشغيل السحابي (يوصى به):\nرفع النظام على استضافة سحابية مثل Vercel، وربطه بقاعدة بيانات سحابية مجانية من MongoDB Atlas. هذا يسمح لأي جهاز متصل بالإنترنت بفتح النظام عبر رابط موقع مخصص.\n\nثانياً: التشغيل الشبكي المحلي (LAN):\n1. حدد كمبيوتر رئيسي ليكون السيرفر وتأكد من تشغيل النظام وقاعدة البيانات عليه.\n2. اعرف عنوان الـ IP المحلي للسيرفر (عبر كتابة `ipconfig` في الـ CMD مثل `192.168.1.50`).\n3. تأكد أن جميع الأجهزة متصلة بنفس جهاز الواي فاي (الراوتر).\n4. اسمح للمنفذ 3000 بالمرور عبر جدار الحماية (Firewall) في السيرفر.\n5. من الأجهزة الأخرى افتح المتصفح وادخل إلى `http://192.168.1.50:3000`.',
            a_en: 'You can do this using two approaches:\n\n1. Cloud Deployment (Recommended):\nDeploy the Next.js app to Vercel and connect it to a MongoDB Atlas cloud database. This allows access from anywhere on any device.\n\n2. Local LAN Connection:\n1. Run the system on one main computer (Server) connected to the local Wi-Fi.\n2. Find its local IP address (run `ipconfig` in cmd, e.g., `192.168.1.50`).\n3. Connect all other devices to the same local Wi-Fi router.\n4. Open port 3000 in Windows Firewall on the Server computer.\n5. Access the app from other browsers using: `http://192.168.1.50:3000`.'
        },
        {
            category: 'setup',
            q_ar: 'كيفية ربط النظام بالـ Gmail لتفعيل ميزة استعادة كلمة المرور (OTP)؟',
            q_en: 'How do I link Gmail for password recovery (OTP)?',
            a_ar: '1. افتح حساب جوجل الخاص بك، واذهب إلى قسم "الأمان".\n2. قم بتفعيل "التحقق بخطوتين" (2-Step Verification).\n3. ابحث عن "كلمات مرور التطبيقات" (App Passwords) وقم بإنشاء كلمة مرور جديدة باسم (Gym GMS).\n4. انسخ الكود المكون من 16 حرفاً الناتج.\n5. افتح ملف `.env.local` في مجلد النظام وأضف المتغيرات التالية:\n```env\nGMAIL_USER=your-email@gmail.com\nGMAIL_PASS=الكود المنسوخ هنا (بدون مسافات)\n```\n6. الآن، إذا نسي المدير كلمة مروره، يمكنه الضغط على "نسيت كلمة المرور" لاستلام كود OTP فوري وتعيين كلمة مرور جديدة.',
            a_en: '1. Log into your Google Account, go to Security.\n2. Enable "2-Step Verification" (Required).\n3. Search for "App Passwords", and create a new app named (Gym GMS).\n4. Copy the generated 16-character code.\n5. Open `.env.local` file and add the variables:\n```env\nGMAIL_USER=your-email@gmail.com\nGMAIL_PASS=your-16-character-code (without spaces)\n```\n6. Now, clicking "Forgot Password" on the login screen will send an OTP directly to the registered admin email.'
        },
        {
            category: 'general',
            q_ar: 'هل توجد كلمة مرور افتراضية عند تشغيل النظام أول مرة؟',
            q_en: 'Are there any default credentials on the first launch?',
            a_ar: 'لا، لضمان الأمان الكامل لصاحب الصالة الرياضية، لا يأتي النظام بأي كلمات مرور افتراضية مسبقة. بدلاً من ذلك، عند أول تشغيل للنظام وقاعدة البيانات فارغة، سيقوم النظام تلقائياً بتحويلك إلى شاشة "تسجيل المدير الرئيسي الأول" لتقوم بإنشاء حسابك الخاص ببريدك الإلكتروني وكلمة مرورك الآمنة مباشرة واستخدامها للدخول.',
            a_en: 'No. To ensure maximum security, the system does not ship with hardcoded default logins. Instead, on the first launch, the system detects an empty database and redirects you to the "Register Master Admin" screen where you set your custom admin email and secure password.'
        },
        {
            category: 'general',
            q_ar: 'ما هي الأوضاع المختلفة لتسجيل الدخول؟ وكيف يتم عزل البيانات؟',
            q_en: 'What are the login modes? How is data isolated?',
            a_ar: 'يدعم النظام ثلاثة أوضاع تشغيل مستقلة:\n1. وضع الرجال (Men Mode): يعرض فقط بيانات المشتركين والموظفين والمالية للفرع الرجالي.\n2. وضع السيدات (Women Mode): يعرض فقط فرع السيدات المعزول تماماً.\n3. الوضع المختلط (Mixed Mode): يعرض بيانات الفرع المشترك بالكامل.\nيتم عزل البيانات عن طريق فلترة قاعدة البيانات برمجياً بناءً على وضع تسجيل الدخول الفعلي وصلاحيات الموظف المسجل.',
            a_en: 'The system runs on three distinct branch modes:\n1. Men Mode: Shows subscribers, staff, and financial data for the men branch.\n2. Women Mode: Shows isolated data for the women branch.\n3. Mixed Mode: Accesses the mixed branch.\nData is isolated at the database query level depending on the active branch mode and staff roles.'
        },
        {
            category: 'general',
            q_ar: 'كيف أقوم بتوزيع الصلاحيات على الموظفين؟',
            q_en: 'How do I distribute permissions to staff members?',
            a_ar: '1. قم بتسجيل الدخول بحساب المدير (Admin).\n2. اذهب إلى تبويب "الموظفين والمدربين".\n3. بجانب اسم أي موظف، اضغط على زر "الصلاحيات" (Shield icon).\n4. ستظهر لك لوحة تحتوي على مفاتيح تحكم (Toggle Switches) لتفعيل أو إيقاف صلاحيات محددة مثل (إدارة المشتركين، الحضور، الإيرادات والمصروفات، إدارة المعدات، إلخ).\n5. اضغط على حفظ ليتم تطبيق القيود على الموظف فوراً عند دخوله.',
            a_en: '1. Log in with your Admin account.\n2. Go to the "Staff" tab.\n3. Click the "Permissions" shield button next to any employee\'s name.\n4. Toggle switches to enable or disable specific features (e.g., Manage Subscribers, View Finance, Manage Equipment, etc.).\n5. Click Save to apply constraints instantly.'
        },
        {
            category: 'backup',
            q_ar: 'كيف أقوم بنسخ بيانات النظام احتياطياً واستعادتها؟',
            q_en: 'How do I backup and restore system data?',
            a_ar: 'أولاً للنسخ الاحتياطي:\nسجل دخول كمدير ← اذهب إلى تبويب "الإعدادات" ← اذهب لقسم "إدارة البيانات" ← اضغط على زر "تنزيل نسخة احتياطية" لتحميل ملف JSON أمني يحتوي على كافة البيانات.\n\nثانياً للاستعادة:\nسجل دخول كمدير ← اذهب إلى تبويب "الإعدادات" ← اضغط على "استعادة نسخة احتياطية" وقم برفع ملف الـ JSON الذي تم تحميله سابقاً. (تحذير: الاستعادة تستبدل كل البيانات الحالية ببيانات النسخة الاحتياطية).',
            a_en: 'To Backup:\nLog in as Admin → Go to "Settings" tab → Under "Data Management", click "Download Backup" to download a secure JSON file containing all data.\n\nTo Restore:\nLog in as Admin → Go to "Settings" tab → Click "Import Backup" and upload the previously exported JSON file. (Caution: This replaces all current database content with the backup database).'
        },
        {
            category: 'backup',
            q_ar: 'ماذا يجب علي فعله عند نهاية كل شهر ميلادي؟',
            q_en: 'What should I do at the end of each month?',
            a_ar: 'النظام يحتفظ بكامل السجلات بشكل تراكمي ولا يمسحها تلقائياً. في نهاية كل شهر، يُنصح بـ:\n1. مراجعة إحصائيات الدخل والأرباح والمقارنة الشهرية في تبويب "التقارير".\n2. مراجعة الاشتراكات المنتهية وتجديدها أو تنبيه أصحابها.\n3. تحميل نسخة احتياطية للبيانات وتخزينها بأمان كإجراء وقائي للحفاظ على أمان البيانات التاريخية.',
            a_en: 'The system maintains all records historically and does not clear them automatically. At the end of each month, it is recommended to:\n1. Review the profits, income, and comparative monthly charts in the "Reports" tab.\n2. Track expired subscriptions to contact members for renewals.\n3. Download a backup JSON file for extra safety.'
        },
        {
            category: 'troubleshoot',
            q_ar: 'يظهر لي شاشة بيضاء أو خطأ في الاتصال بقاعدة البيانات (MongoDB Connection Failed)؟',
            q_en: 'The application shows a blank page or MongoDB Connection Failed?',
            a_ar: 'السبب هو عدم إمكانية وصول التطبيق لقاعدة البيانات. لحل ذلك:\n1. تأكد من إدخال الرابط الصحيح في ملف `.env.local` تحت اسم `MONGODB_URI`.\n2. إذا كنت تستخدم قاعدة بيانات محلية، تأكد من تشغيل خدمة الـ MongoDB (عبر فتح Task Manager ← Services ← تأكد من تشغيل MongoDB).\n3. إذا كنت تستخدم MongoDB Atlas، تأكد من إعداد شبكة الـ IP في لوحة Atlas لتسمح بالاتصال من أي مكان (0.0.0.0/0).',
            a_en: 'This happens when Next.js cannot connect to MongoDB. To resolve:\n1. Make sure your `.env.local` contains the correct `MONGODB_URI` link.\n2. If using a local database, verify MongoDB service is running (Check Windows Services / Task Manager).\n3. If using MongoDB Atlas, make sure you whitelisted access from all IP addresses (add 0.0.0.0/0 in Atlas Network Access).'
        },
        {
            category: 'troubleshoot',
            q_ar: 'لماذا لا تصل أكواد استعادة كلمة المرور (OTP) إلى بريدي الإلكتروني؟',
            q_en: 'Why is the verification code (OTP) not sending to Gmail?',
            a_ar: 'يرجع ذلك لعدة أسباب فنية:\n1. تأكد من أنك قمت بإدخال "كلمة مرور التطبيق" (App Password) ذات الـ 16 حرفاً في متغير `GMAIL_PASS` وليس الباسورد العادي للايميل.\n2. تأكد من كتابة البريد الإلكتروني بشكل صحيح في `GMAIL_USER`.\n3. تأكد من وجود اتصال فعال بالإنترنت في السيرفر ليتمكن من إرسال إيميل خارجي.',
            a_en: 'This occurs due to incorrect email configuration:\n1. Verify you configured Google "App Password" (16 characters) in `GMAIL_PASS` instead of your standard Gmail password.\n2. Make sure `GMAIL_USER` matches the correct email.\n3. Make sure the server has active internet access to reach Google SMTP servers.'
        },
        {
            category: 'troubleshoot',
            q_ar: 'المنفذ 3000 محجوز بالفعل (Port 3000 is already in use)؟',
            q_en: 'Port 3000 is already in use?',
            a_ar: 'هذا يعني أن هناك نسخة أخرى من البرنامج أو تطبيق آخر يعمل بالفعل على منفذ التشغيل الافتراضي 3000. يمكنك حل المشكلة بـ:\n* إغلاق نافذة الـ Terminal القديمة التي تشغل السيرفر.\n* أو تشغيل النظام على منفذ آخر تلقائياً بكتابة الأمر التالي:\n`npx next dev -p 3001` (أو أي رقم منفذ آخر).',
            a_en: 'This means another instance or program is running on port 3000. To fix:\n* Close any open Terminal windows running the server in the background.\n* Alternatively, launch the app on a different port using:\n`npx next dev -p 3001` (or any other port).'
        },
        {
            category: 'general',
            q_ar: 'هل يمكنني استخدام قارئ الباركود أو الـ QR Code مباشرة لتسجيل الحضور؟',
            q_en: 'Can I use a barcode scanner or QR code reader directly for attendance?',
            a_ar: 'نعم، النظام مهيأ بالكامل للتعامل مع أجهزة قراءة الباركود والـ QR Code القياسية. يمكنك توصيل القارئ بجهاز الكمبيوتر عبر منفذ USB، وعند وضع مؤشر الفأرة (Cursor) داخل مربع البحث أو خانة تسجيل الحضور السريع، سيقوم القارئ بمسح الكود أو بطاقة العضوية وتأدية الإجراء تلقائياً وفوراً دون الحاجة للنقر على أي أزرار.',
            a_en: 'Yes, the system is fully compatible with standard USB hardware barcode and QR code scanners. Simply plug the scanner into your computer. When you place the cursor focus inside the search bar or quick check-in input field, scanning the member\'s card or QR code will automatically trigger the check-in/out action instantly.'
        },
        {
            category: 'general',
            q_ar: 'كيف أقوم بطباعة إيصالات دفع الاشتراكات للمشتركين؟',
            q_en: 'How do I print subscriber payment receipts?',
            a_ar: 'لتوفير تجربة احترافية، يمكنك طباعة إيصالات الدفع كالتالي:\n1. اذهب لتبويب "المدفوعات والأقساط".\n2. ابحث عن المعاملة المالية المطلوبة في الجدول.\n3. اضغط على أيقونة الطباعة (🖨️ Print) بجانب المعاملة.\n4. ستفتح لك نافذة نظيفة منسقة للطباعة الفورية تحتوي على كافة تفاصيل المشترك، المبلغ، والبيانات وتدعم الطابعات الحرارية (Thermal Receipt Printers) أو طابعات A4 العادية.',
            a_en: 'To print professional payment receipts for your gym members:\n1. Navigate to the "Payments" tab.\n2. Locate the specific financial transaction in the payments table.\n3. Click the printer icon (🖨️ Print) in the Actions column.\n4. A print-friendly receipt window will open, optimized for either standard A4 printers or 80mm thermal receipt printers.'
        },
        {
            category: 'general',
            q_ar: 'ما هو نظام الولاء ومكافأة المشتركين بالنقاط وكيف يستفيد المشترك منها؟',
            q_en: 'What is the gym loyalty program and how do members benefit from it?',
            a_ar: 'هو نظام آلي يهدف لتحفيز المشتركين على الاستمرار في الصالة:\n1. يقوم النظام بحساب نقاط تلقائية للمشتركين بناءً على حضورهم اليومي أو تجديد اشتراكاتهم.\n2. يتدرج المشتركون عبر 4 مستويات ولاء (برونزي، فضي، ذهبي، ماسي).\n3. يمكن للمشترك استبدال هذه النقاط المتراكمة للحصول على خصومات أو حصص مجانية أو تمديد اشتراك مجاناً بناءً على إعدادات النقاط التي تحددها في تبويب "برنامج الولاء".',
            a_en: 'The loyalty program is built to improve customer retention:\n1. The system automatically awards points to members when they check in daily or renew subscriptions.\n2. Members progress through 4 loyalty tiers (Bronze, Silver, Gold, Diamond).\n3. Members can redeem points for custom benefits, discounts, or free subscription extensions, managed in the "Loyalty" tab.'
        },
        {
            category: 'general',
            q_ar: 'كيف تعمل تنبيهات انخفاض مخزون المكملات والسلع؟',
            q_en: 'How do low-stock alerts for supplements and goods work?',
            a_ar: 'عند إضافة أي منتج/بضاعة في قسم البضائع، يمكنك تحديد "الحد الأدنى للمخزون" (Low-Stock Threshold) الخاص بها. في حال انخفاض الكمية المتاحة عن هذا الحد نتيجة المبيعات، سيظهر تنبيه أحمر مميز في صفحة البضائع ولوحة التحكم لتذكيرك بإعادة شراء وتوفير المنتج فوراً.',
            a_en: 'When adding or editing items in the Goods section, you can define a "Low-Stock Threshold". If sales cause the quantity of an item to drop below this limit, a red warning badge will appear in both the Goods list and the Dashboard to prompt you to restock.'
        }
    ];

    // Filter items based on search and category
    const filteredItems = faqItems.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const query = searchTerm.toLowerCase();
        
        const qText = (lang === 'ar' ? item.q_ar : item.q_en).toLowerCase();
        const aText = (lang === 'ar' ? item.a_ar : item.a_en).toLowerCase();
        
        const matchesSearch = !searchTerm || qText.includes(query) || aText.includes(query);
        return matchesCategory && matchesSearch;
    });

    return (
        <section className="panel faq-panel" style={{ color: '#fff' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ margin: 0 }}>
                        ❓ {trans('الأسئلة الشائعة والدعم الفني', 'FAQ & Technical Support')}
                    </h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: 13, opacity: 0.6 }}>
                        {trans('دليل إرشادي متكامل وحل لجميع المشاكل الفنية وعلاماتها', 'Comprehensive guide and solutions for all technical questions and errors')}
                    </p>
                </div>
            </div>

            {/* Search and Categories Bar */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: 16, borderRadius: 14, marginBottom: 20 }}>
                <div style={{ position: 'relative', width: '100%', marginBottom: 14 }}>
                    <span style={{ position: 'absolute', left: lang === 'ar' ? 'auto' : 12, right: lang === 'ar' ? 12 : 'auto', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
                    <input 
                        type="text" 
                        placeholder={trans('ابحث عن سؤال أو حل مشكلة فنية...', 'Search for a question or technical solution...')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            paddingLeft: lang === 'ar' ? 12 : 36,
                            paddingRight: lang === 'ar' ? 36 : 12,
                            paddingTop: 10,
                            paddingBottom: 10,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 8,
                            fontSize: 13,
                            color: '#fff'
                        }}
                    />
                </div>

                {/* Categories */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            style={{
                                padding: '6px 14px',
                                fontSize: 12,
                                background: activeCategory === cat.id ? '#0ee6b7' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${activeCategory === cat.id ? '#0ee6b7' : 'rgba(255,255,255,0.08)'}`,
                                color: activeCategory === cat.id ? '#000' : '#fff',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontWeight: 700,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Questions Timeline / Accordion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
                        <span>🔍</span>
                        <p style={{ marginTop: 8 }}>{trans('لا توجد نتائج تطابق بحثك حالياً', 'No results match your search query')}</p>
                    </div>
                ) : (
                    filteredItems.map((item, index) => {
                        const isExpanded = expandedItem === index;
                        const question = lang === 'ar' ? item.q_ar : item.q_en;
                        const answer = lang === 'ar' ? item.a_ar : item.a_en;

                        return (
                            <div 
                                key={index} 
                                style={{
                                    background: isExpanded ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                                    border: `1px solid ${isExpanded ? 'rgba(14, 230, 183, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {/* Header (Question) */}
                                <div 
                                    onClick={() => setExpandedItem(isExpanded ? null : index)}
                                    style={{
                                        padding: '16px 20px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 12,
                                        userSelect: 'none'
                                    }}
                                >
                                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: isExpanded ? '#0ee6b7' : '#fff', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'start' }}>
                                        <span>💬</span>
                                        {question}
                                    </h4>
                                    <span style={{ fontSize: 18, color: '#0ee6b7', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                        ▼
                                    </span>
                                </div>

                                {/* Body (Answer) */}
                                {isExpanded && (
                                    <div 
                                        style={{
                                            padding: '0 20px 20px 20px',
                                            fontSize: 13,
                                            lineHeight: 1.6,
                                            opacity: 0.9,
                                            borderTop: '1px solid rgba(255,255,255,0.03)',
                                            paddingTop: 16,
                                            textAlign: 'start',
                                            whiteSpace: 'pre-line',
                                            color: '#cbd5e1'
                                        }}
                                    >
                                        {answer}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <style jsx>{`
                .faq-panel {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}
