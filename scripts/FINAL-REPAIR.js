const fs = require('fs');
const file = 'app/actions.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /export async function getStaff\(\) \{[\s\S]*?export async function addStaff/;
const replacement = `export async function getStaff() {
    await dbConnect();
    const staff = await Staff.find({ active: true }).sort({ role: 1, name: 1 }).lean();
    return serializeDocs(staff);
}

export async function addStaff`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
console.log("REPAIRED: getStaff in actions.js using regex.");
