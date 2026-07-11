'use client';
import React, { useState, useEffect } from 'react';

export default function PerformanceTab({ lang, t, currency, staff, getAuditLogs, getStaffPerformanceStats, deleteAuditLogs, currentUser }) {
    const [performanceStats, setPerformanceStats] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingLogs, setLoadingLogs] = useState(true);
    
    // Filters State
    const [selectedStaffId, setSelectedStaffId] = useState('all');
    const [filterAction, setFilterAction] = useState('all');
    const [filterEntity, setFilterEntity] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // UI details state
    const [selectedPerfStaff, setSelectedPerfStaff] = useState(null);
    const [expandedLogId, setExpandedLogId] = useState(null);
    const [selectedLogIds, setSelectedLogIds] = useState([]);

    const isRtl = lang === 'ar' || lang === 'ur';

    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const translateDescription = (desc) => {
        if (lang === 'ar' || !desc) return desc;

        // 1. Subscribers
        if (desc.startsWith('إضافة مشترك جديد:')) {
            return desc.replace('إضافة مشترك جديد:', 'Added new subscriber:');
        }
        if (desc.startsWith('تعديل بيانات المشترك:')) {
            return desc.replace('تعديل بيانات المشترك:', 'Updated subscriber details:');
        }
        if (desc.startsWith('حذف المشترك:')) {
            return desc.replace('حذف المشترك:', 'Deleted subscriber:');
        }
        if (desc.startsWith('تجديد اشتراك المشترك:')) {
            return desc.replace('تجديد اشتراك المشترك:', 'Renewed subscription for:')
                       .replace('لمدة', 'for')
                       .replace('شهر', 'months');
        }
        if (desc.startsWith('تجميد اشتراك المشترك:')) {
            return desc.replace('تجميد اشتراك المشترك:', 'Froze subscription for:')
                       .replace('لسبب:', 'Reason:');
        }
        if (desc.startsWith('إلغاء تجميد اشتراك المشترك:')) {
            return desc.replace('إلغاء تجميد اشتراك المشترك:', 'Unfroze subscription for:');
        }
        if (desc.startsWith('تسجيل دخول (حضور) للمشترك:')) {
            return desc.replace('تسجيل دخول (حضور) للمشترك:', 'Checked in subscriber:');
        }
        if (desc.startsWith('تسجيل خروج (انصراف) للمشترك:')) {
            return desc.replace('تسجيل خروج (انصراف) للمشترك:', 'Checked out subscriber:');
        }

        // 2. Staff
        if (desc.startsWith('إضافة موظف جديد:')) {
            return desc.replace('إضافة موظف جديد:', 'Registered new staff member:')
                       .replace('بدور', 'with role');
        }
        if (desc.startsWith('تعديل بيانات الموظف:')) {
            return desc.replace('تعديل بيانات الموظف:', 'Updated staff details:');
        }
        if (desc.startsWith('حذف الموظف:')) {
            return desc.replace('حذف الموظف:', 'Deleted staff member:');
        }
        if (desc.startsWith('تسجيل دخول للموظف:')) {
            return desc.replace('تسجيل دخول للموظف:', 'Staff logged in:');
        }
        if (desc.startsWith('تغيير كلمة مرور الموظف:')) {
            return desc.replace('تغيير كلمة مرور الموظف:', 'Changed password for staff:');
        }
        if (desc.startsWith('تعديل صلاحيات الموظف:')) {
            return desc.replace('تعديل صلاحيات الموظف:', 'Updated permissions for staff:');
        }

        // 3. Classes
        if (desc.startsWith('إضافة حصة تدريبية:')) {
            return desc.replace('إضافة حصة تدريبية:', 'Added new training class:');
        }
        if (desc.startsWith('تعديل الحصة التدريبية:')) {
            return desc.replace('تعديل الحصة التدريبية:', 'Updated training class:');
        }
        if (desc.startsWith('حذف الحصة التدريبية:')) {
            return desc.replace('حذف الحصة التدريبية:', 'Deleted training class:');
        }

        // 4. Equipment
        if (desc.startsWith('إضافة جهاز/معدة:')) {
            return desc.replace('إضافة جهاز/معدة:', 'Added equipment:');
        }
        if (desc.startsWith('تعديل بيانات الجهاز/المعدة:')) {
            return desc.replace('تعديل بيانات الجهاز/المعدة:', 'Updated equipment details:');
        }
        if (desc.startsWith('حذف الجهاز/المعدة:')) {
            return desc.replace('حذف الجهاز/المعدة:', 'Deleted equipment:');
        }
        if (desc.startsWith('تسجيل صيانة للجهاز:')) {
            return desc.replace('تسجيل صيانة للجهاز:', 'Recorded maintenance for equipment:')
                       .replace('(التكلفة:', '(Cost:');
        }

        // 5. Settings / Backup
        if (desc === 'تحديث إعدادات النظام العامة') return 'Updated general system settings';
        if (desc === 'تحديث كلمات المرور الافتراضية للأنظمة') return 'Updated default system passwords';
        if (desc === 'تصدير نسخة احتياطية من البيانات') return 'Exported database backup';
        if (desc === 'استيراد واستعادة نسخة احتياطية من البيانات') return 'Imported and restored database backup';
        if (desc === 'مسح جميع البيانات وتهيئة النظام') return 'Cleared all data and initialized system';

        // 6. Payments & Expenses
        if (desc.startsWith('تسجيل دفعة مالية بقيمة')) {
            return desc.replace('تسجيل دفعة مالية بقيمة', 'Processed payment of')
                       .replace('للمشترك:', 'for subscriber:');
        }
        if (desc.startsWith('تحديث حالة الدفعة للمشترك')) {
            return desc.replace('تحديث حالة الدفعة للمشترك', 'Updated payment status for subscriber')
                       .replace('بقيمة', 'of amount')
                       .replace('إلى:', 'to:');
        }
        if (desc.startsWith('إضافة مصروف جديد:')) {
            return desc.replace('إضافة مصروف جديد:', 'Recorded new expense:')
                       .replace('بقيمة', 'of value');
        }
        if (desc.startsWith('تعديل المصروف:')) {
            return desc.replace('تعديل المصروف:', 'Updated expense:');
        }
        if (desc.startsWith('حذف المصروف:')) {
            return desc.replace('حذف المصروف:', 'Deleted expense:');
        }

        // 7. Goods & Sales
        if (desc.startsWith('بيع منتج بالباركود:')) {
            return desc.replace('بيع منتج بالباركود:', 'Sold product by barcode:')
                       .replace('(الكمية:', '(Qty:');
        }
        if (desc.startsWith('بيع منتج:')) {
            return desc.replace('بيع منتج:', 'Sold product:')
                       .replace('(الكمية:', '(Qty:');
        }
        if (desc.startsWith('تراجع عن عملية بيع:')) {
            return desc.replace('تراجع عن عملية بيع:', 'Refunded sale:')
                       .replace('(الكمية:', '(Qty:');
        }
        if (desc.startsWith('تراجع عن بيع:')) {
            return desc.replace('تراجع عن بيع:', 'Refunded sale:');
        }

        // 8. Measurements
        if (desc.startsWith('إضافة قياسات جديدة للمشترك')) {
            return desc.replace('إضافة قياسات جديدة للمشترك', 'Added new measurements for subscriber')
                       .replace('(وزن:', '(Weight:')
                       .replace('دهون:', 'Body Fat:')
                       .replace(')', ')');
        }
        if (desc.startsWith('تعديل قياسات المشترك')) {
            return desc.replace('تعديل قياسات المشترك', 'Updated measurements for subscriber')
                       .replace('(وزن:', '(Weight:');
        }
        if (desc.startsWith('حذف سجل قياسات المشترك ID:')) {
            return desc.replace('حذف سجل قياسات المشترك ID:', 'Deleted measurements record for subscriber ID:');
        }

        return desc;
    };

    // Load stats and logs
    useEffect(() => {
        async function loadData() {
            setLoadingStats(true);
            setLoadingLogs(true);
            try {
                const stats = await getStaffPerformanceStats();
                const filteredStats = (stats || []).filter(s => 
                    staff.some(emp => String(emp._id) === String(s.staff?._id))
                );
                setPerformanceStats(filteredStats);
                
                // Set default selected staff for detail card if available
                if (filteredStats && filteredStats.length > 0) {
                    setSelectedPerfStaff(filteredStats[0]);
                } else {
                    setSelectedPerfStaff(null);
                }
                
                const logs = await getAuditLogs();
                const filteredLogs = (logs || []).filter(log => 
                    !log.user || staff.some(emp => String(emp._id) === String(log.user._id))
                );
                setAuditLogs(filteredLogs);
                setSelectedLogIds([]);
            } catch (err) {
                console.error("Error loading performance data:", err);
            } finally {
                setLoadingStats(false);
                setLoadingLogs(false);
            }
        }
        loadData();
    }, [getAuditLogs, getStaffPerformanceStats, staff]);

    // Refresh data handler
    const handleRefresh = async () => {
        setLoadingStats(true);
        setLoadingLogs(true);
        try {
            const stats = await getStaffPerformanceStats();
            const filteredStats = (stats || []).filter(s => 
                staff.some(emp => String(emp._id) === String(s.staff?._id))
            );
            setPerformanceStats(filteredStats);
            
            // Sync selected staff reference
            if (selectedPerfStaff) {
                const updated = filteredStats.find(s => String(s.staff?._id) === String(selectedPerfStaff.staff?._id));
                if (updated) {
                    setSelectedPerfStaff(updated);
                } else {
                    setSelectedPerfStaff(filteredStats[0] || null);
                }
            } else {
                setSelectedPerfStaff(filteredStats[0] || null);
            }
            
            // Load logs with active filters
            const filters = {};
            if (selectedStaffId !== 'all') filters.userId = selectedStaffId;
            if (filterAction !== 'all') filters.action = filterAction;
            if (filterEntity !== 'all') filters.entity = filterEntity;
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const logs = await getAuditLogs(filters);
            const filteredLogs = (logs || []).filter(log => 
                !log.user || staff.some(emp => String(emp._id) === String(log.user._id))
            );
            setAuditLogs(filteredLogs);
            setSelectedLogIds([]);
        } catch (err) {
            console.error("Error refreshing data:", err);
        } finally {
            setLoadingStats(false);
            setLoadingLogs(false);
        }
    };

    // Filter logs handler
    const applyFilters = async () => {
        setLoadingLogs(true);
        try {
            const filters = {};
            if (selectedStaffId !== 'all') filters.userId = selectedStaffId;
            if (filterAction !== 'all') filters.action = filterAction;
            if (filterEntity !== 'all') filters.entity = filterEntity;
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const logs = await getAuditLogs(filters);
            const filteredLogs = (logs || []).filter(log => 
                !log.user || staff.some(emp => String(emp._id) === String(log.user._id))
            );
            setAuditLogs(filteredLogs);
            setSelectedLogIds([]);
        } catch (err) {
            console.error("Error applying filters:", err);
        } finally {
            setLoadingLogs(false);
        }
    };

    // Filtered list for display (with client-side search query match)
    const displayedLogs = auditLogs.filter(log => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const userName = log.user?.name?.toLowerCase() || '';
        const userEmail = log.user?.email?.toLowerCase() || '';
        const description = log.description?.toLowerCase() || '';
        const entity = log.entity?.toLowerCase() || '';
        return userName.includes(query) || userEmail.includes(query) || description.includes(query) || entity.includes(query);
    });

    // Group logs by day
    const groupedLogs = React.useMemo(() => {
        const groups = {};
        displayedLogs.forEach(log => {
            if (!log.createdAt) return;
            const dateObj = new Date(log.createdAt);
            const dateStr = dateObj.toLocaleDateString('en-US');
            if (!groups[dateStr]) {
                groups[dateStr] = [];
            }
            groups[dateStr].push(log);
        });
        return groups;
    }, [displayedLogs]);

    const sortedDayKeys = React.useMemo(() => {
        return Object.keys(groupedLogs).sort((a, b) => {
            return new Date(b).getTime() - new Date(a).getTime();
        });
    }, [groupedLogs]);

    // Calculations for overall summary cards
    const totalActivitiesLogged = performanceStats.reduce((sum, s) => sum + (s.totalActions || 0), 0);
    const activeStaffCount = staff.filter(s => s.active).length;
    
    // Find top performer by actions count
    let topPerformer = null;
    if (performanceStats.length > 0) {
        topPerformer = performanceStats.reduce((prev, current) => {
            return (prev.totalActions > current.totalActions) ? prev : current;
        });
    }

    // Delete Selected Logs
    const handleDeleteLogs = async () => {
        if (!selectedLogIds.length) return;
        if (!confirm(trans('confirmDeleteLogs', `هل أنت متأكد من حذف عدد ${selectedLogIds.length} من سجلات الأنشطة المحددة؟ لا يمكن التراجع عن هذا الإجراء!`, `Are you sure you want to delete the ${selectedLogIds.length} selected activity logs? This action cannot be undone!`))) {
            return;
        }
        
        try {
            setLoadingLogs(true);
            await deleteAuditLogs(selectedLogIds, currentUser?._id);
            alert(trans('logsDeletedSuccessfully', '✅ تم حذف السجلات المحددة بنجاح', '✅ Selected logs deleted successfully'));
            setSelectedLogIds([]);
            
            // Reload logs
            const filters = {};
            if (selectedStaffId !== 'all') filters.userId = selectedStaffId;
            if (filterAction !== 'all') filters.action = filterAction;
            if (filterEntity !== 'all') filters.entity = filterEntity;
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const logs = await getAuditLogs(filters);
            const filteredLogs = (logs || []).filter(log => 
                !log.user || staff.some(emp => String(emp._id) === String(log.user._id))
            );
            setAuditLogs(filteredLogs);
        } catch (err) {
            console.error("Error deleting logs:", err);
            alert(err.message || 'Error deleting logs');
        } finally {
            setLoadingLogs(false);
        }
    };

    // CSV Export
    const exportLogsToCSV = () => {
        const logsToExport = selectedLogIds.length > 0
            ? displayedLogs.filter(log => selectedLogIds.includes(log._id))
            : displayedLogs;

        if (!logsToExport || !logsToExport.length) {
            alert(trans('noDataToExport', 'لا توجد بيانات للتصدير', 'No data to export'));
            return;
        }
        
        const headers = [
            trans('dateTime', 'التاريخ والوقت', 'Date & Time'),
            trans('staffMember', 'الموظف', 'Staff Member'),
            trans('emailAddress', 'البريد الإلكتروني', 'Email Address'),
            trans('role', 'الدور', 'Role'),
            trans('action', 'العملية', 'Action'),
            trans('entity', 'النوع', 'Entity'),
            trans('description', 'التفاصيل والوصف', 'Description')
        ].join(',');

        const rows = logsToExport.map(log => {
            const date = new Date(log.createdAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');
            const rowFields = [
                date,
                log.user?.name || 'System / Unknown',
                log.user?.email || '-',
                log.user?.role || '-',
                log.action,
                log.entity,
                translateDescription(log.description) || ''
            ];
            return rowFields.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
        }).join('\n');

        const csvContent = "\uFEFF" + [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `staff_activity_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatCurrency = (n) => `${Number(n || 0).toLocaleString()} ${currency}`;

    const getActionBadgeColor = (action) => {
        switch (action) {
            case 'create': return { bg: 'rgba(76, 209, 55, 0.15)', text: '#4cd137', label: trans('create', 'إضافة', 'Create') };
            case 'update': return { bg: 'rgba(20, 150, 176, 0.15)', text: '#1496b0', label: trans('update', 'تعديل', 'Update') };
            case 'delete': return { bg: 'rgba(255, 107, 107, 0.15)', text: '#ff6b6b', label: trans('delete', 'حذف', 'Delete') };
            case 'login': return { bg: 'rgba(155, 89, 182, 0.15)', text: '#9b59b6', label: trans('login', 'دخول', 'Login') };
            case 'logout': return { bg: 'rgba(127, 140, 141, 0.15)', text: '#7f8c8d', label: trans('logout', 'خروج', 'Logout') };
            case 'export': return { bg: 'rgba(241, 196, 15, 0.15)', text: '#f1c40f', label: trans('export', 'تصدير', 'Export') };
            case 'import': return { bg: 'rgba(46, 204, 113, 0.15)', text: '#2ecc71', label: trans('import', 'استيراد', 'Import') };
            default: return { bg: 'rgba(255, 255, 255, 0.1)', text: '#fff', label: action };
        }
    };

    const getEntityLabel = (entity) => {
        const mapping = {
            subscriber: trans('subscriber', 'مشترك', 'Subscriber'),
            staff: trans('staff', 'موظف', 'Staff'),
            class: trans('class', 'حصة تدريبية', 'Class'),
            payment: trans('payment', 'دفعة مالية', 'Payment'),
            expense: trans('expense', 'مصروف', 'Expense'),
            goods: trans('goods', 'بضائع', 'Goods'),
            equipment: trans('equipment', 'معدة/جهاز', 'Equipment'),
            settings: trans('settings', 'إعدادات', 'Settings')
        };
        return mapping[entity] || entity;
    };

    const getRoleLabel = (role) => {
        const mapping = {
            admin: trans('admin', 'مدير', 'Admin'),
            trainer: trans('trainer', 'مدرب', 'Trainer'),
            receptionist: trans('receptionist', 'استقبال', 'Receptionist'),
            accountant: trans('accountant', 'محاسب', 'Accountant'),
            data_entry: trans('data_entry', 'مدخل بيانات', 'Data Entry'),
            marketing: trans('marketing', 'تسويق', 'Marketing'),
            sales: trans('sales', 'مبيعات', 'Sales')
        };
        return mapping[role] || role;
    };

    return (
        <section className="panel performance-panel">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ margin: 0 }}>{trans('performanceReportsTitle', 'تقارير أداء ومتابعة الموظفين', 'Staff Performance & Activity Reports')}</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: 13, opacity: 0.6 }}>
                        {trans('performanceReportsDesc', 'متابعة تفصيلية وتحليلات لنشاط كل موظف على النظام', 'Detailed monitoring and analytics of employee actions in the system')}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="small" onClick={handleRefresh} style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        🔄 {trans('refreshData', 'تحديث البيانات', 'Refresh Data')}
                    </button>
                    <button className="small" onClick={exportLogsToCSV} style={{
                        background: selectedLogIds.length > 0 ? 'rgba(33, 150, 243, 0.15)' : 'rgba(14,230,183,0.1)',
                        border: selectedLogIds.length > 0 ? '1px solid rgba(33, 150, 243, 0.3)' : '1px solid rgba(14,230,183,0.2)',
                        color: selectedLogIds.length > 0 ? '#2196f3' : '#0ee6b7'
                    }}>
                        📤 {selectedLogIds.length > 0 
                            ? trans('exportSelectedCsv', `تصدير المحدد (${selectedLogIds.length})`, `Export Selected (${selectedLogIds.length})`) 
                            : trans('exportCsv', 'تصدير CSV', 'Export CSV')}
                    </button>
                </div>
            </div>

            {/* Performance Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
                {/* Card 1: Total Activities */}
                <div className="perf-summary-card">
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #1496b0, transparent)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div className="card-val">{loadingStats ? '...' : totalActivitiesLogged.toLocaleString()}</div>
                            <div className="card-lbl">{trans('totalLoggedActions', 'إجمالي العمليات المنفذة', 'Total Logged Actions')}</div>
                        </div>
                        <div className="card-icon">📈</div>
                    </div>
                </div>

                {/* Card 2: Active Staff */}
                <div className="perf-summary-card">
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #0ee6b7, transparent)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div className="card-val">{activeStaffCount}</div>
                            <div className="card-lbl">{trans('activeStaffMembers', 'الموظفين النشطين بالنظام', 'Active Staff Members')}</div>
                        </div>
                        <div className="card-icon">👥</div>
                    </div>
                </div>

                {/* Card 3: Top Performer */}
                <div className="perf-summary-card">
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #ff9800, transparent)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div className="card-val" style={{ fontSize: 18, fontWeight: 800 }}>
                                {loadingStats ? '...' : (topPerformer ? topPerformer.staff?.name : trans('none', 'لا يوجد', 'None'))}
                            </div>
                            <div className="card-lbl">
                                {trans('mostActiveStaff', 'الموظف الأكثر تفاعلاً', 'Most Active Staff')} 
                                {topPerformer && ` (${topPerformer.totalActions} ${trans('actionsCount', 'عملية', 'actions')})`}
                            </div>
                        </div>
                        <div className="card-icon">🏆</div>
                    </div>
                </div>
            </div>

            {/* Main Section Grid: Staff Scorecard & Performance reports */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 28, alignItems: 'start' }}>
                
                {/* Column 1: Staff Selection Grid list */}
                <div className="sub-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 700 }}>
                        👥 {trans('staffDirectory', 'قائمة الموظفين', 'Staff Directory')}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
                        {loadingStats ? (
                            <div style={{ textAlign: 'center', opacity: 0.5, padding: 20 }}>{trans('loadingStaff', 'جاري تحميل الموظفين...', 'Loading staff...')}</div>
                        ) : performanceStats.length === 0 ? (
                            <div style={{ textAlign: 'center', opacity: 0.5, padding: 20 }}>{trans('noStaffRegistered', 'لا يوجد موظفين مسجلين', 'No staff registered')}</div>
                        ) : (
                            performanceStats.map((stat, i) => {
                                const isSelected = selectedPerfStaff?.staff?._id === stat.staff?._id;
                                return (
                                    <div 
                                        key={i} 
                                        className={`staff-select-item ${isSelected ? 'active' : ''}`}
                                        onClick={() => setSelectedPerfStaff(stat)}
                                    >
                                        <div className="staff-avatar-circle">
                                            {stat.staff?.name?.charAt(0) || '?'}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div className="staff-name-text" style={{ fontSize: 13, fontWeight: 650 }}>{stat.staff?.name}</div>
                                            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
                                                <span className={`staff-role-badge-small role-${stat.staff?.role}`}>
                                                    {getRoleLabel(stat.staff?.role)}
                                                </span>
                                                <span style={{ fontSize: 11, opacity: 0.4 }}>
                                                    {stat.totalActions} {trans('actionsCount', 'عملية', 'actions')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Column 2: Detailed Staff Performance Report Card */}
                <div className="sub-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', minHeight: 460 }}>
                    {selectedPerfStaff ? (
                        <div>
                            {/* Profile Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 16, marginBottom: 20 }}>
                                <div className="staff-large-avatar">
                                    {selectedPerfStaff.staff?.name?.substring(0, 2)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{selectedPerfStaff.staff?.name}</h3>
                                        <span className={`staff-role-badge role-${selectedPerfStaff.staff?.role}`}>
                                            {getRoleLabel(selectedPerfStaff.staff?.role)}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>
                                        ✉️ {selectedPerfStaff.staff?.email} | 📱 {selectedPerfStaff.staff?.phone || '-'}
                                    </div>
                                </div>
                            </div>

                            {/* Performance Metrics Breakdown */}
                            <h4 style={{ margin: '0 0 12px 0', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.7 }}>
                                📊 {trans('employeeKPIs', 'إحصائيات إنجاز الموظف', 'Employee Key Performance Indicators')}
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
                                {[
                                    { 
                                        label: trans('subscribersRegistered', 'إجمالي المشتركين', 'Total Subscribers'), 
                                        value: selectedPerfStaff.subsAdded, 
                                        subText: trans('subsThisMonth', `هذا الشهر: ${selectedPerfStaff.subsAddedThisMonth || 0}`, `This Month: ${selectedPerfStaff.subsAddedThisMonth || 0}`),
                                        color: '#0ee6b7', 
                                        icon: '👤' 
                                    },
                                    { 
                                        label: trans('amountsCollected', 'أرباح المشتركين', 'Subscribers Revenue'), 
                                        value: formatCurrency(selectedPerfStaff.totalPaymentsAmount), 
                                        subText: trans('amountThisMonth', `هذا الشهر: ${formatCurrency(selectedPerfStaff.totalPaymentsAmountThisMonth || 0)}`, `This Month: ${formatCurrency(selectedPerfStaff.totalPaymentsAmountThisMonth || 0)}`),
                                        color: '#4cd137', 
                                        icon: '💸' 
                                    },
                                    { 
                                        label: trans('productsSold', 'أرباح البضائع', 'Goods Profits'), 
                                        value: formatCurrency(selectedPerfStaff.totalGoodsProfit || 0), 
                                        subText: trans('goodsProfitThisMonth', `العدد: ${selectedPerfStaff.goodsSold || 0} | هذا الشهر: ${formatCurrency(selectedPerfStaff.totalGoodsProfitThisMonth || 0)}`, `Qty: ${selectedPerfStaff.goodsSold || 0} | This Month: ${formatCurrency(selectedPerfStaff.totalGoodsProfitThisMonth || 0)}`),
                                        color: '#ff9800', 
                                        icon: '🛍️' 
                                    },
                                    { 
                                        label: trans('expensesRecorded', 'المصروفات المسجلة', 'Expenses Recorded'), 
                                        value: formatCurrency(selectedPerfStaff.totalExpensesAmount || 0), 
                                        subText: trans('expensesAmountSubText', `العدد: ${selectedPerfStaff.expensesAdded || 0} | هذا الشهر: ${formatCurrency(selectedPerfStaff.totalExpensesAmountThisMonth || 0)}`, `Qty: ${selectedPerfStaff.expensesAdded || 0} | This Month: ${formatCurrency(selectedPerfStaff.totalExpensesAmountThisMonth || 0)}`),
                                        color: '#ff6b6b', 
                                        icon: '📉' 
                                    },
                                    { 
                                        label: trans('staffNetProfitCard', 'صافي أرباح الموظف (مشتركين + بضائع - مصروف)', 'Staff Net Profit (Subscribers + Goods - Expenses)'), 
                                        value: formatCurrency(selectedPerfStaff.netStaffProfit || 0), 
                                        subText: trans('netProfitThisMonthSubText', `هذا الشهر: ${formatCurrency(selectedPerfStaff.netStaffProfitThisMonth || 0)}`, `This Month: ${formatCurrency(selectedPerfStaff.netStaffProfitThisMonth || 0)}`),
                                        color: '#ffd700', 
                                        icon: '💼' 
                                    },
                                    { 
                                        label: trans('staffCommissionCard', `عمولة الموظف المقترحة (${selectedPerfStaff.staff?.commission || 0}%)`, `Suggested Staff Commission (${selectedPerfStaff.staff?.commission || 0}%)`), 
                                        value: formatCurrency(selectedPerfStaff.netStaffProfit > 0 ? selectedPerfStaff.netStaffProfit * ((selectedPerfStaff.staff?.commission || 0) / 100) : 0), 
                                        subText: trans('commissionThisMonthSubText', `هذا الشهر: ${formatCurrency(selectedPerfStaff.netStaffProfitThisMonth > 0 ? selectedPerfStaff.netStaffProfitThisMonth * ((selectedPerfStaff.staff?.commission || 0) / 100) : 0)}`, `This Month: ${formatCurrency(selectedPerfStaff.netStaffProfitThisMonth > 0 ? selectedPerfStaff.netStaffProfitThisMonth * ((selectedPerfStaff.staff?.commission || 0) / 100) : 0)}`),
                                        color: '#9b59b6', 
                                        icon: '🪙' 
                                    },
                                ].map((stat, i) => (
                                    <div key={i} className="kpi-mini-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px 14px' }}>
                                        <div>
                                            <div style={{ fontSize: 16, marginBottom: 4 }}>{stat.icon}</div>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: stat.color, wordBreak: 'break-all' }}>{stat.value}</div>
                                            <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2, lineHeight: 1.2 }}>{stat.label}</div>
                                        </div>
                                        {stat.subText && (
                                            <div style={{ fontSize: 10, color: '#0ee6b7', fontWeight: 'bold', marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 4 }}>
                                                {stat.subText}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>


                             {/* Activity progress distribution bar */}
                            <div style={{ marginBottom: 20 }}>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: 13, opacity: 0.7 }}>
                                    📈 {trans('actionDistribution', 'توزيع العمليات', 'Action Types Distribution')}
                                </h4>
                                {selectedPerfStaff.totalActions > 0 ? (
                                    (() => {
                                        const createPct = Math.round((selectedPerfStaff.subsAdded + selectedPerfStaff.paymentsCount + selectedPerfStaff.expensesAdded) / selectedPerfStaff.totalActions * 100);
                                        const updatePct = Math.round((selectedPerfStaff.totalActions - (selectedPerfStaff.subsAdded + selectedPerfStaff.paymentsCount + selectedPerfStaff.expensesAdded + selectedPerfStaff.goodsSold)) / selectedPerfStaff.totalActions * 100);
                                        const salesPct = Math.round(selectedPerfStaff.goodsSold / selectedPerfStaff.totalActions * 100);
                                        
                                        return (
                                            <div>
                                                <div className="stacked-progress-bar">
                                                    <div style={{ width: `${Math.max(5, createPct)}%`, background: '#4cd137' }} title={`${createPct}% ${trans('creations', 'إضافات', 'Creations')}`} />
                                                    <div style={{ width: `${Math.max(5, salesPct)}%`, background: '#ff9800' }} title={`${salesPct}% ${trans('sales', 'مبيعات', 'Sales')}`} />
                                                    <div style={{ width: `${Math.max(5, updatePct)}%`, background: '#1496b0' }} title={`${updatePct}% ${trans('updates', 'تعديلات وتحديثات', 'Updates')}`} />
                                                </div>
                                                <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, opacity: 0.6 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4cd137' }}></span>
                                                        {trans('creationsAndAdditions', 'إنشاء وإضافات', 'Creations')} ({createPct}%)
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff9800' }}></span>
                                                        {trans('sales', 'مبيعات', 'Sales')} ({salesPct}%)
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1496b0' }}></span>
                                                        {trans('updatesOther', 'تحديثات/عمليات أخرى', 'Updates/Other')} ({updatePct}%)
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div style={{ fontSize: 12, opacity: 0.4 }}>{trans('noActivityData', 'لا توجد بيانات كافية للتصنيف', 'Not enough activity data to visualize')}</div>
                                )}
                            </div>

                            {/* Last Active details */}
                            <div className="last-active-box">
                                <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.8, marginBottom: 4 }}>
                                    ⏱️ {trans('lastLoggedAction', 'آخر نشاط مسجل للموظف', 'Last Logged Action')}
                                </div>
                                <div style={{ fontSize: 13, fontStyle: 'italic', opacity: 0.9 }}>
                                    "{translateDescription(selectedPerfStaff.lastAction) || trans('noActionsRecorded', 'لا توجد عمليات مسجلة بعد', 'No recorded actions yet')}"
                                </div>
                                {selectedPerfStaff.lastActive && (
                                    <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>
                                        {new Date(selectedPerfStaff.lastActive).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                                    </div>
                                )}
                            </div>

                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
                            <span style={{ fontSize: 40 }}>📊</span>
                            <p style={{ marginTop: 12 }}>{trans('selectStaffToViewPerf', 'الرجاء اختيار موظف لعرض تقرير أدائه', 'Select a staff member to view their performance card')}</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Audit Logs Filter Panel */}
            <div className="sub-panel filter-panel" style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 20 }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 700 }}>
                    🔍 {trans('filterActivityLogs', 'تصفية سجل العمليات والأنشطة', 'Filter Activity Logs')}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                    {/* Filter by Staff */}
                    <div>
                        <label className="filter-lbl">{trans('employee', 'الموظف', 'Employee')}</label>
                        <select 
                            value={selectedStaffId} 
                            onChange={(e) => setSelectedStaffId(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">{trans('allStaff', 'كل الموظفين', 'All Staff')}</option>
                            {staff.map((s, i) => (
                                <option key={i} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filter by Action */}
                    <div>
                        <label className="filter-lbl">{trans('actionType', 'نوع العملية', 'Action Type')}</label>
                        <select 
                            value={filterAction} 
                            onChange={(e) => setFilterAction(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">{trans('allActions', 'كل العمليات', 'All Actions')}</option>
                            <option value="create">{trans('createAction', 'إضافة (Create)', 'Create')}</option>
                            <option value="update">{trans('updateAction', 'تعديل (Update)', 'Update')}</option>
                            <option value="delete">{trans('deleteAction', 'حذف (Delete)', 'Delete')}</option>
                            <option value="login">{trans('loginAction', 'تسجيل دخول', 'Login')}</option>
                            <option value="export">{trans('exportAction', 'تصدير بيانات', 'Export')}</option>
                            <option value="import">{trans('importAction', 'استيراد بيانات', 'Import')}</option>
                        </select>
                    </div>

                    {/* Filter by Entity */}
                    <div>
                        <label className="filter-lbl">{trans('moduleSection', 'الجدول / القسم', 'Module/Section')}</label>
                        <select 
                            value={filterEntity} 
                            onChange={(e) => setFilterEntity(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">{trans('allSections', 'كل الأقسام', 'All Sections')}</option>
                            <option value="subscriber">{trans('subscribers', 'المشتركين', 'Subscribers')}</option>
                            <option value="payment">{trans('payments', 'المدفوعات', 'Payments')}</option>
                            <option value="goods">{trans('goodsAndSales', 'المبيعات والبضائع', 'Goods & Sales')}</option>
                            <option value="expense">{trans('expenses', 'المصروفات', 'Expenses')}</option>
                            <option value="staff">{trans('staff', 'الموظفين', 'Staff')}</option>
                            <option value="class">{trans('classes', 'الحصص التدريبية', 'Classes')}</option>
                            <option value="equipment">{trans('equipment', 'الأجهزة والمعدات', 'Equipment')}</option>
                            <option value="settings">{trans('settingsAndBackup', 'إعدادات والنسخ', 'Settings & Backup')}</option>
                        </select>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="filter-lbl">{trans('fromDate', 'من تاريخ', 'From Date')}</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)}
                            className="filter-date-input"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="filter-lbl">{trans('toDate', 'إلى تاريخ', 'To Date')}</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)}
                            className="filter-date-input"
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
                        <span style={{ position: 'absolute', left: isRtl ? 'auto' : 10, right: isRtl ? 10 : 'auto', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
                        <input 
                            type="text" 
                            placeholder={trans('searchLogsPlaceholder', 'بحث بالكلمات المفتاحية...', 'Search logs description...')} 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ 
                                width: '100%', 
                                paddingLeft: isRtl ? 10 : 32, 
                                paddingRight: isRtl ? 32 : 10,
                                margin: 0,
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 8,
                                fontSize: 13,
                                color: '#fff'
                            }}
                        />
                    </div>
                    <button 
                        onClick={applyFilters} 
                        style={{ background: 'linear-gradient(90deg, #0b6b8a, #1496b0)', color: 'white', padding: '8px 18px', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
                    >
                        {trans('applyFilters', 'تطبيق الفلترة', 'Apply Filters')}
                    </button>
                    <button 
                        onClick={() => {
                            setSelectedStaffId('all');
                            setFilterAction('all');
                            setFilterEntity('all');
                            setStartDate('');
                            setEndDate('');
                            setSearchQuery('');
                            // Trigger refresh with empty filters
                            setLoadingLogs(true);
                            getAuditLogs().then(logs => {
                                const filteredLogs = (logs || []).filter(log => 
                                    !log.user || staff.some(emp => String(emp._id) === String(log.user._id))
                                );
                                setAuditLogs(filteredLogs);
                                setLoadingLogs(false);
                            });
                        }} 
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '8px 18px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
                    >
                        {trans('resetFilters', 'إعادة تعيين', 'Reset Filters')}
                    </button>
                </div>
            </div>

            {/* Audit Logs chronological timeline feed */}
            <div className="table-wrap">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ width: 150 }}>{trans('dateTime', 'التاريخ والوقت', 'Date & Time')}</th>
                            <th>{trans('staffPerformer', 'الموظف', 'Staff Performer')}</th>
                            <th>{trans('module', 'القسم', 'Module')}</th>
                            <th>{trans('action', 'العملية', 'Action')}</th>
                            <th>{trans('details', 'التفاصيل', 'Details')}</th>
                            <th style={{ width: 170 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                                    <input 
                                        type="checkbox" 
                                        style={{ cursor: 'pointer', width: 15, height: 15 }}
                                        checked={displayedLogs.length > 0 && selectedLogIds.length === displayedLogs.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedLogIds(displayedLogs.map(l => l._id));
                                            } else {
                                                setSelectedLogIds([]);
                                            }
                                        }}
                                    />
                                    {selectedLogIds.length > 0 ? (
                                        <button 
                                            onClick={handleDeleteLogs} 
                                            style={{
                                                background: 'rgba(255, 75, 75, 0.2)',
                                                border: '1px solid rgba(255,75,75,0.4)',
                                                color: '#ff7f7f',
                                                padding: '2px 8px',
                                                borderRadius: 6,
                                                cursor: 'pointer',
                                                fontSize: 11,
                                                fontWeight: 800,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 4
                                            }}
                                            title={trans('deleteSelectedLogs', `حذف المحدد (${selectedLogIds.length})`, `Delete Selected (${selectedLogIds.length})`)}
                                        >
                                            🗑️ {trans('delete', 'حذف', 'Delete')} ({selectedLogIds.length})
                                        </button>
                                    ) : (
                                        <span>{trans('actions', 'الاجراءات', 'Actions')}</span>
                                    )}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingLogs ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: 30, opacity: 0.5 }}>
                                    <div className="auth-spinner" style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#0ee6b7', margin: '0 auto 10px' }}></div>
                                    {trans('loadingFilteredLogs', 'جاري تحميل السجلات المفلترة...', 'Loading filtered audit logs...')}
                                </td>
                            </tr>
                        ) : displayedLogs.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: 30, opacity: 0.5 }}>
                                    {trans('noLogsMatchingFilter', 'لا توجد سجلات تطابق الفلترة الحالية', 'No logs matching current filter settings')}
                                </td>
                            </tr>
                        ) : (
                            sortedDayKeys.map((dayKey) => {
                                const logsInDay = groupedLogs[dayKey] || [];
                                const allInDaySelected = logsInDay.every(log => selectedLogIds.includes(log._id));
                                const formattedDay = new Date(dayKey).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });

                                return (
                                    <React.Fragment key={dayKey}>
                                        {/* Day Group Header Row */}
                                        <tr style={{ background: 'rgba(14, 230, 183, 0.05)', borderBottom: '1px solid rgba(14, 230, 183, 0.15)' }}>
                                            <td colSpan="5" style={{ padding: '10px 14px', fontWeight: 800, color: '#0ee6b7', fontSize: 13, textAlign: 'start' }}>
                                                📅 {formattedDay} ({logsInDay.length})
                                            </td>
                                            <td style={{ textAlign: 'center', padding: '10px 14px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        style={{ cursor: 'pointer', width: 14, height: 14 }}
                                                        checked={allInDaySelected && logsInDay.length > 0}
                                                        onChange={(e) => {
                                                            const logIdsInDay = logsInDay.map(log => log._id);
                                                            if (e.target.checked) {
                                                                setSelectedLogIds(prev => {
                                                                    const otherIds = prev.filter(id => !logIdsInDay.includes(id));
                                                                    return [...otherIds, ...logIdsInDay];
                                                                });
                                                            } else {
                                                                setSelectedLogIds(prev => prev.filter(id => !logIdsInDay.includes(id)));
                                                            }
                                                        }}
                                                    />
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
                                                        {trans('selectDay', 'تحديد اليوم', 'Select Day')}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Logs of the Day */}
                                        {logsInDay.map((log, i) => {
                                            const actionBadge = getActionBadgeColor(log.action);
                                            const isExpanded = expandedLogId === log._id;
                                            const hasChanges = log.changes && Object.keys(log.changes).length > 0;

                                            return (
                                                <React.Fragment key={log._id || i}>
                                                    <tr>
                                                        <td style={{ fontSize: 11, opacity: 0.6 }}>
                                                            {new Date(log.createdAt).toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontSize: 13, fontWeight: 700 }}>{log.user?.name || trans('system', 'النظام', 'System')}</span>
                                                                <span style={{ fontSize: 11, opacity: 0.4 }}>{log.user?.email || '-'}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
                                                                {getEntityLabel(log.entity)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span style={{ 
                                                                fontSize: 11, 
                                                                fontWeight: 800, 
                                                                background: actionBadge.bg, 
                                                                color: actionBadge.text, 
                                                                padding: '2px 8px', 
                                                                borderRadius: 12,
                                                                display: 'inline-block',
                                                                textTransform: 'uppercase'
                                                            }}>
                                                                {actionBadge.label}
                                                            </span>
                                                        </td>
                                                        <td style={{ fontSize: 13, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {translateDescription(log.description)}
                                                        </td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                                                <input 
                                                                    type="checkbox" 
                                                                    style={{ cursor: 'pointer', width: 14, height: 14 }}
                                                                    checked={selectedLogIds.includes(log._id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedLogIds(prev => [...prev, log._id]);
                                                                        } else {
                                                                            setSelectedLogIds(prev => prev.filter(id => id !== log._id));
                                                                        }
                                                                    }}
                                                                />
                                                                {hasChanges ? (
                                                                    <button 
                                                                        onClick={() => setExpandedLogId(isExpanded ? null : log._id)}
                                                                        style={{ 
                                                                            fontSize: 11, 
                                                                            padding: '4px 10px', 
                                                                            background: isExpanded ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)',
                                                                            border: '1px solid rgba(255,255,255,0.08)',
                                                                            borderRadius: 6,
                                                                            cursor: 'pointer',
                                                                            color: '#fff'
                                                                        }}
                                                                    >
                                                                        {isExpanded ? trans('close', 'إغلاق', 'Close') : trans('view', 'عرض', 'View')}
                                                                    </button>
                                                                ) : (
                                                                    <span style={{ fontSize: 11, opacity: 0.3 }}>-</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {/* Collapsible Changes Panel */}
                                                    {isExpanded && hasChanges && (
                                                        <tr>
                                                            <td colSpan="6" style={{ background: 'rgba(0,0,0,0.2)', padding: '16px 20px', borderTop: 'none' }}>
                                                                <div className="diff-panel-box">
                                                                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, opacity: 0.8 }}>
                                                                        🛠️ {trans('detailedFieldChanges', 'التغييرات التفصيلية التي تمت', 'Detailed Field Changes')}
                                                                    </div>
                                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                                                                        {Object.entries(log.changes).map(([field, change]) => {
                                                                            let prevVal = '-';
                                                                            let newVal = '-';
                                                                            
                                                                            if (change !== null && typeof change === 'object') {
                                                                                prevVal = change.old !== undefined ? JSON.stringify(change.old) : prevVal;
                                                                                newVal = change.new !== undefined ? JSON.stringify(change.new) : newVal;
                                                                            } else {
                                                                                newVal = JSON.stringify(change);
                                                                            }

                                                                            return (
                                                                                <div key={field} className="diff-field-card">
                                                                                    <div className="diff-field-name">{field}</div>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                                                                        <span className="diff-old-val">{prevVal}</span>
                                                                                        <span style={{ opacity: 0.4 }}>➡️</span>
                                                                                        <span className="diff-new-val">{newVal}</span>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .perf-summary-card {
                    padding: 20px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 16px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    backdrop-filter: blur(10px);
                }
                .card-val {
                    font-size: 26px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #ffffff, #bbbbbb);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .card-lbl {
                    font-size: 12px;
                    opacity: 0.5;
                    margin-top: 4px;
                }
                .card-icon {
                    font-size: 30px;
                    opacity: 0.8;
                }
                .staff-select-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 14px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }
                .staff-select-item:hover {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(255,255,255,0.1);
                    transform: translateY(-1px);
                }
                .staff-select-item.active {
                    background: linear-gradient(135deg, rgba(11, 107, 138, 0.25), rgba(20, 150, 176, 0.25));
                    border-color: rgba(20, 150, 176, 0.4);
                }
                .staff-avatar-circle {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #0b6b8a, #1496b0);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 15px;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .staff-large-avatar {
                    width: 54px;
                    height: 54px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, #0b6b8a, #0ee6b7);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    font-weight: 800;
                    text-transform: uppercase;
                    box-shadow: 0 4px 15px rgba(14,230,183,0.25);
                }
                .staff-role-badge-small {
                    font-size: 10px;
                    padding: 1px 6px;
                    border-radius: 4px;
                }
                .staff-role-badge {
                    font-size: 11px;
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-weight: 700;
                }
                .role-admin { background: rgba(231, 76, 60, 0.15); color: #e74c3c; }
                .role-trainer { background: rgba(46, 204, 113, 0.15); color: #2ecc71; }
                .role-receptionist { background: rgba(52, 152, 219, 0.15); color: #3498db; }
                .role-accountant { background: rgba(241, 196, 15, 0.15); color: #f1c40f; }
                .role-data_entry { background: rgba(155, 89, 182, 0.15); color: #9b59b6; }
                .role-marketing { background: rgba(26, 188, 156, 0.15); color: #1abc9c; }
                .role-sales { background: rgba(230, 126, 34, 0.15); color: #e67e22; }

                .kpi-mini-card {
                    padding: 12px 14px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 10px;
                    text-align: center;
                }
                .stacked-progress-bar {
                    display: flex;
                    height: 10px;
                    background: rgba(255,255,255,0.04);
                    border-radius: 5px;
                    overflow: hidden;
                }
                .last-active-box {
                    padding: 12px 16px;
                    background: rgba(255,255,255,0.01);
                    border: 1px solid rgba(255,255,255,0.04);
                    border-radius: 10px;
                    border-left: 3px solid #1496b0;
                }
                
                /* Filter styles */
                .filter-lbl {
                    font-size: 11px;
                    opacity: 0.5;
                    display: block;
                    margin-bottom: 4px;
                }
                .filter-select, .filter-date-input {
                    width: 100%;
                    padding: 8px 10px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 8px;
                    color: white;
                    font-size: 13px;
                    outline: none;
                }
                .filter-select option {
                    background: #111;
                    color: white;
                }
                
                /* Diff formatting */
                .diff-panel-box {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    padding: 12px;
                }
                .diff-field-card {
                    background: rgba(255, 255, 255, 0.01);
                    border: 1px solid rgba(255, 255, 255, 0.03);
                    border-radius: 6px;
                    padding: 8px 10px;
                }
                .diff-field-name {
                    font-size: 11px;
                    font-weight: 700;
                    color: #1496b0;
                    text-transform: uppercase;
                }
                .diff-old-val {
                    font-size: 12px;
                    color: #ff6b6b;
                    text-decoration: line-through;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 120px;
                }
                .diff-new-val {
                    font-size: 12px;
                    color: #4cd137;
                    font-weight: 700;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 120px;
                }
            `}</style>
        </section>
    );
}
