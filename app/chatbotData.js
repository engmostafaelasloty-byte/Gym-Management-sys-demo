export const FAQ_DATA = [
    {
        "id": "auth-modes",
        "question_en": [
            "What login modes does the Gym Management System support?",
            "login modes?"
        ],
        "answer_en": "The new system uses **real staff accounts** with specific roles. Available roles: System Admin — full access to everything, Trainer — manage subscribers and attendance, Accountant — access financials and reports, Reception — attendance and subscriber check-in, Staff. Each employee logs in with their email and password — the system automatically detects their role.",
        "keywords_en": [
            "login",
            "mode",
            "admin",
            "trainer",
            "accountant",
            "reception",
            "roles",
            "role",
            "authentication",
            "staff accounts"
        ],
        "question_ar": [
            "ما هي أوضاع تسجيل الدخول المتاحة؟",
            "ايه اوضاع الدخول؟"
        ],
        "answer_ar": "النظام الجديد يعتمد على **حسابات موظفين حقيقية** مع أدوار محددة. الأدوار المتاحة: مدير النظام (admin) — وصول كامل لكل شيء، مدرب (trainer) — إدارة المشتركين والحضور، محاسب (accountant) — الوصول للمالية والتقارير، موظف استقبال (reception) — تسجيل الحضور والمشتركين، موظف عادي (staff). كل موظف يدخل ببريده الإلكتروني وكلمة مروره — النظام يكتشف دوره تلقائياً.",
        "keywords_ar": [
            "وضع",
            "اوضاع النظام",
            "مدير",
            "مدرب",
            "محاسب",
            "استقبال",
            "دخول",
            "تسجيل دخول",
            "نظام",
            "ادوار",
            "ادمن",
            "انواع الحسابات",
            "انواع الموظفين"
        ]
    },
    {
        "id": "default-passwords",
        "question_en": [
            "What are the default passwords?",
            "initial passwords",
            "first time login"
        ],
        "answer_en": "The system does not use shared default credentials. When you open the system for the first time, you will be prompted to register the owner/admin account with your own email and password.",
        "keywords_en": [
            "default",
            "password",
            "initial",
            "first time",
            "create admin",
            "first login"
        ],
        "question_ar": [
            "ما هي كلمات المرور الافتراضية؟",
            "كلمات السر الأولية",
            "أول مرة دخول"
        ],
        "answer_ar": "النظام لا يستخدم كلمات مرور افتراضية مشتركة. عند فتح النظام لأول مرة، سيُطلب منك تسجيل حساب المدير/المالك ببريدك الإلكتروني وكلمة المرور الخاصة بك مباشرة.",
        "keywords_ar": [
            "افتراضي",
            "كلمة سر",
            "اولية",
            "اول مرة",
            "دخول افتراضي",
            "باسورد افتراضي",
            "اول حساب"
        ]
    },
    {
        "id": "password-reset",
        "question_en": [
            "How do I reset the mode passwords?",
            "reset password",
            "change password"
        ],
        "answer_en": "To change any staff member's password: 1) Log in as Admin, 2) Go to the \"Staff\" tab, 3) Find the employee, 4) Click \"🔑 Password\", 5) Enter the current and new password (twice), 6) Click \"Save\". To change your own admin password: same steps but search for your own account.",
        "keywords_en": [
            "reset password",
            "change password",
            "update password",
            "forgot password",
            "new password",
            "staff password"
        ],
        "question_ar": [
            "كيف أعيد تعيين كلمات مرور الأوضاع؟",
            "ازاي اغير كلمة السر؟",
            "اعادة تعيين كلمة السر"
        ],
        "answer_ar": "لتغيير كلمة مرور أي موظف: 1) سجّل دخول كمدير، 2) اذهب لتبويب \"الموظفين والمدربين\"، 3) ابحث عن الموظف، 4) اضغط زر \"🔑 كلمة المرور\"، 5) أدخل كلمة المرور الحالية والجديدة (مرتين)، 6) اضغط \"حفظ\". لتغيير كلمة مرور المدير نفسه: نفس الخطوات لكن ابحث عن حسابك الخاص.",
        "keywords_ar": [
            "تغيير كلمة السر",
            "اعادة تعيين",
            "تحديث كلمة السر",
            "نسيت كلمة السر",
            "كلمات المرور",
            "غير الباسورد",
            "تغيير الباسورد",
            "تعديل كلمة السر"
        ]
    },
    {
        "id": "password-recovery",
        "question_en": [
            "How does password recovery work?",
            "forgot password recovery",
            "recovery phone",
            "otp recovery",
            "gmail password recovery"
        ],
        "answer_en": "For staff members: The Admin can reset their passwords from the \"Staff\" tab. For the Admin: You can recover your password via Gmail OTP. If you forget your password, click \"Forgot Password?\" on the login page. Enter your email to receive a 6-digit verification code via Gmail to set a new password. Make sure GMAIL_USER and GMAIL_PASS are set in `.env.local` to enable this.",
        "keywords_en": [
            "recovery",
            "forgot",
            "otp",
            "gmail",
            "reset",
            "manager password",
            "forgot password",
            "app password"
        ],
        "question_ar": [
            "كيف تعمل استعادة كلمة المرور؟",
            "نسيت كلمة المرور استعادة",
            "استعادة عبر الايميل",
            "كود التحقق"
        ],
        "answer_ar": "بالنسبة للموظفين: يمكن للمدير إعادة تعيين كلمة مرورهم من تبويب \"الموظفين\". أما بالنسبة للمدير (الآدمن): يمكنك استعادة كلمة مرورك عبر البريد الإلكتروني (Gmail OTP). في شاشة تسجيل الدخول، اضغط على \"نسيت كلمة المرور؟\"، وأدخل بريدك الإلكتروني لتلقي رمز تحقق مكون من 6 أرقام وتعيين كلمة مرور جديدة. تأكد من إعداد GMAIL_USER و GMAIL_PASS في ملف `.env.local` لتفعيل ذلك.",
        "keywords_ar": [
            "استعادة",
            "نسيت",
            "ايميل",
            "جيميل",
            "التحقق بخطوتين",
            "كود التحقق",
            "نسيت كلمة مرور",
            "استرجاع",
            "رمز تحقق"
        ]
    },
    {
        "id": "subscriber-add",
        "question_en": [
            "How do I add a new subscriber?",
            "add subscriber",
            "register member"
        ],
        "answer_en": "To add a subscriber: 1) Go to the Subscribers section, 2) Fill in the form: Name, Category (VIP, Regular, Student, etc.), Phone, Subscription Duration (Daily, Weekly, Half Month, or 1-12 Months), and Price, 3) Click 'Add Subscriber'. The system automatically calculates start and end dates. The subscriber will appear in the table below with their status (Active, Expiring Soon, or Expired).",
        "keywords_en": [
            "add subscriber",
            "register member",
            "new member",
            "new subscriber",
            "subscriber",
            "add member",
            "create subscriber"
        ],
        "question_ar": [
            "كيف أضيف مشترك جديد؟",
            "ازاي اسجل مشترك؟"
        ],
        "answer_ar": "لإضافة مشترك: 1) اذهب إلى قسم المشتركين، 2) املأ النموذج: الاسم، الفئة (VIP، عادي، طالب، إلخ)، الهاتف، مدة الاشتراك (يومي، أسبوعي، نصف شهر، أو 1-12 شهر)، والسعر، 3) اضغط 'إضافة مشترك'. النظام يحسب تاريخ البداية والنهاية تلقائياً. سيظهر المشترك في الجدول أدناه مع حالته (نشط، ينتهي قريباً، أو منتهي).",
        "keywords_ar": [
            "اضيف مشترك",
            "تسجيل مشترك",
            "عميل جديد",
            "عميل",
            "مشترك جديد",
            "اضافه مشترك",
            "تسجيل",
            "اشتراك جديد",
            "ازاي اضيف",
            "عايز اضيف",
            "بضيف ازاي",
            "سجل مشترك",
            "اضافة",
            "انشاء مشترك"
        ]
    },
    {
        "id": "subscriber-edit",
        "question_en": [
            "How do I edit, renew or delete a subscriber?",
            "edit subscriber",
            "renew subscription"
        ],
        "answer_en": "In the Subscribers table, each row has action buttons: 'Edit' (pencil icon) - modify subscriber details, 'Renew' (appears for expired or expiring subscriptions) - extend the subscription, 'Delete' (trash icon) - remove the subscriber after confirmation. Click the appropriate button for the action you want to perform.",
        "keywords_en": [
            "edit subscriber",
            "renew member",
            "delete subscriber",
            "update",
            "modify",
            "remove subscriber"
        ],
        "question_ar": [
            "كيف أعدل أو أجدد أو أحذف مشترك؟",
            "تعديل مشترك",
            "تجديد الاشتراك"
        ],
        "answer_ar": "في جدول المشتركين، كل صف له أزرار إجراءات: 'تعديل' (أيقونة قلم) - لتعديل بيانات المشترك، 'تجديد' (يظهر للاشتراكات المنتهية أو القريبة من الانتهاء) - لتمديد الاشتراك، 'حذف' (أيقونة سلة المهملات) - لإزالة المشترك بعد التأكيد. اضغط على الزر المناسب للإجراء الذي تريده.",
        "keywords_ar": [
            "عدل مشترك",
            "اجدد الاشتراك",
            "امسح مشترك",
            "حذف مشترك",
            "حذف عميل",
            "عدل عميل",
            "تجديد عميل",
            "تعديل",
            "حذف",
            "تجديد",
            "ازاي اعدل",
            "ازاي امسح",
            "ازاي اجدد",
            "مسح مشترك",
            "الغاء اشتراك",
            "ازالة"
        ]
    },
    {
        "id": "subscriber-search",
        "question_en": [
            "How can I search subscribers effectively?",
            "search member",
            "find subscriber"
        ],
        "answer_en": "Use the search bar above the Subscribers table. You can search by: Name, Phone Number, or Category. Results filter instantly as you type. The search is case-insensitive and works with partial matches. To clear the search, delete the text from the search box.",
        "keywords_en": [
            "search",
            "find",
            "filter",
            "lookup",
            "search bar",
            "find member"
        ],
        "question_ar": [
            "كيف أبحث عن المشتركين؟",
            "ازاي ادور على مشترك؟"
        ],
        "answer_ar": "استخدم شريط البحث أعلى جدول المشتركين. يمكنك البحث بـ: الاسم، رقم الهاتف، أو الفئة. النتائج تُفلتر فوراً أثناء الكتابة. البحث غير حساس لحالة الأحرف ويعمل مع المطابقات الجزئية. لإلغاء البحث، احذف النص من مربع البحث.",
        "keywords_ar": [
            "ابحث",
            "دور",
            "فلتر",
            "جد",
            "البحث",
            "بحث",
            "ايجاد المشتركين",
            "البحث عن المشتركين",
            "ابحث عن",
            "كيف ابحث",
            "ازاي ابحث",
            "فين المشترك",
            "ادور ازاي",
            "سيرش",
            "شريط البحث"
        ]
    },
    {
        "id": "subscription-status",
        "question_en": [
            "How does the system show subscription status?",
            "subscription status",
            "expiry"
        ],
        "answer_en": "Subscription status is shown with colored badges: Green 'Active' (more than 7 days remaining), Yellow 'Expiring Soon' (7 days or less), Red 'Expired' (past end date). Daily subscriptions expire at the end of the day. The badge also shows remaining days for active subscriptions.",
        "keywords_en": [
            "status",
            "badge",
            "expired",
            "days left",
            "warning",
            "active",
            "expiring"
        ],
        "question_ar": [
            "كيف يعرض النظام حالة الاشتراك؟",
            "حالة الاشتراك",
            "تاريخ الانتهاء"
        ],
        "answer_ar": "حالة الاشتراك تُعرض بشارات ملونة: أخضر 'نشط' (أكثر من 7 أيام متبقية)، أصفر 'ينتهي قريباً' (7 أيام أو أقل)، أحمر 'منتهي' (بعد تاريخ الانتهاء). الاشتراكات اليومية تنتهي في نهاية اليوم. الشارة تعرض أيضاً الأيام المتبقية للاشتراكات النشطة.",
        "keywords_ar": [
            "الحالة",
            "انتهى",
            "ايام متبقية",
            "ينتهي قريب",
            "خلص",
            "منتهي",
            "شغال",
            "نشط",
            "باقي كام يوم",
            "فاضل كام",
            "تاريخ الانتهاء",
            "شارة",
            "لون"
        ]
    },
    {
        "id": "goods-tracking",
        "question_en": [
            "How do I record goods sales?",
            "track profit",
            "goods",
            "inventory"
        ],
        "answer_en": "To record goods: 1) Go to the Goods section, 2) Fill in: Item Name, Selling Price, Cost Price, Quantity, Date (auto-filled with today), and optional Notes, 3) Click 'Add Good'. The system automatically calculates profit as (Selling Price - Cost) × Quantity. You can view, edit, or delete goods in the table below. Goods profit is included in the monthly profit calculation.",
        "keywords_en": [
            "goods",
            "inventory",
            "sell product",
            "profit",
            "item",
            "products",
            "sales",
            "add goods"
        ],
        "question_ar": [
            "كيف أسجل مبيعات البضائع؟",
            "تتبع الأرباح",
            "مبيعات"
        ],
        "answer_ar": "لتسجيل البضائع: 1) اذهب إلى قسم البضائع، 2) املأ: اسم المنتج، سعر البيع، سعر التكلفة، الكمية، التاريخ (يُملأ تلقائياً باليوم)، وملاحظات اختيارية، 3) اضغط 'إضافة بضاعة'. النظام يحسب الربح تلقائياً كـ (سعر البيع - التكلفة) × الكمية. يمكنك عرض أو تعديل أو حذف البضائع في الجدول أدناه. ربح البضائع يُضاف إلى حساب الربح الشهري.",
        "keywords_ar": [
            "بضاعة",
            "مبيعات",
            "مخزون",
            "ربح",
            "سجل بيع",
            "منتجات",
            "سلع",
            "بيع",
            "شراء",
            "اضافة سلعة",
            "تسجيل بضاعة",
            "المبيعات",
            "اضافة بضاعة"
        ]
    },
    {
        "id": "expenses-tracking",
        "question_en": [
            "How are expenses logged?",
            "record spending",
            "expenses"
        ],
        "answer_en": "To log expenses: 1) Go to the Expenses section, 2) Fill in: Expense Name (e.g., Rent, Electricity, Water, Equipment), Amount, Date (auto-filled), and optional Notes, 3) Click 'Add Expense'. Expenses are stored and can be edited or deleted from the table. Total expenses are subtracted from revenue in the monthly profit calculation.",
        "keywords_en": [
            "expense",
            "cost",
            "spending",
            "save",
            "bills",
            "rent",
            "add expense"
        ],
        "question_ar": [
            "كيف يتم تسجيل المصروفات؟",
            "تسجيل مصروف",
            "تكلفة"
        ],
        "answer_ar": "لتسجيل المصروفات: 1) اذهب إلى قسم المصروفات، 2) املأ: اسم المصروف (مثل: إيجار، كهرباء، مياه، معدات)، المبلغ، التاريخ (يُملأ تلقائياً)، وملاحظات اختيارية، 3) اضغط 'إضافة مصروف'. المصروفات تُخزن ويمكن تعديلها أو حذفها من الجدول. إجمالي المصروفات يُطرح من الإيرادات في حساب الربح الشهري.",
        "keywords_ar": [
            "مصروف",
            "تكلفة",
            "سجل مصروف",
            "صرف",
            "مصاريف",
            "انفاق",
            "فلوس خرجت",
            "اضافة مصروف",
            "تسجيل مصروفات",
            "فواتير",
            "ايجار"
        ]
    },
    {
        "id": "profit-system",
        "question_en": [
            "How does the system handle profit calculation?",
            "profit tracking",
            "how profits work"
        ],
        "answer_en": "The system calculates profits automatically: Monthly Profit = (Total Subscriptions Income + Goods Profit) - Total Expenses. Subscriptions income is the sum of all subscription prices for that month. Goods profit is calculated as (Selling Price - Cost) × Quantity for each item. Expenses are subtracted from the total. The system tracks profits by system type (Men/Women/Mix). You can view detailed charts, KPIs, and monthly breakdowns in the Reports tab. Profits accumulate month by month and are displayed in the Dashboard and Reports.",
        "keywords_en": [
            "profit",
            "calculation",
            "how it works",
            "profit system",
            "revenue",
            "income",
            "tracking"
        ],
        "question_ar": [
            "كيف يتعامل النظام مع حساب الأرباح؟",
            "تتبع الأرباح",
            "كيف تعمل الأرباح"
        ],
        "answer_ar": "النظام يحسب الأرباح تلقائياً: الربح الشهري = (إجمالي إيرادات الاشتراكات + ربح البضائع) - إجمالي المصروفات. إيرادات الاشتراكات هي مجموع أسعار جميع الاشتراكات لذلك الشهر. ربح البضائع يُحسب كـ (سعر البيع - التكلفة) × الكمية لكل منتج. المصروفات تُطرح من الإجمالي. يمكنك عرض رسوم بيانية شهرية ملونة ومؤشرات الأداء (KPI) في تبويب التقارير، بما في ذلك هامش الربح ومعدل الاحتفاظ. الأرباح تتراكم شهراً بعد شهر وتُعرض في لوحة التحكم والتقارير.",
        "keywords_ar": [
            "ربح",
            "حساب",
            "كيف يعمل",
            "نظام الربح",
            "ايرادات",
            "دخل",
            "تتبع",
            "الارباح",
            "حساب الارباح"
        ]
    },
    {
        "id": "month-end",
        "question_en": [
            "What happens at the end of each month?",
            "month end process",
            "monthly cycle"
        ],
        "answer_en": "The system does NOT automatically reset at month end. All data (subscribers, goods, expenses) continues to accumulate. The Dashboard shows monthly breakdowns automatically based on the dates of entries. At the end of each month, you should: 1) Review the monthly report in the Dashboard, 2) Check for expired subscriptions and renew them, 3) Optionally create a backup before starting a new month. The system will continue tracking all data across months and years.",
        "keywords_en": [
            "month end",
            "end of month",
            "monthly",
            "what happens",
            "reset",
            "new month"
        ],
        "question_ar": [
            "ماذا يحدث عند نهاية كل شهر؟",
            "عملية نهاية الشهر",
            "الدورة الشهرية"
        ],
        "answer_ar": "النظام لا يُعيد التعيين تلقائياً عند نهاية الشهر. جميع البيانات (المشتركين، البضائع، المصروفات) تستمر في التراكم. لوحة التحكم تعرض التفاصيل الشهرية تلقائياً بناءً على تواريخ الإدخالات. في نهاية كل شهر، يجب عليك: 1) مراجعة التقرير الشهري في لوحة التحكم، 2) التحقق من الاشتراكات المنتهية وتجديدها، 3) اختيارياً إنشاء نسخة احتياطية قبل بدء شهر جديد. النظام سيستمر في تتبع جميع البيانات عبر الأشهر والسنوات.",
        "keywords_ar": [
            "نهاية الشهر",
            "اخر الشهر",
            "شهري",
            "ماذا يحدث",
            "اعادة تعيين",
            "شهر جديد",
            "نهاية شهر"
        ]
    },
    {
        "id": "backup-recommendations",
        "question_en": [
            "When should I create backups?",
            "backup frequency",
            "how often backup"
        ],
        "answer_en": "Recommended backup schedule: 1) Weekly for active gyms, 2) Monthly at month-end, 3) Before major changes, 4) Before starting a new year. To backup: Login as Admin → Settings tab → Data Management → click '📥 Export Backup' to save a JSON file. Store safely. Restore via '📤 Import Backup'.",
        "keywords_en": [
            "backup",
            "when",
            "how often",
            "frequency",
            "schedule",
            "recommendations",
            "best practices"
        ],
        "question_ar": [
            "متى يجب أن أنشئ نسخ احتياطية؟",
            "تكرار النسخ الاحتياطي",
            "كم مرة نسخ احتياطي"
        ],
        "answer_ar": "جدول النسخ الاحتياطي الموصى به: 1) نسخ احتياطية أسبوعية للصالات النشطة ذات التغييرات اليومية، 2) نسخ احتياطية شهرية في نهاية الشهر قبل مراجعة التقارير، 3) قبل إجراء تغييرات كبيرة (حذف بيانات، تغيير كلمات مرور كثيرة)، 4) قبل بدء سنة جديدة. للنسخ الاحتياطي: سجل دخول كمدير، اذهب لتبويب 'الإعدادات' → قسم 'إدارة البيانات' → اضغط '📥 تحميل نسخة احتياطية' لحفظ ملف JSON. احفظ النسخ في مكان آمن. يمكنك الاستعادة بالضغط على '📤 استعادة نسخة احتياطية' واختيار الملف.",
        "keywords_ar": [
            "نسخ احتياطي",
            "متى",
            "كم مرة",
            "تكرار",
            "جدول",
            "توصيات",
            "افضل الممارسات",
            "باك اب"
        ]
    },
    {
        "id": "fresh-start",
        "question_en": [
            "When should I start fresh?",
            "clear all data",
            "new year reset"
        ],
        "answer_en": "Consider starting fresh (clearing all data) when: 1) Starting a new calendar year (after creating a year-end backup), 2) The system becomes too slow due to thousands of entries, 3) You want to reorganize your gym management approach. Before clearing: ALWAYS create a backup first! To clear: Login as Admin → Settings tab → Danger Zone ⚠️ → click '🗑️ Reset System' and confirm. This deletes all subscribers, goods, expenses, and resets profits. Only do this when you're certain and have a backup.",
        "keywords_en": [
            "fresh start",
            "clear data",
            "reset",
            "new year",
            "delete all",
            "start over"
        ],
        "question_ar": [
            "متى يجب أن أبدأ من جديد؟",
            "مسح كل البيانات",
            "إعادة تعيين سنة جديدة"
        ],
        "answer_ar": "فكر في البدء من جديد (مسح كل البيانات) عندما: 1) تبدأ سنة ميلادية جديدة (بعد إنشاء نسخة احتياطية لنهاية العام)، 2) يصبح النظام بطيئاً جداً بسبب آلاف الإدخالات، 3) تريد إعادة تنظيم نهج إدارة الصالة. قبل المسح: أنشئ نسخة احتياطية دائماً أولاً! للمسح: سجل دخول كمدير → تبويب 'الإعدادات' → قسم 'منطقة الخطر' ⚠️ → اضغط '🗑️ مسح جميع البيانات' وأكّد الإجراء. هذا يحذف جميع المشتركين والبضائع والمصروفات ويعيد تعيين الأرباح. افعل هذا فقط عندما تكون متأكداً ولديك نسخة احتياطية.",
        "keywords_ar": [
            "بداية جديدة",
            "مسح البيانات",
            "اعادة تعيين",
            "سنة جديدة",
            "حذف الكل",
            "ابدأ من جديد",
            "مسح كل شيء"
        ]
    },
    {
        "id": "reports-dashboard",
        "question_en": [
            "What financial reports are available?",
            "dashboard",
            "monthly report",
            "annual report"
        ],
        "answer_en": "The Dashboard shows: 1) stat cards for total subscribers, active, expired, today's attendance, monthly revenue and expenses. 2) The Reports tab shows 4 annual summary cards + color-coded monthly bar chart + KPIs (retention rate, profit margin) + peak hours chart. Green numbers = profit, red = loss. Switch between Monthly and KPIs views and export CSV anytime.",
        "keywords_en": [
            "report",
            "monthly",
            "annual",
            "dashboard",
            "profit",
            "financial",
            "reports"
        ],
        "question_ar": [
            "ما هي التقارير المالية المتاحة؟",
            "لوحة التحكم",
            "تقرير شهري"
        ],
        "answer_ar": "لوحة التحكم تعرض: 1) بطاقات إحصائية بإجمالي المشتركين والنشطين والمنتهين وحضور اليوم والإيرادات والمصروفات الشهرية، 2) تبويب التقارير يعرض 4 بطاقات ملخص سنوي + رسم بياني شهري ملوّن + مؤشرات أداء KPI (معدل الاحتفاظ، هامش الربح) + مخطط ساعات الذروة. الأرقام الخضراء تشير للربح والحمراء للخسارة. يمكنك التبديل بين عرض شهري وعرض مؤشرات الأداء وتصدير CSV.",
        "keywords_ar": [
            "تقرير",
            "شهري",
            "سنوي",
            "لوحة",
            "صافي",
            "ارباح",
            "خسائر",
            "مكسب",
            "الداشبورد",
            "التقارير",
            "الاحصائيات",
            "احصائيات",
            "مالي"
        ]
    },
    {
        "id": "backup-restore",
        "question_en": [
            "How do I backup or restore my data?",
            "download backup",
            "import backup"
        ],
        "answer_en": "To Backup: 1) Login as Admin, 2) Click 'Download Backup' button, 3) A JSON file downloads with all your data, 4) Save it safely. To Restore: 1) Login as Admin, 2) Click 'Import Backup', 3) Select your JSON backup file, 4) Confirm to restore. WARNING: Restoring replaces ALL current data with the backup data. To Clear All Data: Admin can click 'Clear All Data' to delete everything (requires confirmation).",
        "keywords_en": [
            "backup",
            "download",
            "import",
            "restore",
            "json file",
            "clear data",
            "restore data",
            "export"
        ],
        "question_ar": [
            "كيف أنسخ البيانات أو أستعيدها؟",
            "نسخة احتياطية",
            "استعادة البيانات"
        ],
        "answer_ar": "للنسخ الاحتياطي: 1) سجل دخول كمدير، 2) اضغط زر 'تنزيل النسخة الاحتياطية'، 3) سيتم تنزيل ملف JSON بكل بياناتك، 4) احفظه بأمان. للاستعادة: 1) سجل دخول كمدير، 2) اضغط 'استيراد النسخة الاحتياطية'، 3) اختر ملف النسخة الاحتياطية JSON، 4) أكد للاستعادة. تحذير: الاستعادة تستبدل كل البيانات الحالية ببيانات النسخة الاحتياطية. لمسح كل البيانات: المدير يمكنه الضغط على 'مسح كل البيانات' لحذف كل شيء (يتطلب تأكيد).",
        "keywords_ar": [
            "نسخة احتياطية",
            "استيراد",
            "تصدير",
            "باك اب",
            "اعادة بيانات",
            "حفظ البيانات",
            "نسخ",
            "استرجاع",
            "ملف",
            "تحميل نسخة",
            "رفع نسخة",
            "استعادة"
        ]
    },
    {
        "id": "system-features",
        "question_en": [
            "What are the system features?",
            "system features?"
        ],
        "answer_en": "The Professional Gym Management System features: 1) Subscriber Management — add, edit, delete members with daily/monthly subscriptions, status tracking, and QR attendance, 2) Staff Management — real accounts with roles (Admin, Trainer, Accountant, Reception) and granular permissions via Toggle Switches, 3) Financial Reports — color-coded monthly bar charts, KPIs (retention rate, profit margin), and CSV export, 4) Payments — installments tracking, pending payments, and printable professional receipts, 5) Daily Attendance — real-time stats with search and CSV export, 6) Group Classes — card and schedule views with trainer and time, 7) Smart Chatbot — understands questions in any format in Arabic and English, 8) Secure MongoDB database with bcrypt-encrypted passwords, 9) Backup & Restore, 10) Loyalty points, Measurements, and Equipment management, 11) Bilingual Glassmorphism UI design",
        "keywords_en": [
            "system features",
            "sys features",
            "advantage",
            "specifications",
            "Features",
            "features",
            "what can it do"
        ],
        "question_ar": [
            "ما هي مميزات النظام؟",
            "ايه مميزات السيستم؟"
        ],
        "answer_ar": "مميزات نظام إدارة الجيم الاحترافي: 1) إدارة المشتركين — إضافة وتعديل وحذف الأعضاء مع اشتراكات يومية/شهرية وتتبع الحالة وتسجيل الحضور بالباركود، 2) إدارة الموظفين — حسابات حقيقية بأدوار مختلفة (مدير، مدرب، محاسب، استقبال) وصلاحيات مفصّلة بالـ Toggle Switches، 3) تقارير مالية — رسوم بيانية شهرية ملونة ومؤشرات أداء KPI وتصدير CSV، 4) المدفوعات — أقساط وتتبع المعلق ووصلات دفع قابلة للطباعة، 5) الحضور اليومي — إحصائيات فورية مع بحث وتصدير، 6) الحصص الجماعية — بطاقات وجدول يومي مع المدرب والوقت، 7) شات بوت ذكي — يفهم الأسئلة بأي صياغة بالعربي والإنجليزي، 8) قاعدة بيانات MongoDB آمنة مع تشفير bcrypt لكلمات المرور، 9) نسخ احتياطي واستعادة، 10) الولاء والقياسات وإدارة المعدات، 11) واجهة ثنائية اللغة بتصميم Glassmorphism عصري",
        "keywords_ar": [
            "مميزات النظام",
            "مميزات",
            "مميزات السيستم",
            "المميزات الاساسيه",
            "المميزات",
            "خصائص",
            "امكانيات",
            "بيعمل ايه",
            "فايدة النظام",
            "ايه الحلو فيه",
            "ماذا يفعل"
        ]
    },
    {
        "id": "chatbot-help",
        "question_en": [
            "How does the chatbot assist me?",
            "chatbot help",
            "bot assistance"
        ],
        "answer_en": "The chatbot (me!) helps you by: 1) Answering common questions about the system, 2) Providing step-by-step instructions, 3) Explaining features and how they work, 4) Offering suggested questions for quick access. Click the chat button (bottom left) to open me. You can type any question or click suggested questions. I understand both English and Arabic!",
        "keywords_en": [
            "chatbot",
            "bot",
            "assistant",
            "help",
            "guide",
            "how to use chatbot"
        ],
        "question_ar": [
            "كيف يساعدني الشات بوت؟",
            "دليل الجيم",
            "مساعد"
        ],
        "answer_ar": "الشات بوت (أنا!) يساعدك من خلال: 1) الإجابة على الأسئلة الشائعة حول النظام، 2) توفير تعليمات خطوة بخطوة، 3) شرح الميزات وكيفية عملها، 4) تقديم أسئلة مقترحة للوصول السريع. اضغط على زر الدردشة (أسفل اليسار) لفتحي. يمكنك كتابة أي سؤال أو الضغط على الأسئلة المقترحة. أفهم العربية والإنجليزية!",
        "keywords_ar": [
            "شات",
            "بوت",
            "دليل",
            "مساعد",
            "جيم بوت",
            "الالي",
            "الروبوت",
            "مساعدة",
            "اسئلة",
            "استفسار",
            "كيف استخدم الشات بوت"
        ]
    },
    {
        "id": "greeting",
        "question_en": [
            "Hi",
            "hi",
            "how are you",
            "hey",
            "hello",
            "salam",
            "hiya",
            "yo",
            "good morning",
            "good afternoon",
            "good evening",
            "greetings",
            "what's up",
            "how's it going",
            "how do you do"
        ],
        "answer_en": "Hi! I'm your Gym Assistant Bot! 👋 How can I help you today? You can ask me questions like 'How to add a subscriber?' or 'How does profit calculation work?' or choose from the suggested questions above.",
        "keywords_en": [
            "hi",
            "hello",
            "hey",
            "salam",
            "hiya",
            "yo",
            "good morning",
            "greetings"
        ],
        "question_ar": [
            "كيف حالك؟",
            "مرحبا",
            "اهلا",
            "يا هلا",
            "السلام عليكم",
            "هاي",
            "صباح الخير",
            "مساء الخير",
            "اهلاً",
            "ازيك",
            "ازيك عامل ايه",
            "ازيكوا عاملين ايه",
            "يا هلا",
            "يا مرحبا",
            "يا اهلا",
            "يا سلام",
            "يا هاي",
            "يا صباح الخير",
            "يا مساء الخير",
            "يا اهلاً"
        ],
        "answer_ar": "مرحباً! أنا مساعدك في إدارة الجيم! 👋 كيف يمكنني مساعدتك اليوم؟ يمكنك طرح أسئلة مثل 'كيف أضيف مشترك؟' أو 'كيف يعمل حساب الأرباح؟' أو اختيار من الأسئلة المقترحة بالأعلى.",
        "keywords_ar": [
            "مرحبا",
            "اهلا",
            "اهلاً",
            "السلام عليكم",
            "هاي",
            "يا هلا",
            "هاي",
            "صباح الخير",
            "مساء الخير",
            "كيف حالك",
            "ازيك",
            "عامل ايه",
            "اخبارك",
            "منور",
            "هلا",
            "سلام"
        ]
    },
    {
        "id": "search-details",
        "question_en": [
            "Does search by name include phone numbers?",
            "search by phone",
            "find by number"
        ],
        "answer_en": "Yes! The 'Search by Name' feature allows you to find subscribers using their Name, Phone Number, or Category. Just start typing in the search box and results will filter instantly. It's very flexible!",
        "keywords_en": [
            "search",
            "phone",
            "number",
            "find",
            "search phone"
        ],
        "question_ar": [
            "هل البحث بالاسم يشمل رقم الهاتف؟",
            "بحث برقم التليفون",
            "البحث بالرقم"
        ],
        "answer_ar": "نعم! خاصية 'البحث بالاسم' تتيح لك العثور على المشتركين باستخدام الاسم أو رقم الهاتف أو الفئة. فقط ابدأ الكتابة في مربع البحث وستُفلتر النتائج فوراً. إنها مرنة جداً!",
        "keywords_ar": [
            "بحث",
            "هاتف",
            "رقم",
            "تليفون",
            "موبايل",
            "نمرة",
            "ابحث برقم",
            "اجيب رقم",
            "بحث بالهاتف"
        ]
    },
    {
        "id": "subscription-durations",
        "question_en": [
            "What subscription periods are available?",
            "durations",
            "plans"
        ],
        "answer_en": "The system supports flexible subscription periods: Daily (1 day), Weekly (7 days), Half Month (15 days), and Monthly (1 to 12 months). Choose the period that fits your member's needs when adding or renewing a subscription.",
        "keywords_en": [
            "duration",
            "period",
            "plan",
            "month",
            "week",
            "day",
            "subscription types"
        ],
        "question_ar": [
            "ما هي مدد الاشتراك المتاحة؟",
            "انواع الاشتراكات",
            "المدد"
        ],
        "answer_ar": "النظام يدعم مدد اشتراك مرنة: يومي (يوم واحد)، أسبوعي (7 أيام)، نصف شهر (15 يوم)، وشهري (من شهر واحد حتى 12 شهر). اختر المدة التي تناسب احتياجات عضوك عند إضافة أو تجديد اشتراك.",
        "keywords_ar": [
            "مدة",
            "اشتراك",
            "يومي",
            "شهري",
            "اسبوعي",
            "نصف شهر",
            "شهر",
            "سنة",
            "نص شهر",
            "يوم",
            "اسبوع",
            "باقات",
            "انظمة",
            "انواع الاشتراك"
        ]
    },
    {
        "id": "profit-calculation",
        "question_en": [
            "How is the monthly profit calculated?",
            "calculate profit",
            "net profit"
        ],
        "answer_en": "Monthly Profit Formula: Net Profit = (Total Subscriptions Income + Goods Profit) - Total Expenses. Where: Subscriptions Income = sum of all subscription prices that month, Goods Profit = (Selling Price - Cost) × Quantity for each item, Expenses = sum of all expenses that month. The system calculates this automatically and displays it in the Dashboard.",
        "keywords_en": [
            "profit",
            "calculate",
            "formula",
            "net",
            "income",
            "profit formula"
        ],
        "question_ar": [
            "كيف يتم حساب الربح الشهري؟",
            "حساب الارباح",
            "صافي الربح"
        ],
        "answer_ar": "معادلة الربح الشهري: صافي الربح = (إجمالي إيرادات الاشتراكات + ربح البضائع) - إجمالي المصروفات. حيث: إيرادات الاشتراكات = مجموع أسعار جميع الاشتراكات لذلك الشهر، ربح البضائع = (سعر البيع - التكلفة) × الكمية لكل منتج، المصروفات = مجموع كل المصروفات لذلك الشهر. النظام يحسب هذا تلقائياً ويعرضه في لوحة التحكم.",
        "keywords_ar": [
            "ربح",
            "حساب",
            "صافي",
            "ارباح",
            "معادلة",
            "بيحسب ازاي",
            "المكسب",
            "صافي الدخل",
            "حسبة",
            "معادلة الربح"
        ]
    },
    {
        "id": "data-security",
        "question_en": [
            "Where is my data stored?",
            "is it secure?",
            "offline",
            "internet"
        ],
        "answer_en": "Your data is stored in a **MongoDB database**. Benefits: 1) Secure and encrypted on the server, 2) Passwords are bcrypt-hashed and never stored in plain text, 3) Manual backup from Settings, 4) Data persists even after closing the browser. Remember to create regular backups!",
        "keywords_en": [
            "storage",
            "secure",
            "offline",
            "internet",
            "data",
            "server",
            "privacy",
            "safe",
            "mongodb",
            "database"
        ],
        "question_ar": [
            "أين يتم تخزين بياناتي؟",
            "هل النظام آمن؟",
            "بدون نت",
            "انترنت"
        ],
        "answer_ar": "بياناتك مخزنة في **قاعدة بيانات MongoDB**. المزايا: 1) آمنة ومشفرة على السيرفر، 2) كلمات المرور مشفرة بـ bcrypt ولا تُخزن بشكل واضح، 3) نسخ احتياطي يدوي من الإعدادات، 4) لا تُمسح البيانات عند إغلاق المتصفح. احرص على إنشاء نسخ احتياطية منتظمة!",
        "keywords_ar": [
            "تخزين",
            "امان",
            "نت",
            "انترنت",
            "اوفلاين",
            "محلي",
            "سيرفر",
            "كلاود",
            "بياناتي",
            "خصوصية",
            "آمن",
            "mongodb"
        ]
    },
    {
        "id": "admin-privileges",
        "question_en": [
            "What can the Admin do?",
            "admin features",
            "manager role"
        ],
        "answer_en": "Admin has full control: 1) View and edit all data (subscribers, payments, reports), 2) Manage staff and their permissions with Toggle Switches, 3) Change any staff member's password, 4) Download/import backups, 5) Clear all data, 6) Access Settings and full Reports. Admin is the only role that can access the Settings tab.",
        "keywords_en": [
            "admin",
            "manager",
            "privileges",
            "role",
            "access",
            "admin powers",
            "what admin can do",
            "full access"
        ],
        "question_ar": [
            "ما هي صلاحيات المدير؟",
            "خصائص الادمن",
            "دور المدير"
        ],
        "answer_ar": "المدير (admin) لديه تحكم كامل: 1) عرض وتعديل كل البيانات (مشتركين، مدفوعات، تقارير)، 2) إدارة الموظفين وتحديد صلاحياتهم بالـ Toggle Switches، 3) تغيير كلمات مرور أي موظف، 4) تنزيل/استيراد النسخ الاحتياطية، 5) مسح كل البيانات، 6) الوصول لتبويب الإعدادات والتقارير الكاملة. المدير هو الوحيد الذي يمكنه الوصول لتبويب \"الإعدادات\".",
        "keywords_ar": [
            "مدير",
            "ادمن",
            "صلاحيات",
            "خصائص",
            "تحكم",
            "المدير",
            "يعمل ايه",
            "صلاحية",
            "قدرات المدير"
        ]
    },
    {
        "id": "switch-user",
        "question_en": [
            "How do I switch between Men/Women/Admin modes?",
            "change user",
            "logout"
        ],
        "answer_en": "To switch between accounts: click the \"Sign Out\" / \"خروج\" button at the top of the screen. You'll be logged out and returned to the login screen. Enter the email and password for the other account. The system will detect the role automatically.",
        "keywords_en": [
            "switch",
            "change user",
            "logout",
            "login",
            "switch mode",
            "sign out",
            "log out"
        ],
        "question_ar": [
            "كيف أبدل بين المستخدمين؟",
            "تغيير المستخدم",
            "تسجيل خروج"
        ],
        "answer_ar": "للتبديل بين حسابات مختلفة: اضغط على زر \"خروج\" في الأعلى (يمين أو يسار الشاشة). سيتم تسجيل خروجك والعودة لشاشة الدخول. أدخل البريد الإلكتروني وكلمة المرور للحساب الآخر. النظام يكتشف الدور تلقائياً.",
        "keywords_ar": [
            "تبديل",
            "تغيير",
            "خروج",
            "دخول",
            "مستخدم",
            "اغير الحساب",
            "اخرج",
            "ادخل تاني",
            "تبديل وضع",
            "لوق اوت",
            "سيغن اوت"
        ]
    },
    {
        "id": "gender-restrictions",
        "question_en": [
            "Can Men mode see Women's data?",
            "privacy",
            "access control"
        ],
        "answer_en": "No. Data is completely separated: Men mode ONLY sees male subscribers, goods, and expenses. Women mode ONLY sees female subscribers, goods, and expenses. Only Admin mode can see both. This ensures privacy and data separation between the two sections.",
        "keywords_en": [
            "privacy",
            "gender",
            "access",
            "see",
            "view",
            "data separation"
        ],
        "question_ar": [
            "هل يمكن لوضع الرجال رؤية بيانات النساء؟",
            "الخصوصية",
            "اطلاع"
        ],
        "answer_ar": "لا. البيانات منفصلة تماماً: وضع الرجال يرى فقط المشتركين والبضائع والمصروفات الخاصة بالرجال. وضع النساء يرى فقط المشتركين والبضائع والمصروفات الخاصة بالنساء. وضع المدير فقط يمكنه رؤية الاثنين. هذا يضمن الخصوصية والفصل بين القسمين.",
        "keywords_ar": [
            "خصوصية",
            "رجال",
            "نساء",
            "رؤية",
            "بيانات",
            "يشوف",
            "ممنوع",
            "اطلاع",
            "حد يشوف",
            "فصل البيانات"
        ]
    },
    {
        "id": "renew-subscription",
        "question_en": [
            "How do I renew a subscription?",
            "renew",
            "extend"
        ],
        "answer_en": "A 'Renew' button automatically appears for: 1) Expired subscriptions (red status), 2) Subscriptions expiring within 7 days (yellow status). Exception: Daily subscriptions don't show a renew button. Click the 'Renew' button, choose the new duration, and the subscription will be extended from the current end date.",
        "keywords_en": [
            "renew",
            "extend",
            "expire",
            "renewal",
            "extend subscription"
        ],
        "question_ar": [
            "كيف أجدد الاشتراك؟",
            "تجديد",
            "تمديد"
        ],
        "answer_ar": "زر 'تجديد' يظهر تلقائياً لـ: 1) الاشتراكات المنتهية (حالة حمراء)، 2) الاشتراكات التي ستنتهي خلال 7 أيام (حالة صفراء). استثناء: الاشتراكات اليومية لا تظهر زر تجديد. اضغط على زر 'تجديد'، اختر المدة الجديدة، وسيتم تمديد الاشتراك من تاريخ الانتهاء الحالي.",
        "keywords_ar": [
            "تجديد",
            "تمديد",
            "انتهاء",
            "اجدد",
            "امد",
            "شهر كمان",
            "تجديد اشتراك",
            "تمديد اشتراك"
        ]
    },
    {
        "id": "extend-subscription",
        "question_en": [
            "How do I extend a subscriber's subscription?",
            "extend subscription",
            "add months"
        ],
        "answer_en": "IMPORTANT: You can only extend ACTIVE (non-expired) subscriptions. To extend: 1) Find the subscriber in the table, 2) Click 'Edit' button, 3) Change the 'Months' field to the NEW TOTAL duration. Example: If a subscriber has 1 month and you want to add 2 more months, change the field to 3 months (not 2). The system will recalculate the end date as 3 months from the original start date. 4) Click 'Save Edit'. NOTE: If the subscription is expired (red status), you cannot edit it - you must either Delete it or use the Renew button.",
        "keywords_en": [
            "extend",
            "add months",
            "increase duration",
            "prolong",
            "extension",
            "add time"
        ],
        "question_ar": [
            "كيفية تمديد الاشتراك لمشترك؟",
            "تمديد اشتراك",
            "إضافة أشهر"
        ],
        "answer_ar": "مهم: يمكنك فقط تمديد الاشتراكات النشطة (غير المنتهية). للتمديد: 1) ابحث عن المشترك في الجدول، 2) اضغط على زر 'تعديل'، 3) غيّر حقل 'الأشهر' إلى المدة الإجمالية الجديدة. مثال: إذا كان المشترك لديه شهر واحد وتريد إضافة شهرين، غيّر الحقل إلى 3 أشهر (وليس 2). النظام سيعيد حساب تاريخ الانتهاء كـ 3 أشهر من تاريخ البدء الأصلي. 4) اضغط 'حفظ التعديل'. ملاحظة: إذا كان الاشتراك منتهي (حالة حمراء)، لا يمكنك تعديله - يجب إما حذفه أو استخدام زر التجديد.",
        "keywords_ar": [
            "تمديد",
            "إضافة أشهر",
            "زيادة المدة",
            "إطالة",
            "مد الاشتراك",
            "زود شهور",
            "اضيف شهور",
            "امد الاشتراك"
        ]
    },
    {
        "id": "renew-expired-subscription",
        "question_en": [
            "How do I renew a subscriber's subscription after it expires?",
            "renew expired",
            "subscription renewal"
        ],
        "answer_en": "To renew an expired subscription: 1) Find the expired subscriber (red 'Expired' status), 2) Click the 'Renew' button, 3) A dialog will appear with a dropdown menu to select the renewal duration. You can choose from: Day, Weekly (7 days), Half Month (15 days), or 1-12 Months. The default selection is 1 Month. 4) Select your desired duration from the dropdown, 5) Click 'Renew' to confirm. The subscription will start from today with the selected duration. NOTE: The Renew button now works for ALL expired subscriptions, including daily subscriptions!",
        "keywords_en": [
            "renew",
            "expired",
            "after expiry",
            "renewal",
            "restart subscription",
            "reactivate"
        ],
        "question_ar": [
            "ازاي اجدد اشتراك لمشترك بعد انتهاء اشتراكه؟",
            "تجديد منتهي",
            "تجديد اشتراك منتهي"
        ],
        "answer_ar": "لتجديد اشتراك منتهي: 1) ابحث عن المشترك المنتهي (حالة 'منتهي' حمراء)، 2) اضغط على زر 'تجديد'، 3) ستظهر نافذة تحتوي على قائمة منسدلة لاختيار مدة التجديد. يمكنك الاختيار من: يوم، أسبوعي (7 أيام)، نصف شهر (15 يوم)، أو من 1-12 شهر. الاختيار الافتراضي هو شهر واحد. 4) اختر المدة المطلوبة من القائمة، 5) اضغط 'تجديد' للتأكيد. سيبدأ الاشتراك من اليوم بالمدة المختارة. ملاحظة: زر التجديد يعمل الآن مع جميع الاشتراكات المنتهية، بما فيها الاشتراكات اليومية!",
        "keywords_ar": [
            "تجديد",
            "منتهي",
            "بعد الانتهاء",
            "اجدد اشتراك",
            "اعيد تفعيل",
            "تنشيط من جديد",
            "جدد اشتراك خلص",
            "اشتراك انتهى"
        ]
    },
    {
        "id": "developer-info",
        "question_en": [
            "Who developed this system?",
            "system developer",
            "who made this",
            "creator"
        ],
        "answer_en": "This Gym Management System was developed by Engineer Mostafa Elasloty. The system is designed to provide comprehensive gym management with features including subscriber tracking, financial reporting, goods and expenses management, and an intelligent chatbot assistant. For support or inquiries, please contact: <a href='mailto:engmostafaelasloty@gmail.com' style='color: #4fc3f7; text-decoration: underline;'>engmostafaelasloty@gmail.com</a>",
        "keywords_en": [
            "developer",
            "creator",
            "who made",
            "mostafa",
            "elasloty",
            "engineer",
            "programmer",
            "built by"
        ],
        "question_ar": [
            "مين مبرمج النظام؟",
            "من صمم النظام؟",
            "مين عمل السيستم؟"
        ],
        "answer_ar": "تم تطوير نظام إدارة الجيم هذا بواسطة المهندس مصطفى العسلوتي (Mostafa Elasloty). النظام مصمم لتوفير إدارة شاملة للصالات الرياضية مع ميزات تشمل تتبع المشتركين، التقارير المالية، إدارة البضائع والمصروفات، ومساعد شات بوت ذكي. للدعم أو الاستفسارات، يرجى التواصل على: <a href='mailto:engmostafaelasloty@gmail.com' style='color: #4fc3f7; text-decoration: underline;'>engmostafaelasloty@gmail.com</a>",
        "keywords_ar": [
            "مبرمج",
            "مطور",
            "مصمم",
            "مصطفى",
            "العسلوتي",
            "مهندس",
            "عمل النظام",
            "صانع",
            "من عمل",
            "مين عمل"
        ]
    },
    {
        "id": "mix-mode-info",
        "question_en": [
            "What is Mix Gym Mode?",
            "mixed mode",
            "mix111"
        ],
        "answer_en": "When logging in, you choose the system type: Men only, Women only, or Mixed. In \"Mixed\" mode you can add subscribers of both genders and view all their data together. The mode is set at the login screen when selecting the system type.",
        "keywords_en": [
            "mix",
            "mixed",
            "both genders",
            "men and women",
            "system type"
        ],
        "question_ar": [
            "ما هو وضع الجيم المختلط؟",
            "الوضع المكس",
            "mix111"
        ],
        "answer_ar": "عند تسجيل الدخول، تختار نوع النظام: رجال فقط، نساء فقط، أو مختلط. في وضع \"مختلط\" يمكن إضافة مشتركين من الجنسين وعرض بياناتهم معاً. الوضع يُحدَّد عند اختيار نوع النظام في شاشة تسجيل الدخول.",
        "keywords_ar": [
            "مكس",
            "مختلط",
            "رجال ونساء",
            "الجنسين",
            "نوع النظام"
        ]
    },
    {
        "id": "attendance-qr",
        "question_en": [
            "How do I use QR codes for attendance?",
            "qr scan",
            "check-in"
        ],
        "answer_en": "Every subscriber has a unique QR code generated automatically. You can scan it using a barcode scanner or manually click 'Check-in' in the Subscribers table. If a subscriber has remaining sessions or an active time-based plan, the visit will be recorded, and they will receive loyalty points. You can view today's attendance in the 'Attendance' tab.",
        "keywords_en": [
            "qr",
            "barcode",
            "check-in",
            "attendance",
            "scan"
        ],
        "question_ar": [
            "كيف أستخدم كود QR للحضور؟",
            "مسح الكود",
            "تسجيل حضور"
        ],
        "answer_ar": "كل مشترك له كود QR فريد يتم إنشاؤه تلقائياً. يمكنك مسحه باستخدام ماسح الباركود أو الضغط يدوياً على 'تسجيل دخول' في جدول المشتركين. إذا كان لدى المشترك حصص متبقية أو اشتراك وقت نشط، سيتم تسجيل الزيارة، وسيحصل على نقاط ولاء. يمكنك عرض حضور اليوم في تبويب 'الحضور اليومي'.",
        "keywords_ar": [
            "باركود",
            "كيو ار",
            "qr",
            "تسجيل دخول",
            "حضور",
            "مسح"
        ]
    },
    {
        "id": "measurements-tracking",
        "question_en": [
            "How do I track physical progress and InBody details?",
            "measurements",
            "inbody",
            "weight tracking"
        ],
        "answer_en": "Open the Subscriber Detail Modal by clicking the 'View' (eye) icon or their name. Go to the 'Measurements' tab. Here you can record weight, body fat %, muscle mass, and notes. The system saves a history of these measurements so you can track progress over time.",
        "keywords_en": [
            "measurements",
            "weight",
            "body fat",
            "muscle",
            "inbody",
            "progress"
        ],
        "question_ar": [
            "كيف أتتبع التطور الجسماني وقياسات InBody؟",
            "القياسات",
            "انبودي",
            "تتبع الوزن"
        ],
        "answer_ar": "افتح تفاصيل المشترك بالضغط على أيقونة 'عرض' (العين) أو الضغط على اسمه. اذهب إلى تبويب 'القياسات'. هنا يمكنك تسجيل الوزن، نسبة الدهون، كتلة العضلات، وملاحظات. النظام يحفظ سجل لهذه القياسات لتتمكن من تتبع التطور بمرور الوقت.",
        "keywords_ar": [
            "قياسات",
            "وزن",
            "دهون",
            "عضلات",
            "انبودي",
            "تطور",
            "متابعة"
        ]
    },
    {
        "id": "installments-payments",
        "question_en": [
            "How do I manage installments and payments?",
            "installments",
            "pending payments",
            "receipts"
        ],
        "answer_en": "Go to the 'Payments' tab. You'll see a list of all transactions. On the right, there's a panel for 'Due Installments' for members with payment plans. You can mark them as 'Paid' and even print a printable receipt for any completed payment to give to the member.",
        "keywords_en": [
            "payments",
            "installments",
            "receipt",
            "debt",
            "pending"
        ],
        "question_ar": [
            "كيف أدير الأقساط والمدفوعات؟",
            "اقساط",
            "ديون",
            "وصل استلام"
        ],
        "answer_ar": "اذهب إلى تبويب 'المدفوعات'. ستظهر لك قائمة بكل المعاملات. على اليمين، يوجد لوحة لـ 'أقساط مستحقة' للأعضاء الذين لديهم خطط تقسيط. يمكنك تعليمها كـ 'مدفوعة' وحتى طباعة وصل استلام لأي دفعة مكتملة لتسليمها للعضو.",
        "keywords_ar": [
            "دفع",
            "اقساط",
            "وصل",
            "فاتورة",
            "مدفوعات"
        ]
    },
    {
        "id": "loyalty-points",
        "question_en": [
            "How does the loyalty points system work?",
            "loyalty points",
            "rewards",
            "tiers"
        ],
        "answer_en": "Subscribers earn points for: 1) Joining (Welcome Bonus), 2) Every gym visit, 3) Subscription renewals. Points are displayed in the Subscriber Modal under the 'Loyalty' tab, showing their current Tier (Bronze, Silver, Gold, etc.). In future updates, these points can be redeemed for discounts.",
        "keywords_en": [
            "loyalty",
            "points",
            "rewards",
            "tier",
            "members"
        ],
        "question_ar": [
            "كيف يعمل نظام نقاط الولاء؟",
            "النقاط",
            "جوائز",
            "مستويات"
        ],
        "answer_ar": "يحصل المشتركون على نقاط مقابل: 1) الانضمام (مكافأة ترحيبية)، 2) كل زيارة للجيم، 3) تجديد الاشتراك. تُعرض النقاط في تفاصيل المشترك تحت تبويب 'الولاء'، موضحاً مستواهم الحالي (برونزي، فضي، ذهبي، إلخ). في التحديثات القادمة، يمكن استبدال هذه النقاط بخصومات.",
        "keywords_ar": [
            "نقاط",
            "ولاء",
            "جائزة",
            "نقطة",
            "مستوى",
            "ترقية"
        ]
    },
    {
        "id": "smart-notifs",
        "question_en": [
            "What are the smart notifications?",
            "bell icon",
            "alerts"
        ],
        "answer_en": "The bell icon in the header shows 'Smart Notifications'. It alerts you about: 1) Birthdays today, 2) Members absent for more than 7 days (retention), 3) Goods with low stock levels. This helps you manage member relations and inventory proactively.",
        "keywords_en": [
            "notifications",
            "alerts",
            "birthday",
            "absent",
            "stock"
        ],
        "question_ar": [
            "ما هي التنبيهات الذكية؟",
            "جرس التنبيهات",
            "اشعارات"
        ],
        "answer_ar": "أيقونة الجرس في الأعلى تعرض 'التنبيهات الذكية'. تنبهك بـ: 1) أعياد الميلاد اليوم، 2) أعضاء غائبين لأكثر من 7 أيام، 3) بضائع قاربت على النفاد. هذا يساعدك في إدارة علاقات الأعضاء والمخزون بشكل استباقي.",
        "keywords_ar": [
            "جرس",
            "اشعارات",
            "تنبيه",
            "عيد ميلاد",
            "نواقص",
            "غياب"
        ]
    },
    {
        "id": "data-export-info",
        "question_en": [
            "Can I export data to Excel?",
            "export csv",
            "download list"
        ],
        "answer_en": "Yes! In the 'Subscribers' and 'Goods' tabs, you'll find an 'Export' button. Clicking it downloads the current table data as a CSV file, which you can open in Excel for reporting or offline record-keeping.",
        "keywords_en": [
            "export",
            "excel",
            "csv",
            "download",
            "sheet"
        ],
        "question_ar": [
            "هل يمكنني تصدير البيانات إلى إكسيل؟",
            "تصدير csv",
            "تحميل القائمة"
        ],
        "answer_ar": "نعم! في تبويبات 'المشتركين' و 'البضائع'، ستجد زر 'تصدير'. الضغط عليه يقوم بتحميل بيانات الجدول الحالية كملف CSV، والذي يمكنك فتحه في برنامج Excel للتقارير أو الحفظ الورقي.",
        "keywords_ar": [
            "اكسيل",
            "تصدير",
            "تحميل",
            "شيت",
            "excel",
            "csv"
        ]
    },
    {
        "id": "staff-classes-info",
        "question_en": [
            "How do I manage Staff and Group Classes?",
            "trainers",
            "classes",
            "group session"
        ],
        "answer_en": "Use the 'Staff' tab to add/remove employees and trainers. Use the 'Classes' tab to schedule group sessions like Yoga, Zumba, or Crossfit. You can assign specific trainers to classes and set the capacity for each session.",
        "keywords_en": [
            "staff",
            "trainer",
            "employee",
            "class",
            "session",
            "yoga",
            "zumba"
        ],
        "question_ar": [
            "كيف أدير الموظفين والحصص الجماعية؟",
            "مدربين",
            "كلاسات",
            "حصص"
        ],
        "answer_ar": "استخدم تبويب 'الموظفين' لإضافة/حذف الموظفين والمدربين. استخدم تبويب 'الحصص' لجدولة الحصص الجماعية مثل اليوجا، الزومبا، أو الكروس فت. يمكنك تعيين مدربين محددين للحصص وتحديد السعة لكل حصة.",
        "keywords_ar": [
            "موظفين",
            "مدرب",
            "كلاس",
            "حصة",
            "مواعيد",
            "تدريب"
        ]
    },
    {
        "id": "staff-permissions",
        "question_en": [
            "How do I set staff permissions?",
            "permissions",
            "what can staff do",
            "access controls"
        ],
        "answer_en": "Go to the 'Staff' tab, find the employee, and click '🔐 Permissions'. A modal opens with toggle switches grouped into: Subscribers, Finance & Reports, and Management. Toggle each permission on/off and click Save.",
        "keywords_en": [
            "permissions",
            "access",
            "staff permissions",
            "toggle",
            "what staff can do",
            "controls"
        ],
        "question_ar": [
            "كيف أضبط صلاحيات الموظف؟",
            "صلاحيات الموظف",
            "ازاي احدد الصلاحيات",
            "يعمل ايه الموظف"
        ],
        "answer_ar": "اذهب لتبويب 'الموظفين'، ابحث عن الموظف، واضغط '🔐 الصلاحيات'. ستفتح نافذة بمفاتيح تبديل مجمّعة في: المشتركين، المالية والتقارير، والإدارة. شغّل/أوقف حسب الحاجة ثم اضغط حفظ.",
        "keywords_ar": [
            "صلاحيات",
            "تحكم",
            "الموظف",
            "مفتاح",
            "تشغيل",
            "يشوف ايه",
            "يعمل ايه",
            "تفعيل",
            "ايقاف"
        ]
    },
    {
        "id": "change-staff-password",
        "question_en": [
            "How do I change a staff member's password?",
            "staff password reset",
            "employee password change"
        ],
        "answer_en": "Go to the 'Staff' tab, find the employee, and click '🔑 Password'. Enter the current password, the new password, confirm it, and click Save. The password must be at least 6 characters.",
        "keywords_en": [
            "staff password",
            "employee password",
            "change password",
            "reset password",
            "new password"
        ],
        "question_ar": [
            "كيف أغير كلمة مرور موظف؟",
            "تغيير باسورد موظف",
            "كلمة مرور الموظف",
            "تغيير الباسورد"
        ],
        "answer_ar": "اذهب لتبويب 'الموظفين'، ابحث عن الموظف، واضغط '🔑 كلمة المرور'. أدخل كلمة المرور الحالية ثم الجديدة مرتين واضغط حفظ. يجب أن تكون 6 أحرف على الأقل.",
        "keywords_ar": [
            "باسورد موظف",
            "كلمة سر موظف",
            "تغيير كلمة مرور",
            "تغيير الباسورد",
            "حساب الموظف"
        ]
    },
    {
        "id": "attendance-today",
        "question_en": [
            "How do I view today's attendance?",
            "who came today",
            "attendance list",
            "daily attendance tab"
        ],
        "answer_en": "Click the 'Daily Attendance' tab. You'll see 3 summary cards (Total Today, Still Inside, Checked Out), a search box by name, and a full table with each member's check-in time, check-out time, duration, and status. Export as CSV is also available.",
        "keywords_en": [
            "attendance",
            "today",
            "who came",
            "checkin",
            "checkout",
            "present",
            "inside"
        ],
        "question_ar": [
            "كيف أشوف حضور اليوم؟",
            "مين وصل النهارده؟",
            "قائمة الحضور اليومي",
            "حضور اليوم"
        ],
        "answer_ar": "اضغط على تبويب 'الحضور اليومي'. ستجد 3 بطاقات ملخص (إجمالي اليوم، لا يزالون داخل، غادروا)، صندوق بحث بالاسم، وجدول بوقت دخول وخروج ومدة حضور وحالة كل عضو. يمكنك تصدير القائمة كـ CSV.",
        "keywords_ar": [
            "حضور",
            "اليوم",
            "مين جه",
            "وصل",
            "دخل",
            "خرج",
            "الحضور اليومي",
            "قائمة الحضور"
        ]
    },
    {
        "id": "reports-charts",
        "question_en": [
            "How do I view financial reports and charts?",
            "monthly chart",
            "KPIs view",
            "profit chart"
        ],
        "answer_en": "Go to the 'Reports' tab. It shows: 4 annual summary cards (Income, Goods Profit, Expenses, Net Profit), a color-coded monthly bar chart, KPIs view (Retention Rate, Profit Margin, Average Revenue), and a Peak Hours chart. Switch views with top buttons. CSV export available.",
        "keywords_en": [
            "reports",
            "charts",
            "kpi",
            "monthly report",
            "annual",
            "financial graph",
            "profit chart"
        ],
        "question_ar": [
            "كيف أشوف التقارير والرسوم البيانية؟",
            "رسم بياني الارباح",
            "مؤشرات الاداء KPI"
        ],
        "answer_ar": "اذهب لتبويب 'التقارير'. يعرض: 4 بطاقات ملخص سنوي، مخطط شريطي شهري بالألوان، مؤشرات الأداء (معدل الاحتفاظ، هامش الربح)، ومخطط ساعات الذروة. بدّل بين 'شهري' و'مؤشرات الأداء' بالأزرار في الأعلى.",
        "keywords_ar": [
            "تقارير",
            "رسم بياني",
            "KPI",
            "شهري",
            "مالي",
            "احصائيات",
            "ارباح الشهر",
            "الارباح السنوية"
        ]
    },
    {
        "id": "payment-receipt",
        "question_en": [
            "How do I print a payment receipt?",
            "print invoice",
            "payment proof",
            "billing document"
        ],
        "answer_en": "Go to the 'Payments' tab. Find a completed payment (marked ✅ Paid) and click '🖨️ Receipt'. A professional bilingual (Arabic/English) receipt opens in a new tab with the gym name and payment details, and the print dialog opens automatically.",
        "keywords_en": [
            "receipt",
            "print",
            "invoice",
            "proof",
            "billing",
            "payment document",
            "paper"
        ],
        "question_ar": [
            "كيف أطبع وصل دفع؟",
            "طباعة فاتورة",
            "وصل استلام",
            "ايصال دفع",
            "اطبع الوصل"
        ],
        "answer_ar": "اذهب لتبويب 'المدفوعات'. ابحث عن الدفعة المكتملة (✅ مدفوع) واضغط '🖨️ وصل'. سيفتح وصل استلام احترافي في نافذة جديدة باسم الجيم وتفاصيل الدفع بالعربي والإنجليزي، ويفتح حوار الطباعة تلقائياً.",
        "keywords_ar": [
            "وصل",
            "فاتورة",
            "طباعة",
            "ايصال",
            "اثبات دفع",
            "ورقة",
            "اطبع"
        ]
    },
    {
        "id": "settings-gym-info",
        "question_en": [
            "How do I configure gym name and settings?",
            "set gym name",
            "change currency",
            "opening hours setup"
        ],
        "answer_en": "Go to 'Settings' tab (Admin only). In 'Gym Information': set gym name, currency (EGP, SAR, AED, USD, EUR), and opening/closing hours. Click Save. Other sections: Data Management (backup/restore), Security (change passwords), Danger Zone (clear all data), and System Info.",
        "keywords_en": [
            "settings",
            "gym name",
            "config",
            "currency",
            "hours",
            "configure",
            "setup gym"
        ],
        "question_ar": [
            "كيف أضبط معلومات وإعدادات الجيم؟",
            "تعديل اسم الجيم",
            "تغيير العملة",
            "ساعات العمل"
        ],
        "answer_ar": "اذهب لتبويب 'الإعدادات' (للمدير فقط). في 'معلومات النادي': عيّن اسم الجيم، العملة (جنيه، ريال، درهم، دولار)، وأوقات الفتح والإغلاق ثم اضغط حفظ. توجد أيضاً: إدارة البيانات، الأمان، ومنطقة الخطر.",
        "keywords_ar": [
            "اعدادات",
            "اسم الجيم",
            "عملة",
            "ساعات العمل",
            "فتح",
            "اغلاق",
            "ضبط"
        ]
    },
    {
        "id": "what-tabs-exist",
        "question_en": [
            "What tabs or sections does the system have?",
            "list all sections",
            "navigation menu"
        ],
        "answer_en": "The system has 14 main tabs: Dashboard, Subscribers, Goods, Stock, Expenses, Daily Attendance, Group Classes, Staff, Reports, Payments, Measurements, Loyalty, Equipment, and Settings.",
        "keywords_en": [
            "tabs",
            "sections",
            "navigation",
            "features",
            "menu",
            "all features",
            "what is available"
        ],
        "question_ar": [
            "ما هي أقسام وتبويبات النظام؟",
            "الشاشات المتاحة",
            "ايه اللي في النظام",
            "كل الاقسام"
        ],
        "answer_ar": "النظام يحتوي على 14 تبويب رئيسي: لوحة التحكم، المشتركين، البضائع، المخزون، المصروفات، الحضور اليومي، الحصص الجماعية، الموظفين، التقارير، المدفوعات، القياسات، الولاء، المعدات، والإعدادات.",
        "keywords_ar": [
            "تبويبات",
            "اقسام",
            "شاشات",
            "ايه موجود",
            "القائمة",
            "اقسام النظام",
            "عدد التبويبات"
        ]
    },
    {
        "id": "login-no-role",
        "question_en": [
            "Do I need to select a role when logging in?",
            "automatic role detection",
            "how to login now"
        ],
        "answer_en": "No! The new system automatically detects your role from the database. Just enter your email and password — your role (Admin, Trainer, Accountant, Reception, etc.) is detected automatically and shown as a colored badge in the header after login.",
        "keywords_en": [
            "role",
            "login",
            "select role",
            "automatic",
            "email login",
            "how to login",
            "sign in"
        ],
        "question_ar": [
            "هل أحتاج لاختيار الدور عند الدخول؟",
            "دور تلقائي",
            "دخول بالبريد والباسورد فقط"
        ],
        "answer_ar": "لا! النظام يكتشف دورك تلقائياً من قاعدة البيانات. فقط أدخل بريدك الإلكتروني وكلمة المرور — سيتم اكتشاف دورك (مدير، مدرب، محاسب، استقبال...) تلقائياً ويظهر كـ badge ملوّن في الهيدر.",
        "keywords_ar": [
            "دور",
            "اختيار دور",
            "تلقائي",
            "بدون دور",
            "ادخل ازاي",
            "طريقة الدخول",
            "سجل دخول"
        ]
    }
];
