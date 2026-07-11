const fs = require('fs');
const file = 'app/actions.js';
let content = fs.readFileSync(file, 'utf8');

const brokenBlock = `export async function getStaff() {
    await dbConnect();
    const staff = await Staff.find({ active: true }).sort({ role: 1, name: 1 }).lean();
    return serializeDocs(staff);
}.sort({ createdAt: -1 }).lean();
    return serializeDocs(staff);
}`;

const cleanBlock = `export async function getStaff() {
    await dbConnect();
    const staff = await Staff.find({ active: true }).sort({ role: 1, name: 1 }).lean();
    return serializeDocs(staff);
}`;

content = content.replace(brokenBlock, cleanBlock);
fs.writeFileSync(file, content);
console.log("REPAIRED: getStaff in actions.js");
