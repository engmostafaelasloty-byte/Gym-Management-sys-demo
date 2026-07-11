'use client';
import React, { useState } from 'react';
import Modal from '../Modal';
import { changeStaffPassword, updateStaff } from '../../actions';

export default function StaffTab({
    lang, t, staff, handleStaffSubmit, handleDelete, updateStaffPermissions, loadAllData, currentUser
}) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const [selectedStaff, setSelectedStaff] = useState(null);
    const [permissions, setPermissions] = useState({});
    const [changePwdStaff, setChangePwdStaff] = useState(null);
    const [pwdForm, setPwdForm] = useState({ current: '', new: '', confirm: '' });
    const [pwdError, setPwdError] = useState('');
    const [pwdLoading, setPwdLoading] = useState(false);
    const [editStaffId, setEditStaffId] = useState(null);
    const formRef = React.useRef(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const email = fd.get('email');
        const pwd = fd.get('password');
        
        // Validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert(trans('invalidEmail', 'صيغة البريد الإلكتروني غير صالحة', 'Invalid email address format'));
            return;
        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[1-9]).{6,}$/;
        if (pwd && !passwordRegex.test(pwd)) {
            alert(trans('passwordRequirements', 
                'كلمة المرور يجب أن تحتوي على حرف واحد على الأقل ورقم من 1 إلى 9، وتكون 6 رموز على الأقل', 
                'Password must contain at least one letter and a number from 1 to 9, and be at least 6 characters'));
            return;
        }

        if (editStaffId) {
            const data = {
                name: fd.get('name'),
                email: fd.get('email'),
                phone: fd.get('phone'),
                role: fd.get('role'),
                salary: parseFloat(fd.get('salary') || '0'),
                commission: parseFloat(fd.get('commission') || '0'),
                gender: fd.get('gender'),
                systemType: fd.get('systemType')
            };
            if (pwd) {
                data.password = pwd;
            }
            try {
                await updateStaff(editStaffId, data, currentUser?._id);
                e.target.reset();
                setEditStaffId(null);
                loadAllData();
                alert(trans('staffUpdated', 'تم تعديل الموظف بنجاح', 'Staff updated successfully'));
            } catch(err) {
                alert(err.message || 'Error updating staff');
            }
        } else {
            handleStaffSubmit(e);
        }
    };

    const handleEditClick = (s) => {
        setEditStaffId(s._id);
        if (formRef.current) {
            formRef.current.name.value = s.name;
            formRef.current.email.value = s.email;
            formRef.current.phone.value = s.phone || '';
            formRef.current.role.value = s.role;
            formRef.current.salary.value = s.salary || '';
            formRef.current.commission.value = s.commission || '';
            if (s.gender) formRef.current.gender.value = s.gender;
            if (s.systemType) formRef.current.systemType.value = s.systemType;
            formRef.current.password.value = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };


    const ROLES = {
        admin:        { label: trans('admin', 'مدير النظام', 'Admin'),        cls: 'role-admin' },
        data_entry:   { label: trans('data_entry', 'مدخل بيانات', 'Data Entry'),   cls: 'role-data_entry' },
        trainer:      { label: trans('trainer', 'مدرب', 'Trainer'),             cls: 'role-trainer' },
        accountant:   { label: trans('accountant', 'محاسب', 'Accountant'),         cls: 'role-accountant' },
        marketing:    { label: trans('marketing', 'تسويق', 'Marketing'),           cls: 'role-marketing' },
        sales:        { label: trans('sales', 'مبيعات', 'Sales'),             cls: 'role-sales' },
        receptionist: { label: trans('receptionist', 'استقبال', 'Receptionist'),     cls: 'role-receptionist' },
    };

    // Grouped permissions
    const PERM_GROUPS = [
        {
            title: trans('permSubscribers', '👥 المشتركين', '👥 Subscribers'),
            perms: [
                { key: 'canAddSubscribers',    icon: '➕', label: trans('canAddSubscribers', 'إضافة مشتركين', 'Add Subscribers') },
                { key: 'canEditSubscribers',   icon: '✏️', label: trans('canEditSubscribers', 'تعديل مشتركين', 'Edit Subscribers') },
                { key: 'canDeleteSubscribers', icon: '🗑️', label: trans('canDeleteSubscribers', 'حذف مشتركين', 'Delete Subscribers') },
                { key: 'canRenewSubscribers',  icon: '🔄', label: trans('canRenewSubscribers', 'تجديد/تمديد', 'Renew/Extend') },
                { key: 'canFreezeSubscribers', icon: '❄️', label: trans('canFreezeSubscribers', 'تجميد اشتراك', 'Freeze Account') },
                { key: 'canCheckInSubscribers',icon: '✅', label: trans('canCheckInSubscribers', 'تسجيل الحضور', 'Check-In') },
            ]
        },
        {
            title: trans('permReportsFinance', '📊 التقارير والمالية', '📊 Reports & Finance'),
            perms: [
                { key: 'canViewDashboard',   icon: '🏠', label: trans('canViewDashboard', 'لوحة التحكم', 'Dashboard') },
                { key: 'canViewReports',     icon: '📈', label: trans('canViewReports', 'التقارير', 'Reports') },
                { key: 'canManageFinances',  icon: '💰', label: trans('canManageFinances', 'المالية والمصروفات', 'Finances & Expenses') },
                { key: 'canViewSalaries',    icon: '💸', label: trans('canViewSalaries', 'عرض إجمالي الرواتب', 'View Total Salaries') },
            ]
        },
        {
            title: trans('permManagementStock', '🏪 الإدارة والمخزون', '🏪 Management & Stock'),
            perms: [
                { key: 'canManageGoods',     icon: '📦', label: trans('canManageGoods', 'البضائع والمخزون', 'Goods & Stock') },
                { key: 'canManageEquipment', icon: '🏋️', label: trans('canManageEquipment', 'المعدات', 'Equipment') },
                { key: 'canManageLoyalty',   icon: '⭐', label: trans('canManageLoyalty', 'نقاط الولاء', 'Loyalty Points') },
                { key: 'canManageStaff',     icon: '👨‍💼', label: trans('canManageStaff', 'إدارة الموظفين', 'Manage Staff') },
            ]
        },
    ];

    const handlePermClick = (s) => {
        setSelectedStaff(s);
        setPermissions(s.permissions || {});
    };

    const handleSavePerms = async () => {
        try {
            await updateStaffPermissions(selectedStaff._id, permissions, currentUser?._id);
            alert(trans('permissionsUpdated', '✅ تم تحديث الصلاحيات بنجاح', '✅ Permissions updated'));
            setSelectedStaff(null); console.log('StaffTab: handleDelete prop is', typeof handleDelete);
            loadAllData();
        } catch (err) {
            console.error(err);
        }
    };

    const togglePerm = (key) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChangePwd = async () => {
        setPwdError('');
        if (!pwdForm.new || !pwdForm.confirm) {
            setPwdError(trans('fillAllFields', 'يرجى ملء جميع الحقول', 'Please fill all fields'));
            return;
        }
        if (pwdForm.new !== pwdForm.confirm) {
            setPwdError(trans('passwordsDoNotMatch', 'كلمتا المرور غير متطابقتين', 'Passwords do not match'));
            return;
        }
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[1-9]).{6,}$/;
        if (!passwordRegex.test(pwdForm.new)) {
            setPwdError(trans('passwordRequirements', 
                'يجب أن تحتوي كلمة المرور على حرف واحد على الأقل ورقم من 1 إلى 9، وتكون 6 رموز على الأقل', 
                'Password must be at least 6 characters, and contain at least one letter and a number from 1 to 9'));
            return;
        }
        setPwdLoading(true);
        try {
            await changeStaffPassword(changePwdStaff._id, '', pwdForm.new, currentUser?._id);
            alert(trans('passwordChanged', '✅ تم تغيير كلمة المرور بنجاح', '✅ Password changed successfully'));
            setChangePwdStaff(null);
            setPwdForm({ current: '', new: '', confirm: '' });
        } catch (err) {
            setPwdError(err.message || trans('errorChangingPassword', 'حدث خطأ في تغيير كلمة المرور', 'Error changing password'));
        } finally {
            setPwdLoading(false);
        }
    };

    const activePermsCount = (s) => {
        if (!s.permissions) return 0;
        return Object.values(s.permissions).filter(Boolean).length;
    };

    return (
        <section className="panel">
            <h2>{t.staff}</h2>

            {/* Add Staff Form */}
            <form ref={formRef} onSubmit={onSubmit} className="form-grid" style={{ marginBottom: 24 }}>
                <div className="tooltip-field" data-tooltip={trans('staffNameTooltip', 'اسم الموظف', 'Staff name')}><input name="name" placeholder={t.name} required /></div>
                <input name="email" type="email" placeholder={t.email} required />
                <input name="phone" placeholder={t.phone} />
                <div className="tooltip-field" data-tooltip={trans('passwordTooltip', 'كلمة المرور (يجب أن تحتوي على حرف ورقم 1-9، وتكون 6 رموز على الأقل)', 'Password (must contain letter & number 1-9, min 6 characters)')}>
                    <input 
                        name="password" 
                        type="text" 
                        autoComplete="off" 
                        placeholder={trans('passwordPlaceholder', 'كلمة المرور (افتراضي: gms123)', 'Password (default: gms123)')} 
                        pattern="(?=.*[a-zA-Z])(?=.*[1-9]).{6,}"
                        title={trans('passwordTitle', 'يجب أن تحتوي كلمة المرور على حرف واحد على الأقل ورقم من 1 إلى 9، وتتكون من 6 رموز على الأقل', 'Password must contain at least one letter and a number from 1 to 9, and be at least 6 characters')}
                        style={{ WebkitTextSecurity: 'disc', textSecurity: 'disc' }}
                    />
                </div>
                <select name="role">
                    {Object.entries(ROLES).map(([val, info]) => (
                        <option key={val} value={val}>{info.label}</option>
                    ))}
                </select>
                <input name="salary" type="number" placeholder={trans('salary', 'الراتب', 'Salary')} />
                <input name="commission" type="number" placeholder={trans('commissionPercent', 'العمولة %', 'Commission %')} />
                
                <select name="gender">
                    <option value="male">{t.male}</option>
                    <option value="female">{t.female}</option>
                </select>
                <div className="tooltip-field" data-tooltip={trans('systemTypeTooltip', 'نوع الفرع/النظام الذي يعمل به الموظف', 'The system/branch this staff works in')}>
                <select name="systemType" required>
                    <option value="">{trans('systemAccessOption', '-- صلاحية الوصول للأنظمة --', '-- System Access --')}</option>
                    <option value="men">{trans('menSystemOnlyOption', '♂️ نظام الرجال فقط', '♂️ Men System Only')}</option>
                    <option value="women">{trans('womenSystemOnlyOption', '♀️ نظام السيدات فقط', '♀️ Women System Only')}</option>
                    <option value="mix">{trans('mixedSystemOption', '⚡ نظام المختلط (Mixed)', '⚡ Mixed System')}</option>
                    <option value="separate">{trans('bothSystemOption', '🏢 كلاهما (رجالي + حريمي)', '🏢 Both (Men + Women)')}</option>
                </select>
                </div>
                {editStaffId ? (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
                        <button type="submit" style={{ flex: 1, background: '#2196f3' }}>
                            ✅ {trans('update', 'تحديث البيانات', 'Update')}
                        </button>
                        <button type="button" onClick={() => { setEditStaffId(null); formRef.current?.reset(); }} style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}>
                            ❌ {trans('cancel', 'إلغاء', 'Cancel')}
                        </button>
                    </div>
                ) : (
                    <button type="submit" style={{ gridColumn: '1 / -1' }}>
                        ➕ {t.save}
                    </button>
                )}
            </form>

            {/* Staff Table */}
            <div className="table-wrap" style={{ marginTop: 8 }}>
                <table>
                    <thead>
                        <tr>
                            <th>{t.name}</th>
                            <th>{t.role || trans('role', 'الوظيفة', 'Role')}</th>
                            <th>{trans('salary', 'الراتب', 'Salary')}</th>
                            <th>{trans('permissions', 'الصلاحيات', 'Permissions')}</th>
                            <th>{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ color: 'rgba(255,255,255,0.4)', padding: 30 }}>
                                    {trans('noStaffYet', 'لا يوجد موظفون بعد', 'No staff members yet')}
                                </td>
                            </tr>
                        )}
                        {staff.map((s) => {
                            const roleInfo = ROLES[s.role] || { label: s.role, cls: 'role-data_entry' };
                            const permCount = activePermsCount(s);
                            return (
                                <tr key={s._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #0b6b8a, #0ee6b7)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, fontSize: 14, flexShrink: 0
                                            }}>
                                                {s.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div style={{ textAlign: 'start' }}>
                                                <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                                                <div style={{ fontSize: 11, opacity: 0.5 }}>{s.email}</div>
                                                {s.phone && <div style={{ fontSize: 11, opacity: 0.4 }}>{s.phone}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`staff-role-badge ${roleInfo.cls}`}>
                                            {roleInfo.label}
                                        </span>
                                        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4, fontWeight: 500 }}>
                                            {s.systemType === 'mix' ? trans('mixedSystem', '⚡ مختلط', '⚡ Mixed') : s.systemType === 'men' ? trans('menSystem', '♂️ رجالي', '♂️ Men') : s.systemType === 'women' ? trans('womenSystem', '♀️ نسائي', '♀️ Women') : trans('bothSystems', '🏢 كلاهما', '🏢 Both')}
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        {s.salary?.toLocaleString() || 0}
                                        {s.commission > 0 && (
                                            <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>
                                                +{s.commission}%
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            padding: '4px 10px',
                                            background: permCount > 0 ? 'rgba(14,230,183,0.1)' : 'rgba(255,255,255,0.05)',
                                            border: `1px solid ${permCount > 0 ? 'rgba(14,230,183,0.2)' : 'rgba(255,255,255,0.07)'}`,
                                            borderRadius: 20,
                                            fontSize: 12,
                                            color: permCount > 0 ? '#0ee6b7' : 'rgba(255,255,255,0.4)'
                                        }}>
                                            <span>🔐</span>
                                            {permCount} {trans('perms', 'صلاحية', 'perms')}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                                            <button
                                                className="small"
                                                onClick={() => handlePermClick(s)}
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(11,107,138,0.3), rgba(14,230,183,0.15))',
                                                    border: '1px solid rgba(14,230,183,0.2)',
                                                    color: '#0ee6b7',
                                                    fontSize: 12
                                                }}
                                            >
                                                🔐 {trans('permissions', 'الصلاحيات', 'Permissions')}
                                            </button>
                                            {s.role !== 'admin' && (
                                                <>
                                                <button
                                                    className="small"
                                                    onClick={() => { setChangePwdStaff(s); setPwdForm({ current: '', new: '', confirm: '' }); setPwdError(''); }}
                                                    style={{
                                                        background: 'rgba(255,193,7,0.1)',
                                                        border: '1px solid rgba(255,193,7,0.2)',
                                                        color: '#ffc107',
                                                        fontSize: 12
                                                    }}
                                                >
                                                    🔑 {trans('password', 'كلمة المرور', 'Password')}
                                                </button>
                                                {currentUser?.role === 'admin' && (
                                                    <>
                                                    <button
                                                        className="small"
                                                        onClick={() => handleEditClick(s)}
                                                        style={{
                                                            background: 'rgba(33,150,243,0.1)',
                                                            border: '1px solid rgba(33,150,243,0.2)',
                                                            color: '#2196f3',
                                                            fontSize: 12
                                                        }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="small"
                                                        onClick={() => handleDelete('staff', s._id, trans('confirmDeleteStaff', `هل أنت متأكد من حذف الموظف ${s.name}؟`, `Are you sure you want to delete ${s.name}?`))}
                                                        style={{
                                                            background: 'rgba(255, 75, 75, 0.1)',
                                                            border: '1px solid rgba(255,75,75,0.2)',
                                                            color: '#ff7f7f',
                                                            fontSize: 12
                                                        }}
                                                    >
                                                        🗑️
                                                    </button>
                                                    </>
                                                )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Permissions Modal */}
            {selectedStaff && (
                <Modal
                    isOpen={true}
                    onClose={() => setSelectedStaff(null)}
                    title={trans('permissionsFor', `🔐 صلاحيات: ${selectedStaff.name}`, `🔐 Permissions: ${selectedStaff.name}`)}
                >
                    <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: 4 }}>
                        {PERM_GROUPS.map((group) => (
                            <div key={group.title}>
                                <div className="perm-group-title">{group.title}</div>
                                {group.perms.map(p => (
                                    <div key={p.key} className="perm-toggle-row">
                                        <div className="perm-toggle-label">
                                            <span className="perm-toggle-icon">{p.icon}</span>
                                            {p.label}
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={selectedStaff.role === 'admin' ? true : (permissions[p.key] || false)}
                                                onChange={() => togglePerm(p.key)}
                                                disabled={selectedStaff.role === 'admin'}
                                            />
                                            <span className="toggle-track">
                                                <span className="toggle-thumb"></span>
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    {selectedStaff.role !== 'admin' ? (
                        <button
                            onClick={handleSavePerms}
                            style={{
                                width: '100%', marginTop: 16,
                                background: 'linear-gradient(135deg, #0b6b8a, #0ee6b7)',
                                border: 'none', padding: '12px', borderRadius: 10,
                                color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer'
                            }}
                        >
                            ✅ {t.save}
                        </button>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#0ee6b7', marginTop: 16, fontSize: 13, fontWeight: 500, padding: 12, background: 'rgba(14,230,183,0.08)', borderRadius: 10, border: '1px solid rgba(14,230,183,0.15)' }}>
                            ℹ️ {trans('adminHasAllPerms', 'حساب المدير يمتلك كافة الصلاحيات تلقائياً ولا يمكن تعديلها.', 'Admin account has all permissions by default and cannot be modified.')}
                        </div>
                    )}
                </Modal>
            )}

            {/* Change Password Modal */}
            {changePwdStaff && (
                <Modal
                    isOpen={true}
                    onClose={() => setChangePwdStaff(null)}
                    title={trans('changePasswordFor', `🔑 تغيير كلمة مرور: ${changePwdStaff.name}`, `🔑 Change Password: ${changePwdStaff.name}`)}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <input
                            type="text" autoComplete="off"
                            placeholder={trans('newPassword', 'كلمة المرور الجديدة', 'New Password')} title={trans('passwordTooltip', 'كلمة المرور يجب أن تحتوي على حرف ورقم 1-9 وتكون 6 رموز على الأقل', 'Password must contain a letter and number 1-9 and be at least 6 characters')}
                            value={pwdForm.new}
                            onChange={e => setPwdForm(p => ({ ...p, new: e.target.value }))}
                            style={{ WebkitTextSecurity: 'disc', textSecurity: 'disc' }}
                        />
                        <input
                            type="text" autoComplete="off"
                            placeholder={trans('confirmNewPassword', 'تأكيد كلمة المرور', 'Confirm New Password')} title={trans('confirmNewPassword', 'تأكيد كلمة المرور', 'Confirm New Password')}
                            value={pwdForm.confirm}
                            onChange={e => setPwdForm(p => ({ ...p, confirm: e.target.value }))}
                            style={{ WebkitTextSecurity: 'disc', textSecurity: 'disc' }}
                        />
                        {pwdError && (
                            <div className="error-msg">{pwdError}</div>
                        )}
                        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                            <button
                                onClick={handleChangePwd}
                                disabled={pwdLoading}
                                style={{
                                    flex: 1,
                                    background: 'linear-gradient(135deg, #0b6b8a, #1496b0)',
                                    border: 'none', padding: '12px', borderRadius: 10,
                                    color: 'white', fontWeight: 700, cursor: 'pointer'
                                }}
                            >
                                {pwdLoading ? '...' : trans('save', '✅ حفظ', '✅ Save')}
                            </button>
                            <button
                                onClick={() => setChangePwdStaff(null)}
                                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                {t.cancel}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </section>
    );
}
