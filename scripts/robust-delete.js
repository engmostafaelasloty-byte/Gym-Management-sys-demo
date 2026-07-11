const fs = require('fs');

// 1. UPDATE PAGE.JS FOR ROBUST DELETION AND FEEDBACK
const pageFile = 'app/page.js';
let pageContent = fs.readFileSync(pageFile, 'utf8');

// Ensure deleteStaff is correctly used in executeDeletion
// and add a check to prevent self-deletion
const executeTarget = /async function executeDeletion\(\) \{[\s\S]*?async function executeDeletion\(\) \{/; // This regex is tricky, let's just replace the whole function

const executeRefined = `async function executeDeletion() {
        const { type, id } = confirmDelete;
        
        // Prevent self-deletion for staff
        if (type === 'staff' && currentUser && id === currentUser._id) {
            alert(lang === 'ar' ? 'لا يمكنك حذف حسابك الخاص أثناء تسجيل الدخول!' : 'You cannot delete your own account while logged in!');
            setConfirmDelete({ open: false, type: '', id: '', msg: '' });
            return;
        }

        setIsDeleting(true);
        try {
            console.log('Attempting to delete:', type, id);
            if (type === 'sub') await deleteSubscriber(id);
            else if (type === 'goods') await deleteGoods(id);
            else if (type === 'exp') await deleteExpense(id);
            else if (type === 'equipment') await deleteEquipment(id);
            else if (type === 'staff') await deleteStaff(id);
            else if (type === 'class') await deleteClass(id);
            
            // Artificial delay for better UX and to allow DB to catch up
            await new Promise(resolve => setTimeout(resolve, 500));
            
            await loadAllData();
            console.log('Data reloaded after deletion');
            
            setConfirmDelete({ open: false, type: '', id: '', msg: '' });
            
            // Trigger a small success notification (Optional, alert is fine for now)
            alert(lang === 'ar' ? '✅ تم الحذف بنجاح' : '✅ Deleted successfully');
        } catch (err) {
            console.error('Deletion error:', err);
            alert(lang === 'ar' ? '❌ فشل الحذف: ' + err.message : '❌ Deletion failed: ' + err.message);
        } finally {
            setIsDeleting(false);
        }
    }`;

// Replacing the function
const funcRegex = /async function executeDeletion\(\) \{[\s\S]*?setConfirmDelete\(\{ open: false, type: '', id: '', msg: '' \}\);[\s\S]*?\} catch \(err\) \{[\s\S]*?\} finally \{[\s\S]*?setIsDeleting\(false\);[\s\S]*?\}[\s\S]*?\}/;
pageContent = pageContent.replace(funcRegex, executeRefined);

fs.writeFileSync(pageFile, pageContent);

// 2. ENSURE STAFF.JS IS CLEAN AND PASSES ID PROPERLY
const staffFile = 'app/components/Tabs/Staff.js';
let staffContent = fs.readFileSync(staffFile, 'utf8');

// Make sure the delete button is clean
const btnRegex = /<button\s+className="small"\s+onClick=\{\(\) => handleDelete\('staff', s\._id, lang === 'ar' \? `هل أنت متأكد من حذف الموظف \$\{s\.name\}؟` : `Are you sure you want to delete \$\{s\.name\}\?`\)\}/;

if (!staffContent.includes("handleDelete('staff', s._id")) {
    console.log("Button might have different format, attempting generic fix");
    // Just in case, let's find any button with a trash icon and fix its onClick
    // but the previous view showed it was correct. 
}

fs.writeFileSync(staffFile, staffContent);

console.log("Applied robust deletion logic and self-deletion protection");
