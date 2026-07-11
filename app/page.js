'use client';

import { useState, useEffect, useRef } from 'react';
import {
    getSubscribers, addSubscriber, deleteSubscriber, updateSubscriber, renewSubscriber,
    getGoods, addGoods, deleteGoods, updateGoods,
    getExpenses, addExpense, deleteExpense, updateExpense,
    getStats, getAdvancedStats, getMonthlyComparison,
    getSettings, updateSettings, updatePasswords, createBackup, restoreBackup, clearAllData,
    checkIn, checkOut, getTodayAttendance, freezeSubscriber, unfreezeSubscriber,
    getLowStockGoods, getDashboardAnalytics, getSmartNotifications,
    getClasses, addClass, deleteClass, getStaff, addStaff, deleteStaff,
    getAllPayments, getPendingInstallments, updatePaymentStatus,
    addMeasurement, getSubscriberMeasurements, updateMeasurement, deleteMeasurement,
    getEquipment, addEquipment, updateEquipment, deleteEquipment, addMaintenance, getMaintenanceDue,
    getLoyaltyInfo, addLoyaltyPoints, redeemLoyaltyPoints,
    sellGoodsByBarcode, getSalesByMonth, sellGoodsById, undoSale,
    loginStaff, updateStaffPermissions, changeStaffPassword,
    checkHasAdmin, registerFirstAdmin, requestPasswordResetOTP, resetPasswordWithOTP, verifyPasswordResetOTP,
    getAuditLogs, getStaffPerformanceStats, deleteAuditLogs
} from './actions';
import { FAQ_DATA } from './chatbotData';
import DashboardStats from './components/DashboardStats';
import ChatBot from './components/ChatBot';
import SubscribersTab from './components/Tabs/Subscribers';
import GoodsTab from './components/Tabs/Goods';
import ExpensesTab from './components/Tabs/Expenses';
import AttendanceTab from './components/Tabs/Attendance';
import StaffTab from './components/Tabs/Staff';
import ClassesTab from './components/Tabs/Classes';
import ReportsTab from './components/Tabs/Reports';
import SettingsTab from './components/Tabs/Settings';
import PaymentsTab from './components/Tabs/Payments';
import MeasurementsTab from './components/Tabs/Measurements';
import EquipmentTab from './components/Tabs/Equipment';
import LoyaltyTab from './components/Tabs/Loyalty';
import StockDashboard from './components/Tabs/StockDashboard';
import SubscriberModal from './components/Tabs/SubscriberModal';
import Modal from './components/Modal';
import PerformanceTab from './components/Tabs/Performance';
import FAQTab from './components/Tabs/FAQ';
const DemoReadOnlyWrapper = ({ children, lang }) => {
    return (
        <div 
            onClickCapture={(e) => {
                const target = e.target;
                const isInsideButton = target.closest('button');
                const isCheckboxOrRadio = target.tagName === 'INPUT' && (target.type === 'checkbox' || target.type === 'radio');
                const isSubmitOrBtnInput = target.tagName === 'INPUT' && (target.type === 'submit' || target.type === 'button' || target.type === 'file');
                const isButton = target.tagName === 'BUTTON' || isInsideButton || isSubmitOrBtnInput || isCheckboxOrRadio || target.classList.contains('btn') || target.getAttribute('role') === 'button';

                if (isButton) {
                    e.preventDefault();
                    e.stopPropagation();
                    alert(lang === 'ar' 
                        ? 'هذه الميزة معطلة في النسخة التجريبية (الديمو)، اشترِ النسخة الأصلية للتمتع بجميع مميزات النظام!' 
                        : 'This feature is disabled in the demo version. Purchase the original version to enjoy all the system features!');
                }
            }}
            style={{ display: 'contents' }}
        >
            {children}
        </div>
    );
};

// Translations
const DICT = {
    en: {
        gymTitle: 'Professional Gym Management System',
        login: 'Login',
        password: 'Password',
        mode: 'Mode',
        logout: 'Logout',
        dashboard: 'Dashboard',
        subscribers: 'Subscribers',
        goods: 'Goods',
        expenses: 'Expenses',
        attendance: 'Attendance',
        classes: 'Classes',
        staff: 'Staff',
        reports: 'Annual Reports',
        settings: 'Settings',
        performance: 'Staff Performance',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        category: 'Category',
        price: 'Price',
        count: 'Count',
        gender: 'Gender',
        months: 'Duration',
        startDate: 'Start Date',
        endDate: 'End Date',
        status: 'Status',
        actions: 'Actions',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        renew: 'Renew',
        cancel: 'Cancel',
        search: 'Search by name or category',
        filterAll: 'All',
        filterActive: 'Active',
        filterExpired: 'Expired',
        filterSoon: 'Expiring Soon',
        filterFrozen: 'Frozen',
        male: 'Male',
        female: 'Female',
        mix: 'Mixed',
        day: 'Day',
        week: 'Week',
        halfMonth: 'Half Month',
        month: 'Month',
        months: 'Months',
        active: 'Active',
        expired: 'Expired',
        expiringSoon: 'Expiring Soon',
        daysLeft: 'days left',
        backup: 'Backup',
        restore: 'Restore',
        clearData: 'Clear Data',
        changePasswords: 'Change Passwords',
        item: 'Item',
        qty: 'Quantity',
        salePrice: 'Sale Price',
        costPrice: 'Cost Price',
        profit: 'Profit',
        note: 'Note',
        amount: 'Amount',
        totalIncome: 'Total Income',
        totalExpenses: 'Total Expenses',
        netProfit: 'Net Profit',
        loading: 'Loading...',
        checkIn: 'Check In',
        checkOut: 'Check Out',
        scanQR: 'Scan QR',
        todayAttendance: 'Today Attendance',
        totalStats: 'Total Stats',
        payments: 'Payments',
        measurements: 'Measurements',
        notifications: 'Notifications',
        export: 'Export',
        inbody: 'Body Evolution',
        birthdays: 'Birthdays',
        absent: 'Absent Members',
        lowStockItems: 'Low Stock',
        installment: 'Installment',
        paid: 'Paid',
        pending: 'Pending',
        addPayment: 'Add Payment',
        weight: 'Weight',
        bodyFat: 'Body Fat %',
        muscleMass: 'Muscle Mass',
        extend: 'Extend/Renew',
        equipment: 'Equipment',
        loyalty: 'Loyalty',
        role: 'Role',
        admin: 'Admin',
        data_entry: 'Data Entry',
        trainer: 'Trainer',
        accountant: 'Accountant',
        marketing: 'Marketing',
        sales: 'Sales',
        performanceReports: 'Staff Performance & Activity Reports',
        performanceReportsSub: 'Detailed monitoring and analytics of employee actions in the system',
        refreshData: 'Refresh Data',
        exportCSV: 'Export CSV',
        totalLoggedActions: 'Total Logged Actions',
        activeStaffMembers: 'Active Staff Members',
        mostActiveStaff: 'Most Active Staff',
        staffDirectory: 'Staff Directory',
        loadingStaff: 'Loading staff...',
        noStaffRegistered: 'No staff registered',
        employeeKPIs: 'Employee Key Performance Indicators',
        subscribersRegistered: 'Subscribers Registered',
        paymentsProcessed: 'Payments Processed',
        amountsCollected: 'Amounts Collected',
        productsSold: 'Products Sold',
        expensesRecorded: 'Expenses Recorded',
        totalOperations: 'Total Operations',
        actionTypesDistribution: 'Action Types Distribution',
        notEnoughActivityData: 'Not enough activity data to visualize',
        lastLoggedAction: 'Last Logged Action',
        noRecordedActionsYet: 'No recorded actions yet',
        selectStaffToView: 'Select a staff member to view their performance card',
        filterActivityLogs: 'Filter Activity Logs',
        employee: 'Employee',
        allStaff: 'All Staff',
        actionType: 'Action Type',
        allActions: 'All Actions',
        moduleSection: 'Module/Section',
        allSections: 'All Sections',
        fromDate: 'From Date',
        toDate: 'To Date',
        searchLogsDescription: 'Search logs description...',
        applyFilters: 'Apply Filters',
        resetFilters: 'Reset Filters',
        dateTime: 'Date & Time',
        staffPerformer: 'Staff Performer',
        module: 'Module',
        action: 'Action',
        details: 'Details',
        diff: 'Diff',
        loadingFilteredLogs: 'Loading filtered audit logs...',
        noLogsMatching: 'No logs matching current filter settings',
        detailedFieldChanges: 'Detailed Field Changes',
        close: 'Close',
        view: 'View',
        creations: 'Creations',
        sales: 'Sales',
        updates: 'Updates',
        none: 'None',
        noDataToExport: 'No data to export',
        performance: 'Staff Performance',
        performanceReportsTitle: 'Staff Performance & Activity Reports',
        performanceReportsDesc: 'Detailed monitoring and analytics of employee actions in the system',
        refreshData: 'Refresh Data',
        exportCsv: 'Export CSV',
        totalLoggedActions: 'Total Logged Actions',
        activeStaffMembers: 'Active Staff Members',
        mostActiveStaff: 'Most Active Staff',
        staffDirectory: 'Staff Directory',
        loadingStaff: 'Loading staff...',
        noStaffRegistered: 'No staff registered',
        employeeKPIs: 'Employee Key Performance Indicators',
        employeeKpis: 'Employee Key Performance Indicators',
        subscribersRegistered: 'Subscribers Registered',
        paymentsProcessed: 'Payments Processed',
        amountsCollected: 'Amounts Collected',
        productsSold: 'Products Sold',
        expensesRecorded: 'Expenses Recorded',
        totalOperations: 'Total Operations',
        actionDistribution: 'Action Types Distribution',
        actionTypesDistribution: 'Action Types Distribution',
        noActivityData: 'Not enough activity data to visualize',
        notEnoughActivityData: 'Not enough activity data to visualize',
        lastLoggedAction: 'Last Logged Action',
        noActionsRecorded: 'No recorded actions yet',
        noRecordedActionsYet: 'No recorded actions yet',
        selectStaffToViewPerf: 'Select a staff member to view their performance card',
        selectStaffToView: 'Select a staff member to view their performance card',
        filterActivityLogs: 'Filter Activity Logs',
        employee: 'Employee',
        allStaff: 'All Staff',
        actionType: 'Action Type',
        allActions: 'All Actions',
        moduleSection: 'Module/Section',
        allSections: 'All Sections',
        fromDate: 'From Date',
        toDate: 'To Date',
        searchLogsPlaceholder: 'Search logs description...',
        searchLogsDescription: 'Search logs description...',
        applyFilters: 'Apply Filters',
        resetFilters: 'Reset Filters',
        dateTime: 'Date & Time',
        staffPerformer: 'Staff Performer',
        module: 'Module',
        action: 'Action',
        details: 'Details',
        diff: 'Diff',
        loadingFilteredLogs: 'Loading filtered audit logs...',
        noLogsMatchingFilter: 'No logs matching current filter settings',
        noLogsMatching: 'No logs matching current filter settings',
        detailedFieldChanges: 'Detailed Field Changes',
        close: 'Close',
        view: 'View',
        creations: 'Creations',
        sales: 'Sales',
        updates: 'Updates',
        none: 'None',
        noDataToExport: 'No data to export',
        receptionist: 'Receptionist',
        receipt: 'Receipt',
        paymentReceipt: 'Payment Receipt',
        officialReceipt: 'Official Payment Receipt',
        member: 'Member',
        type: 'Type',
        thankYouClub: 'Thank you for choosing our gym! 💪',
        date: 'Date',
        actionsCount: 'actions',
        creationsAndAdditions: 'Creations & Additions',
        updatesOther: 'Updates/Other',
        createAction: 'Create',
        updateAction: 'Update',
        deleteAction: 'Delete',
        loginAction: 'Login',
        exportAction: 'Export',
        importAction: 'Import',
        goodsAndSales: 'Goods & Sales',
        settingsAndBackup: 'Settings & Backup',
        system: 'System',
        monthlyRevenue: 'Subscription Profits',
    },
    ar: {
        gymTitle: 'نظام إدارة الصالات الرياضية الاحترافي',
        login: 'تسجيل الدخول',
        password: 'كلمة المرور',
        mode: 'الوضع',
        logout: 'تسجيل الخروج',
        dashboard: 'لوحة التحكم',
        subscribers: 'المشتركين',
        goods: 'البضائع',
        expenses: 'المصروفات',
        attendance: 'الحضور',
        classes: 'الحصص',
        staff: 'الموظفين',
        reports: 'التقارير السنوية',
        settings: 'الإعدادات',
        performance: 'أداء الموظفين',
        name: 'الاسم',
        email: 'الايميل',
        phone: 'الهاتف',
        category: 'الفئة',
        price: 'السعر',
        count: 'العدد',
        gender: 'الجنس',
        months: 'المدة',
        startDate: 'تاريخ البداية',
        endDate: 'تاريخ النهاية',
        status: 'الحالة',
        actions: 'الإجراءات',
        save: 'حفظ',
        edit: 'تعديل',
        delete: 'حذف',
        renew: 'تجديد',
        cancel: 'إلغاء',
        search: 'بحث بالاسم أو الفئة',
        filterAll: 'الكل',
        filterActive: 'النشطة',
        filterExpired: 'المنتهية',
        filterSoon: 'ستنتهي قريباً',
        filterFrozen: 'المجمدة',
        male: 'رجال',
        female: 'نساء',
        mix: 'مختلط',
        day: 'يوم',
        week: 'أسبوع',
        halfMonth: 'نصف شهر',
        month: 'شهر',
        months: 'أشهر',
        active: 'نشط',
        expired: 'منتهي',
        expiringSoon: 'ينتهي قريباً',
        daysLeft: 'يوم متبقي',
        backup: 'نسخة احتياطية',
        restore: 'استعادة',
        clearData: 'مسح البيانات',
        changePasswords: 'تغيير كلمات المرور',
        item: 'الصنف',
        qty: 'الكمية',
        salePrice: 'سعر البيع',
        costPrice: 'سعر التكلفة',
        profit: 'الربح',
        note: 'ملاحظة',
        amount: 'المبلغ',
        totalIncome: 'إجمالي الدخل',
        totalExpenses: 'إجمالي المصروفات',
        netProfit: 'صافي الربح',
        loading: 'جاري التحميل...',
        checkIn: 'تسجيل دخول',
        checkOut: 'تسجيل خروج',
        scanQR: 'مسح QR',
        todayAttendance: 'حضور اليوم',
        totalStats: 'إحصائيات شاملة',
        payments: 'المدفوعات',
        measurements: 'القياسات',
        notifications: 'التنبيهات',
        export: 'تصدير',
        inbody: 'تطور الجسم',
        birthdays: 'أعياد ميلاد',
        absent: 'مشتركين غائبين',
        lowStockItems: 'نواقص بضائع',
        installment: 'قسط',
        paid: 'مدفوع',
        pending: 'معلق',
        addPayment: 'إضافة دفعة',
        weight: 'الوزن',
        bodyFat: 'نسبة الدهون',
        muscleMass: 'كتلة العضلات',
        extend: 'تمديد/تجديد',
        equipment: 'المعدات',
        loyalty: 'الولاء',
        role: 'الدور/الوظيفة',
        admin: 'مدمن (Admin)',
        data_entry: 'مدخل بيانات',
        trainer: 'مدرب',
        accountant: 'محاسب',
        marketing: 'ماركيتينج',
        sales: 'سيلز',
        performanceReports: 'تقارير أداء ومتابعة الموظفين',
        performanceReportsSub: 'متابعة تفصيلية وتحليلات لنشاط كل موظف على النظام',
        refreshData: 'تحديث البيانات',
        exportCSV: 'تصدير CSV',
        totalLoggedActions: 'إجمالي العمليات المنفذة',
        activeStaffMembers: 'الموظفين النشطين بالنظام',
        mostActiveStaff: 'الموظف الأكثر تفاعلاً',
        staffDirectory: 'قائمة الموظفين',
        loadingStaff: 'جاري تحميل الموظفين...',
        noStaffRegistered: 'لا يوجد موظفين مسجلين',
        employeeKPIs: 'إحصائيات إنجاز الموظف',
        subscribersRegistered: 'إضافة مشتركين',
        paymentsProcessed: 'عمليات تحصيل',
        amountsCollected: 'مبالغ محصلة',
        productsSold: 'مبيعات منتجات',
        expensesRecorded: 'تسجيل مصروفات',
        totalOperations: 'مجموع العمليات',
        actionTypesDistribution: 'توزيع العمليات',
        notEnoughActivityData: 'لا توجد بيانات كافية للتصنيف',
        lastLoggedAction: 'آخر نشاط مسجل للموظف',
        noRecordedActionsYet: 'لا توجد عمليات مسجلة بعد',
        selectStaffToView: 'الرجاء اختيار موظف لعرض تقرير أدائه',
        filterActivityLogs: 'تصفية سجل العمليات والأنشطة',
        employee: 'الموظف',
        allStaff: 'كل الموظفين',
        actionType: 'نوع العملية',
        allActions: 'كل العمليات',
        moduleSection: 'الجدول / القسم',
        allSections: 'كل الأقسام',
        fromDate: 'من تاريخ',
        toDate: 'إلى تاريخ',
        searchLogsDescription: 'بحث بالكلمات المفتاحية...',
        applyFilters: 'تطبيق الفلترة',
        resetFilters: 'إعادة تعيين',
        dateTime: 'التاريخ والوقت',
        staffPerformer: 'الموظف',
        module: 'القسم',
        action: 'العملية',
        details: 'التفاصيل',
        diff: 'تفاصيل',
        loadingFilteredLogs: 'جاري تحميل السجلات المفلترة...',
        noLogsMatching: 'لا توجد سجلات تطابق الفلترة الحالية',
        detailedFieldChanges: 'التغييرات التفصيلية التي تمت',
        close: 'إغلاق',
        view: 'عرض',
        creations: 'إنشاء وإضافات',
        sales: 'مبيعات',
        updates: 'تحديثات/عمليات أخرى',
        none: 'لا يوجد',
        noDataToExport: 'لا توجد بيانات للتصدير',
        performance: 'أداء الموظفين',
        performanceReportsTitle: 'تقارير أداء ومتابعة الموظفين',
        performanceReportsDesc: 'متابعة تفصيلية وتحليلات لنشاط كل موظف على النظام',
        refreshData: 'تحديث البيانات',
        exportCsv: 'تصدير CSV',
        totalLoggedActions: 'إجمالي العمليات المنفذة',
        activeStaffMembers: 'الموظفين النشطين بالنظام',
        mostActiveStaff: 'الموظف الأكثر تفاعلاً',
        staffDirectory: 'قائمة الموظفين',
        loadingStaff: 'جاري تحميل الموظفين...',
        noStaffRegistered: 'لا يوجد موظفين مسجلين',
        employeeKPIs: 'إحصائيات إنجاز الموظف',
        employeeKpis: 'إحصائيات إنجاز الموظف',
        subscribersRegistered: 'إضافة مشتركين',
        paymentsProcessed: 'عمليات تحصيل',
        amountsCollected: 'مبالغ محصلة',
        productsSold: 'مبيعات منتجات',
        expensesRecorded: 'تسجيل مصروفات',
        totalOperations: 'مجموع العمليات',
        actionDistribution: 'توزيع العمليات',
        actionTypesDistribution: 'توزيع العمليات',
        noActivityData: 'لا توجد بيانات كافية للتصنيف',
        notEnoughActivityData: 'لا توجد بيانات كافية للتصنيف',
        lastLoggedAction: 'آخر نشاط مسجل للموظف',
        noActionsRecorded: 'لا توجد عمليات مسجلة بعد',
        noRecordedActionsYet: 'لا توجد عمليات مسجلة بعد',
        selectStaffToViewPerf: 'الرجاء اختيار موظف لعرض تقرير أدائه',
        selectStaffToView: 'الرجاء اختيار موظف لعرض تقرير أدائه',
        filterActivityLogs: 'تصفية سجل العمليات والأنشطة',
        employee: 'الموظف',
        allStaff: 'كل الموظفين',
        actionType: 'نوع العملية',
        allActions: 'كل العمليات',
        moduleSection: 'الجدول / القسم',
        allSections: 'كل الأقسام',
        fromDate: 'من تاريخ',
        toDate: 'إلى تاريخ',
        searchLogsPlaceholder: 'بحث بالكلمات المفتاحية...',
        searchLogsDescription: 'بحث بالكلمات المفتاحية...',
        applyFilters: 'تطبيق الفلترة',
        resetFilters: 'إعادة تعيين',
        dateTime: 'التاريخ والوقت',
        staffPerformer: 'الموظف',
        module: 'القسم',
        action: 'العملية',
        details: 'التفاصيل',
        diff: 'التفاصيل',
        loadingFilteredLogs: 'جاري تحميل السجلات المفلترة...',
        noLogsMatchingFilter: 'لا توجد سجلات تطابق الفلترة الحالية',
        noLogsMatching: 'لا توجد سجلات تطابق الفلترة الحالية',
        detailedFieldChanges: 'التغييرات التفصيلية التي تمت',
        close: 'إغلاق',
        view: 'عرض',
        creations: 'إنشاء وإضافات',
        sales: 'مبيعات',
        updates: 'تحديثات/عمليات أخرى',
        none: 'لا يوجد',
        noDataToExport: 'لا توجد بيانات للتصدير',
        receptionist: 'استقبال',
        receipt: 'وصل',
        paymentReceipt: 'وصل دفع',
        officialReceipt: 'وصل دفع رسمي',
        member: 'العضو',
        type: 'النوع',
        thankYouClub: 'شكراً لاختياركم نادينا 💪',
        date: 'التاريخ',
        actionsCount: 'عملية',
        creationsAndAdditions: 'إنشاء وإضافات',
        updatesOther: 'تحديثات/عمليات أخرى',
        createAction: 'إضافة (Create)',
        updateAction: 'تعديل (Update)',
        deleteAction: 'حذف (Delete)',
        loginAction: 'تسجيل دخول',
        exportAction: 'تصدير بيانات',
        importAction: 'استيراد بيانات',
        goodsAndSales: 'المبيعات والبضائع',
        settingsAndBackup: 'إعدادات والنسخ',
        system: 'النظام',
        monthlyRevenue: 'أرباح الاشتراكات',
    },
    fr: {
        gymTitle: 'Système de Gestion de Gym Professionnel',
        login: 'Connexion',
        password: 'Mot de passe',
        mode: 'Mode',
        logout: 'Déconnexion',
        dashboard: 'Tableau de bord',
        subscribers: 'Abonnés',
        goods: 'Marchandises',
        expenses: 'Dépenses',
        attendance: 'Présence',
        classes: 'Cours',
        staff: 'Personnel',
        reports: 'Rapports Annuels',
        settings: 'Paramètres',
        name: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        category: 'Catégorie',
        price: 'Prix',
        count: 'Nombre',
        gender: 'Genre',
        months: 'Durée',
        startDate: 'Date de début',
        endDate: 'Date de fin',
        status: 'Statut',
        actions: 'Actions',
        save: 'Enregistrer',
        edit: 'Modifier',
        delete: 'Supprimer',
        renew: 'Renouveler',
        cancel: 'Annuler',
        search: 'Recherche par nom ou catégorie',
        filterAll: 'Tous',
        filterActive: 'Actif',
        filterExpired: 'Expiré',
        filterSoon: 'Expire bientôt',
        filterFrozen: 'Gelé',
        male: 'Homme',
        female: 'Femme',
        mix: 'Mixte',
        day: 'Jour',
        week: 'Semaine',
        halfMonth: 'Demi-mois',
        month: 'Mois',
        months: 'Mois',
        active: 'Actif',
        expired: 'Expiré',
        expiringSoon: 'Expire bientôt',
        daysLeft: 'jours restants',
        backup: 'Sauvegarde',
        restore: 'Restaurer',
        clearData: 'Effacer les données',
        changePasswords: 'Changer les mots de passe',
        item: 'Article',
        qty: 'Quantité',
        salePrice: 'Prix de vente',
        costPrice: 'Prix de revient',
        profit: 'Profit',
        note: 'Note',
        amount: 'Montant',
        totalIncome: 'Revenu total',
        totalExpenses: 'Dépenses totales',
        netProfit: 'Bénéfice net',
        loading: 'Chargement...',
        checkIn: 'Arrivée',
        checkOut: 'Départ',
        scanQR: 'Scanner QR',
        todayAttendance: 'Présence aujourd\'hui',
        totalStats: 'Stats totales',
        payments: 'Paiements',
        measurements: 'Mesures',
        notifications: 'Notifications',
        export: 'Exporter',
        inbody: 'Évolution corporelle',
        birthdays: 'Anniversaires',
        absent: 'Membres absents',
        lowStockItems: 'Stock faible',
        installment: 'Versement',
        paid: 'Payé',
        pending: 'En attente',
        addPayment: 'Ajouter un paiement',
        weight: 'Poids',
        bodyFat: '% de graisse',
        muscleMass: 'Masse musculaire',
        extend: 'Prolonger',
        equipment: 'Équipement',
        loyalty: 'Fidélité',
        role: 'Rôle',
        admin: 'Admin',
        data_entry: 'Saisie de données',
        trainer: 'Entraîneur',
        accountant: 'Comptable',
        marketing: 'Marketing',
        sales: 'Ventes',
        performance: 'Performance du personnel',
        performanceReportsTitle: 'Rapports de performance et d\'activité du personnel',
        performanceReportsDesc: 'Suivi détaillé et analyses de l\'activité de chaque employé sur le système',
        refreshData: 'Actualiser les données',
        exportCsv: 'Exporter CSV',
        totalLoggedActions: 'Total des actions enregistrées',
        activeStaffMembers: 'Membres actifs du personnel',
        mostActiveStaff: 'Personnel le plus actif',
        staffDirectory: 'Annuaire du personnel',
        loadingStaff: 'Chargement du personnel...',
        noStaffRegistered: 'Aucun personnel enregistré',
        employeeKPIs: 'Indicateurs de performance de l\'employé',
        employeeKpis: 'Indicateurs de performance de l\'employé',
        subscribersRegistered: 'Abonnés enregistrés',
        paymentsProcessed: 'Paiements traités',
        amountsCollected: 'Montants collectés',
        productsSold: 'Produits vendus',
        expensesRecorded: 'Dépenses enregistrées',
        totalOperations: 'Opérations totales',
        actionDistribution: 'Distribution des types d\'action',
        actionTypesDistribution: 'Distribution des types d\'action',
        noActivityData: 'Pas assez de données d\'activité',
        notEnoughActivityData: 'Pas assez de données d\'activité',
        lastLoggedAction: 'Dernière action enregistrée',
        noActionsRecorded: 'Aucune action enregistrée',
        noRecordedActionsYet: 'Aucune action enregistrée pour le moment',
        selectStaffToViewPerf: 'Sélectionnez un membre du personnel pour afficher sa carte de performance',
        selectStaffToView: 'Sélectionnez un membre du personnel pour afficher sa carte de performance',
        filterActivityLogs: 'Filtrer les journaux d\'activité',
        employee: 'Employé',
        allStaff: 'Tout le personnel',
        actionType: 'Type d\'action',
        allActions: 'Toutes les actions',
        moduleSection: 'Section/Module',
        allSections: 'Toutes les sections',
        fromDate: 'Depuis le',
        toDate: 'Jusqu\'au',
        searchLogsPlaceholder: 'Recherche dans les journaux...',
        searchLogsDescription: 'Recherche dans les journaux...',
        applyFilters: 'Appliquer les filtres',
        resetFilters: 'Réinitialiser',
        dateTime: 'Date & Heure',
        staffPerformer: 'Exécutant',
        module: 'Module',
        action: 'Action',
        details: 'Détails',
        diff: 'Différences',
        loadingFilteredLogs: 'Chargement des journaux filtrés...',
        noLogsMatchingFilter: 'Aucun journal ne correspond aux filtres',
        noLogsMatching: 'Aucun journal ne correspond aux filtres',
        detailedFieldChanges: 'Modifications détaillées des champs',
        close: 'Fermer',
        view: 'Voir',
        creations: 'Créations',
        sales: 'Ventes',
        updates: 'Mises à jour',
        none: 'Aucun',
        noDataToExport: 'Aucune donnée à exporter',
        receptionist: 'Réceptionniste',
        receipt: 'Reçu',
        paymentReceipt: 'Reçu de paiement',
        officialReceipt: 'Reçu de paiement officiel',
        member: 'Membre',
        type: 'Type',
        thankYouClub: 'Merci d\'avoir choisi notre club! 💪',
        date: 'Date',
        actionsCount: 'actions',
        creationsAndAdditions: 'Créations',
        updatesOther: 'Mises à jour/Autres',
        createAction: 'Créer',
        updateAction: 'Modifier',
        deleteAction: 'Supprimer',
        loginAction: 'Connexion',
        exportAction: 'Exporter',
        importAction: 'Importer',
        goodsAndSales: 'Ventes & Marchandises',
        settingsAndBackup: 'Paramètres & Sauvegarde',
        system: 'Système',
        monthlyRevenue: 'Profits des Abonnements',
    },
    es: {
        gymTitle: 'Sistema Profesional de Gestión de Gimnasios',
        login: 'Acceso',
        password: 'Password',
        mode: 'Modo',
        logout: 'Cerrar sesión',
        dashboard: 'Panel',
        subscribers: 'Abonados',
        goods: 'Mercancías',
        expenses: 'Gastos',
        attendance: 'Asistencia',
        classes: 'Clases',
        staff: 'Personal',
        reports: 'Informes Anuales',
        settings: 'Ajustes',
        name: 'Nombre',
        email: 'Email',
        phone: 'Teléfono',
        category: 'Categoría',
        price: 'Precio',
        count: 'Cantidad',
        gender: 'Género',
        months: 'Duración',
        startDate: 'Fecha de inicio',
        endDate: 'Fecha de fin',
        status: 'Estado',
        actions: 'Acciones',
        save: 'Guardar',
        edit: 'Editar',
        delete: 'Eliminar',
        renew: 'Renovar',
        cancel: 'Cancelar',
        search: 'Buscar por nombre o categoría',
        filterAll: 'Todos',
        filterActive: 'Activo',
        filterExpired: 'Expirado',
        filterSoon: 'Vence pronto',
        filterFrozen: 'Congelado',
        male: 'Hombre',
        female: 'Mujer',
        mix: 'Mixto',
        day: 'Día',
        week: 'Semana',
        halfMonth: 'Medio mes',
        month: 'Mes',
        months: 'Meses',
        active: 'Activo',
        expired: 'Expirado',
        expiringSoon: 'Vence pronto',
        daysLeft: 'días restantes',
        backup: 'Respaldo',
        restore: 'Restaurar',
        clearData: 'Borrar datos',
        changePasswords: 'Cambiar contraseñas',
        item: 'Artículo',
        qty: 'Cantidad',
        salePrice: 'Precio venta',
        costPrice: 'Precio coste',
        profit: 'Beneficio',
        note: 'Nota',
        amount: 'Monto',
        totalIncome: 'Ingreso total',
        totalExpenses: 'Gastos totales',
        netProfit: 'Beneficio neto',
        loading: 'Cargando...',
        checkIn: 'Entrada',
        checkOut: 'Salida',
        scanQR: 'Escanear QR',
        todayAttendance: 'Asistencia hoy',
        totalStats: 'Estadísticas totales',
        payments: 'Pagos',
        measurements: 'Medidas',
        notifications: 'Notificaciones',
        export: 'Exportar',
        inbody: 'Evolución corporal',
        birthdays: 'Cumpleaños',
        absent: 'Miembros ausentes',
        lowStockItems: 'Stock bajo',
        installment: 'Cuota',
        paid: 'Pagado',
        pending: 'Pendiente',
        addPayment: 'Agregar pago',
        weight: 'Peso',
        bodyFat: '% de grasa',
        muscleMass: 'Masa muscular',
        extend: 'Extender',
        equipment: 'Equipo',
        loyalty: 'Fidelidad',
        role: 'Rol',
        admin: 'Admin',
        data_entry: 'Entrada de datos',
        trainer: 'Entrenador',
        accountant: 'Contador',
        marketing: 'Marketing',
        sales: 'Ventas',
        performance: 'Rendimiento del personal',
        performanceReportsTitle: 'Informes de rendimiento y actividad del personal',
        performanceReportsDesc: 'Seguimiento detallado y análisis de la actividad de cada empleado en el sistema',
        refreshData: 'Actualizar datos',
        exportCsv: 'Exportar CSV',
        totalLoggedActions: 'Total de acciones registradas',
        activeStaffMembers: 'Miembros activos del personal',
        mostActiveStaff: 'Personal más activo',
        staffDirectory: 'Directorio del personal',
        loadingStaff: 'Cargando personal...',
        noStaffRegistered: 'Ningún personal registrado',
        employeeKPIs: 'Indicadores clave de rendimiento del empleado',
        employeeKpis: 'Indicadores clave de rendimiento del empleado',
        subscribersRegistered: 'Abonados registrados',
        paymentsProcessed: 'Pagos procesados',
        amountsCollected: 'Montos cobrados',
        productsSold: 'Productos vendidos',
        expensesRecorded: 'Gastos registrados',
        totalOperations: 'Operaciones totales',
        actionDistribution: 'Distribución de tipos de acción',
        actionTypesDistribution: 'Distribución de tipos de acción',
        noActivityData: 'No hay suficientes datos de actividad',
        notEnoughActivityData: 'No hay suficientes datos de actividad',
        lastLoggedAction: 'Última acción registrada',
        noActionsRecorded: 'Ninguna acción registrada',
        noRecordedActionsYet: 'Ninguna acción registrada aún',
        selectStaffToViewPerf: 'Seleccione un miembro del personal para ver su tarjeta de rendimiento',
        selectStaffToView: 'Seleccione un miembro del personal para ver su tarjeta de rendimiento',
        filterActivityLogs: 'Filtrar registros de actividad',
        employee: 'Empleado',
        allStaff: 'Todo el personal',
        actionType: 'Tipo de acción',
        allActions: 'Todas las acciones',
        moduleSection: 'Sección/Módulo',
        allSections: 'Todas las secciones',
        fromDate: 'Desde la fecha',
        toDate: 'Hasta la fecha',
        searchLogsPlaceholder: 'Buscar en los registros...',
        searchLogsDescription: 'Buscar en los registros...',
        applyFilters: 'Aplicar filtros',
        resetFilters: 'Restablecer',
        dateTime: 'Fecha y Hora',
        staffPerformer: 'Ejecutor',
        module: 'Módulo',
        action: 'Acción',
        details: 'Detalles',
        diff: 'Diferencias',
        loadingFilteredLogs: 'Cargando registros filtrados...',
        noLogsMatchingFilter: 'Ningún registro coincide con los filtros',
        noLogsMatching: 'Ningún registro coincide con los filtros',
        detailedFieldChanges: 'Cambios detallados de campos',
        close: 'Cerrar',
        view: 'Ver',
        creations: 'Creaciones',
        sales: 'Ventas',
        updates: 'Actualizaciones',
        none: 'Ninguno',
        noDataToExport: 'No hay datos para exportar',
        receptionist: 'Recepcionista',
        receipt: 'Recibo',
        paymentReceipt: 'Recibo de pago',
        officialReceipt: 'Recibo de pago oficial',
        member: 'Miembro',
        type: 'Tipo',
        thankYouClub: '¡Gracias por elegir nuestro club! 💪',
        date: 'Fecha',
        actionsCount: 'acciones',
        creationsAndAdditions: 'Creaciones',
        updatesOther: 'Actualizaciones/Otros',
        createAction: 'Crear',
        updateAction: 'Modificar',
        deleteAction: 'Eliminar',
        loginAction: 'Iniciar sesión',
        exportAction: 'Exportar',
        importAction: 'Importar',
        goodsAndSales: 'Ventas y Mercancías',
        settingsAndBackup: 'Ajustes y Respaldo',
        system: 'Sistema',
        monthlyRevenue: 'Beneficios de Suscripciones',
    },
    tr: {
        gymTitle: 'Profesyonel Spor Salonu Yönetim Sistemi',
        login: 'Giriş',
        password: 'Şifre',
        mode: 'Mod',
        logout: 'Çıkış',
        dashboard: 'Panel',
        subscribers: 'Üyeler',
        goods: 'Ürünler',
        expenses: 'Giderler',
        attendance: 'Yoklama',
        classes: 'Dersler',
        staff: 'Personel',
        reports: 'Yıllık Raporlar',
        settings: 'Ayarlar',
        name: 'İsim',
        email: 'E-posta',
        phone: 'Telefon',
        category: 'Kategori',
        price: 'Fiyat',
        count: 'Sayı',
        gender: 'Cinsiyet',
        months: 'Süre',
        startDate: 'Başlangıç',
        endDate: 'Bitiş',
        status: 'Durum',
        actions: 'İşlemler',
        save: 'Kaydet',
        edit: 'Düzenle',
        delete: 'Sil',
        renew: 'Yenile',
        cancel: 'İptal',
        search: 'İsim veya kategori ile ara',
        filterAll: 'Hepsi',
        filterActive: 'Aktif',
        filterExpired: 'Süresi dolmuş',
        filterSoon: 'Yakında bitecek',
        filterFrozen: 'Dondurulmuş',
        male: 'Erkek',
        female: 'Kadın',
        mix: 'Karma',
        day: 'Gün',
        week: 'Hafta',
        halfMonth: 'Yarım Ay',
        month: 'Ay',
        months: 'Aylar',
        active: 'Aktif',
        expired: 'Süresi Dolmuş',
        expiringSoon: 'Yakında Bitecek',
        daysLeft: 'gün kaldı',
        backup: 'Yedekle',
        restore: 'Geri Yükle',
        clearData: 'Verileri Temizle',
        changePasswords: 'Şifre Değiştir',
        item: 'Ürün',
        qty: 'Miktar',
        salePrice: 'Satış Fiyatı',
        costPrice: 'Maliyet',
        profit: 'Kar',
        note: 'Not',
        amount: 'Tutar',
        totalIncome: 'Toplam Gelir',
        totalExpenses: 'Toplam Gider',
        netProfit: 'Net Kar',
        loading: 'Yükleniyor...',
        checkIn: 'Giriş',
        checkOut: 'Çıkış',
        scanQR: 'QR Tara',
        todayAttendance: 'Bugünkü Yoklama',
        totalStats: 'Genel İstatistikler',
        payments: 'Ödemeler',
        measurements: 'Ölçümler',
        notifications: 'Bildirimler',
        export: 'Dışa Aktar',
        inbody: 'Vücut Gelişimi',
        birthdays: 'Doğum Günleri',
        absent: 'Devamsız Üyeler',
        lowStockItems: 'Stok Az',
        installment: 'Taksit',
        paid: 'Ödendi',
        pending: 'Beklemede',
        addPayment: 'Ödeme Ekle',
        weight: 'Kilo',
        bodyFat: 'Yağ Oranı %',
        muscleMass: 'Kas Kütlesi',
        extend: 'Uzat',
        equipment: 'Ekipman',
        loyalty: 'Sadakat',
        role: 'Rol',
        admin: 'Admin',
        data_entry: 'Veri Girişi',
        trainer: 'Eğitmen',
        accountant: 'Muhasebeci',
        marketing: 'Pazarlama',
        sales: 'Satış',
        performance: 'Personel Performansı',
        performanceReportsTitle: 'Personel Performans ve Aktivite Raporları',
        performanceReportsDesc: 'Sistemdeki her çalışanın etkinliğinin ayrıntılı takibi ve analizi',
        refreshData: 'Verileri Yenile',
        exportCsv: 'CSV Dışa Aktar',
        totalLoggedActions: 'Toplam Kaydedilen İşlem',
        activeStaffMembers: 'Aktif Personel Sayısı',
        mostActiveStaff: 'En Aktif Personel',
        staffDirectory: 'Personel Listesi',
        loadingStaff: 'Personel yükleniyor...',
        noStaffRegistered: 'Kayıtlı personel yok',
        employeeKPIs: 'Çalışan Temel Performans Göstergeleri',
        employeeKpis: 'Çalışan Temel Performans Göstergeleri',
        subscribersRegistered: 'Kayıtlı Üyeler',
        paymentsProcessed: 'İşlenen Ödemeler',
        amountsCollected: 'Tahsil Edilen Tutar',
        productsSold: 'Satılan Ürünler',
        expensesRecorded: 'Kaydedilen Giderler',
        totalOperations: 'Toplam İşlemler',
        actionDistribution: 'İşlem Türü Dağılımı',
        actionTypesDistribution: 'İşlem Türü Dağılımı',
        noActivityData: 'Yeterli aktivite verisi yok',
        notEnoughActivityData: 'Yeterli aktivite verisi yok',
        lastLoggedAction: 'Son Kaydedilen İşlem',
        noActionsRecorded: 'Kaydedilmiş işlem yok',
        noRecordedActionsYet: 'Henüz kaydedilmiş işlem yok',
        selectStaffToViewPerf: 'Performans kartını görüntülemek için bir personel seçin',
        selectStaffToView: 'Performans kartını görüntülemek için bir personel seçin',
        filterActivityLogs: 'Aktivite Günlüklerini Filtrele',
        employee: 'Çalışan',
        allStaff: 'Tüm Personel',
        actionType: 'İşlem Türü',
        allActions: 'Tüm İşlemler',
        moduleSection: 'Bölüm/Modül',
        allSections: 'Tüm Bölümler',
        fromDate: 'Başlangıç Tarihi',
        toDate: 'Bitiş Tarihi',
        searchLogsPlaceholder: 'Günlüklerde ara...',
        searchLogsDescription: 'Günlüklerde ara...',
        applyFilters: 'Filtreleri Uygula',
        resetFilters: 'Filtreleri Sıfırla',
        dateTime: 'Tarih ve Saat',
        staffPerformer: 'İşlemi Yapan Personel',
        module: 'Modül',
        action: 'İşlem',
        details: 'Detaylar',
        diff: 'Karşılaştır',
        loadingFilteredLogs: 'Filtrelenmiş günlükler yükleniyor...',
        noLogsMatchingFilter: 'Filtreye uygun günlük bulunamadı',
        noLogsMatching: 'Filtreye uygun günlük bulunamadı',
        detailedFieldChanges: 'Detaylı Alan Değişiklikleri',
        close: 'Kapat',
        view: 'Göster',
        creations: 'Oluşturulanlar',
        sales: 'Satışlar',
        updates: 'Güncellemeler',
        none: 'Yok',
        noDataToExport: 'Dışa aktarılacak veri yok',
        receptionist: 'Resepsiyonist',
        receipt: 'Makbuz',
        paymentReceipt: 'Ödeme Makbuzu',
        officialReceipt: 'Resmi Ödeme Makbuzu',
        member: 'Üye',
        type: 'Tür',
        thankYouClub: 'Kulübümüzü seçtiğiniz için teşekkür ederiz! 💪',
        date: 'Tarih',
        actionsCount: 'işlem',
        creationsAndAdditions: 'Oluşturma ve Ekleme',
        updatesOther: 'Güncellemeler/Diğer',
        createAction: 'Oluştur',
        updateAction: 'Güncelle',
        deleteAction: 'Sil',
        loginAction: 'Giriş',
        exportAction: 'Dışa Aktar',
        importAction: 'İçe Aktar',
        goodsAndSales: 'Ürünler ve Satışlar',
        settingsAndBackup: 'Ayarlar ve Yedekleme',
        system: 'Sistem',
        monthlyRevenue: 'Abonelik Karlıları',
    },
    ru: {
        gymTitle: 'Профессиональная Система Управления Спортивным Залом',
        login: 'Вход',
        password: 'Пароль',
        mode: 'Режим',
        logout: 'Выход',
        dashboard: 'Панель',
        subscribers: 'Абоненты',
        goods: 'Товары',
        expenses: 'Расходы',
        attendance: 'Посещаемость',
        classes: 'Занятия',
        staff: 'Персонал',
        reports: 'Годовые отчеты',
        settings: 'Настройки',
        name: 'Имя',
        email: 'Email',
        phone: 'Телефон',
        category: 'Категория',
        price: 'Цена',
        count: 'Количество',
        gender: 'Пол',
        months: 'Длительность',
        startDate: 'Дата начала',
        endDate: 'Дата окончания',
        status: 'Статус',
        actions: 'Действия',
        save: 'Сохранить',
        edit: 'Изменить',
        delete: 'Удалить',
        renew: 'Продлить',
        cancel: 'Отмена',
        search: 'Поиск по имени или категории',
        filterAll: 'Все',
        filterActive: 'Активные',
        filterExpired: 'Истекшие',
        filterSoon: 'Истекают скоро',
        filterFrozen: 'Замороженные',
        male: 'Мужчины',
        female: 'Женщины',
        mix: 'Смешанный',
        day: 'День',
        week: 'Неделя',
        halfMonth: 'Полмесяца',
        month: 'Месяц',
        months: 'Месяцы',
        active: 'Активен',
        expired: 'Истек',
        expiringSoon: 'Скоро истечет',
        daysLeft: 'дней осталось',
        backup: 'Бэкап',
        restore: 'Восстановить',
        clearData: 'Очистить данные',
        changePasswords: 'Сменить пароли',
        item: 'Товар',
        qty: 'Кол-во',
        salePrice: 'Цена продажи',
        costPrice: 'Себестоимость',
        profit: 'Прибыль',
        note: 'Заметка',
        amount: 'Сумма',
        totalIncome: 'Общий доход',
        totalExpenses: 'Общие расходы',
        netProfit: 'Чистая прибыль',
        loading: 'Загрузка...',
        checkIn: 'Вход',
        checkOut: 'Выход',
        scanQR: 'Сканировать QR',
        todayAttendance: 'Сегодняшняя явка',
        totalStats: 'Общая статистика',
        payments: 'Платежи',
        measurements: 'Замеры',
        notifications: 'Уведомления',
        export: 'Экспорт',
        inbody: 'Динамика тела',
        birthdays: 'Дни рождения',
        absent: 'Отсутствующие',
        lowStockItems: 'Мало товара',
        installment: 'Рассрочка',
        paid: 'Оплачено',
        pending: 'Ожидает',
        addPayment: 'Добавить платеж',
        weight: 'Вес',
        bodyFat: '% жира',
        muscleMass: 'Мышечная масса',
        extend: 'Продлить',
        equipment: 'Оборудование',
        loyalty: 'Лояльность',
        role: 'Роль',
        admin: 'Админ',
        data_entry: 'Ввод данных',
        trainer: 'Тренер',
        accountant: 'Бухгалтер',
        marketing: 'Маркетинг',
        sales: 'Продажи',
        performance: 'Эффективность персонала',
        performanceReportsTitle: 'Отчеты об эффективности и активности персонала',
        performanceReportsDesc: 'Подробный мониторинг и аналитика действий каждого сотрудника в системе',
        refreshData: 'Обновить данные',
        exportCsv: 'Экспорт CSV',
        totalLoggedActions: 'Всего зарегистрированных действий',
        activeStaffMembers: 'Активные сотрудники',
        mostActiveStaff: 'Самый активный сотрудник',
        staffDirectory: 'Список сотрудников',
        loadingStaff: 'Загрузка сотрудников...',
        noStaffRegistered: 'Нет зарегистрированных сотрудников',
        employeeKPIs: 'Ключевые показатели эффективности сотрудника',
        employeeKpis: 'Ключевые показатели эффективности сотрудника',
        subscribersRegistered: 'Зарегистрированные абоненты',
        paymentsProcessed: 'Обработанные платежи',
        amountsCollected: 'Собранные суммы',
        productsSold: 'Проданные товары',
        expensesRecorded: 'Зарегистрированные расходы',
        totalOperations: 'Всего операций',
        actionDistribution: 'Распределение типов действий',
        actionTypesDistribution: 'Распределение типов действий',
        noActivityData: 'Недостаточно данных об активности',
        notEnoughActivityData: 'Недостаточно данных об активности',
        lastLoggedAction: 'Последнее действие',
        noActionsRecorded: 'Действий не зарегистрировано',
        noRecordedActionsYet: 'Пока нет зарегистрированных действий',
        selectStaffToViewPerf: 'Выберите сотрудника для просмотра карточки эффективности',
        selectStaffToView: 'Выберите сотрудника для просмотра карточки эффективности',
        filterActivityLogs: 'Фильтрация журналов активности',
        employee: 'Сотрудник',
        allStaff: 'Все сотрудники',
        actionType: 'Тип действия',
        allActions: 'Все действия',
        moduleSection: 'Раздел/Модуль',
        allSections: 'Все разделы',
        fromDate: 'С даты',
        toDate: 'По дату',
        searchLogsPlaceholder: 'Поиск по журналам...',
        searchLogsDescription: 'Поиск по журналам...',
        applyFilters: 'Применить фильтры',
        resetFilters: 'Сбросить фильтры',
        dateTime: 'Дата и время',
        staffPerformer: 'Исполнитель',
        module: 'Модуль',
        action: 'Действие',
        details: 'Детали',
        diff: 'Изменения',
        loadingFilteredLogs: 'Загрузка отфильтрованных журналов...',
        noLogsMatchingFilter: 'Нет журналов, соответствующих фильтрам',
        noLogsMatching: 'Нет журналов, соответствующих фильтрам',
        detailedFieldChanges: 'Подробные изменения полей',
        close: 'Закрыть',
        view: 'Просмотр',
        creations: 'Создания',
        sales: 'Продажи',
        updates: 'Обновления',
        none: 'Нет',
        noDataToExport: 'Нет данных для экспорта',
        receptionist: 'Регистратор',
        receipt: 'Квитанция',
        paymentReceipt: 'Квитанция об оплате',
        officialReceipt: 'Официальная квитанция об оплате',
        member: 'Участник',
        type: 'Тип',
        thankYouClub: 'Спасибо, что выбрали наш клуб! 💪',
        date: 'Дата',
        actionsCount: 'действий',
        creationsAndAdditions: 'Создание и добавление',
        updatesOther: 'Обновления/Другое',
        createAction: 'Создать',
        updateAction: 'Обновить',
        deleteAction: 'Удалить',
        loginAction: 'Вход',
        exportAction: 'Экспорт',
        importAction: 'Импорт',
        goodsAndSales: 'Товары и продажи',
        settingsAndBackup: 'Настройки и бэкап',
        system: 'Система',
        monthlyRevenue: 'Доход от Подписок',
    },
    zh: {
        gymTitle: '专业健身房管理系统',
        login: '登录',
        password: '密码',
        mode: '模式',
        logout: '登出',
        dashboard: '仪表盘',
        subscribers: '会员',
        goods: '商品',
        expenses: '支出',
        attendance: '考勤',
        classes: '课程',
        staff: '员工',
        reports: '年度报告',
        settings: '设置',
        name: '姓名',
        email: '电子邮件',
        phone: '电话',
        category: '类别',
        price: '价格',
        count: '人数',
        gender: '性别',
        months: '时长',
        startDate: '开始日期',
        endDate: '结束日期',
        status: '状态',
        actions: '操作',
        save: '保存',
        edit: '编辑',
        delete: '删除',
        renew: '续约',
        cancel: '取消',
        search: '按姓名或类别搜索',
        filterAll: '全部',
        filterActive: '活跃',
        filterExpired: '已过期',
        filterSoon: '即将到期',
        filterFrozen: '已冻结',
        male: '男',
        female: '女',
        mix: '混合',
        day: '日',
        week: '周',
        halfMonth: '半月',
        month: '月',
        months: '月',
        active: '活跃',
        expired: '已过期',
        expiringSoon: '即将到期',
        daysLeft: '天剩余',
        backup: '备份',
        restore: '还原',
        clearData: '清除数据',
        changePasswords: '更改密码',
        item: '项目',
        qty: '数量',
        salePrice: '售价',
        costPrice: '成本价',
        profit: '利润',
        note: '备注',
        amount: '金额',
        totalIncome: '总收入',
        totalExpenses: '总支出',
        netProfit: '净利润',
        loading: '正在加载...',
        checkIn: '签到',
        checkOut: '签退',
        scanQR: '扫描二维码',
        todayAttendance: '今日出勤',
        totalStats: '总统计',
        payments: '付款',
        measurements: '测量',
        notifications: '通知',
        export: '导出',
        inbody: '身体进化',
        birthdays: '生日',
        absent: '缺席会员',
        lowStockItems: '库存不足',
        installment: '分期',
        paid: '已付',
        pending: '待定',
        addPayment: '添加付款',
        weight: '体重',
        bodyFat: '体脂率 %',
        muscleMass: '肌肉量',
        extend: '延长',
        equipment: '设备',
        loyalty: '忠诚度',
        role: '角色',
        admin: '管理员',
        data_entry: '数据录入',
        trainer: '教练',
        accountant: '会计',
        marketing: '市场营销',
        sales: '销售',
        performance: '员工绩效',
        performanceReportsTitle: '员工绩效与活动报告',
        performanceReportsDesc: '系统中每个员工操作的详细监控和分析',
        refreshData: '刷新数据',
        exportCsv: '导出 CSV',
        totalLoggedActions: '记录的操作总数',
        activeStaffMembers: '活跃员工人数',
        mostActiveStaff: '最活跃的员工',
        staffDirectory: '员工名册',
        loadingStaff: '正在加载员工...',
        noStaffRegistered: '未注册员工',
        employeeKPIs: '员工关键绩效指标',
        employeeKpis: '员工关键绩效指标',
        subscribersRegistered: '注册会员数',
        paymentsProcessed: '已处理付款',
        amountsCollected: '收讫金额',
        productsSold: '售出商品',
        expensesRecorded: '记录的支出',
        totalOperations: '总操作数',
        actionDistribution: '操作类型分布',
        actionTypesDistribution: '操作类型分布',
        noActivityData: '没有足够的活动数据',
        notEnoughActivityData: '没有足够的活动数据',
        lastLoggedAction: '最后记录的操作',
        noActionsRecorded: '尚无操作记录',
        noRecordedActionsYet: '尚无操作记录',
        selectStaffToViewPerf: '选择一名员工以查看其绩效卡',
        selectStaffToView: '选择一名员工以查看其绩效卡',
        filterActivityLogs: '筛选活动日志',
        employee: '员工',
        allStaff: '所有员工',
        actionType: '操作类型',
        allActions: '所有操作',
        moduleSection: '模块/区域',
        allSections: '所有模块',
        fromDate: '开始日期',
        toDate: '结束日期',
        searchLogsPlaceholder: '搜索日志...',
        searchLogsDescription: '搜索日志...',
        applyFilters: '应用筛选',
        resetFilters: '重置筛选',
        dateTime: '日期与时间',
        staffPerformer: '执行员工',
        module: '模块',
        action: '操作',
        details: '详情',
        diff: '比对',
        loadingFilteredLogs: '正在加载筛选日志...',
        noLogsMatchingFilter: '没有符合筛选条件的日志',
        noLogsMatching: '没有符合筛选条件的日志',
        detailedFieldChanges: '详细字段变更',
        close: '关闭',
        view: '查看',
        creations: '创建',
        sales: '销售',
        updates: '更新',
        none: '无',
        noDataToExport: '没有可导出的数据',
        receptionist: '接待员',
        receipt: '收据',
        paymentReceipt: '付款收据',
        officialReceipt: '正式付款收据',
        member: '会员',
        type: '类型',
        thankYouClub: '感谢您选择我们的俱乐部！💪',
        date: '日期',
        actionsCount: '次操作',
        creationsAndAdditions: '创建和添加',
        updatesOther: '更新/其他',
        createAction: '创建',
        updateAction: '更新',
        deleteAction: '删除',
        loginAction: '登录',
        exportAction: '导出',
        importAction: '导入',
        goodsAndSales: '商品与销售',
        settingsAndBackup: '设置与备份',
        system: '系统',
        monthlyRevenue: '订阅收益',
    },
    de: {
        gymTitle: 'Professionelles Fitnessstudio-Managementsystem',
        login: 'Anmelden',
        password: 'Passwort',
        mode: 'Modus',
        logout: 'Abmelden',
        dashboard: 'Dashboard',
        subscribers: 'Abonnenten',
        goods: 'Waren',
        expenses: 'Ausgaben',
        attendance: 'Anwesenheit',
        classes: 'Kurse',
        staff: 'Personal',
        reports: 'Jahresberichte',
        settings: 'Einstellungen',
        name: 'Name',
        email: 'E-Mail',
        phone: 'Telefon',
        category: 'Kategorie',
        price: 'Preis',
        count: 'Anzahl',
        gender: 'Geschlecht',
        months: 'Dauer',
        startDate: 'Startdatum',
        endDate: 'Enddatum',
        status: 'Status',
        actions: 'Aktionen',
        save: 'Speichern',
        edit: 'Bearbeiten',
        delete: 'Löschen',
        renew: 'Erneuern',
        cancel: 'Abbrechen',
        search: 'Suche nach Name oder Kategorie',
        filterAll: 'Alle',
        filterActive: 'Aktiv',
        filterExpired: 'Abgelaufen',
        filterSoon: 'Läuft bald ab',
        filterFrozen: 'Eingefroren',
        male: 'Männlich',
        female: 'Weiblich',
        mix: 'Gemischt',
        day: 'Tag',
        week: 'Woche',
        halfMonth: 'Halber Monat',
        month: 'Monat',
        months: 'Monate',
        active: 'Aktiv',
        expired: 'Abgelaufen',
        expiringSoon: 'Läuft bald ab',
        daysLeft: 'Tage übrig',
        backup: 'Backup',
        restore: 'Wiederherstellen',
        clearData: 'Daten löschen',
        changePasswords: 'Passwörter ändern',
        item: 'Artikel',
        qty: 'Menge',
        salePrice: 'Verkaufspreis',
        costPrice: 'Selbstkostenpreis',
        profit: 'Gewinn',
        note: 'Notiz',
        amount: 'Betrag',
        totalIncome: 'Gesamteinkommen',
        totalExpenses: 'Gesamtausgaben',
        netProfit: 'Nettogewinn',
        loading: 'Laden...',
        checkIn: 'Einchecken',
        checkOut: 'Auschecken',
        scanQR: 'QR scannen',
        todayAttendance: 'Heutige Anwesenheit',
        totalStats: 'Gesamtstatistik',
        payments: 'Zahlungen',
        measurements: 'Messungen',
        notifications: 'Benachrichtigungen',
        export: 'Exportieren',
        inbody: 'Körperentwicklung',
        birthdays: 'Geburtstage',
        absent: 'Abwesende Mitglieder',
        lowStockItems: 'Niedriger Lagerbestand',
        installment: 'Ratenzahlung',
        paid: 'Bezahlt',
        pending: 'Ausstehend',
        addPayment: 'Zahlung hinzufügen',
        weight: 'Gewicht',
        bodyFat: 'Körperfett %',
        muscleMass: 'Muskelmasse',
        extend: 'Verlängern',
        equipment: 'Ausrüstung',
        loyalty: 'Loyalität',
        role: 'Rolle',
        admin: 'Admin',
        data_entry: 'Dateneingabe',
        trainer: 'Trainer',
        accountant: 'Buchhalter',
        marketing: 'Marketing',
        sales: 'Verkauf',
        performance: 'Mitarbeiterleistung',
        performanceReportsTitle: 'Berichte über Mitarbeiterleistung und -aktivität',
        performanceReportsDesc: 'Detaillierte Überwachung und Analyse der Mitarbeiteraktionen im System',
        refreshData: 'Daten aktualisieren',
        exportCsv: 'CSV exportieren',
        totalLoggedActions: 'Aktionen insgesamt',
        activeStaffMembers: 'Aktive Mitarbeiter',
        mostActiveStaff: 'Aktivster Mitarbeiter',
        staffDirectory: 'Mitarbeiterverzeichnis',
        loadingStaff: 'Personal wird geladen...',
        noStaffRegistered: 'Kein Personal registriert',
        employeeKPIs: 'Leistungsindikatoren des Mitarbeiters',
        employeeKpis: 'Leistungsindikatoren des Mitarbeiters',
        subscribersRegistered: 'Registrierte Abonnenten',
        paymentsProcessed: 'Verarbeitete Zahlungen',
        amountsCollected: 'Gesammelte Beträge',
        productsSold: 'Verkaufte Produkte',
        expensesRecorded: 'Registrierte Ausgaben',
        totalOperations: 'Operationen insgesamt',
        actionDistribution: 'Verteilung der Aktionsarten',
        actionTypesDistribution: 'Verteilung der Aktionsarten',
        noActivityData: 'Nicht genügend Aktivitätsdaten',
        notEnoughActivityData: 'Nicht genügend Aktivitätsdaten',
        lastLoggedAction: 'Letzte Aktion',
        noActionsRecorded: 'Keine Aktionen aufgezeichnet',
        noRecordedActionsYet: 'Noch keine Aktionen aufgezeichnet',
        selectStaffToViewPerf: 'Wählen Sie einen Mitarbeiter aus, um seine Leistungskarte anzuzeigen',
        selectStaffToView: 'Wählen Sie einen Mitarbeiter aus, um seine Leistungskarte anzuzeigen',
        filterActivityLogs: 'Aktivitätsprotokolle filtern',
        employee: 'Mitarbeiter',
        allStaff: 'Gesamtes Personal',
        actionType: 'Aktionsart',
        allActions: 'Alle Aktionen',
        moduleSection: 'Bereich/Modul',
        allSections: 'Alle Bereiche',
        fromDate: 'Von Datum',
        toDate: 'Bis Datum',
        searchLogsPlaceholder: 'Protokolle suchen...',
        searchLogsDescription: 'Protokolle suchen...',
        applyFilters: 'Filter anwenden',
        resetFilters: 'Filter zurücksetzen',
        dateTime: 'Datum & Uhrzeit',
        staffPerformer: 'Ausführender Mitarbeiter',
        module: 'Modul',
        action: 'Aktion',
        details: 'Details',
        diff: 'Unterschied',
        loadingFilteredLogs: 'Gefilterte Protokolle werden geladen...',
        noLogsMatchingFilter: 'Keine Protokolle entsprechen dem Filter',
        noLogsMatching: 'Keine Protokolle entsprechen dem Filter',
        detailedFieldChanges: 'Detaillierte Feldänderungen',
        close: 'Schließen',
        view: 'Ansehen',
        creations: 'Erstellungen',
        sales: 'Verkäufe',
        updates: 'Aktualisierungen',
        none: 'Keine',
        noDataToExport: 'Keine Daten zum Exportieren',
        receptionist: 'Rezeptionist',
        receipt: 'Quittung',
        paymentReceipt: 'Zahlungsbeleg',
        officialReceipt: 'Offizieller Zahlungsbeleg',
        member: 'Mitglied',
        type: 'Typ',
        thankYouClub: 'Vielen Dank, dass Sie sich für unseren Club entschieden haben! 💪',
        date: 'Datum',
        actionsCount: 'Aktionen',
        creationsAndAdditions: 'Erstellungen & Hinzufügungen',
        updatesOther: 'Aktualisierungen/Sonstiges',
        createAction: 'Erstellen',
        updateAction: 'Aktualisieren',
        deleteAction: 'Löschen',
        loginAction: 'Anmelden',
        exportAction: 'Exportieren',
        importAction: 'Importieren',
        goodsAndSales: 'Waren & Verkäufe',
        settingsAndBackup: 'Einstellungen & Backup',
        system: 'System',
        monthlyRevenue: 'Abonnement-Gewinne',
    },
    hi: {
        gymTitle: 'व्यावसायिक जिम प्रबंधन प्रणाली',
        login: 'लॉगिन करें',
        password: 'पासवर्ड',
        mode: 'मोड',
        logout: 'लॉगआउट करें',
        dashboard: 'डैशबोर्ड',
        subscribers: 'सदस्य',
        goods: 'वस्तुएं',
        expenses: 'खर्च',
        attendance: 'उपस्थिति',
        classes: 'कक्षाएं',
        staff: 'कर्मचारी',
        reports: 'वार्षिक रिपोर्ट',
        settings: 'सेटिंग्स',
        name: 'नाम',
        email: 'ईमेल',
        phone: 'फ़ोन',
        category: 'श्रेणी',
        price: 'कीमत',
        count: 'संख्या',
        gender: 'लिंग',
        months: 'अवधि',
        startDate: 'शुरुआत की तारीख',
        endDate: 'समाप्ति की तारीख',
        status: 'स्थिति',
        actions: 'कार्रवाई',
        save: 'सहेजें',
        edit: 'संपादित करें',
        delete: 'हटाएं',
        renew: 'नवीनीकरण करें',
        cancel: 'रद्द करें',
        search: 'नाम या श्रेणी के आधार पर खोजें',
        filterAll: 'सभी',
        filterActive: 'सक्रिय',
        filterExpired: 'समाप्त',
        filterSoon: 'जल्द समाप्त होने वाला',
        filterFrozen: 'रोका हुआ',
        male: 'पुरुष',
        female: 'महिला',
        mix: 'मिश्रित',
        day: 'दिन',
        week: 'सप्ताह',
        halfMonth: 'आधा महीना',
        month: 'महीना',
        months: 'महीने',
        active: 'सक्रिय',
        expired: 'समाप्त',
        expiringSoon: 'जल्द समाप्त',
        daysLeft: 'दिन शेष',
        backup: 'बैकअप',
        restore: 'पुनर्स्थापित करें',
        clearData: 'डेटा साफ़ करें',
        changePasswords: 'पासवर्ड बदलें',
        item: 'सामान',
        qty: 'मात्रा',
        salePrice: 'विक्रय मूल्य',
        costPrice: 'लागत मूल्य',
        profit: 'लाभ',
        note: 'नोट',
        amount: 'राशि',
        totalIncome: 'कुल आय',
        totalExpenses: 'कुल खर्च',
        netProfit: 'शुद्ध लाभ',
        loading: 'लोड हो रहा है...',
        checkIn: 'चेक इन',
        checkOut: 'चेक आउट',
        scanQR: 'क्यूआर स्कैन करें',
        todayAttendance: 'आज की उपस्थिति',
        totalStats: 'कुल आँकड़े',
        payments: 'भुगतान',
        measurements: 'माप',
        notifications: 'सूचनाएं',
        export: 'निर्यात करें',
        inbody: 'शरीर विकास',
        birthdays: 'जन्मदिन',
        absent: 'अनुपस्थित सदस्य',
        lowStockItems: 'कम स्टॉक',
        installment: 'किस्त',
        paid: 'भुगतान किया गया',
        pending: 'लंबित',
        addPayment: 'भुगतान जोड़ें',
        weight: 'वजन',
        bodyFat: 'शरीर की वसा %',
        muscleMass: 'मांसपेशी द्रव्यमान',
        extend: 'बढ़ाएं',
        equipment: 'उपकरण',
        loyalty: 'निष्ठा',
        role: 'भूमिका',
        admin: 'एडमिन',
        data_entry: 'डेटा प्रविष्टि',
        trainer: 'प्रशिक्षक',
        accountant: 'लेखाकार',
        marketing: 'मार्केटिंग',
        sales: 'बिक्री',
        performance: 'कर्मचारी प्रदर्शन',
        performanceReportsTitle: 'कर्मचारी प्रदर्शन और गतिविधि रिपोर्ट',
        performanceReportsDesc: 'सिस्टम में प्रत्येक कर्मचारी के कार्यों की विस्तृत निगरानी और विश्लेषण',
        refreshData: 'डेटा ताज़ा करें',
        exportCsv: 'सीएसवी निर्यात करें',
        totalLoggedActions: 'कुल रिकॉर्ड की गई गतिविधियां',
        activeStaffMembers: 'सक्रिय कर्मचारी',
        mostActiveStaff: 'सबसे सक्रिय कर्मचारी',
        staffDirectory: 'कर्मचारी निर्देशिका',
        loadingStaff: 'कर्मचारियों को लोड किया जा रहा है...',
        noStaffRegistered: 'कोई कर्मचारी पंजीकृत नहीं है',
        employeeKPIs: 'कर्मचारी के मुख्य प्रदर्शन संकेतक',
        employeeKpis: 'कर्मचारी के मुख्य प्रदर्शन संकेतक',
        subscribersRegistered: 'पंजीकृत सदस्य',
        paymentsProcessed: 'संसाधित भुगतान',
        amountsCollected: 'एकत्रित राशि',
        productsSold: 'बेचे गए उत्पाद',
        expensesRecorded: 'रिकॉर्ड किए गए खर्च',
        totalOperations: 'कुल संचालन',
        actionDistribution: 'गतिविधि प्रकार वितरण',
        actionTypesDistribution: 'गतिविधि प्रकार वितरण',
        noActivityData: 'पर्याप्त गतिविधि डेटा नहीं है',
        notEnoughActivityData: 'पर्याप्त गतिविधि डेटा नहीं है',
        lastLoggedAction: 'अंतिम रिकॉर्ड की गई गतिविधि',
        noActionsRecorded: 'कोई गतिविधि दर्ज नहीं',
        noRecordedActionsYet: 'अभी तक कोई गतिविधि दर्ज नहीं है',
        selectStaffToViewPerf: 'प्रदर्शन कार्ड देखने के लिए किसी कर्मचारी का चयन करें',
        selectStaffToView: 'प्रदर्शन कार्ड देखने के लिए किसी कर्मचारी का चयन करें',
        filterActivityLogs: 'गतिविधि लॉग फ़िल्टर करें',
        employee: 'कर्मचारी',
        allStaff: 'सभी कर्मचारी',
        actionType: 'गतिविधि प्रकार',
        allActions: 'सभी गतिविधियां',
        moduleSection: 'अनुभाग/मॉड्यूल',
        allSections: 'सभी अनुभाग',
        fromDate: 'इस तारीख से',
        toDate: 'इस तारीख तक',
        searchLogsPlaceholder: 'लॉग खोजें...',
        searchLogsDescription: 'लॉग खोजें...',
        applyFilters: 'फ़िल्टर लागू करें',
        resetFilters: 'फ़िल्टर रीसेट करें',
        dateTime: 'दिनांक और समय',
        staffPerformer: 'कार्यकर्ता कर्मचारी',
        module: 'मॉड्यूल',
        action: 'क्रिया',
        details: 'विवरण',
        diff: 'अंतर',
        loadingFilteredLogs: 'फ़िल्टर किए गए लॉग लोड हो रहे हैं...',
        noLogsMatchingFilter: 'फ़िल्टर सेटिंग्स से मेल खाने वाले कोई लॉग नहीं हैं',
        noLogsMatching: 'फ़िल्टर सेटिंग्स से मेल खाने वाले कोई लॉग नहीं हैं',
        detailedFieldChanges: 'विस्तृत फ़ील्ड परिवर्तन',
        close: 'बंद करें',
        view: 'देखें',
        creations: 'निर्माण',
        sales: 'बिक्री',
        updates: 'अद्यतन',
        none: 'कोई नहीं',
        noDataToExport: 'निर्यात करने के लिए कोई डेटा नहीं है',
        receptionist: 'रिसेप्शनिस्ट',
        receipt: 'रसीद',
        paymentReceipt: 'भुगतान रसीद',
        officialReceipt: 'आधिकारिक भुगतान रसीद',
        member: 'सदस्य',
        type: 'प्रकार',
        thankYouClub: 'हमारे क्लब को चुनने के लिए धन्यवाद! 💪',
        date: 'तारीख',
        actionsCount: 'गतिविधियां',
        creationsAndAdditions: 'सृजन और जोड़',
        updatesOther: 'अद्यतन/अन्य',
        createAction: 'बनाएं',
        updateAction: 'अद्यतन',
        deleteAction: 'हटाएं',
        loginAction: 'लॉगिन',
        exportAction: 'निर्यात',
        importAction: 'आयात',
        goodsAndSales: 'सामान और बिक्री',
        settingsAndBackup: 'सेटिंग्स और बैकअप',
        system: 'सिस्टम',
        monthlyRevenue: 'सदस्यता लाभ',
    },
    pt: {
        gymTitle: 'Sistema Profissional de Gestão de Academia',
        login: 'Entrar',
        password: 'Senha',
        mode: 'Modo',
        logout: 'Sair',
        dashboard: 'Painel',
        subscribers: 'Alunos',
        goods: 'Produtos',
        expenses: 'Despesas',
        attendance: 'Frequência',
        classes: 'Aulas',
        staff: 'Equipe',
        reports: 'Relatórios Anuais',
        settings: 'Configurações',
        name: 'Nome',
        email: 'E-mail',
        phone: 'Telefone',
        category: 'Categoria',
        price: 'Preço',
        count: 'Quantidade',
        gender: 'Gênero',
        months: 'Duração',
        startDate: 'Data Inicial',
        endDate: 'Data Final',
        status: 'Status',
        actions: 'Ações',
        save: 'Salvar',
        edit: 'Editar',
        delete: 'Excluir',
        renew: 'Renovar',
        cancel: 'Cancelar',
        search: 'Buscar por nome ou categoria',
        filterAll: 'Todos',
        filterActive: 'Ativo',
        filterExpired: 'Expirado',
        filterSoon: 'Vencendo logo',
        filterFrozen: 'Trancado',
        male: 'Masculino',
        female: 'Feminino',
        mix: 'Misto',
        day: 'Dia',
        week: 'Semana',
        halfMonth: 'Quinze dias',
        month: 'Mês',
        months: 'Meses',
        active: 'Ativo',
        expired: 'Expirado',
        expiringSoon: 'Vencendo logo',
        daysLeft: 'dias restantes',
        backup: 'Backup',
        restore: 'Restaurar',
        clearData: 'Limpar Dados',
        changePasswords: 'Mudar Senhas',
        item: 'Item',
        qty: 'Qtd',
        salePrice: 'Preço Venda',
        costPrice: 'Preço Custo',
        profit: 'Lucro',
        note: 'Nota',
        amount: 'Valor',
        totalIncome: 'Renda Total',
        totalExpenses: 'Despesas Totais',
        netProfit: 'Lucro Líquido',
        loading: 'Carregando...',
        checkIn: 'Entrada',
        checkOut: 'Saída',
        scanQR: 'Escanear QR',
        todayAttendance: 'Presença hoje',
        totalStats: 'Estatísticas Gerais',
        payments: 'Pagamentos',
        measurements: 'Medidas',
        notifications: 'Notificações',
        export: 'Exportar',
        inbody: 'Evolução Corporal',
        birthdays: 'Aniversários',
        absent: 'Alunos Ausentes',
        lowStockItems: 'Estoque Baixo',
        installment: 'Parcela',
        paid: 'Pago',
        pending: 'Pendente',
        addPayment: 'Adicionar Pagamento',
        weight: 'Peso',
        bodyFat: '% de Gordura',
        muscleMass: 'Massa Muscular',
        extend: 'Estender',
        equipment: 'Equipamento',
        loyalty: 'Fidelidade',
        role: 'Cargo',
        admin: 'Admin',
        data_entry: 'Entrada de Dados',
        trainer: 'Instrutor',
        accountant: 'Contador',
        marketing: 'Marketing',
        sales: 'Vendas',
        performance: 'Desempenho da Equipe',
        performanceReportsTitle: 'Relatórios de Desempenho e Atividade da Equipe',
        performanceReportsDesc: 'Monitoramento detalhado e análises das ações de cada funcionário no sistema',
        refreshData: 'Atualizar dados',
        exportCsv: 'Exportar CSV',
        totalLoggedActions: 'Total de ações registradas',
        activeStaffMembers: 'Funcionários ativos',
        mostActiveStaff: 'Funcionário mais ativo',
        staffDirectory: 'Lista de funcionários',
        loadingStaff: 'Carregando equipe...',
        noStaffRegistered: 'Nenhum funcionário registrado',
        employeeKPIs: 'Indicadores de desempenho do funcionário',
        employeeKpis: 'Indicadores de desempenho do funcionário',
        subscribersRegistered: 'Alunos registrados',
        paymentsProcessed: 'Pagamentos processados',
        amountsCollected: 'Valores arrecadados',
        productsSold: 'Produtos vendidos',
        expensesRecorded: 'Despesas registradas',
        totalOperations: 'Total de operações',
        actionDistribution: 'Distribuição de tipos de ação',
        actionTypesDistribution: 'Distribuição de tipos de ação',
        noActivityData: 'Dados de atividade insuficientes',
        notEnoughActivityData: 'Dados de atividade insuficientes',
        lastLoggedAction: 'Última ação registrada',
        noActionsRecorded: 'Nenhuma ação registrada',
        noRecordedActionsYet: 'Nenhuma ação registrada ainda',
        selectStaffToViewPerf: 'Selecione um funcionário para ver seu cartão de desempenho',
        selectStaffToView: 'Selecione um funcionário para ver seu cartão de desempenho',
        filterActivityLogs: 'Filtrar logs de atividade',
        employee: 'Funcionário',
        allStaff: 'Toda a equipe',
        actionType: 'Tipo de ação',
        allActions: 'Todas as ações',
        moduleSection: 'Seção/Módulo',
        allSections: 'Todas as seções',
        fromDate: 'A partir de',
        toDate: 'Até',
        searchLogsPlaceholder: 'Buscar nos logs...',
        searchLogsDescription: 'Buscar nos logs...',
        applyFilters: 'Aplicar filtros',
        resetFilters: 'Redefinir filtros',
        dateTime: 'Data e Hora',
        staffPerformer: 'Funcionário executor',
        module: 'Módulo',
        action: 'Ação',
        details: 'Detalhes',
        diff: 'Diferença',
        loadingFilteredLogs: 'Carregando logs filtrados...',
        noLogsMatchingFilter: 'Nenhum log correspondente aos filtros',
        noLogsMatching: 'Nenhum log correspondente aos filtros',
        detailedFieldChanges: 'Alterações detalhadas de campos',
        close: 'Fechar',
        view: 'Visualizar',
        creations: 'Criações',
        sales: 'Vendas',
        updates: 'Atualizações',
        none: 'Nenhum',
        noDataToExport: 'Não há dados para exportar',
        receptionist: 'Recepcionista',
        receipt: 'Recibo',
        paymentReceipt: 'Recibo de pagamento',
        officialReceipt: 'Recibo de pagamento oficial',
        member: 'Membro',
        type: 'Tipo',
        thankYouClub: 'Obrigado por escolher o nosso clube! 💪',
        date: 'Data',
        actionsCount: 'ações',
        creationsAndAdditions: 'Criações e Adições',
        updatesOther: 'Atualizações/Outros',
        createAction: 'Criar',
        updateAction: 'Atualizar',
        deleteAction: 'Excluir',
        loginAction: 'Entrar',
        exportAction: 'Exportar',
        importAction: 'Importar',
        goodsAndSales: 'Produtos e Vendas',
        settingsAndBackup: 'Configurações e Backup',
        system: 'Sistema',
        monthlyRevenue: 'Lucros das Assinaturas',
    },
    it: {
        gymTitle: 'Sistema Professionale di Gestione Palestra',
        login: 'Accedi',
        password: 'Password',
        mode: 'Modalità',
        logout: 'Esci',
        dashboard: 'Bacheca',
        subscribers: 'Iscritti',
        goods: 'Merci',
        expenses: 'Spese',
        attendance: 'Presenze',
        classes: 'Corsi',
        staff: 'Personale',
        reports: 'Rapporti Annuali',
        settings: 'Impostazioni',
        name: 'Nome',
        email: 'Email',
        phone: 'Telefono',
        category: 'Categoria',
        price: 'Prezzo',
        count: 'Conteggio',
        gender: 'Genere',
        months: 'Durata',
        startDate: 'Data Inizio',
        endDate: 'Data Fine',
        status: 'Stato',
        actions: 'Azioni',
        save: 'Salva',
        edit: 'Modifica',
        delete: 'Elimina',
        renew: 'Rinnova',
        cancel: 'Annulla',
        search: 'Cerca per nome o categoria',
        filterAll: 'Tutti',
        filterActive: 'Attivo',
        filterExpired: 'Scaduto',
        filterSoon: 'In scadenza',
        filterFrozen: 'Congelato',
        male: 'Maschio',
        female: 'Femmina',
        mix: 'Misto',
        day: 'Giorno',
        week: 'Settimana',
        halfMonth: 'Quindici giorni',
        month: 'Mese',
        months: 'Mesi',
        active: 'Attivo',
        expired: 'Scaduto',
        expiringSoon: 'In scadenza',
        daysLeft: 'giorni rimasti',
        backup: 'Backup',
        restore: 'Ripristina',
        clearData: 'Cancella Dati',
        changePasswords: 'Cambia Password',
        item: 'Articolo',
        qty: 'Quantità',
        salePrice: 'Prezzo Vendita',
        costPrice: 'Prezzo Costo',
        profit: 'Profitto',
        note: 'Nota',
        amount: 'Importo',
        totalIncome: 'Entrate Totali',
        totalExpenses: 'Spese Totali',
        netProfit: 'Utile Netto',
        loading: 'Caricamento...',
        checkIn: 'Ingresso',
        checkOut: 'Uscita',
        scanQR: 'Scansiona QR',
        todayAttendance: 'Presenze Oggi',
        totalStats: 'Statistiche Totali',
        payments: 'Pagamenti',
        measurements: 'Misure',
        notifications: 'Notifiche',
        export: 'Esporta',
        inbody: 'Evoluzione Corporea',
        birthdays: 'Compleanni',
        absent: 'Membri Assenti',
        lowStockItems: 'Sottoscorta',
        installment: 'Rata',
        paid: 'Pagato',
        pending: 'In sospeso',
        addPayment: 'Aggiungi Pagamento',
        weight: 'Peso',
        bodyFat: '% Grasso',
        muscleMass: 'Massa Muscolare',
        extend: 'Estendi',
        equipment: 'Attrezzatura',
        loyalty: 'Fedeltà',
        role: 'Ruolo',
        admin: 'Admin',
        data_entry: 'Inserimento Dati',
        trainer: 'Istruttore',
        accountant: 'Contabile',
        marketing: 'Marketing',
        sales: 'Vendite',
        performance: 'Prestazioni del Personale',
        performanceReportsTitle: 'Rapporti sulle Prestazioni e sulle Attività del Personale',
        performanceReportsDesc: 'Monitoraggio dettagliato e analisi delle azioni di ciascun dipendente nel sistema',
        refreshData: 'Aggiorna dati',
        exportCsv: 'Esporta CSV',
        totalLoggedActions: 'Totale azioni registrate',
        activeStaffMembers: 'Membres du personnel actifs',
        mostActiveStaff: 'Personale più attivo',
        staffDirectory: 'Elenco del personale',
        loadingStaff: 'Caricamento del personale...',
        noStaffRegistered: 'Nessun dipendente registrato',
        employeeKPIs: 'Indicatori chiave di prestazione del dipendente',
        employeeKpis: 'Indicatori chiave di prestazione del dipendente',
        subscribersRegistered: 'Iscritti registrati',
        paymentsProcessed: 'Pagamenti elaborati',
        amountsCollected: 'Importi riscossi',
        productsSold: 'Prodotti venduti',
        expensesRecorded: 'Spese registrate',
        totalOperations: 'Operazioni totali',
        actionDistribution: 'Distribuzione dei tipi di azione',
        actionTypesDistribution: 'Distribuzione dei tipi di azione',
        noActivityData: 'Dati sull\'attività insufficienti',
        notEnoughActivityData: 'Dati sull\'attività insufficienti',
        lastLoggedAction: 'Ultima azione registrata',
        noActionsRecorded: 'Nessuna azione registrata',
        noRecordedActionsYet: 'Ancora nessuna azione registrata',
        selectStaffToViewPerf: 'Seleziona un dipendente per visualizzare la scheda delle prestazioni',
        selectStaffToView: 'Seleziona un dipendente per visualizzare la scheda delle prestazioni',
        filterActivityLogs: 'Filtra i registri delle attività',
        employee: 'Dipendente',
        allStaff: 'Tutto il personale',
        actionType: 'Tipo di azione',
        allActions: 'Tutte le azioni',
        moduleSection: 'Sezione/Modulo',
        allSections: 'Tutte le sezioni',
        fromDate: 'Da data',
        toDate: 'A data',
        searchLogsPlaceholder: 'Cerca nei registri...',
        searchLogsDescription: 'Cerca nei registri...',
        applyFilters: 'Applica filtri',
        resetFilters: 'Reimposta filtri',
        dateTime: 'Data e ora',
        staffPerformer: 'Operatore',
        module: 'Modulo',
        action: 'Azione',
        details: 'Dettagli',
        diff: 'Modifiche',
        loadingFilteredLogs: 'Caricamento dei registri filtrati...',
        noLogsMatchingFilter: 'Nessun registro corrispondente al filtro',
        noLogsMatching: 'Nessun registro corrispondente al filtro',
        detailedFieldChanges: 'Modifiche dettagliate dei campi',
        close: 'Chiudi',
        view: 'Visualizza',
        creations: 'Creazioni',
        sales: 'Vendite',
        updates: 'Aggiornamenti',
        none: 'Nessuno',
        noDataToExport: 'Nessun dato da esportare',
        receptionist: 'Addetto alla reception',
        receipt: 'Ricevuta',
        paymentReceipt: 'Ricevuta di pagamento',
        officialReceipt: 'Ricevuta di pagamento ufficiale',
        member: 'Membro',
        type: 'Tipo',
        thankYouClub: 'Grazie per aver scelto il nostro club! 💪',
        date: 'Data',
        actionsCount: 'azioni',
        creationsAndAdditions: 'Creazioni e aggiunte',
        updatesOther: 'Aggiornamenti/Altro',
        createAction: 'Crea',
        updateAction: 'Modifica',
        deleteAction: 'Elimina',
        loginAction: 'Accedi',
        exportAction: 'Esporta',
        importAction: 'Importa',
        goodsAndSales: 'Merci e vendite',
        settingsAndBackup: 'Impostazioni e backup',
        system: 'Sistema',
        monthlyRevenue: 'Profitti degli Abbonamenti',
    },
    vi: {
        gymTitle: 'Hệ Thống Quản Lý Phòng Gym Chuyên Nghiệp',
        login: 'Đăng nhập',
        password: 'Mật khẩu',
        mode: 'Chế độ',
        logout: 'Đăng xuất',
        dashboard: 'Tổng quan',
        subscribers: 'Hội viên',
        goods: 'Hàng hóa',
        expenses: 'Chi phí',
        attendance: 'Điểm danh',
        classes: 'Lớp học',
        staff: 'Nhân viên',
        reports: 'Báo cáo năm',
        settings: 'Cài đặt',
        name: 'Họ tên',
        email: 'Email',
        phone: 'Số điện thoại',
        category: 'Danh mục',
        price: 'Giá',
        count: 'Số lượng',
        gender: 'Giới tính',
        months: 'Thời hạn',
        startDate: 'Ngày bắt đầu',
        endDate: 'Ngày kết thúc',
        status: 'Trạng thái',
        actions: 'Thao tác',
        save: 'Lưu',
        edit: 'Sửa',
        delete: 'Xóa',
        renew: 'Gia hạn',
        cancel: 'Hủy',
        search: 'Tìm theo tên hoặc danh mục',
        filterAll: 'Tất cả',
        filterActive: 'Đang hoạt động',
        filterExpired: 'Đã hết hạn',
        filterSoon: 'Sắp hết hạn',
        filterFrozen: 'Đang tạm dừng',
        male: 'Nam',
        female: 'Nữ',
        mix: 'Tổng hợp',
        day: 'Ngày',
        week: 'Tuần',
        halfMonth: 'Nửa tháng',
        month: 'Tháng',
        months: 'Tháng',
        active: 'Hoạt động',
        expired: 'Hết hạn',
        expiringSoon: 'Sắp hết hạn',
        daysLeft: 'ngày còn lại',
        backup: 'Sao lưu',
        restore: 'Khôi phục',
        clearData: 'Xóa dữ liệu',
        changePasswords: 'Đổi mật khẩu',
        item: 'Mặt hàng',
        qty: 'Số lượng',
        salePrice: 'Giá bán',
        costPrice: 'Giá vốn',
        profit: 'Lợi nhuận',
        note: 'Ghi chú',
        amount: 'Số tiền',
        totalIncome: 'Tổng thu',
        totalExpenses: 'Tổng chi',
        netProfit: 'Lợi nhuận ròng',
        loading: 'Đang tải...',
        checkIn: 'Vào',
        checkOut: 'Ra',
        scanQR: 'Quét QR',
        todayAttendance: 'Hiện diện hôm nay',
        totalStats: 'Thống kê tổng thể',
        payments: 'Thanh toán',
        measurements: 'Chỉ số cơ thể',
        notifications: 'Thông báo',
        export: 'Xuất dữ liệu',
        inbody: 'Tiến triển cơ thể',
        birthdays: 'Sinh nhật',
        absent: 'Hội viên vắng',
        lowStockItems: 'Sắp hết hàng',
        installment: 'Trả góp',
        paid: 'Đã thanh toán',
        pending: 'Chờ xử lý',
        addPayment: 'Thêm thanh toán',
        weight: 'Cân nặng',
        bodyFat: '% Mỡ',
        muscleMass: 'Khối lượng cơ',
        extend: 'Gia hạn',
        equipment: 'Thiết bị',
        loyalty: 'Thành viên thân thiết',
        role: 'Vai trò',
        admin: 'Quản trị',
        data_entry: 'Nhập liệu',
        trainer: 'Huấn luyện viên',
        accountant: 'Kế toán',
        marketing: 'Marketing',
        sales: 'Bán hàng',
        performance: 'Hiệu suất nhân viên',
        performanceReportsTitle: 'Báo cáo hiệu suất và hoạt động của nhân viên',
        performanceReportsDesc: 'Giám sát chi tiết và phân tích các hành động của từng nhân viên trên hệ thống',
        refreshData: 'Làm mới dữ liệu',
        exportCsv: 'Xuất CSV',
        totalLoggedActions: 'Tổng số hành động đã ghi',
        activeStaffMembers: 'Nhân viên đang hoạt động',
        mostActiveStaff: 'Nhân viên tích cực nhất',
        staffDirectory: 'Danh sách nhân viên',
        loadingStaff: 'Đang tải nhân viên...',
        noStaffRegistered: 'Chưa có nhân viên đăng ký',
        employeeKPIs: 'Chỉ số hiệu suất của nhân viên',
        employeeKpis: 'Chỉ số hiệu suất của nhân viên',
        subscribersRegistered: 'Hội viên đã đăng ký',
        paymentsProcessed: 'Giao dịch thanh toán',
        amountsCollected: 'Số tiền thu được',
        productsSold: 'Sản phẩm đã bán',
        expensesRecorded: 'Chi phí đã ghi',
        totalOperations: 'Tổng số hoạt động',
        actionDistribution: 'Phân bổ loại hành động',
        actionTypesDistribution: 'Phân bổ loại hành động',
        noActivityData: 'Không đủ dữ liệu hoạt động',
        notEnoughActivityData: 'Không đủ dữ liệu hoạt động',
        lastLoggedAction: 'Hành động ghi nhận cuối',
        noActionsRecorded: 'Chưa ghi nhận hành động nào',
        noRecordedActionsYet: 'Chưa có hoạt động nào được ghi nhận',
        selectStaffToViewPerf: 'Chọn một nhân viên để xem thẻ hiệu suất',
        selectStaffToView: 'Chọn một nhân viên để xem thẻ hiệu suất',
        filterActivityLogs: 'Lọc lịch sử hoạt động',
        employee: 'Nhân viên',
        allStaff: 'Tất cả nhân viên',
        actionType: 'Loại hoạt động',
        allActions: 'Tất cả hoạt động',
        moduleSection: 'Phần/Mô-đun',
        allSections: 'Tất cả các phần',
        fromDate: 'Từ ngày',
        toDate: 'Đến ngày',
        searchLogsPlaceholder: 'Tìm kiếm lịch sử...',
        searchLogsDescription: 'Tìm kiếm lịch sử...',
        applyFilters: 'Áp dụng bộ lọc',
        resetFilters: 'Đặt lại bộ lọc',
        dateTime: 'Ngày & giờ',
        staffPerformer: 'Nhân viên thực hiện',
        module: 'Mô-đun',
        action: 'Hành động',
        details: 'Chi tiết',
        diff: 'Khác biệt',
        loadingFilteredLogs: 'Đang tải lịch sử đã lọc...',
        noLogsMatchingFilter: 'Không có lịch sử phù hợp bộ lọc',
        noLogsMatching: 'Không có lịch sử phù hợp bộ lọc',
        detailedFieldChanges: 'Thay đổi trường chi tiết',
        close: 'Đóng',
        view: 'Xem',
        creations: 'Tạo mới',
        sales: 'Bán hàng',
        updates: 'Cập nhật',
        none: 'Không',
        noDataToExport: 'Không có dữ liệu để xuất',
        receptionist: 'Lễ tân',
        receipt: 'Biên lai',
        paymentReceipt: 'Biên lai thanh toán',
        officialReceipt: 'Biên lai thanh toán chính thức',
        member: 'Hội viên',
        type: 'Loại',
        thankYouClub: 'Cảm ơn bạn đã lựa chọn câu lạc bộ của chúng tôi! 💪',
        date: 'Ngày',
        actionsCount: 'hoạt động',
        creationsAndAdditions: 'Tạo mới & Thêm',
        updatesOther: 'Cập nhật/Khác',
        createAction: 'Tạo mới',
        updateAction: 'Cập nhật',
        deleteAction: 'Xóa',
        loginAction: 'Đăng nhập',
        exportAction: 'Xuất',
        importAction: 'Nhập',
        goodsAndSales: 'Hàng hóa & Bán hàng',
        settingsAndBackup: 'Cài đặt & Sao lưu',
        system: 'Hệ thống',
        monthlyRevenue: 'Lợi nhuận Đăng ký',
    },
    id: {
        gymTitle: 'Sistem Manajemen Gym Profesional',
        login: 'Masuk',
        password: 'Kata Sandi',
        mode: 'Mode',
        logout: 'Keluar',
        dashboard: 'Dasbor',
        subscribers: 'Pelanggan',
        goods: 'Barang',
        expenses: 'Pengeluaran',
        attendance: 'Kehadiran',
        classes: 'Kelas',
        staff: 'Staf',
        reports: 'Laporan Tahunan',
        settings: 'Pengaturan',
        name: 'Nama',
        email: 'Email',
        phone: 'Telepon',
        category: 'Kategori',
        price: 'Harga',
        count: 'Jumlah',
        gender: 'Jenis Kelamin',
        months: 'Durasi',
        startDate: 'Tanggal Mulai',
        endDate: 'Tanggal Selesai',
        status: 'Status',
        actions: 'Tindakan',
        save: 'Simpan',
        edit: 'Edit',
        delete: 'Hapus',
        renew: 'Perbarui',
        cancel: 'Batal',
        search: 'Cari berdasarkan nama atau kategori',
        filterAll: 'Semua',
        filterActive: 'Aktif',
        filterExpired: 'Kedaluwarsa',
        filterSoon: 'Segera Berakhir',
        filterFrozen: 'Dibekukan',
        male: 'Pria',
        female: 'Wanita',
        mix: 'Campuran',
        day: 'Hari',
        week: 'Minggu',
        halfMonth: 'Setengah Bulan',
        month: 'Bulan',
        months: 'Bulan',
        active: 'Aktif',
        expired: 'Kedaluwarsa',
        expiringSoon: 'Segera Berakhir',
        daysLeft: 'hari tersisa',
        backup: 'Cadangan',
        restore: 'Pulihkan',
        clearData: 'Hapus Data',
        changePasswords: 'Ubah Kata Sandi',
        item: 'Item',
        qty: 'Jumlah',
        salePrice: 'Harga Jual',
        costPrice: 'Harga Modal',
        profit: 'Laba',
        note: 'Catatan',
        amount: 'Jumlah',
        totalIncome: 'Total Pendapatan',
        totalExpenses: 'Total Pengeluaran',
        netProfit: 'Laba Bersih',
        loading: 'Memuat...',
        checkIn: 'Masuk',
        checkOut: 'Keluar',
        scanQR: 'Pindai QR',
        todayAttendance: 'Kehadiran Hari Ini',
        totalStats: 'Statistik Total',
        payments: 'Pembayaran',
        measurements: 'Pengukuran',
        notifications: 'Notifikasi',
        export: 'Ekspor',
        inbody: 'Evolusi Tubuh',
        birthdays: 'Ulang Tahun',
        absent: 'Anggota Absen',
        lowStockItems: 'Stok Menipis',
        installment: 'Cicilan',
        paid: 'Dibayar',
        pending: 'Tertunda',
        addPayment: 'Tambah Pembayaran',
        weight: 'Berat',
        bodyFat: '% Lemak',
        muscleMass: 'Massa Otot',
        extend: 'Perpanjang',
        equipment: 'Peralatan',
        loyalty: 'Loyalitas',
        role: 'Peran',
        admin: 'Admin',
        data_entry: 'Input Data',
        trainer: 'Pelatih',
        accountant: 'Akuntan',
        marketing: 'Pemasaran',
        sales: 'Penjualan',
        performance: 'Kinerja Staf',
        performanceReportsTitle: 'Laporan Kinerja & Aktivitas Staf',
        performanceReportsDesc: 'Pemantauan & analisis terperinci tentang tindakan setiap karyawan di sistem',
        refreshData: 'Perbarui Data',
        exportCsv: 'Ekspor CSV',
        totalLoggedActions: 'Total Tindakan Tercatat',
        activeStaffMembers: 'Anggota Staf Aktif',
        mostActiveStaff: 'Staf Paling Aktif',
        staffDirectory: 'Direktori Staf',
        loadingStaff: 'Memuat staf...',
        noStaffRegistered: 'Tidak ada staf terdaftar',
        employeeKPIs: 'Indikator Kinerja Utama Karyawan',
        employeeKpis: 'Indikator Kinerja Utama Karyawan',
        subscribersRegistered: 'Pelanggan Terdaftar',
        paymentsProcessed: 'Pembayaran Diproses',
        amountsCollected: 'Jumlah Terkumpul',
        productsSold: 'Produk Terjual',
        expensesRecorded: 'Pengeluaran Tercatat',
        totalOperations: 'Total Operasi',
        actionDistribution: 'Distribusi Tipe Tindakan',
        actionTypesDistribution: 'Distribusi Tipe Tindakan',
        noActivityData: 'Data aktivitas tidak cukup',
        notEnoughActivityData: 'Data aktivitas tidak cukup',
        lastLoggedAction: 'Tindakan Tercatat Terakhir',
        noActionsRecorded: 'Tidak ada tindakan tercatat',
        noRecordedActionsYet: 'Belum ada tindakan tercatat',
        selectStaffToViewPerf: 'Pilih anggota staf untuk melihat kartu kinerja',
        selectStaffToView: 'Pilih anggota staf untuk melihat kartu kinerja',
        filterActivityLogs: 'Filter Log Aktivitas',
        employee: 'Karyawan',
        allStaff: 'Semua Staf',
        actionType: 'Tipe Tindakan',
        allActions: 'Semua Tindakan',
        moduleSection: 'Bagian/Modul',
        allSections: 'Semua Bagian',
        fromDate: 'Dari Tanggal',
        toDate: 'Sampai Tanggal',
        searchLogsPlaceholder: 'Cari deskripsi log...',
        searchLogsDescription: 'Cari deskripsi log...',
        applyFilters: 'Terapkan Filter',
        resetFilters: 'Atur Ulang Filter',
        dateTime: 'Tanggal & Waktu',
        staffPerformer: 'Staf Pelaksana',
        module: 'Modul',
        action: 'Tindakan',
        details: 'Detail',
        diff: 'Perbedaan',
        loadingFilteredLogs: 'Memuat log terfilter...',
        noLogsMatchingFilter: 'Tidak ada log yang cocok dengan filter',
        noLogsMatching: 'Tidak ada log yang cocok dengan filter',
        detailedFieldChanges: 'Perubahan Bidang Terperinci',
        close: 'Tutup',
        view: 'Lihat',
        creations: 'Pembuatan',
        sales: 'Penjualan',
        updates: 'Pembaruan',
        none: 'Tidak ada',
        noDataToExport: 'Tidak ada data untuk diekspor',
        receptionist: 'Resepsionis',
        receipt: 'Kuitansi',
        paymentReceipt: 'Kuitansi Pembayaran',
        officialReceipt: 'Kuitansi Pembayaran Resmi',
        member: 'Anggota',
        type: 'Tipe',
        thankYouClub: 'Terima kasih telah memilih klub kami! 💪',
        date: 'Tanggal',
        actionsCount: 'tindakan',
        creationsAndAdditions: 'Pembuatan & Penambahan',
        updatesOther: 'Pembaruan/Lainnya',
        createAction: 'Buat',
        updateAction: 'Perbarui',
        deleteAction: 'Hapus',
        loginAction: 'Masuk',
        exportAction: 'Ekspor',
        importAction: 'Impor',
        goodsAndSales: 'Barang & Penjualan',
        settingsAndBackup: 'Pengaturan & Cadangan',
        system: 'Sistem',
        monthlyRevenue: 'Keuntungan Langganan',
    },
    ur: {
        gymTitle: 'پروفیشنل جم مینجمنٹ سسٹم',
        login: 'لاگ ان کریں',
        password: 'پاس ورڈ',
        mode: 'موڈ',
        logout: 'لاگ آؤٹ',
        dashboard: 'ڈیش بورڈ',
        subscribers: 'ممبران',
        goods: 'اشیاء',
        expenses: 'اخراجات',
        attendance: 'حاضری',
        classes: 'کلاسز',
        staff: 'عملہ',
        reports: 'سالانہ رپورٹ',
        settings: 'سیٹنگز',
        name: 'نام',
        email: 'ای میل',
        phone: 'فون',
        category: 'کیٹیگری',
        price: 'قیمت',
        count: 'تعداد',
        gender: 'جنس',
        months: 'دورانیہ',
        startDate: 'شروع کی تاریخ',
        endDate: 'ختم ہونے کی تاریخ',
        status: 'حیثیت',
        actions: 'اقدامات',
        save: 'محفوظ کریں',
        edit: 'ترمیم کریں',
        delete: 'حذف کریں',
        renew: 'تجدید کریں',
        cancel: 'منسوخ کریں',
        search: 'نام یا کیٹیگری سے تلاش کریں',
        filterAll: 'تمام',
        filterActive: 'فعال',
        filterExpired: 'میعاد ختم',
        filterSoon: 'جلد ختم ہونے والا',
        filterFrozen: 'روکا ہوا',
        male: 'مرد',
        female: 'خاتون',
        mix: 'مخلوط',
        day: 'دن',
        week: 'ہفتہ',
        halfMonth: 'آدھا مہینہ',
        month: 'مہینہ',
        months: 'مہینے',
        active: 'فعال',
        expired: 'میعاد ختم',
        expiringSoon: 'جلد ختم',
        daysLeft: 'دن باقی',
        backup: 'بیک اپ',
        restore: 'بحال کریں',
        clearData: 'ڈیٹا صاف کریں',
        changePasswords: 'پاس ورڈز بدلیں',
        item: 'آئٹم',
        qty: 'مقدار',
        salePrice: 'فروخت کی قیمت',
        costPrice: 'لاگت کی قیمت',
        profit: 'منافع',
        note: 'نوٹ',
        amount: 'رقم',
        totalIncome: 'کل آمدنی',
        totalExpenses: 'کل اخراجات',
        netProfit: 'خالص منافع',
        loading: 'لوڈنگ ہو رہی ہے...',
        checkIn: 'چیک ان',
        checkOut: 'چیک آؤٹ',
        scanQR: 'کیو آر اسکین',
        todayAttendance: 'آج کی حاضری',
        totalStats: 'کل اعداد و شمار',
        payments: 'ادائیگیاں',
        measurements: 'پیمائش',
        notifications: 'اطلاعات',
        export: 'ایکسپورٹ',
        inbody: 'جسمانی ارتقاء',
        birthdays: 'سالگرہ',
        absent: 'غیر حاضر ممبران',
        lowStockItems: 'کم اسٹاک',
        installment: 'قسط',
        paid: 'ادا شدہ',
        pending: 'زیر التواء',
        addPayment: 'ادائیگی شامل کریں',
        weight: 'وزن',
        bodyFat: 'جسم کی چربی %',
        muscleMass: 'پٹھوں کی مقدار',
        extend: 'توسیع کریں',
        equipment: 'آلات',
        loyalty: 'وفاداری',
        role: 'عہدہ',
        admin: 'ایڈمن',
        data_entry: 'ڈیٹا انٹری',
        trainer: 'ٹرینر',
        accountant: 'اکاؤنٹنٹ',
        marketing: 'مارکیٹنگ',
        sales: 'سیلز',
        performance: 'عملے کی کارکردگی',
        performanceReportsTitle: 'عملے کی کارکردگی اور سرگرمی کی رپورٹیں',
        performanceReportsDesc: 'سسٹم میں ہر ملازم کی سرگرمیوں کی تفصیلی نگرانی اور تجزیہ',
        refreshData: 'ڈیٹا کو تازہ کریں',
        exportCsv: 'CSV ایکسپورٹ',
        totalLoggedActions: 'کل ریکارڈ شدہ اقدامات',
        activeStaffMembers: 'فعال عملہ',
        mostActiveStaff: 'سب سے زیادہ فعال عملہ',
        staffDirectory: 'عملے کی فہرست',
        loadingStaff: 'عملہ لوڈ ہو رہا ہے...',
        noStaffRegistered: 'عملہ رجسٹرڈ نہیں ہے',
        employeeKPIs: 'ملازم کی کارکردگی کے اہم اشارے',
        employeeKpis: 'ملازم کی کارکردگی کے اہم اشارے',
        subscribersRegistered: 'رجسٹرڈ ممبران',
        paymentsProcessed: 'عمل درآمد شدہ ادائگیاں',
        amountsCollected: 'جمع شدہ رقوم',
        productsSold: 'فروخت شدہ مصنوعات',
        expensesRecorded: 'درج شدہ اخراجات',
        totalOperations: 'کل آپریشنز',
        actionDistribution: 'اقدامات کی اقسام کی تقسیم',
        actionTypesDistribution: 'اقدامات کی اقسام کی تقسیم',
        noActivityData: 'سرگرمی کا ڈیٹا کافی نہیں ہے',
        notEnoughActivityData: 'سرگرمی کا ڈیٹا کافی نہیں ہے',
        lastLoggedAction: 'آخری لاگ ان عمل',
        noActionsRecorded: 'کوئی عمل ریکارڈ نہیں',
        noRecordedActionsYet: 'ابھی تک کوئی اقدام ریکارڈ نہیں کیا گیا',
        selectStaffToViewPerf: 'عملے کی کارکردگی کا کارڈ دیکھنے کے لیے منتخب کریں',
        selectStaffToView: 'عملے کی کارکردگی کا کارڈ دیکھنے کے لیے منتخب کریں',
        filterActivityLogs: 'سرگرمی کے لاگز کو فلٹر کریں',
        employee: 'ملازم',
        allStaff: 'تمام عملہ',
        actionType: 'عمل کی قسم',
        allActions: 'تمام اقدامات',
        moduleSection: 'سیکشن/ماڈیول',
        allSections: 'تمام سیکشنز',
        fromDate: 'تاریخ سے',
        toDate: 'تاریخ تک',
        searchLogsPlaceholder: 'لاگ کی تفصیل تلاش کریں...',
        searchLogsDescription: 'لاگ کی تفصیل تلاش کریں...',
        applyFilters: 'فلٹرز لاگو کریں',
        resetFilters: 'فلٹرز ری سیٹ کریں',
        dateTime: 'تاریخ اور وقت',
        staffPerformer: 'عملہ کرنے والا',
        module: 'ماڈیول',
        action: 'عمل',
        details: 'تفصیلات',
        diff: 'فرق',
        loadingFilteredLogs: 'فلٹر شدہ لاگز لوڈ ہو رہے ہیں...',
        noLogsMatchingFilter: 'فلٹر کی ترتیبات سے مطابقت رکھنے والے کوئی لاگ نہیں ہیں',
        noLogsMatching: 'فلٹر کی ترتیبات سے مطابقت رکھنے والے کوئی لاگ نہیں ہیں',
        detailedFieldChanges: 'تفصیلی فیلڈ تبدیلیاں',
        close: 'بند کریں',
        view: 'دیکھیں',
        creations: 'تخلیقات',
        sales: 'فروخت',
        updates: 'اپ ڈیٹس',
        none: 'کوئی نہیں',
        noDataToExport: 'ایکسپورٹ کرنے کے لیے کوئی ڈیٹا نہیں ہے',
        receptionist: 'ریسپشنسٹ',
        receipt: 'رسید',
        paymentReceipt: 'ادائیگی کی رسید',
        officialReceipt: 'سرکاری ادائیگی کی رسید',
        member: 'رکن',
        type: 'قسم',
        thankYouClub: 'ہمارے کلب کو منتخب کرنے کے لیے شکریہ! 💪',
        date: 'تاریخ',
        actionsCount: 'اقدامات',
        creationsAndAdditions: 'تخلیق اور اضافہ',
        updatesOther: 'اپ ڈیٹس/دیگر',
        createAction: 'تخلیق کریں',
        updateAction: 'اپ ڈیٹ کریں',
        deleteAction: 'حذف کریں',
        loginAction: 'لاگ ان',
        exportAction: 'ایکسپورٹ',
        importAction: 'امپورٹ',
        goodsAndSales: 'اشیاء اور فروخت',
        settingsAndBackup: 'ترتیبات اور بیک اپ',
        system: 'سسٹم',
        monthlyRevenue: 'سبسکرپشن منافع',
    }
};

export default function Home() {
    // State
    const [mode, setMode] = useState(null);
    const [loginMode, setLoginMode] = useState('mix');
     const [loginEmail, setLoginEmail] = useState('admin@gym.com');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [lang, setLang] = useState('ar');
    const [currency, setCurrency] = useState('EGP');
    const [gymName, setGymName] = useState('Gym Management System');
    const [gymLogo, setGymLogo] = useState(null);
    const [logoSize, setLogoSize] = useState(45);
    const [logoGlow, setLogoGlow] = useState('#0ee6b7');
    const [showLargeLogo, setShowLargeLogo] = useState(false);
    const longPressTimeout = useRef(null);
    const isLongPressActive = useRef(false);

    const startLogoPress = (e) => {
        if (longPressTimeout.current) {
            clearTimeout(longPressTimeout.current);
        }
        isLongPressActive.current = false;
        longPressTimeout.current = setTimeout(() => {
            isLongPressActive.current = true;
            setShowLargeLogo(true);
        }, 500);
    };

    const endLogoPress = (e) => {
        if (longPressTimeout.current) {
            clearTimeout(longPressTimeout.current);
        }
        if (isLongPressActive.current) {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    const [activeTab, setActiveTab] = useState('dashboard');
    const [currentUser, setCurrentUser] = useState(null);
    const [adminGenderView, setAdminGenderView] = useState('all'); // 'male', 'female', 'all'

    const [subscribers, setSubscribers] = useState([]);
    const [goods, setGoods] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [todayAttendance, setTodayAttendance] = useState([]);
    const [monthlyComparison, setMonthlyComparison] = useState([]);
    const [stats, setStats] = useState(null);
    const [lowStock, setLowStock] = useState([]);
    const [advStats, setAdvStats] = useState(null);
    const [smartNotifications, setSmartNotifications] = useState({ birthdays: [], absent: [], lowStock: [] });
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
    const [payments, setPayments] = useState([]);
    const [pendingInstallments, setPendingInstallments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [staff, setStaff] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedSub, setSelectedSub] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterMonth, setFilterMonth] = useState('all');

    const [editSubId, setEditSubId] = useState(null);
    const [editGoodsId, setEditGoodsId] = useState(null);
    const [editExpId, setEditExpId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, type: '', id: '', msg: '' });
    const [isDeleting, setIsDeleting] = useState(false);


    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState({ admin: '', men: '', women: '', mix: '', recoveryPhone: '' });

    // Onboarding & Password Reset States
    const [hasAdmin, setHasAdmin] = useState(true);
    const [checkingAdmin, setCheckingAdmin] = useState(true);
    const [failedLoginCount, setFailedLoginCount] = useState(0);

    const [smsGatewayUrl, setSmsGatewayUrl] = useState('');
    const [smsApiKey, setSmsApiKey] = useState('');
    const [smsSenderId, setSmsSenderId] = useState('');
    const [smsEnabled, setSmsEnabled] = useState(false);

    const [onboardName, setOnboardName] = useState('');
    const [onboardEmail, setOnboardEmail] = useState('');
    const [onboardPhone, setOnboardPhone] = useState('');
    const [onboardPassword, setOnboardPassword] = useState('');
    const [onboardLoading, setOnboardLoading] = useState(false);
    const [onboardError, setOnboardError] = useState('');

    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmailOrPhone, setResetEmailOrPhone] = useState('');
    const [resetStep, setResetStep] = useState(1);
    const [resetOTP, setResetOTP] = useState('');
    const [resetNewPassword, setResetNewPassword] = useState('');
    const [resetConfirmPassword, setResetConfirmPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState('');
    const [visitedAlerts, setVisitedAlerts] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('visitedAlerts');
            if (stored) {
                try {
                    setVisitedAlerts(JSON.parse(stored));
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }, []);

    const markAlertAsVisited = (id) => {
        setVisitedAlerts(prev => {
            const next = prev.includes(id) ? prev : [...prev, id];
            if (typeof window !== 'undefined') {
                localStorage.setItem('visitedAlerts', JSON.stringify(next));
            }
            return next;
        });
    };


    const subFormRef = useRef(null);
    const goodsFormRef = useRef(null);
    const expFormRef = useRef(null);
    const fileInputRef = useRef(null);
    const sessionRestoredRef = useRef(false); // لمنع double loading عند استعادة الجلسة

    const t = DICT[lang];
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };
    const systemType = mode === 'mix' ? 'mix' : 'separate';

    // Effects
    useEffect(() => {
        document.documentElement.lang = lang;
        // اللغات التي تدعم الاتجاه من اليمين لليسار (RTL)
        const rtlLanguages = ['ar', 'ur'];
        document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
    }, [lang]);

    // ── استعادة الجلسة عند الريلود ──
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem('gms_session');
            if (saved) {
                const { user, savedMode } = JSON.parse(saved);
                if (user && savedMode) {
                    sessionRestoredRef.current = true; // نعلم به لمنع double loading
                    setCurrentUser(user);
                    setMode(savedMode);
                    // نستدعي loadAllData مباشرة مع user لأن setCurrentUser غير متزامن
                    setTimeout(() => {
                        loadAllData(user);
                        sessionRestoredRef.current = false; // نرجعه للطبيعية بعد التحميل
                    }, 0);
                }
            }
        } catch (e) {
            sessionStorage.removeItem('gms_session');
        }
    }, []); // مرة واحدة عند التحميل

    useEffect(() => {
        async function runAdminCheck() {
            try {
                const res = await checkHasAdmin();
                setHasAdmin(res);
                
                // Load backend settings
                const s = await getSettings();
                if (s && s.notifications) {
                    setSmsGatewayUrl(s.notifications.smsGatewayUrl || '');
                    setSmsApiKey(s.notifications.smsApiKey || '');
                    setSmsSenderId(s.notifications.smsSenderId || '');
                    setSmsEnabled(s.notifications.smsEnabled || false);
                }
            } catch (err) {
                console.error('Admin check / settings load error:', err);
            } finally {
                setCheckingAdmin(false);
            }
        }
        runAdminCheck();
    }, []);

    useEffect(() => {
        const savedCurrency = localStorage.getItem('currency');
        if (savedCurrency) setCurrency(savedCurrency);
        const savedGymName = localStorage.getItem('gymName');
        if (savedGymName) setGymName(savedGymName);
        const savedLogo = localStorage.getItem('gymLogo');
        if (savedLogo) setGymLogo(savedLogo);
        const savedSize = localStorage.getItem('logoSize');
        if (savedSize) setLogoSize(parseInt(savedSize));
        const savedGlow = localStorage.getItem('logoGlow');
        if (savedGlow) setLogoGlow(savedGlow);
    }, []);

    useEffect(() => {
        // لو كانت الجلسة تتم استعادتها فعلاً، لا نستدعي loadAllData مرتين
        if (mode && !sessionRestoredRef.current) loadAllData();
    }, [mode, adminGenderView]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotificationsDropdown && !event.target.closest('.bell-container')) {
                setShowNotificationsDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotificationsDropdown]);

    // Functions
    async function loadAllData(user = currentUser) {
        setIsLoading(true);
        try {
            // تحديد الجنس بناءً على النظام المفتوح
            // الأدمن والمختلط: بدون فلتر جنس (يشوف الكل)
            // نظام الرجالي: male فقط | نظام الحريمي: female فقط
            const genderFilter = mode === 'mix'
                ? null
                : user?.role === 'admin'
                    ? (adminGenderView === 'all' ? null : adminGenderView)
                    : (mode === 'men' ? 'male' : 'female');

            const results = await Promise.allSettled([
                getSubscribers({}, systemType, genderFilter),
                getGoods(systemType),
                getExpenses(systemType, genderFilter),
                getStats(systemType, genderFilter),
                getTodayAttendance(systemType),
                getMonthlyComparison(new Date().getFullYear(), user?.role === 'admin' ? null : systemType),
                getLowStockGoods(systemType),
                getDashboardAnalytics(user?.role === 'admin' ? null : systemType),
                getClasses(systemType),
                getStaff(systemType),
                getSmartNotifications(systemType),
                getAllPayments({ systemType }),
                getPendingInstallments(systemType),
                getEquipment(systemType),
                getSalesByMonth(new Date().getMonth() + 1, new Date().getFullYear(), systemType),
            ]);

            const data = results.map(r => r.status === 'fulfilled' ? r.value : []);

            setSubscribers(data[0]);
            setGoods(data[1]);
            setExpenses(data[2]);
            setStats(data[3] || null);
            setTodayAttendance(data[4]);
            setMonthlyComparison(data[5]);
            setLowStock(data[6]);
            setAdvStats(data[7] || null);
            setClasses(data[8]);
            let fetchedStaff = data[9] || [];
            if (mode) {
                if (mode === 'mix') {
                    fetchedStaff = fetchedStaff.filter(s => s.systemType === 'mix' || s.role === 'admin');
                } else if (mode === 'men') {
                    fetchedStaff = fetchedStaff.filter(s => s.systemType === 'men' || s.systemType === 'separate' || s.role === 'admin');
                } else if (mode === 'women') {
                    fetchedStaff = fetchedStaff.filter(s => s.systemType === 'women' || s.systemType === 'separate' || s.role === 'admin');
                }
            }
            setStaff(fetchedStaff);
            setSmartNotifications(data[10] || { birthdays: [], absent: [], lowStock: [] });
            setPayments(data[11]);
            setPendingInstallments(data[12]);
            setEquipment(data[13]);
            setRecentSales(data[14]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }


    async function handleLogin(e) {
        e.preventDefault();
        const effectiveMode = loginMode;
        if (!effectiveMode || !loginEmail || !password) {
            setError(trans('fillAllFields', 'يرجى إكمال جميع الحقول', 'Please fill all fields'));
            return;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(loginEmail)) {
            setError(trans('invalidEmailFormat', 'صيغة البريد الإلكتروني غير صالحة', 'Invalid email format'));
            return;
        }
        setLoginLoading(true);
        setError('');
        try {
            const sysType = effectiveMode; // 'men', 'women', or 'mix'
            const staff = await loginStaff(loginEmail, password, sysType);

            // حفظ الجلسة في sessionStorage للاستعادة عند الريلود
            sessionStorage.setItem('gms_session', JSON.stringify({ user: staff, savedMode: effectiveMode }));

            setCurrentUser(staff);
            setMode(effectiveMode);
            // تفريغ حقول تسجيل الدخول
            setLoginEmail('');
            setPassword('');
            setFailedLoginCount(0);
            loadAllData(staff);
        } catch (err) {
            console.error(err);
            const msg = err.message;
            let displayError = trans('invalidEmailOrPassword', 'خطأ في البريد أو كلمة المرور', 'Invalid email or password');

            if (msg.includes('User not found')) {
                displayError = trans('emailNotFound', 'البريد الإلكتروني غير موجود', 'Email not found');
            } else if (msg.includes('Invalid credentials')) {
                displayError = trans('incorrectPassword', 'كلمة المرور غير صحيحة', 'Incorrect password');
            } else if (msg.includes('Access denied')) {
                const type = msg.split(': ')[1];
                const typeText = trans(
                    type === 'men' ? 'menSystemOnly' : type === 'women' ? 'womenSystemOnly' : type === 'mix' ? 'mixSystemOnly' : 'separateSystems',
                    type === 'men' ? 'نظام الرجال فقط' : type === 'women' ? 'نظام السيدات فقط' : type === 'mix' ? 'نظام المختلط فقط' : 'الأنظمة المنفصلة',
                    type === 'men' ? 'Men system only' : type === 'women' ? 'Women system only' : type === 'mix' ? 'Mixed system only' : 'Separate systems'
                );
                displayError = trans('accessDeniedPermissionFor', 'ليس لديك صلاحية للدخول لهذا النظام. صلاحيتك مسجلة لـ: ', 'Access denied. Your permission is for: ') + typeText;
            }

            setFailedLoginCount(prev => prev + 1);
            setError(displayError);
        } finally {
            setLoginLoading(false);
        }
    }

    async function handleOnboardSubmit(e) {
        e.preventDefault();
        if (!onboardName || !onboardEmail || !onboardPhone || !onboardPassword) {
            setOnboardError(trans('fillRequiredFields', 'يرجى ملء جميع الحقول المطلوبة', 'Please fill all required fields'));
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[1-9]).{6,}$/;

        if (onboardName.trim().length < 3) {
            setOnboardError(trans('fullNameMinChar', 'الاسم الكامل يجب أن يكون 3 أحرف على الأقل', 'Full name must be at least 3 characters'));
            return;
        }
        if (!emailRegex.test(onboardEmail)) {
            setOnboardError(trans('invalidEmailAddressFormat', 'صيغة البريد الإلكتروني غير صالحة', 'Invalid email address format'));
            return;
        }
        if (!phoneRegex.test(onboardPhone)) {
            setOnboardError(trans('invalidPhoneNumberDigits', 'رقم الهاتف غير صالح، يجب أن يتكون من 10 إلى 15 رقماً', 'Invalid phone number, must be 10 to 15 digits'));
            return;
        }
        if (!passwordRegex.test(onboardPassword)) {
            setOnboardError(
                trans(
                    'passwordValidationRule',
                    'كلمة المرور يجب أن تكون 6 رموز على الأقل، وتحتوي على حرف واحد على الأقل ورقم من 1 إلى 9',
                    'Password must be at least 6 characters, and contain at least one letter and a number from 1 to 9'
                )
            );
            return;
        }

        setOnboardLoading(true);
        setOnboardError('');
        try {
            const formData = new FormData();
            formData.set('name', onboardName);
            formData.set('email', onboardEmail);
            formData.set('phone', onboardPhone);
            formData.set('password', onboardPassword);
            formData.set('gender', 'male');
            formData.set('systemType', 'mix');

            const staff = await registerFirstAdmin(formData);
            
            // Log them in immediately
            const savedMode = 'mix';
            sessionStorage.setItem('gms_session', JSON.stringify({ user: staff, savedMode }));
            setCurrentUser(staff);
            setMode(savedMode);
            setHasAdmin(true);

            setTimeout(() => {
                loadAllData(staff);
            }, 0);
        } catch (err) {
            setOnboardError(err.message || 'Error occurred during registration');
        } finally {
            setOnboardLoading(false);
        }
    }

    async function handleRequestOTP(e) {
        e.preventDefault();
        if (!resetEmailOrPhone) return;
        setResetLoading(true);
        setResetError('');
        try {
            const res = await requestPasswordResetOTP(resetEmailOrPhone);
            if (res.success) {
                setResetStep(2);
            }
        } catch (err) {
            setResetError(err.message || 'Error requesting reset code');
        } finally {
            setResetLoading(false);
        }
    }

    async function handleVerifyOTP(e) {
        e.preventDefault();
        if (!resetEmailOrPhone || !resetOTP) {
            setResetError(trans('fillAllFields', 'يرجى إكمال جميع الحقول', 'Please fill all fields'));
            return;
        }

        const otpRegex = /^[0-9]{6}$/;
        if (!otpRegex.test(resetOTP)) {
            setResetError(trans('invalidVerificationCode', 'رمز التحقق غير صالح، يجب إدخال 6 أرقام', 'Invalid verification code, must be 6 digits'));
            return;
        }

        setResetLoading(true);
        setResetError('');
        try {
            const res = await verifyPasswordResetOTP(resetEmailOrPhone, resetOTP);
            if (res.success) {
                setResetStep(3);
            }
        } catch (err) {
            setResetError(err.message || 'Error verifying code');
        } finally {
            setResetLoading(false);
        }
    }

    async function handleResetPassword(e) {
        e.preventDefault();
        if (!resetEmailOrPhone || !resetOTP || !resetNewPassword || !resetConfirmPassword) {
            setResetError(trans('fillAllFields', 'يرجى إكمال جميع الحقول', 'Please fill all fields'));
            return;
        }

        if (resetNewPassword !== resetConfirmPassword) {
            setResetError(trans('passwordsDoNotMatch', 'كلمتا المرور غير متطابقتين', 'Passwords do not match'));
            return;
        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[1-9]).{6,}$/;
        if (!passwordRegex.test(resetNewPassword)) {
            setResetError(
                trans(
                    'newPasswordValidationRule',
                    'كلمة المرور الجديدة يجب أن تكون 6 رموز على الأقل، وتحتوي على حرف واحد على الأقل ورقم من 1 إلى 9',
                    'New password must be at least 6 characters, and contain at least one letter and a number from 1 to 9'
                )
            );
            return;
        }

        setResetLoading(true);
        setResetError('');
        setResetSuccess('');
        try {
            await resetPasswordWithOTP(resetEmailOrPhone, resetOTP, resetNewPassword);
            setResetSuccess(trans('passwordResetSuccess', 'تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.', 'Password reset successfully! You can now log in.'));
            setTimeout(() => {
                setShowResetModal(false);
                setResetEmailOrPhone('');
                setResetOTP('');
                setResetNewPassword('');
                setResetConfirmPassword('');
                setResetSuccess('');
            }, 2500);
        } catch (err) {
            setResetError(err.message || 'Error resetting password');
        } finally {
            setResetLoading(false);
        }
    }

    async function handleSubSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.set('systemType', systemType);
        // Set gender based on mode if not mix
        if (mode !== 'mix') {
            formData.set('gender', mode === 'men' ? 'male' : 'female');
        }
        try {
            if (editSubId) {
                await updateSubscriber(editSubId, formData, currentUser?._id);
                setEditSubId(null);
            } else {
                await addSubscriber(formData, currentUser?._id);
            }
            e.target.reset();
            loadAllData();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleGoodsSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.set('systemType', systemType);
        try {
            if (editGoodsId) {
                await updateGoods(editGoodsId, formData, currentUser?._id);
                setEditGoodsId(null);
            } else {
                await addGoods(formData, currentUser?._id);
            }
            e.target.reset();
            loadAllData();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleExpSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.set('systemType', systemType);
        if (mode !== 'mix') {
            const genderMap = { men: 'male', women: 'female' };
            formData.set('gender', genderMap[mode] || 'general');
            formData.set('period', mode === 'men' ? 'men' : 'women');
        } else {
            const period = formData.get('period') || 'general';
            const periodToGender = {
                men: 'male',
                women: 'female',
                mix: 'mix',
                general: 'general'
            };
            formData.set('gender', periodToGender[period] || 'general');
        }
        try {
            if (editExpId) {
                await updateExpense(editExpId, formData, currentUser?._id);
                setEditExpId(null);
            } else {
                await addExpense(formData, currentUser?._id);
            }
            e.target.reset();
            // Reset date field to today after form reset
            const dateField = e.target.elements['date'];
            if (dateField) dateField.value = new Date().toISOString().split('T')[0];
            loadAllData();
        } catch (err) {
            console.error(err);
            alert(trans('errorSavingExpense', 'حدث خطأ في حفظ المصروف', 'Error saving expense'));
        }
    }

    async function handleDelete(type, id, customMsg = null) {
        setConfirmDelete({
            open: true,
            type,
            id,
            msg: customMsg || trans('deleteConfirmation', 'هل أنت متأكد من رغبتك في الحذف؟ لا يمكن التراجع عن هذه الخطوة.', 'Are you sure you want to delete? This action cannot be undone.')
        });
    }

    async function executeDeletion() {
        const { type, id } = confirmDelete;
        
        // Prevent self-deletion for staff
        if (type === 'staff' && currentUser && id === currentUser._id) {
            alert(trans('cannotDeleteOwnAccount', 'لا يمكنك حذف حسابك الخاص أثناء تسجيل الدخول!', 'You cannot delete your own account while logged in!'));
            setConfirmDelete({ open: false, type: '', id: '', msg: '' });
            return;
        }

        setIsDeleting(true);
        try {
            console.log('Attempting to delete:', type, id);
            if (type === 'sub') await deleteSubscriber(id, currentUser?._id);
            else if (type === 'goods') await deleteGoods(id, currentUser?._id);
            else if (type === 'exp') await deleteExpense(id, currentUser?._id);
            else if (type === 'equipment') await deleteEquipment(id, currentUser?._id);
            else if (type === 'staff') await deleteStaff(id, currentUser?._id);
            else if (type === 'class') await deleteClass(id, currentUser?._id);
            
            // Artificial delay for better UX and to allow DB to catch up
            await new Promise(resolve => setTimeout(resolve, 500));
            
            await loadAllData();
            console.log('Data reloaded after deletion');
            
            setConfirmDelete({ open: false, type: '', id: '', msg: '' });
            
            // Trigger a small success notification (Optional, alert is fine for now)
            alert(trans('deletedSuccessfully', '✅ تم الحذف بنجاح', '✅ Deleted successfully'));
        } catch (err) {
            console.error('Deletion error:', err);
            alert(trans('deleteFailedPrefix', '❌ فشل الحذف: ', '❌ Deletion failed: ') + err.message);
        } finally {
            setIsDeleting(false);
        }
    }

    async function handleManualSale(id) {
        const qty = prompt(trans('enterQuantityToSell', 'أدخل الكمية المراد بيعها:', 'Enter quantity to sell:'), '1');
        if (!qty || isNaN(qty) || parseInt(qty) <= 0) return;

        try {
            await sellGoodsById(id, mode, parseInt(qty), systemType, currentUser?._id);
            loadAllData();
            alert(trans('saleSuccessful', 'تمت عملية البيع بنجاح', 'Sale successful'));
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleRenew(id) {
        const sub = subscribers.find(s => s._id === id);
        if (!sub) return;

        if (sub.planType === 'sessions') {
            const sessions = prompt(trans('enterAdditionalSessions', 'أدخل عدد الحصص الإضافية:', 'Enter additional sessions count:'), '10');
            if (sessions) {
                const totalSessions = sub.totalSessions || 1;
                const defaultPrice = ((sub.price / totalSessions) * parseInt(sessions)).toFixed(0);
                const price = prompt(trans('enterRenewalPriceSessions', `أدخل الأموال المستحقة لتجديد ${sessions} حصة:`, `Enter amount due for renewing ${sessions} session(s):`), defaultPrice);
                if (price !== null) {
                    await renewSubscriber(id, 1, parseInt(sessions), false, parseFloat(price || '0'), currentUser?._id);
                    loadAllData();
                }
            }
        } else {
            const duration = prompt(trans('enterMonthsRenewal', 'أدخل عدد الأشهر للتجديد:', 'Enter months for renewal:'), '1');
            if (duration) {
                const subMonths = sub.months || 1;
                const defaultPrice = ((sub.price / subMonths) * parseFloat(duration)).toFixed(0);
                const price = prompt(trans('enterRenewalPriceTime', `أدخل الأموال المستحقة لتجديد ${duration} شهر:`, `Enter amount due for renewing ${duration} month(s):`), defaultPrice);
                if (price !== null) {
                    await renewSubscriber(id, parseFloat(duration), 0, false, parseFloat(price || '0'), currentUser?._id);
                    loadAllData();
                }
            }
        }
    }

    async function handleExtend(id) {
        const sub = subscribers.find(s => s._id === id);
        if (!sub) return;

        if (sub.planType === 'sessions') {
            const sessions = prompt(trans('enterAddedSessions', 'أدخل عدد الحصص المضافة:', 'Enter added sessions count:'), '10');
            if (sessions) {
                const totalSessions = sub.totalSessions || 1;
                const defaultPrice = ((sub.price / totalSessions) * parseInt(sessions)).toFixed(0);
                const price = prompt(trans('enterAdditionalPriceSessions', `أدخل الأموال المستحقة لتمديد ${sessions} حصة:`, `Enter amount due for extending ${sessions} session(s):`), defaultPrice);
                if (price !== null) {
                    await renewSubscriber(id, 1, parseInt(sessions), true, parseFloat(price || '0'), currentUser?._id);
                    loadAllData();
                }
            }
        } else {
            const duration = prompt(trans('enterMonthsExtension', 'أدخل عدد الأشهر للتمديد:', 'Enter months for extension:'), '1');
            if (duration) {
                const subMonths = sub.months || 1;
                const defaultPrice = ((sub.price / subMonths) * parseFloat(duration)).toFixed(0);
                const price = prompt(trans('enterAdditionalPriceTime', `أدخل الأموال المستحقة لتمديد ${duration} شهر:`, `Enter amount due for extending ${duration} month(s):`), defaultPrice);
                if (price !== null) {
                    await renewSubscriber(id, parseFloat(duration), 0, true, parseFloat(price || '0'), currentUser?._id);
                    loadAllData();
                }
            }
        }
    }

    async function handleCheckIn(subId) {
        try {
            await checkIn(subId, 'manual', currentUser?._id);
            loadAllData();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleCheckOut(attId) {
        try {
            await checkOut(attId, currentUser?._id);
            loadAllData();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleFreeze(id) {
        const reason = prompt(trans('enterFreezeReason', 'أدخل سبب التجميد:', 'Enter freeze reason:'));
        if (reason) {
            const days = prompt(trans('enterFreezeDays', 'أدخل مدة التجميد بالأيام:', 'Enter freeze duration in days:'), '7');
            if (days) {
                try {
                    await freezeSubscriber(id, reason, parseInt(days), currentUser?._id);
                    loadAllData();
                } catch (err) {
                    alert(err.message);
                }
            }
        }
    }

    async function handleUnfreeze(id) {
        if (confirm(trans('unfreezeConfirm', 'هل تود إلغاء التجميد؟', 'Unfreeze account?'))) {
            await unfreezeSubscriber(id, currentUser?._id);
            loadAllData();
        }
    }

    async function handleStaffSubmit(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        if (!fd.get('systemType')) fd.set('systemType', systemType);
        try {
            await addStaff(fd, currentUser?._id);
            e.target.reset();
            loadAllData();
            alert(trans('staffAddedSuccessfully', 'تم إضافة الموظف بنجاح', 'Staff added successfully'));
        } catch (err) {
            console.error(err);
            alert(trans('staffAddFailed', 'فشل إمالية الإضافة: قد يكون البريد مكرر', 'Failed to add staff: Email might be duplicate'));
        }
    }

    async function handleClassSubmit(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        fd.append('systemType', systemType);
        try {
            await addClass(fd, currentUser?._id);
            e.target.reset();
            loadAllData();
        } catch (err) {
            console.error(err);
        }
    }


    async function handleBackup() {
        try {
            const backup = await createBackup(currentUser?._id);
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `gym-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleRestore() {
        fileInputRef.current?.click();
    }

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            await restoreBackup(text, currentUser?._id);
            alert(trans('restoredSuccessfully', 'تم الاستعادة بنجاح', 'Restored successfully'));
            loadAllData();
        } catch (err) {
            console.error(err);
        }
    }

    async function handlePasswordChange() {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[1-9]).{6,}$/;
        if (passwords.admin && !passwordRegex.test(passwords.admin)) {
            alert(trans('adminPasswordRule', 'كلمة مرور الأدمن يجب أن تحتوي على حرف ورقم (1-9) وتكون 6 رموز على الأقل', 'Admin password must contain at least one letter and a number from 1 to 9, and be at least 6 characters'));
            return;
        }
        if (passwords.men && !passwordRegex.test(passwords.men)) {
            alert(trans('menPasswordRule', 'كلمة مرور نظام الرجال يجب أن تحتوي على حرف ورقم (1-9) وتكون 6 رموز على الأقل', 'Men system password must contain at least one letter and a number from 1 to 9, and be at least 6 characters'));
            return;
        }
        if (passwords.women && !passwordRegex.test(passwords.women)) {
            alert(trans('womenPasswordRule', 'كلمة مرور نظام السيدات يجب أن تحتوي على حرف ورقم (1-9) وتكون 6 رموز على الأقل', 'Women system password must contain at least one letter and a number from 1 to 9, and be at least 6 characters'));
            return;
        }
        if (passwords.mix && !passwordRegex.test(passwords.mix)) {
            alert(trans('mixPasswordRule', 'كلمة مرور النظام المختلط يجب أن تحتوي على حرف ورقم (1-9) وتكون 6 رموز على الأقل', 'Mixed system password must contain at least one letter and a number from 1 to 9, and be at least 6 characters'));
            return;
        }
        try {
            await updatePasswords(passwords, currentUser?._id);
            alert(trans('updatedSuccessfully', 'تم التحديث بنجاح', 'Updated successfully'));
            setShowPasswordModal(false);
        } catch (err) {
            console.error(err);
            alert(err.message || 'Error updating passwords');
        }
    }

    async function handleUpdatePaymentStatus(paymentId, status) {
        try {
            await updatePaymentStatus(paymentId, status, currentUser?._id);
            loadAllData();
            alert(trans('paymentStatusUpdated', 'تم تحديث حالة الدفعة بنجاح', 'Payment status updated successfully'));
        } catch (err) {
            console.error(err);
            alert(trans('errorOccurred', 'حدث خطأ', 'An error occurred'));
        }
    }

    function exportToCSV(data, filename) {
        if (!data || !data.length) {
            alert(trans('noDataToExport', 'لا توجد بيانات للتصدير', 'No data to export'));
            return;
        }
        // Simplified headers from the first object's keys
        const headers = Object.keys(data[0])
            .filter(k => !['_id', '__v', 'id', 'subscriber'].includes(k))
            .join(',');

        const rows = data.map(obj =>
            Object.keys(obj)
                .filter(k => !['_id', '__v', 'id', 'subscriber'].includes(k))
                .map(k => {
                    let val = obj[k];
                    if (val instanceof Date) val = val.toLocaleDateString();
                    if (typeof val === 'object') val = JSON.stringify(val);
                    return `"${String(val || '').replace(/"/g, '""')}"`;
                })
                .join(',')
        );

        const csvContent = "\uFEFF" + [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function getStatus(endDate) {
        const diffDays = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) return { text: t.expired, cls: 'status-expired' };
        if (diffDays <= 7) return { text: `${diffDays} ${t.daysLeft} (${t.expiringSoon})`, cls: 'status-warning' };
        return { text: `${diffDays} ${t.daysLeft}`, cls: 'status-active' };
    }

    function getDurationText(months) {
        const val = parseFloat(months);
        if (val === 0) return t.day;
        if (val === 0.25) return t.week;
        if (val === 0.5) return t.halfMonth;
        if (val === 1) return `1 ${t.month}`;
        return `${val} ${t.months}`;
    }

    // Filtering
    let filteredSubs = subscribers.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone?.includes(searchTerm) ||
        s.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType === 'active') filteredSubs = filteredSubs.filter(s => new Date(s.endDate) > new Date());
    else if (filterType === 'expired') filteredSubs = filteredSubs.filter(s => new Date(s.endDate) <= new Date());
    else if (filterType === 'soon') filteredSubs = filteredSubs.filter(s => {
        const days = Math.ceil((new Date(s.endDate) - new Date()) / (1000 * 60 * 60 * 24));
        return days > 0 && days <= 7;
    });
    else if (filterType === 'frozen') filteredSubs = filteredSubs.filter(s => s.isFrozen);

    if (filterMonth !== 'all') {
        filteredSubs = filteredSubs.filter(s => {
            if (!s.startDate) return false;
            const m = new Date(s.startDate).getMonth() + 1;
            return m.toString() === filterMonth;
        });
    }

    if (!currentUser && !mode) {
        if (checkingAdmin) {
            return (
                <main className="centered" style={{ background: '#0a0a0a' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="auth-spinner" style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#0ee6b7', margin: '0 auto 15px' }}></div>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: 'sans-serif' }}>
                            {trans('initializingSystem', 'جاري تهيئة النظام...', 'Initializing system...')}
                        </p>
                    </div>
                </main>
            );
        }

        if (!hasAdmin) {
            return (
                <>
                    <main className="centered">
                        <div className="auth-box">
                            <div className="auth-logo">
                                <div className="gms-logo-container"><div className="gms-logo-text">GMS</div></div>
                                <h1>{trans('setupOwnerAccount', 'تهيئة حساب المالك', 'Setup Owner Account')}</h1>
                                <p>{trans('setupOwnerAccountSub', 'قم بإنشاء حساب المدير لمالك النظام لأول مرة', 'Create the main owner admin account for the first time')}</p>
                            </div>

                            <form onSubmit={handleOnboardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                <div className="input-group" style={{ marginBottom: 12 }}>
                                    <span className="input-group-icon">👤</span>
                                    <input
                                        type="text"
                                        placeholder={trans('ownerFullName', 'الاسم الكامل للمالك', 'Owner Full Name')}
                                        value={onboardName}
                                        onChange={(e) => setOnboardName(e.target.value)}
                                        required
                                        minLength={3}
                                        title={trans('fullNameMinChar', 'الاسم الكامل يجب أن يكون 3 أحرف على الأقل', 'Full name must be at least 3 characters')}
                                        style={{ marginBottom: 0 }}
                                    />
                                </div>

                                <div className="input-group" style={{ marginBottom: 12 }}>
                                    <span className="input-group-icon">✉️</span>
                                    <input
                                        type="email"
                                        placeholder={trans('emailAddressPlaceholder', 'البريد الإلكتروني (مثال: gmail)', 'Email Address (e.g. Gmail)')}
                                        value={onboardEmail}
                                        onChange={(e) => setOnboardEmail(e.target.value)}
                                        required
                                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                                        title={trans('validEmailAddress', 'البريد الإلكتروني يجب أن يكون بريداً صالحاً', 'Must be a valid email address')}
                                        style={{ marginBottom: 0 }}
                                    />
                                </div>

                                <div className="input-group" style={{ marginBottom: 12 }}>
                                    <span className="input-group-icon">📱</span>
                                    <input
                                        type="tel"
                                        placeholder={trans('mobilePhonePlaceholder', 'رقم الهاتف المحمول (الرمز يرسل له)', 'Mobile Phone (OTP receiver)')}
                                        value={onboardPhone}
                                        onChange={(e) => setOnboardPhone(e.target.value)}
                                        required
                                        pattern="\+?[0-9]{10,15}"
                                        title={trans('phoneDigitsRule', 'رقم الهاتف يجب أن يتكون من 10 إلى 15 رقماً', 'Phone number must be 10 to 15 digits')}
                                        style={{ marginBottom: 0 }}
                                    />
                                </div>

                                <div className="input-group" style={{ marginBottom: 24 }}>
                                    <span className="input-group-icon">🔒</span>
                                    <input
                                        type="text"
                                        placeholder={t.password}
                                        value={onboardPassword}
                                        onChange={(e) => setOnboardPassword(e.target.value)}
                                        required
                                        autoComplete="off"
                                        pattern="(?=.*[a-zA-Z])(?=.*[1-9]).{6,}"
                                        title={trans('passwordRules', 'كلمة المرور يجب أن تكون 6 رموز على الأقل وتحتوي على حرف ورقم من 1 إلى 9', 'Password must be at least 6 characters, containing at least one letter and a number from 1 to 9')}
                                        style={{ marginBottom: 0, WebkitTextSecurity: 'disc', textSecurity: 'disc' }}
                                    />
                                </div>

                                {onboardError && <div className="error-msg" style={{ marginBottom: 14 }}>{onboardError}</div>}

                                <button type="submit" className="auth-btn" disabled={onboardLoading}>
                                    {onboardLoading ? (
                                        <span className="auth-btn-loading">
                                            <span className="auth-spinner"></span>
                                            {trans('settingUpSystem', 'جاري تهيئة النظام...', 'Setting up system...')}
                                        </span>
                                    ) : (
                                        trans('createOwnerAndStart', 'إنشاء حساب المالك والبدء', 'Create Owner Account & Start')
                                    )}
                                </button>
                            </form>

                            <div className="auth-lang-container">
                                <span style={{ fontSize: 13, opacity: 0.6 }}>🌐 {trans('selectLanguage', 'اختر اللغة', 'Select Language')}:</span>
                                <select 
                                    className="auth-lang-select" 
                                    value={lang} 
                                    onChange={(e) => setLang(e.target.value)}
                                >
                                    <option value="ar">العربية (Arabic)</option>
                                    <option value="en">English</option>
                                    <option value="fr">Français (French)</option>
                                    <option value="es">Español (Spanish)</option>
                                    <option value="tr">Türkçe (Turkish)</option>
                                    <option value="ru">Русский (Russian)</option>
                                    <option value="zh">中文 (Chinese)</option>
                                    <option value="de">Deutsch (German)</option>
                                    <option value="hi">हिन्दी (Hindi)</option>
                                    <option value="pt">Português (Portuguese)</option>
                                    <option value="it">Italiano (Italian)</option>
                                    <option value="vi">Tiếng Việt (Vietnamese)</option>
                                    <option value="id">Bahasa Indonesia (Indonesian)</option>
                                    <option value="ur">اردو (Urdu)</option>
                                </select>
                            </div>
                        </div>
                    </main>
                </>
            );
        }

        if (showResetModal) {
            return (
                <>
                    <main className="centered">
                        <div className="auth-box">
                            <div className="auth-logo">
                                <div className="gms-logo-container"><div className="gms-logo-text">GMS</div></div>
                                <h1>{trans('resetPasswordTitle', 'استعادة كلمة المرور', 'Reset Password')}</h1>
                                <p>{trans('recoverAdminAccountSub', 'استرجع حساب مدير النظام الخاص بك عبر رمز الهاتف', 'Recover your admin owner account via phone code')}</p>
                            </div>

                            {resetStep === 1 && (
                                <form onSubmit={handleRequestOTP} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 15, textAlign: 'center', lineHeight: '1.5' }}>
                                        {trans('enterEmailOrPhoneForOTP', 'أدخل البريد الإلكتروني أو رقم الهاتف المسجل لمالك النظام لتلقي رمز التحقق.', 'Enter your registered admin email or phone number to receive a verification OTP code.')}
                                    </p>

                                    <div className="input-group" style={{ marginBottom: 18 }}>
                                        <span className="input-group-icon">📱</span>
                                        <input
                                            type="text"
                                            placeholder={trans('emailOrPhone', 'البريد الإلكتروني أو رقم الهاتف', 'Email or Phone Number')}
                                            value={resetEmailOrPhone}
                                            onChange={(e) => setResetEmailOrPhone(e.target.value)}
                                            required
                                            style={{ marginBottom: 0 }}
                                        />
                                    </div>

                                    {resetError && <div className="error-msg" style={{ marginBottom: 14 }}>{resetError}</div>}

                                    <button type="submit" className="auth-btn" disabled={resetLoading} style={{ marginBottom: 12 }}>
                                        {resetLoading ? (
                                            <span className="auth-btn-loading">
                                                <span className="auth-spinner"></span>
                                                {trans('verifying', 'جاري التحقق...', 'Verifying...')}
                                            </span>
                                        ) : (
                                            trans('sendVerificationCode', 'أرسل رمز التحقق', 'Send Verification Code')
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowResetModal(false)}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#fff',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            width: '100%',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                    >
                                        {trans('backToLogin', 'العودة لتسجيل الدخول', 'Back to Login')}
                                    </button>
                                </form>
                            )}

                            {resetStep === 2 && (
                                <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 15, textAlign: 'center', lineHeight: '1.5' }}>
                                        {trans('otpSentInstructionOnly', 'تم إرسال رمز التحقق إلى حسابك. يرجى إدخال الرمز المكون من 6 أرقام للتحقق.', 'A verification code was sent to your account. Please enter the 6-digit code to verify.')}
                                    </p>

                                    <div className="input-group" style={{ marginBottom: 18 }}>
                                        <span className="input-group-icon">🔑</span>
                                        <input
                                            type="text"
                                            placeholder={trans('otpPlaceholder', 'رمز التحقق (6 أرقام)', 'Verification Code (6 digits)')}
                                            value={resetOTP}
                                            onChange={(e) => setResetOTP(e.target.value)}
                                            required
                                            maxLength={6}
                                            pattern="[0-9]{6}"
                                            title={trans('otpRules', 'رمز التحقق يجب أن يتكون من 6 أرقام', 'OTP must be 6 digits')}
                                            style={{ marginBottom: 0 }}
                                        />
                                    </div>

                                    {resetError && <div className="error-msg" style={{ marginBottom: 14 }}>{resetError}</div>}

                                    <button type="submit" className="auth-btn" disabled={resetLoading} style={{ marginBottom: 12 }}>
                                        {resetLoading ? (
                                            <span className="auth-btn-loading">
                                                <span className="auth-spinner"></span>
                                                {trans('verifyingCode', 'جاري التحقق من الرمز...', 'Verifying code...')}
                                            </span>
                                        ) : (
                                            trans('verifyCodeBtn', 'التحقق من الرمز', 'Verify Code')
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setResetStep(1)}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#fff',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            width: '100%',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                    >
                                        {trans('goBack', 'الرجوع للخطوة السابقة', 'Go Back')}
                                    </button>
                                </form>
                            )}

                            {resetStep === 3 && (
                                <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 15, textAlign: 'center', lineHeight: '1.5' }}>
                                        {trans('enterNewPasswordInstruction', 'تم التحقق من الرمز بنجاح. يرجى إدخال كلمة المرور الجديدة وتأكيدها.', 'Code verified successfully. Please enter and confirm your new password.')}
                                    </p>

                                    <div className="input-group" style={{ marginBottom: 12 }}>
                                        <span className="input-group-icon">🔒</span>
                                        <input
                                            type="text"
                                            placeholder={trans('newPasswordPlaceholder', 'كلمة المرور الجديدة', 'New Password')}
                                            value={resetNewPassword}
                                            onChange={(e) => setResetNewPassword(e.target.value)}
                                            required
                                            autoComplete="off"
                                            pattern="(?=.*[a-zA-Z])(?=.*[1-9]).{6,}"
                                            title={trans('passwordRules', 'كلمة المرور يجب أن تكون 6 رموز على الأقل وتحتوي على حرف ورقم من 1 إلى 9', 'Password must be at least 6 characters, containing at least one letter and a number from 1 to 9')}
                                            style={{ marginBottom: 0, WebkitTextSecurity: 'disc', textSecurity: 'disc' }}
                                        />
                                    </div>

                                    <div className="input-group" style={{ marginBottom: 18 }}>
                                        <span className="input-group-icon">🔒</span>
                                        <input
                                            type="text"
                                            placeholder={trans('confirmPasswordPlaceholder', 'تأكيد كلمة المرور الجديدة', 'Confirm New Password')}
                                            value={resetConfirmPassword}
                                            onChange={(e) => setResetConfirmPassword(e.target.value)}
                                            required
                                            autoComplete="off"
                                            pattern="(?=.*[a-zA-Z])(?=.*[1-9]).{6,}"
                                            title={trans('passwordRules', 'كلمة المرور يجب أن تكون 6 رموز على الأقل وتحتوي على حرف ورقم من 1 إلى 9', 'Password must be at least 6 characters, containing at least one letter and a number from 1 to 9')}
                                            style={{ marginBottom: 0, WebkitTextSecurity: 'disc', textSecurity: 'disc' }}
                                        />
                                    </div>

                                    {resetError && <div className="error-msg" style={{ marginBottom: 14 }}>{resetError}</div>}
                                    {resetSuccess && <div style={{ color: '#0ee6b7', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{resetSuccess}</div>}

                                    <button type="submit" className="auth-btn" disabled={resetLoading} style={{ marginBottom: 12 }}>
                                        {resetLoading ? (
                                            <span className="auth-btn-loading">
                                                <span className="auth-spinner"></span>
                                                {trans('updating', 'جاري التحديث...', 'Updating...')}
                                            </span>
                                        ) : (
                                            trans('resetPasswordBtn', 'تحديث كلمة المرور', 'Reset Password')
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setResetStep(2)}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#fff',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            width: '100%',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                    >
                                        {trans('goBack', 'الرجوع للخطوة السابقة', 'Go Back')}
                                    </button>
                                </form>
                            )}

                            <div className="auth-lang-container">
                                <span style={{ fontSize: 13, opacity: 0.6 }}>🌐 {trans('selectLanguage', 'اختر اللغة', 'Select Language')}:</span>
                                <select 
                                    className="auth-lang-select" 
                                    value={lang} 
                                    onChange={(e) => setLang(e.target.value)}
                                >
                                    <option value="ar">العربية (Arabic)</option>
                                    <option value="en">English</option>
                                    <option value="fr">Français (French)</option>
                                    <option value="es">Español (Spanish)</option>
                                    <option value="tr">Türkçe (Turkish)</option>
                                    <option value="ru">Русский (Russian)</option>
                                    <option value="zh">中文 (Chinese)</option>
                                    <option value="de">Deutsch (German)</option>
                                    <option value="hi">हिन्दी (Hindi)</option>
                                    <option value="pt">Português (Portuguese)</option>
                                    <option value="it">Italiano (Italian)</option>
                                    <option value="vi">Tiếng Việt (Vietnamese)</option>
                                    <option value="id">Bahasa Indonesia (Indonesian)</option>
                                    <option value="ur">اردو (Urdu)</option>
                                </select>
                            </div>
                        </div>
                    </main>
                </>
            );
        }

        const ROLE_LABELS = {
            admin: trans('role_admin', 'مدير النظام', 'System Admin'),
            trainer: trans('role_trainer', 'مدرب', 'Trainer'),
            receptionist: trans('role_receptionist', 'استقبال', 'Receptionist'),
            accountant: trans('role_accountant', 'محاسب', 'Accountant'),
            data_entry: trans('role_data_entry', 'مدخل بيانات', 'Data Entry'),
            marketing: trans('role_marketing', 'تسويق', 'Marketing'),
            sales: trans('role_sales', 'مبيعات', 'Sales'),
        };
        return (
            <>
                <main className="centered">
                    <div className="auth-box">
                        {/* Logo */}
                        <div className="auth-logo">
                            <div className="gms-logo-container"><div className="gms-logo-text">GMS</div></div>
                            <h1>{t.gymTitle}</h1>
                            <p>{trans('gymTitleSub', 'نظام احترافي متكامل', 'Professional Management System')}</p>
                        </div>

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {/* 1. System Type */}
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'block' }}>
                                    {trans('systemTypeLabel', 'نوع النظام', 'System Type')}
                                </label>
                                <div className="system-type-grid">
                                    <label className="system-type-btn">
                                        <input type="radio" name="loginMode" value="men" checked={loginMode === 'men'} onChange={(e) => setLoginMode(e.target.value)} />
                                        <span className="system-type-label">
                                            <span style={{ fontSize: 20 }}>♂️</span>
                                            {t.male}
                                        </span>
                                    </label>
                                    <label className="system-type-btn">
                                        <input type="radio" name="loginMode" value="women" checked={loginMode === 'women'} onChange={(e) => setLoginMode(e.target.value)} />
                                        <span className="system-type-label">
                                            <span style={{ fontSize: 20 }}>♀️</span>
                                            {t.female}
                                        </span>
                                    </label>
                                    <label className="system-type-btn">
                                        <input type="radio" name="loginMode" value="mix" checked={loginMode === 'mix'} onChange={(e) => setLoginMode(e.target.value)} />
                                        <span className="system-type-label">
                                            <span style={{ fontSize: 20 }}>⚡</span>
                                            {t.mix}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* 2. Email */}
                            <div className="input-group">
                                <span className="input-group-icon">✉️</span>
                                <input
                                    type="email"
                                    id="loginEmail"
                                    placeholder={trans('emailPlaceholder', 'البريد الإلكتروني', 'Email Address')}
                                    title={trans('emailTitle', 'أدخل البريد الإلكتروني المسجّل في النظام', 'Enter your registered email address')}
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                    autoComplete="off"
                                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                                    style={{ marginBottom: 0 }}
                                />
                            </div>

                            {/* 3. Password */}
                            <div className="input-group" style={{ marginBottom: 18 }}>
                                <span className="input-group-icon">🔒</span>
                                <input
                                    type="text"
                                    id="loginPassword"
                                    placeholder={t.password}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="off"
                                    style={{ marginBottom: 0, WebkitTextSecurity: 'disc', textSecurity: 'disc' }}
                                />
                            </div>

                            {/* Forgot Password Link */}
                            {failedLoginCount >= 3 && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18, marginTop: -6 }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setResetEmailOrPhone('');
                                            setResetOTP('');
                                            setResetNewPassword('');
                                            setResetConfirmPassword('');
                                            setResetStep(1);
                                            setResetError('');
                                            setResetSuccess('');
                                            setShowResetModal(true);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ff6b6b',
                                            cursor: 'pointer',
                                            fontSize: 12,
                                            padding: 0,
                                            textDecoration: 'underline',
                                            opacity: 0.85
                                        }}
                                        onMouseEnter={(e) => e.target.style.opacity = 1}
                                        onMouseLeave={(e) => e.target.style.opacity = 0.85}
                                    >
                                        {trans('forgotPassword', 'نسيت كلمة المرور؟', 'Forgot password?')}
                                    </button>
                                </div>
                            )}

                            {/* Error */}
                            {error && <div className="error-msg" style={{ marginBottom: 14 }}>{error}</div>}

                            {/* Submit */}
                            <button type="submit" className="auth-btn" id="loginBtn" disabled={loginLoading}>
                                {loginLoading ? (
                                    <span className="auth-btn-loading">
                                        <span className="auth-spinner"></span>
                                        {trans('signingIn', 'جاري الدخول...', 'Signing in...')}
                                    </span>
                                ) : (
                                    trans('signInBtn', 'تسجيل الدخول', 'Sign In')
                                )}
                            </button>
                        </form>

                        <div className="auth-lang-container">
                            <span style={{ fontSize: 13, opacity: 0.6 }}>🌐 {trans('selectLanguage', 'اختر اللغة', 'Select Language')}:</span>
                            <select 
                                className="auth-lang-select" 
                                value={lang} 
                                onChange={(e) => setLang(e.target.value)}
                            >
                                <option value="ar">العربية (Arabic)</option>
                                <option value="en">English</option>
                                <option value="fr">Français (French)</option>
                                <option value="es">Español (Spanish)</option>
                                <option value="tr">Türkçe (Turkish)</option>
                                <option value="ru">Русский (Russian)</option>
                                <option value="zh">中文 (Chinese)</option>
                                <option value="de">Deutsch (German)</option>
                                <option value="hi">हिन्दी (Hindi)</option>
                                <option value="pt">Português (Portuguese)</option>
                                <option value="it">Italiano (Italian)</option>
                                <option value="vi">Tiếng Việt (Vietnamese)</option>
                                <option value="id">Bahasa Indonesia (Indonesian)</option>
                                <option value="ur">اردو (Urdu)</option>
                            </select>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    // Main App
    const ROLE_LABELS_HEADER = {
        admin: trans('role_admin_header', 'مدير النظام', 'Admin'),
        trainer: trans('role_trainer_header', 'مدرب', 'Trainer'),
        receptionist: trans('role_receptionist_header', 'استقبال', 'Receptionist'),
        accountant: trans('role_accountant_header', 'محاسب', 'Accountant'),
        data_entry: trans('role_data_entry_header', 'مدخل بيانات', 'Data Entry'),
        marketing: trans('role_marketing_header', 'تسويق', 'Marketing'),
        sales: trans('role_sales_header', 'مبيعات', 'Sales'),
    };

    const activeBirthdays = (smartNotifications?.birthdays || []).filter(sub => !visitedAlerts.includes(`birthday-${sub._id}`));
    const activeAbsent = (smartNotifications?.absent || []).filter(sub => !visitedAlerts.includes(`absent-${sub._id}`));
    const activeLowStock = (smartNotifications?.lowStock || []).filter(good => !visitedAlerts.includes(`lowStock-${good._id}`));

    const totalAlerts = activeBirthdays.length + activeAbsent.length + activeLowStock.length;
    const originalAlertsCount = (smartNotifications?.birthdays?.length || 0) + (smartNotifications?.absent?.length || 0) + (smartNotifications?.lowStock?.length || 0);

    return (
        <>

            <main className="app">
                {/* Header */}
                <header className="topbar">
                    <div className="glass-title-badge">
                        <h1 style={{ fontSize: 16, margin: 0, fontWeight: 600 }}>{t.gymTitle} — {mode === 'men' ? t.male : mode === 'women' ? t.female : t.mix}</h1>
                    </div>

                    <div className="glass-gym-badge">
                        <div 
                            className="glass-logo-frame" 
                            style={{ 
                                width: logoSize, 
                                height: logoSize,
                                boxShadow: `0 0 15px ${logoGlow}40`,
                                borderColor: `${logoGlow}60`,
                                cursor: 'pointer',
                                userSelect: 'none'
                            }}
                            onMouseDown={startLogoPress}
                            onMouseUp={endLogoPress}
                            onMouseLeave={endLogoPress}
                            onTouchStart={startLogoPress}
                            onTouchEnd={endLogoPress}
                            onTouchCancel={endLogoPress}
                            onContextMenu={(e) => e.preventDefault()}
                            title={trans('holdEnlargeLogo', 'اضغط مطولاً لتكبير الشعار', 'Hold to enlarge logo')}
                        >
                            {gymLogo ? (
                                <img src={gymLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
                            ) : (
                                <span style={{ fontSize: logoSize * 0.5, pointerEvents: 'none' }}>🏋️</span>
                            )}
                        </div>
                        <span className="glassy-text" style={{ fontSize: Math.max(14, logoSize * 0.35) }}>{gymName || 'Gym System'}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <select 
                            className="lang-select-topbar" 
                            value={lang} 
                            onChange={(e) => setLang(e.target.value)}
                        >
                            <option value="ar">AR</option>
                            <option value="en">EN</option>
                            <option value="fr">FR</option>
                            <option value="es">ES</option>
                            <option value="tr">TR</option>
                            <option value="ru">RU</option>
                            <option value="zh">ZH</option>
                            <option value="de">DE</option>
                            <option value="hi">HI</option>
                            <option value="pt">PT</option>
                            <option value="it">IT</option>
                            <option value="vi">VI</option>
                            <option value="id">ID</option>
                            <option value="ur">UR</option>
                        </select>

                        {/* Admin Gender Switcher (Only in Separate mode for Admin) */}
                        {currentUser?.role === 'admin' && mode !== 'mix' && (
                            <div className="admin-view-container">
                                <select 
                                    className="admin-view-select"
                                    value={adminGenderView}
                                    onChange={(e) => setAdminGenderView(e.target.value)}
                                >
                                    <option value="all">🚻 {trans('showAll', 'عرض الكل', 'Show All')}</option>
                                    <option value="male">♂️ {trans('menOnly', 'الرجال فقط', 'Men Only')}</option>
                                    <option value="female">♀️ {trans('womenOnly', 'النساء فقط', 'Women Only')}</option>
                                </select>
                            </div>
                        )}

                        {/* Smart Notifications Bell */}
                        {currentUser && (
                            <div className="bell-container" style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                                    className="bell-btn"
                                    title={trans('smartNotificationsTitle', 'التنبيهات الذكية', 'Smart Notifications')}
                                    style={{
                                        background: showNotificationsDropdown ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        padding: '8px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '40px',
                                        height: '40px',
                                        transition: 'all 0.3s',
                                        outline: 'none'
                                    }}
                                >
                                    <span style={{ fontSize: '20px' }}>🔔</span>
                                    {totalAlerts > 0 && (
                                        <span className="bell-badge" style={{
                                            position: 'absolute',
                                            top: '-2px',
                                            right: '-2px',
                                            background: '#ff4d4f',
                                            color: 'white',
                                            borderRadius: '50%',
                                            padding: '2px 6px',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            minWidth: '18px',
                                            textAlign: 'center',
                                            boxShadow: '0 0 10px rgba(255, 77, 79, 0.6)'
                                        }}>
                                            {totalAlerts}
                                        </span>
                                    )}
                                </button>
                                {showNotificationsDropdown && (
                                    <div className="notifications-dropdown glass-panel" style={{
                                        position: 'absolute',
                                        right: lang === 'ar' ? 'auto' : '0',
                                        left: lang === 'ar' ? '0' : 'auto',
                                        top: '48px',
                                        width: '320px',
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        background: 'rgba(10, 25, 41, 0.98)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                        padding: '16px',
                                        zIndex: 1000,
                                        direction: lang === 'ar' ? 'rtl' : 'ltr'
                                    }}>
                                        <h4 style={{ margin: '0 0 12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', fontSize: '15px', color: '#fff' }}>
                                            <span>🔔 {trans('smartNotificationsTitle', 'التنبيهات الذكية', 'Smart Notifications')}</span>
                                            {totalAlerts > 0 && <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>{totalAlerts}</span>}
                                        </h4>
                                        
                                        {originalAlertsCount === 0 ? (
                                            <div style={{ textAlign: 'center', color: '#888', padding: '20px 0', fontSize: '13px' }}>
                                                {trans('noNotifications', 'لا توجد تنبيهات حالياً', 'No alerts currently')}
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {/* Birthdays Section */}
                                                {smartNotifications.birthdays?.length > 0 && (
                                                    <div>
                                                        <div style={{ fontSize: '12px', color: '#ffb86c', fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span>🎉</span> {trans('todayBirthdays', 'أعياد ميلاد اليوم', "Today's Birthdays")}
                                                        </div>
                                                        {smartNotifications.birthdays.map((sub, idx) => (
                                                            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px', fontSize: '12px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <div>
                                                                    <div style={{ fontWeight: 'bold', color: '#fff' }}>{sub.name}</div>
                                                                    <div style={{ color: '#888', fontSize: '11px' }}>{sub.phone}</div>
                                                                </div>
                                                                <button 
                                                                    onClick={() => {
                                                                        markAlertAsVisited(`birthday-${sub._id}`);
                                                                        setActiveTab('subscribers');
                                                                        setSearchTerm(sub.name);
                                                                        setShowNotificationsDropdown(false);
                                                                    }}
                                                                    style={{ background: 'none', border: 'none', color: visitedAlerts.includes(`birthday-${sub._id}`) ? '#000000' : '#0ee6b7', cursor: 'pointer', fontSize: '11px', textDecoration: 'none' }}
                                                                >
                                                                    {trans('view', 'عرض', 'View')}
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                {/* Absent Members Section */}
                                                {smartNotifications.absent?.length > 0 && (
                                                    <div>
                                                        <div style={{ fontSize: '12px', color: '#ff79c6', fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span>⚠️</span> {trans('absentMembersAlert', 'مشتركين غائبين', "Absent Members")}
                                                        </div>
                                                        {smartNotifications.absent.map((sub, idx) => (
                                                            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px', fontSize: '12px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <div>
                                                                    <div style={{ fontWeight: 'bold', color: '#fff' }}>{sub.name}</div>
                                                                    <div style={{ color: '#888', fontSize: '11px' }}>
                                                                        {trans('lastVisit', 'آخر حضور:', 'Last visit:')} {sub.stats?.lastVisit ? new Date(sub.stats.lastVisit).toLocaleDateString() : 'N/A'}
                                                                    </div>
                                                                </div>
                                                                <button 
                                                                    onClick={() => {
                                                                        markAlertAsVisited(`absent-${sub._id}`);
                                                                        setActiveTab('subscribers');
                                                                        setSearchTerm(sub.name);
                                                                        setShowNotificationsDropdown(false);
                                                                    }}
                                                                    style={{ background: 'none', border: 'none', color: visitedAlerts.includes(`absent-${sub._id}`) ? '#000000' : '#0ee6b7', cursor: 'pointer', fontSize: '11px', textDecoration: 'none' }}
                                                                >
                                                                    {trans('view', 'عرض', 'View')}
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                {/* Low Stock Goods Section */}
                                                {smartNotifications.lowStock?.length > 0 && (
                                                    <div>
                                                        <div style={{ fontSize: '12px', color: '#ff5555', fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span>📦</span> {trans('lowStockAlert', 'نواقص البضائع', "Low Stock Goods")}
                                                        </div>
                                                        {smartNotifications.lowStock.map((good, idx) => (
                                                            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px', fontSize: '12px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <div>
                                                                    <div style={{ fontWeight: 'bold', color: '#fff' }}>{good.name}</div>
                                                                    <div style={{ color: '#ff5555', fontSize: '11px' }}>
                                                                        {trans('quantity', 'الكمية:', 'Qty:')} {good.qty} / {trans('minStock', 'الحد الأدنى:', 'Min:')} {good.minStock}
                                                                    </div>
                                                                </div>
                                                                <button 
                                                                    onClick={() => {
                                                                        markAlertAsVisited(`lowStock-${good._id}`);
                                                                        setActiveTab('goods');
                                                                        setShowNotificationsDropdown(false);
                                                                    }}
                                                                    style={{ background: 'none', border: 'none', color: visitedAlerts.includes(`lowStock-${good._id}`) ? '#000000' : '#0ee6b7', cursor: 'pointer', fontSize: '11px', textDecoration: 'none' }}
                                                                >
                                                                    {trans('view', 'عرض', 'View')}
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* User Info Pill */}
                        {currentUser && (
                            <div className="user-info-pill">
                                <div className="user-avatar">
                                    {currentUser.name?.charAt(0) || '?'}
                                </div>
                                <div className="user-text">
                                    <span className="user-name">{currentUser.name}</span>
                                    <span className={`user-role-badge role-${currentUser.role}`}>
                                        {ROLE_LABELS_HEADER[currentUser.role] || currentUser.role}
                                    </span>
                                </div>
                            </div>
                        )}

                        <button
                            className="logout-btn"
                            id="logoutBtn"
                            onClick={() => {
                                // مسح الجلسة من sessionStorage عند تسجيل الخروج
                                sessionStorage.removeItem('gms_session');
                                setMode(null);
                                setCurrentUser(null);
                            }}
                            title={trans('logoutTooltip', 'تسجيل الخروج من النظام', 'Log out of system')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            {t.logout}
                        </button>
                    </div>
                </header>

                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={activeTab === 'dashboard' ? 'active' : ''}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        {t.dashboard}
                    </button>
                    <button
                        className={activeTab === 'subscribers' ? 'active' : ''}
                        onClick={() => setActiveTab('subscribers')}
                    >
                        {t.subscribers}
                    </button>
                    <button
                        className={activeTab === 'goods' ? 'active' : ''}
                        onClick={() => setActiveTab('goods')}
                    >
                        {t.goods}
                    </button>
                    <button
                        className={activeTab === 'stock' ? 'active' : ''}
                        onClick={() => setActiveTab('stock')}
                    >
                        {trans('stockTab', 'المخزون', 'Stock')}
                    </button>
                    <button
                        className={activeTab === 'expenses' ? 'active' : ''}
                        onClick={() => setActiveTab('expenses')}
                    >
                        {t.expenses}
                    </button>
                    <button
                        className={activeTab === 'attendance' ? 'active' : ''}
                        onClick={() => setActiveTab('attendance')}
                    >
                        {t.attendance}
                    </button>
                    <button
                        className={activeTab === 'classes' ? 'active' : ''}
                        onClick={() => setActiveTab('classes')}
                    >
                        {t.classes}
                    </button>
                    {(currentUser?.role === 'admin' || currentUser?.permissions?.canManageStaff) && (
                        <button
                            className={activeTab === 'staff' ? 'active' : ''}
                            onClick={() => setActiveTab('staff')}
                        >
                            {t.staff}
                        </button>
                    )}
                    {(currentUser?.role === 'admin' || currentUser?.permissions?.canViewReports) && (
                        <button
                            className={activeTab === 'reports' ? 'active' : ''}
                            onClick={() => setActiveTab('reports')}
                        >
                            {t.reports}
                        </button>
                    )}
                    {(currentUser?.role === 'admin' || currentUser?.permissions?.canManageFinances) && (
                        <button
                            className={activeTab === 'payments' ? 'active' : ''}
                            onClick={() => setActiveTab('payments')}
                        >
                            {t.payments}
                        </button>
                    )}
                    <button
                        className={activeTab === 'measurements' ? 'active' : ''}
                        onClick={() => setActiveTab('measurements')}
                    >
                        {t.measurements}
                    </button>
                    {(currentUser?.role === 'admin' || currentUser?.permissions?.canManageLoyalty) && (
                        <button
                            className={activeTab === 'loyalty' ? 'active' : ''}
                            onClick={() => setActiveTab('loyalty')}
                        >
                            {t.loyalty}
                        </button>
                    )}
                    {(currentUser?.role === 'admin' || currentUser?.permissions?.canManageEquipment) && (
                        <button
                            className={activeTab === 'equipment' ? 'active' : ''}
                            onClick={() => setActiveTab('equipment')}
                        >
                            {t.equipment}
                        </button>
                    )}
                    {currentUser?.role === 'admin' && (
                        <button
                            className={activeTab === 'performance' ? 'active' : ''}
                            onClick={() => setActiveTab('performance')}
                        >
                            {t.performance}
                        </button>
                    )}
                    {currentUser?.role === 'admin' && (
                        <button
                            className={activeTab === 'settings' ? 'active' : ''}
                            onClick={() => setActiveTab('settings')}
                        >
                            {t.settings}
                        </button>
                    )}
                    <button
                        className={activeTab === 'faq' ? 'active' : ''}
                        onClick={() => setActiveTab('faq')}
                    >
                        FAQ
                    </button>
                </div>

                {isLoading && <div className="loading">{t.loading}</div>}

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (currentUser?.role === 'admin' || currentUser?.permissions?.canViewDashboard) && (
                    <>
                        <DashboardStats stats={stats} lang={lang} t={t} mode={mode} subscribers={subscribers} currency={currency} currentUser={currentUser} smartNotifications={smartNotifications} />
                    </>
                )}

                {/* Subscribers Tab */}
                {activeTab === 'subscribers' && (
                    <SubscribersTab
                        lang={lang} t={t} mode={mode} currentUser={currentUser} currency={currency}
                        subscribers={subscribers} searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                        filterType={filterType} setFilterType={setFilterType} filteredSubs={filteredSubs}
                        filterMonth={filterMonth} setFilterMonth={setFilterMonth}
                        editSubId={editSubId} setEditSubId={setEditSubId} subFormRef={subFormRef}
                        handleSubSubmit={handleSubSubmit} handleDelete={handleDelete} handleRenew={handleRenew}
                        handleExtend={handleExtend}
                        handleCheckIn={handleCheckIn} handleFreeze={handleFreeze} handleUnfreeze={handleUnfreeze}
                        setSelectedSub={setSelectedSub} getStatus={getStatus} exportToCSV={exportToCSV}
                    />
                )}

                {/* Goods Tab */}
                {activeTab === 'goods' && (
                    <GoodsTab
                        lang={lang} t={t} mode={mode} currentUser={currentUser} currency={currency}
                        goods={goods} editGoodsId={editGoodsId} setEditGoodsId={setEditGoodsId}
                        goodsFormRef={goodsFormRef} handleGoodsSubmit={handleGoodsSubmit}
                        handleDelete={handleDelete} exportToCSV={exportToCSV}
                        handleManualSale={handleManualSale}
                    />
                )}

                {/* Expenses Tab */}
                {(currentUser?.role === 'admin' || currentUser?.permissions?.canManageFinances) && activeTab === 'expenses' && (
                    <ExpensesTab
                        t={t} mode={mode} lang={lang} expenses={expenses} currency={currency}
                        currentUser={currentUser}
                        editExpId={editExpId} setEditExpId={setEditExpId}
                        expFormRef={expFormRef} handleExpSubmit={handleExpSubmit}
                        handleDelete={handleDelete} exportToCSV={exportToCSV}
                    />
                )}

                {/* Staff Tab */}
                {(currentUser?.role === 'admin' || currentUser?.permissions?.canManageStaff) && activeTab === 'staff' && (
                    <DemoReadOnlyWrapper lang={lang}>
                        <StaffTab key={activeTab + staff.length}
                            lang={lang} t={t} staff={staff}
                            handleStaffSubmit={handleStaffSubmit}
                            handleDelete={handleDelete}
                            updateStaffPermissions={updateStaffPermissions}
                            loadAllData={loadAllData}
                            currentUser={currentUser}
                        />
                    </DemoReadOnlyWrapper>
                )}

                {/* Classes Tab */}
                {activeTab === 'classes' && (
                    <DemoReadOnlyWrapper lang={lang}>
                        <ClassesTab
                            lang={lang} t={t} classes={classes}
                            handleClassSubmit={handleClassSubmit}
                            handleDelete={handleDelete} loadAllData={loadAllData}
                        />
                    </DemoReadOnlyWrapper>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                    <DemoReadOnlyWrapper lang={lang}>
                        <AttendanceTab
                            lang={lang} t={t} todayAttendance={todayAttendance}
                            handleCheckOut={handleCheckOut}
                        />
                    </DemoReadOnlyWrapper>
                )}

                {/* Reports Tab */}
                {(currentUser?.role === 'admin' || currentUser?.permissions?.canViewReports) && activeTab === 'reports' && (
                    <ReportsTab
                        lang={lang} t={t} mode={mode} currency={currency}
                        currentUser={currentUser}
                        monthlyComparison={monthlyComparison}
                        advStats={advStats}
                    />
                )}

                {/* Payments Tab */}
                {(currentUser?.role === 'admin' || currentUser?.permissions?.canManageFinances) && activeTab === 'payments' && (
                    <DemoReadOnlyWrapper lang={lang}>
                        <PaymentsTab
                            lang={lang} t={t} currency={currency}
                            payments={payments}
                            pendingInstallments={pendingInstallments}
                            updatePaymentStatus={handleUpdatePaymentStatus}
                            exportToCSV={exportToCSV}
                        />
                    </DemoReadOnlyWrapper>
                )}

                {/* Measurements Tab */}
                {activeTab === 'measurements' && (
                    <DemoReadOnlyWrapper lang={lang}>
                        <MeasurementsTab
                            lang={lang} t={t}
                            subscribers={subscribers}
                            addMeasurement={(data) => addMeasurement(data, currentUser?._id)}
                            updateMeasurement={(id, data) => updateMeasurement(id, data, currentUser?._id)}
                            deleteMeasurement={(id) => deleteMeasurement(id, currentUser?._id)}
                            getSubscriberMeasurements={getSubscriberMeasurements}
                        />
                    </DemoReadOnlyWrapper>
                )}

                {/* Loyalty Tab */}
                {(currentUser?.role === 'admin' || currentUser?.permissions?.canManageLoyalty) && activeTab === 'loyalty' && (
                    <DemoReadOnlyWrapper lang={lang}>
                        <LoyaltyTab
                            lang={lang} t={t}
                            subscribers={subscribers}
                            getLoyaltyInfo={getLoyaltyInfo}
                            addLoyaltyPoints={addLoyaltyPoints}
                            redeemLoyaltyPoints={redeemLoyaltyPoints}
                        />
                    </DemoReadOnlyWrapper>
                )}

                {/* Equipment Tab */}
                {(currentUser?.role === 'admin' || currentUser?.permissions?.canManageEquipment) && activeTab === 'equipment' && (
                    <DemoReadOnlyWrapper lang={lang}>
                        <EquipmentTab
                            lang={lang} t={t}
                            equipment={equipment}
                            systemType={systemType}
                            addEquipment={(data) => addEquipment(data, currentUser?._id)}
                            updateEquipment={(id, data) => updateEquipment(id, data, currentUser?._id)}
                            handleDelete={handleDelete}
                            addMaintenance={(data) => addMaintenance(data, currentUser?._id)}
                            getMaintenanceDue={getMaintenanceDue}
                            loadAllData={loadAllData}
                        />
                    </DemoReadOnlyWrapper>
                )}

                {/* Performance Tab */}
                {activeTab === 'performance' && currentUser?.role === 'admin' && (
                    <DemoReadOnlyWrapper lang={lang}>
                        <PerformanceTab
                            lang={lang}
                            t={t}
                            currency={currency}
                            staff={staff}
                            getAuditLogs={getAuditLogs}
                            getStaffPerformanceStats={getStaffPerformanceStats}
                            deleteAuditLogs={deleteAuditLogs}
                            currentUser={currentUser}
                        />
                    </DemoReadOnlyWrapper>
                )}

                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                    <FAQTab
                        lang={lang}
                    />
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && currentUser?.role === 'admin' && (
                    <DemoReadOnlyWrapper lang={lang}>
                        <SettingsTab
                            lang={lang} t={t} mode={mode} currentUser={currentUser}
                            currency={currency} setCurrency={setCurrency}
                            gymName={gymName} setGymName={setGymName}
                            gymLogo={gymLogo} setGymLogo={setGymLogo}
                            logoSize={logoSize} setLogoSize={setLogoSize}
                            logoGlow={logoGlow} setLogoGlow={setLogoGlow}
                            handleBackup={handleBackup}
                            handleRestore={handleFileChange}
                            setShowPasswordModal={setShowPasswordModal}
                            clearAllData={() => clearAllData(currentUser?._id)}
                            loadAllData={loadAllData}
                            smsGatewayUrl={smsGatewayUrl}
                            setSmsGatewayUrl={setSmsGatewayUrl}
                            smsApiKey={smsApiKey}
                            setSmsApiKey={setSmsApiKey}
                            smsSenderId={smsSenderId}
                            setSmsSenderId={setSmsSenderId}
                            smsEnabled={smsEnabled}
                            setSmsEnabled={setSmsEnabled}
                            updateSettings={(data) => updateSettings(data, currentUser?._id)}
                        />
                    </DemoReadOnlyWrapper>
                )}

                {/* Password Modal */}
                <Modal
                    isOpen={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    title={t.changePasswords}
                >
                    <input
                        type="text" autoComplete="off"
                        placeholder="Admin Password"
                        value={passwords.admin}
                        onChange={(e) => setPasswords({ ...passwords, admin: e.target.value })}
                        style={{ width: '100%', marginBottom: 10, WebkitTextSecurity: 'disc', textSecurity: 'disc' }}
                    />
                    <input
                        type="text" autoComplete="off"
                        placeholder="Men Password"
                        value={passwords.men}
                        onChange={(e) => setPasswords({ ...passwords, men: e.target.value })}
                        style={{ width: '100%', marginBottom: 10, WebkitTextSecurity: 'disc', textSecurity: 'disc' }}
                    />
                    <input
                        type="text" autoComplete="off"
                        placeholder="Women Password"
                        value={passwords.women}
                        onChange={(e) => setPasswords({ ...passwords, women: e.target.value })}
                        style={{ width: '100%', marginBottom: 10, WebkitTextSecurity: 'disc', textSecurity: 'disc' }}
                    />
                    <input
                        type="text" autoComplete="off"
                        placeholder="Mix Mode Password"
                        value={passwords.mix}
                        onChange={(e) => setPasswords({ ...passwords, mix: e.target.value })}
                        style={{ width: '100%', marginBottom: 10, WebkitTextSecurity: 'disc', textSecurity: 'disc' }}
                    />
                    <input
                        type="tel"
                        placeholder="Recovery Phone"
                        value={passwords.recoveryPhone}
                        onChange={(e) => setPasswords({ ...passwords, recoveryPhone: e.target.value })}
                        style={{ width: '100%', marginBottom: 10 }}
                    />
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={handlePasswordChange} style={{ flex: 1 }}>{t.save}</button>
                        <button onClick={() => setShowPasswordModal(false)} style={{ flex: 1, background: 'gray' }}>{t.cancel}</button>
                    </div>
                </Modal>

                {/* Subscriber Detail Modal */}
                <SubscriberModal
                    lang={lang} t={t}
                    selectedSub={selectedSub}
                    setSelectedSub={setSelectedSub}
                    currentUser={currentUser}
                />

                {activeTab === 'stock' && (
                    <StockDashboard
                        lang={lang}
                        t={t}
                        mode={mode}
                        goods={goods}
                        recentSales={recentSales}
                        sellGoodsByBarcode={(barcode, gender, qty) => sellGoodsByBarcode(barcode, gender, qty, systemType, currentUser?._id)}
                        loadAllData={loadAllData}
                        getSalesByMonth={(m, y) => getSalesByMonth(m, y, systemType)}
                        undoSale={(saleId) => undoSale(saleId, currentUser?._id)}
                        currentUser={currentUser}
                    />
                )}

                
            {/* Custom Delete Confirmation Modal */}
            {confirmDelete.open && (
                <div className="modal-overlay">
                    <div className="modal-content delete-confirm-modal" style={{ maxWidth: 400, textAlign: 'center' }}>
                        <div className="delete-icon-warn">⚠️</div>
                        <h3>{trans('confirmDeletion', 'تأكيد الحذف', 'Confirm Deletion')}</h3>
                        <p style={{ opacity: 0.8, marginBottom: 24 }}>{confirmDelete.msg}</p>
                        
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button 
                                onClick={executeDeletion} 
                                disabled={isDeleting}
                                style={{ flex: 1, background: 'darkred', color: 'white' }}
                            >
                                {isDeleting ? trans('deleting', 'جاري الحذف...', 'Deleting...') : trans('confirmDeleteYes', 'تأكيد الحذف', 'Yes, Delete')}
                            </button>
                            <button 
                                onClick={() => setConfirmDelete({ open: false, type: '', id: '', msg: '' })} 
                                disabled={isDeleting}
                                style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}
                            >
                                {trans('cancelBtn', 'إلغاء', 'Cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showLargeLogo && (
                <div className="logo-preview-overlay" onClick={() => setShowLargeLogo(false)}>
                    <div className="logo-preview-card" onClick={(e) => e.stopPropagation()} style={{
                        borderColor: `${logoGlow}80`,
                        boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${logoGlow}30`
                    }}>
                        <button className="logo-preview-close" onClick={() => setShowLargeLogo(false)}>×</button>
                        <div className="logo-preview-image-container">
                            {gymLogo ? (
                                <img src={gymLogo} alt="Gym Logo Large" className="logo-preview-img" />
                            ) : (
                                <span className="logo-preview-emoji">🏋️</span>
                            )}
                        </div>
                        <div className="logo-preview-details">
                            <h3>{gymName || 'Gym System'}</h3>
                            <p>{trans('gymLogoLabel', 'شعار النادي الرياضي', 'Gym Logo')}</p>
                        </div>
                    </div>
                </div>
            )}

            <ChatBot faqData={FAQ_DATA} lang={lang} />
            </main >

            <style jsx global>{`
                .tabs {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                .tabs button {
                    padding: 10px 20px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.3s;
                }
                .tabs button.active {
                    background: linear-gradient(90deg, #0b6b8a, #1496b0);
                    border-color: #1496b0;
                }
                .tabs button:hover {
                    background: rgba(255,255,255,0.1);
                }
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }
                .stat-card {
                    background: linear-gradient(135deg, rgba(11, 107, 138, 0.1), rgba(6, 42, 61, 0.2));
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                }
                .stat-label {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 10px;
                }
                .stat-value {
                    font-size: 32px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #ffffff, #cccccc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .loading {
                    text-align: center;
                    padding: 20px;
                    font-size: 18px;
                    color: rgba(255, 255, 255, 0.7);
                }
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: linear-gradient(180deg, rgba(6, 12, 18, 0.95), rgba(9, 16, 23, 0.95));
                    padding: 30px;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 90%;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .icon-btn:hover {
                    background: rgba(255,255,255,0.1);
                }

                /* Logo Preview Overlay Styles */
                .glass-logo-frame {
                    transition: all 0.2s ease;
                }
                .glass-logo-frame:active {
                    transform: scale(0.92);
                }
                .logo-preview-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: logoFadeIn 0.25s ease;
                }
                .logo-preview-card {
                    background: linear-gradient(135deg, rgba(16, 28, 36, 0.95), rgba(10, 16, 22, 0.98));
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 24px;
                    padding: 28px 24px 24px;
                    max-width: 90vw;
                    width: 380px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    animation: logoScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .logo-preview-close {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    color: #fff;
                    font-size: 18px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .logo-preview-close:hover {
                    background: rgba(255, 67, 54, 0.2);
                    border-color: rgba(255, 67, 54, 0.4);
                    color: #ff6b6b;
                    transform: rotate(90deg);
                }
                .logo-preview-image-container {
                    width: 260px;
                    height: 260px;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 0, 0, 0.2);
                    margin-bottom: 20px;
                    box-shadow: inset 0 0 15px rgba(0,0,0,0.5);
                }
                .logo-preview-img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    transition: transform 0.3s;
                }
                .logo-preview-img:hover {
                    transform: scale(1.05);
                }
                .logo-preview-emoji {
                    font-size: 110px;
                    animation: logoPulse 2s infinite ease-in-out;
                }
                .logo-preview-details {
                    text-align: center;
                }
                .logo-preview-details h3 {
                    margin: 0 0 6px 0;
                    font-size: 20px;
                    color: #fff;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                .logo-preview-details p {
                    margin: 0;
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.5);
                }
                @keyframes logoFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes logoScaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes logoPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }
            `}</style>
        </>
    );
}
