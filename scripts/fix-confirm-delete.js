const fs = require('fs');

const pageFile = 'app/page.js';
let pageContent = fs.readFileSync(pageFile, 'utf8');

// Update handleDelete signature and confirm call
pageContent = pageContent.replace(
    'async function handleDelete(type, id) {\n        if (!confirm(lang === \'ar\' ? \'هل أنت متأكد؟\' : \'Are you sure?\')) return;',
    'async function handleDelete(type, id, customMsg) {\n        const msg = customMsg || (lang === \'ar\' ? \'هل أنت متأكد؟\' : \'Are you sure?\');\n        if (!confirm(msg)) return;'
);

fs.writeFileSync(pageFile, pageContent);

const staffFile = 'app/components/Tabs/Staff.js';
let staffContent = fs.readFileSync(staffFile, 'utf8');

// Update onClick to include custom message
const targetOnClick = "onClick={() => handleDelete('staff', s._id)}";
const replacementOnClick = "onClick={() => handleDelete('staff', s._id, lang === 'ar' ? `هل أنت متأكد من حذف الموظف ${s.name}؟` : `Are you sure you want to delete ${s.name}?`)}";

staffContent = staffContent.replace(targetOnClick, replacementOnClick);
fs.writeFileSync(staffFile, staffContent);

console.log("Updated confirmation message logic.");
