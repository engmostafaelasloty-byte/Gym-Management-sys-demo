const fs = require('fs');
const file = 'app/page.js';
let content = fs.readFileSync(file, 'utf8');

const oldLine = "const sysType = effectiveMode === 'mix' ? 'mix' : 'separate';";
const newLine = "const sysType = effectiveMode; // 'men', 'women', or 'mix'";

content = content.replace(oldLine, newLine);
fs.writeFileSync(file, content);
console.log("Fixed handleLogin to pass the specific system mode (men/women/mix) to the backend.");
