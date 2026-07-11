const fs = require('fs');

const pageFile = 'app/page.js';
let pageContent = fs.readFileSync(pageFile, 'utf8');

// Replace the handleDelete function completely to ensure it's correct
const target = /async function handleDelete\(type, id\) \{\s*if \(!confirm\([^)]+\)\) return;\s*try \{/m;
const replacement = `async function handleDelete(type, id, customMsg = null) {
        const msg = customMsg || (lang === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?');
        if (!confirm(msg)) return;
        try {`;

if (target.test(pageContent)) {
    pageContent = pageContent.replace(target, replacement);
    fs.writeFileSync(pageFile, pageContent);
    console.log("Updated page.js handleDelete perfectly");
} else {
    // maybe it was replaced partially before
    const target2 = /async function handleDelete\(type, id, customMsg = null\) \{\s*const msg = customMsg \|\| \(lang === 'ar' \? 'هل أنت متأكد؟' : 'Are you sure\?'\);\s*if \(!confirm\(msg\)\) return;\s*try \{/m;
    if (target2.test(pageContent)) {
        console.log("Already updated!");
    } else {
        console.log("Could not find handleDelete to update in page.js");
    }
}
