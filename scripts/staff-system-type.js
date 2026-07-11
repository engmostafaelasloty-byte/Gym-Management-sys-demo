const fs = require('fs');

// 1. UPDATE STAFF.JS (Component)
const staffFile = 'app/components/Tabs/Staff.js';
let staffContent = fs.readFileSync(staffFile, 'utf8');

// Add systemType to the form
const genderSelect = `<select name="gender">
                    <option value="male">{t.male}</option>
                    <option value="female">{t.female}</option>
                </select>`;

const systemTypeSelect = `
                <select name="gender">
                    <option value="male">{t.male}</option>
                    <option value="female">{t.female}</option>
                </select>
                <div className="tooltip-field" data-tooltip={lang === 'ar' ? 'نوع الفرع/النظام الذي يعمل به الموظف' : 'The system/branch this staff works in'}>
                <select name="systemType" required>
                    <option value="">{lang === 'ar' ? '-- نوع النظام --' : '-- System Type --'}</option>
                    <option value="separate">{lang === 'ar' ? 'منفصل (رجالي/حريمي)' : 'Separate (Men/Women)'}</option>
                    <option value="mix">{lang === 'ar' ? 'مختلط (Mixed)' : 'Mixed'}</option>
                </select>
                </div>`;

staffContent = staffContent.replace(genderSelect, systemTypeSelect);

// Update onSubmit (Edit mode)
const editDataBlock = `gender: fd.get('gender')
            };`;
const newEditDataBlock = `gender: fd.get('gender'),
                systemType: fd.get('systemType')
            };`;
staffContent = staffContent.replace(editDataBlock, newEditDataBlock);

// Update handleEditClick (to pre-fill)
const editPreFill = `if (s.gender) formRef.current.gender.value = s.gender;`;
const newEditPreFill = `if (s.gender) formRef.current.gender.value = s.gender;
            if (s.systemType) formRef.current.systemType.value = s.systemType;`;
staffContent = staffContent.replace(editPreFill, newEditPreFill);

fs.writeFileSync(staffFile, staffContent);

// 2. UPDATE PAGE.JS (handleStaffSubmit)
const pageFile = 'app/page.js';
let pageContent = fs.readFileSync(pageFile, 'utf8');

const overrideLine = "fd.set('systemType', systemType);";
const fixOverrideLine = "if (!fd.get('systemType')) fd.set('systemType', systemType);";

pageContent = pageContent.replace(overrideLine, fixOverrideLine);

fs.writeFileSync(pageFile, pageContent);

console.log("Added System Type selection to staff management and fixed override logic.");
