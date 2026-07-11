const fs = require('fs');

// 1. ADD CSS FOR SECURE INPUTS
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
if (!cssContent.includes('.secure-input')) {
    fs.appendFileSync(cssFile, securityCss);
}

// 2. UPDATE PAGE.JS
const pageFile = 'app/page.js';
let pageContent = fs.readFileSync(pageFile, 'utf8');

// Login password input
pageContent = pageContent.replace('type="password"', 'type="text" className="secure-input" autoComplete="new-password"');
// Confirm password modal fields (if any)
pageContent = pageContent.replace(/type="password"/g, 'type="text" className="secure-input" autoComplete="new-password"');

fs.writeFileSync(pageFile, pageContent);

// 3. UPDATE STAFF.JS
const staffFile = 'app/components/Tabs/Staff.js';
let staffContent = fs.readFileSync(staffFile, 'utf8');

// There are multiple password inputs in Staff.js
staffContent = staffContent.replace(/type="password"/g, 'type="text" className="secure-input" autoComplete="new-password"');

fs.writeFileSync(staffFile, staffContent);

console.log("Applied advanced security measures to bypass browser password detection and saving.");
