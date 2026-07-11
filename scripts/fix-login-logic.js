const fs = require('fs');
const file = 'app/actions.js';
let content = fs.readFileSync(file, 'utf8');

const target = 'const staff = await Staff.findOne({ email: cleanEmail, systemType, active: true });';
const replacement = `let searchType = systemType;
    if (systemType === 'men' || systemType === 'women') searchType = 'separate';
    const staff = await Staff.findOne({ email: cleanEmail, systemType: searchType, active: true });`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log("Updated actions.js correctly");
} else {
    console.log("Target not found");
}
