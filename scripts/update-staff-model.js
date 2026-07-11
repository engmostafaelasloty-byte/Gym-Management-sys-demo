const fs = require('fs');
const file = 'models/Staff.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    "enum: ['mix', 'separate'], default: 'separate'",
    "enum: ['mix', 'separate', 'men', 'women'], default: 'separate'"
);

fs.writeFileSync(file, content);
console.log("Updated Staff model systemType enum.");
