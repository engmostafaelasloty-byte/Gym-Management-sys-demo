const fs = require('fs');
const file = 'app/page.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /(if \(type === 'equipment'\) await deleteEquipment\(id\);)/;
content = content.replace(regex, "$1\n            if (type === 'staff') await deleteStaff(id);");

fs.writeFileSync(file, content);
console.log("Updated page.js handleDelete");
