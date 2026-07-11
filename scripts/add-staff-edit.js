const fs = require('fs');

const file = 'app/components/Tabs/Staff.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add updateStaff to imports
content = content.replace("import { changeStaffPassword } from '../../actions';", "import { changeStaffPassword, updateStaff } from '../../actions';");

// 2. Add formRef, editStaffId, onSubmit, handleEditClick
const hooksTarget = "const [pwdLoading, setPwdLoading] = useState(false);";
const hooksAddition = `
    const [editStaffId, setEditStaffId] = useState(null);
    const formRef = React.useRef(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        if (editStaffId) {
            const data = {
                name: fd.get('name'),
                email: fd.get('email'),
                phone: fd.get('phone'),
                role: fd.get('role'),
                salary: parseFloat(fd.get('salary') || '0'),
                commission: parseFloat(fd.get('commission') || '0'),
                gender: fd.get('gender')
            };
            if (fd.get('password')) {
                data.password = fd.get('password');
            }
            try {
                await updateStaff(editStaffId, data);
                e.target.reset();
                setEditStaffId(null);
                loadAllData();
                alert(lang === 'ar' ? 'تم تعديل الموظف بنجاح' : 'Staff updated successfully');
            } catch(err) {
                alert('Error updating staff: ' + err.message);
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
            formRef.current.password.value = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
`;
content = content.replace(hooksTarget, hooksTarget + hooksAddition);

// 3. Update form submit handler
content = content.replace('<form onSubmit={handleStaffSubmit}', '<form ref={formRef} onSubmit={onSubmit}');

// 4. Update the submit button
const submitBtnTarget = `<button type="submit" style={{ gridColumn: '1 / -1' }}>
                    ➕ {t.save}
                </button>`;
const submitBtnReplace = `{editStaffId ? (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
                        <button type="submit" style={{ flex: 1, background: '#2196f3' }}>
                            ✅ {lang === 'ar' ? 'تحديث البيانات' : 'Update'}
                        </button>
                        <button type="button" onClick={() => { setEditStaffId(null); formRef.current?.reset(); }} style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}>
                            ❌ {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                    </div>
                ) : (
                    <button type="submit" style={{ gridColumn: '1 / -1' }}>
                        ➕ {t.save}
                    </button>
                )}`;
content = content.replace(submitBtnTarget, submitBtnReplace);

// 5. Add edit button next to delete button
const deleteBtnTarget = `{currentUser?.role === 'admin' && (
                                                <button`;
const deleteBtnReplace = `{currentUser?.role === 'admin' && (
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
                                                <button`;
content = content.replace(deleteBtnTarget, deleteBtnReplace);
content = content.replace('</button>\n                                            )}', '</button>\n                                                </>\n                                            )}');

// Ensure password isn't placeholder with '123456' when editing so the user isn't forced to change it.
// We'll leave the placeholder, if password is empty `updateStaff` handles checking `if (data.password)` and skips it.

fs.writeFileSync(file, content);
console.log("Updated Staff.js with edit functionality");
