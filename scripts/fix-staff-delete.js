const fs = require('fs');
const path = require('path');

// 1. UPDATE PAGE.JS
const pagePath = path.join(__dirname, '..', 'app', 'page.js');
let pageContent = fs.readFileSync(pagePath, 'utf8');

const targetPageStr = `<StaffTab
                        lang={lang} t={t} staff={staff}
                        handleStaffSubmit={handleStaffSubmit}
                        deleteStaff={deleteStaff}
                        updateStaffPermissions={updateStaffPermissions}
                        loadAllData={loadAllData}
                    />`;

const replacePageStr = `<StaffTab
                        lang={lang} t={t} staff={staff}
                        handleStaffSubmit={handleStaffSubmit}
                        deleteStaff={deleteStaff}
                        updateStaffPermissions={updateStaffPermissions}
                        loadAllData={loadAllData}
                        currentUser={currentUser}
                    />`;

if (pageContent.includes(targetPageStr)) {
    pageContent = pageContent.replace(targetPageStr, replacePageStr);
    fs.writeFileSync(pagePath, pageContent, 'utf8');
    console.log('Fixed page.js successfully.');
} else {
    console.log('Could not find StaffTab in page.js');
}


// 2. UPDATE STAFF.JS
const staffPath = path.join(__dirname, '..', 'app', 'components', 'Tabs', 'Staff.js');
let staffContent = fs.readFileSync(staffPath, 'utf8');

// A. update props
const staffPropsTarget = `export default function StaffTab({
    lang, t, staff, handleStaffSubmit, deleteStaff, updateStaffPermissions, loadAllData
})`;
const staffPropsReplace = `export default function StaffTab({
    lang, t, staff, handleStaffSubmit, deleteStaff, updateStaffPermissions, loadAllData, currentUser
})`;

if (staffContent.includes(staffPropsTarget)) {
    staffContent = staffContent.replace(staffPropsTarget, staffPropsReplace);
}

// B. Wrap the delete button
// Note: use Regex or exact string replacement
const buttonTarget = `<button
                                                className="small"
                                                onClick={async () => {
                                                    if (confirm(lang === 'ar' ? \`هل تريد حذف \${s.name}؟\` : \`Delete \${s.name}?\`)) {
                                                        await deleteStaff(s._id);
                                                        loadAllData();
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
                                            </button>`;

const buttonReplace = `{currentUser?.role === 'admin' && (
                                                <button
                                                    className="small"
                                                    onClick={async () => {
                                                        if (confirm(lang === 'ar' ? \`هل تريد حذف \${s.name}؟\` : \`Delete \${s.name}?\`)) {
                                                            await deleteStaff(s._id);
                                                            loadAllData();
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

if (staffContent.includes(buttonTarget)) {
    staffContent = staffContent.replace(buttonTarget, buttonReplace);
    fs.writeFileSync(staffPath, staffContent, 'utf8');
    console.log('Fixed Staff.js successfully.');
} else {
    console.log('Could not find delete button in Staff.js');
}
