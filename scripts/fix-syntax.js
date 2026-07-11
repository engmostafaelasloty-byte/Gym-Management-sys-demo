const fs = require('fs');

// 1. FIX STAFF.JS SYNTAX
const staffFile = 'app/components/Tabs/Staff.js';
let staffContent = fs.readFileSync(staffFile, 'utf8');

const buggyLine = "onClick={() => { window.alert('Staff.js: button clicked'); handleDelete('staff', s._id, lang === 'ar' ? `هل أنت متأكد من حذف الموظف ${s.name}؟` : `Are you sure you want to delete ${s.name}?`)}";
const cleanLine = "onClick={() => handleDelete('staff', s._id, lang === 'ar' ? `هل أنت متأكد من حذف الموظف ${s.name}؟` : `Are you sure you want to delete ${s.name}?`)}";

staffContent = staffContent.replace(buggyLine, cleanLine);
fs.writeFileSync(staffFile, staffContent);

// 2. FIX PAGE.JS SYNTAX (Just in case I did something similar there)
const pageFile = 'app/page.js';
let pageContent = fs.readFileSync(pageFile, 'utf8');

const buggyPageLine = "window.alert('Button Clicked - opening modal'); setConfirmDelete({";
const cleanPageLine = "setConfirmDelete({";

pageContent = pageContent.replace(buggyPageLine, cleanPageLine);
fs.writeFileSync(pageFile, pageContent);

console.log("Fixed syntax errors and removed debug alerts");
