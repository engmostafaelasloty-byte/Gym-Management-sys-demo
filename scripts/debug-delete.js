const fs = require('fs');
const file = 'app/page.js';
let content = fs.readFileSync(file, 'utf8');

const target = `async function handleDelete(type, id, customMsg = null) {
        const msg = customMsg || (lang === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?');
        if (!confirm(msg)) return;
        try {
            if (type === 'sub') await deleteSubscriber(id);
            if (type === 'goods') await deleteGoods(id);
            if (type === 'exp') await deleteExpense(id);
            if (type === 'equipment') await deleteEquipment(id);
            if (type === 'staff') await deleteStaff(id);
            loadAllData();
        } catch (err) {
            console.error(err);
        }
    }`;

const replacement = `async function handleDelete(type, id, customMsg = null) {
        const msg = customMsg || (lang === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?');
        if (!confirm(msg)) return;
        try {
            if (type === 'sub') await deleteSubscriber(id);
            else if (type === 'goods') await deleteGoods(id);
            else if (type === 'exp') await deleteExpense(id);
            else if (type === 'equipment') await deleteEquipment(id);
            else if (type === 'staff') await deleteStaff(id);
            
            await loadAllData();
            alert(lang === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
        } catch (err) {
            console.error(err);
            alert(lang === 'ar' ? 'فشل الحذف: ' + err.message : 'Delete failed: ' + err.message);
        }
    }`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log("Updated page.js with alerts");
} else {
    // Fallback regex attempt
    const regex = /async function handleDelete\(type, id, customMsg = null\) \{[\s\S]*?loadAllData\(\);[\s\S]*?catch \(err\) \{[\s\S]*?console\.error\(err\);[\s\S]*?\}[\s\S]*?\}/;
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(file, content);
        console.log("Updated page.js with alerts (regex)");
    } else {
        console.log("handleDelete pattern not found");
    }
}
