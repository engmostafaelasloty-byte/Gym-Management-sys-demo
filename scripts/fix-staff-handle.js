const fs = require('fs');

// UPDATE PAGE.JS
const pagePath = 'app/page.js';
let pageContent = fs.readFileSync(pagePath, 'utf8');
pageContent = pageContent.replace('deleteStaff={deleteStaff}', 'handleDelete={handleDelete}');
fs.writeFileSync(pagePath, pageContent);

// UPDATE STAFF.JS
const staffPath = 'app/components/Tabs/Staff.js';
let staffContent = fs.readFileSync(staffPath, 'utf8');

staffContent = staffContent.replace(
    'lang, t, staff, handleStaffSubmit, deleteStaff, updateStaffPermissions, loadAllData, currentUser',
    'lang, t, staff, handleStaffSubmit, handleDelete, updateStaffPermissions, loadAllData, currentUser'
);

const oldButton = `{currentUser?.role === 'admin' && (
                                                <button
                                                    className="small"
                                                    onClick={async () => {
                                                        if (confirm(lang === 'ar' ? \`هل تريد حذف \${s.name}؟\` : \`Delete \${s.name}?\`)) {
                                                            try {
                                                                await deleteStaff(s._id);
                                                                await loadAllData();
                                                            } catch(err) {
                                                                alert('Error: ' + err.message);
                                                            }
                                                        }
                                                    }}
                                                    style={{
                                                        background: 'rgba(255, 75, 75, 0.1)',
                                                        border: '1px solid rgba(255,75,75,0.2)',
                                                        color: '#ff7f7f',
                                                        fontSize: 12
                                                    }}
                                                >
                                                    🗑️
                                                </button>
                                            )}`;

const newButton = `{currentUser?.role === 'admin' && (
                                                <button
                                                    className="small"
                                                    onClick={() => handleDelete('staff', s._id)}
                                                    style={{
                                                        background: 'rgba(255, 75, 75, 0.1)',
                                                        border: '1px solid rgba(255,75,75,0.2)',
                                                        color: '#ff7f7f',
                                                        fontSize: 12
                                                    }}
                                                >
                                                    🗑️
                                                </button>
                                            )}`;

if (staffContent.includes('catch(err) {')) {
    staffContent = staffContent.replace(oldButton, newButton);
}
fs.writeFileSync(staffPath, staffContent);
