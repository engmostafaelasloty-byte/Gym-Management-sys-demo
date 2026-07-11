const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'app', 'page.js');
let text = fs.readFileSync(filePath, 'utf8');

const regex = /<StaffTab\s+lang=\{lang\}\s+t=\{t\}\s+staff=\{staff\}\s+handleStaffSubmit=\{handleStaffSubmit\}\s+deleteStaff=\{deleteStaff\}\s+updateStaffPermissions=\{updateStaffPermissions\}\s+loadAllData=\{loadAllData\}\s+\/>/m;

const replacement = `<StaffTab
                        lang={lang} t={t} staff={staff}
                        handleStaffSubmit={handleStaffSubmit}
                        deleteStaff={deleteStaff}
                        updateStaffPermissions={updateStaffPermissions}
                        loadAllData={loadAllData}
                        currentUser={currentUser}
                    />`;

if (regex.test(text)) {
    fs.writeFileSync(filePath, text.replace(regex, replacement));
    console.log("Replaced using exact regex match!");
} else {
    console.log("Could not find StaffTab using regex.");
}
