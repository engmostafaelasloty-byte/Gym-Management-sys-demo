const fs = require('fs');

// 1. PAGE.JS
const pageFile = 'app/page.js';
let pageContent = fs.readFileSync(pageFile, 'utf8');

// Clean up attributes
pageContent = pageContent.replace(/type="text" className="secure-input" autoComplete="new-password"\s+id="loginPassword"/, 'id="loginPassword"');
pageContent = pageContent.replace(/id="loginPassword"[\s\S]*?autoComplete="current-password"/, 'id="loginPassword"\n                                type="text" className="secure-input" autoComplete="new-password"');

fs.writeFileSync(pageFile, pageContent);

// 2. STAFF.JS
const staffFile = 'app/components/Tabs/Staff.js';
let staffContent = fs.readFileSync(staffFile, 'utf8');

// Clean up potential duplicate autoCompletes if they existed
staffContent = staffContent.replace(/type="text" className="secure-input" autoComplete="new-password"/g, 'className="secure-input" type="text" autoComplete="new-password"');

fs.writeFileSync(staffFile, staffContent);

console.log("Cleaned up password security fields");
