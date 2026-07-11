const fs = require('fs');

// 1. REVERT GLOBALS.CSS SECURITY MASKING
const cssFile = 'app/globals.css';
let cssContent = fs.readFileSync(cssFile, 'utf8');
const securityCss = `
.secure-input {
    -webkit-text-security: disc !important;
    text-security: disc !important;
}

/* Fallback for browsers that don't support text-security */
.secure-input::placeholder {
    -webkit-text-security: none !important;
    text-security: none !important;
}
`;
if (cssContent.includes('.secure-input')) {
    cssContent = cssContent.replace(securityCss, '');
    fs.writeFileSync(cssFile, cssContent);
}

// 2. REVERT PAGE.JS TO STANDARD PASSWORD INPUT
const pageFile = 'app/page.js';
let pageContent = fs.readFileSync(pageFile, 'utf8');

const secureLoginInput = `<input
                                type="text" className="secure-input" autoComplete="new-password"
                                id="loginPassword"`;
const restoreLoginInput = `<input
                                type="password"
                                id="loginPassword"`;

if (pageContent.includes('className="secure-input"')) {
    pageContent = pageContent.replace(/type="text" className="secure-input" autoComplete="new-password"/g, 'type="password" autoComplete="new-password"');
}
fs.writeFileSync(pageFile, pageContent);

// 3. REVERT STAFF.JS TO STANDARD PASSWORD INPUT
const staffFile = 'app/components/Tabs/Staff.js';
let staffContent = fs.readFileSync(staffFile, 'utf8');

if (staffContent.includes('className="secure-input"')) {
    staffContent = staffContent.replace(/className="secure-input" type="text" autoComplete="new-password"/g, 'type="password" autoComplete="new-password"');
    staffContent = staffContent.replace(/className="secure-input" type="text"/g, 'type="password"');
    staffContent = staffContent.replace(/type="text" className="secure-input"/g, 'type="password"');
}
fs.writeFileSync(staffFile, staffContent);

console.log("Reverted masking trick to restore system stability and fix validation issues.");
