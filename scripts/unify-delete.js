const fs = require('fs');

// 1. UPDATE CLASSES.JS
const classesFile = 'app/components/Tabs/Classes.js';
let classesContent = fs.readFileSync(classesFile, 'utf8');
classesContent = classesContent.replace('deleteClass, loadAllData', 'handleDelete, loadAllData');
classesContent = classesContent.replace('deleteClass={deleteClass}', 'handleDelete={handleDelete}');

const oldClassBtn = `onClick={async () => {
                    if (confirm(lang === 'ar' ? \`حذف حصة "\${c.nameAr || c.name}"؟\` : \`Delete class "\${c.name}"?\`)) {
                        await deleteClass(c._id);
                        loadAllData();
                    }
                }}`;
const newClassBtn = `onClick={() => handleDelete('class', c._id, lang === 'ar' ? \`هل أنت متأكد من حذف الحصة "\${c.nameAr || c.name}"؟\` : \`Are you sure you want to delete class "\${c.name}"?\`)}`;

classesContent = classesContent.replace(oldClassBtn, newClassBtn);
fs.writeFileSync(classesFile, classesContent);

// 2. UPDATE EQUIPMENT.JS
const equipFile = 'app/components/Tabs/Equipment.js';
let equipContent = fs.readFileSync(equipFile, 'utf8');
equipContent = equipContent.replace('deleteEquipment, addMaintenance', 'handleDelete, addMaintenance');
equipContent = equipContent.replace("onClick={() => deleteEquipment('equipment', eq._id)}", "onClick={() => handleDelete('equipment', eq._id)}");
fs.writeFileSync(equipFile, equipContent);

// 3. UPDATE PAGE.JS TO ENSURE PROPS ARE PASSED CORRECTLY
const pageFile = 'app/page.js';
let pageContent = fs.readFileSync(pageFile, 'utf8');
pageContent = pageContent.replace('deleteClass={handleDelete}', 'handleDelete={handleDelete}');
pageContent = pageContent.replace('deleteEquipment={handleDelete}', 'handleDelete={handleDelete}');
fs.writeFileSync(pageFile, pageContent);

console.log("Unified professional deletion across all components");
