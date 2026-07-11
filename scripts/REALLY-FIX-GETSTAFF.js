const fs = require('fs');
const file = 'app/actions.js';
let content = fs.readFileSync(file, 'utf8');

const oldGetStaff = `export async function getStaff(systemType = 'separate') {
    await dbConnect();
    const staff = await Staff.find({ systemType }).sort({ createdAt: -1 }).lean();
    return serializeDocs(staff);
}`;

const newGetStaff = `export async function getStaff() {
    await dbConnect();
    const staff = await Staff.find({ active: true }).sort({ role: 1, name: 1 }).lean();
    return serializeDocs(staff);
}`;

if (content.includes(oldGetStaff)) {
    content = content.replace(oldGetStaff, newGetStaff);
    fs.writeFileSync(file, content);
    console.log("SUCCESS: Fixed getStaff to return ALL staff members.");
} else {
    // If exact match fails, try a slightly different match version
     const regex = /export async function getStaff\([\s\S]*?\}[\s\S]*?\}/; // Too broad
     // Let's just find the line
     const lineStart = content.indexOf('export async function getStaff');
     const lineEnd = content.indexOf('}', lineStart) + 1;
     const actualText = content.substring(lineStart, lineEnd + 1);
     console.log("Actually found text for getStaff:", actualText);
     
     content = content.replace(actualText, newGetStaff);
     fs.writeFileSync(file, content);
}
