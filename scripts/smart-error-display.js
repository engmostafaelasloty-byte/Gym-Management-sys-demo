const fs = require('fs');
const file = 'app/page.js';
let content = fs.readFileSync(file, 'utf8');

const oldErrorBlock = `            if (msg.includes('User not found')) displayError = lang === 'ar' ? 'البريد الإلكتروني غير موجود' : 'Email not found';
            else if (msg.includes('Invalid credentials')) displayError = lang === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect password';

            setError(displayError);`;

const newErrorBlock = `            if (msg.includes('User not found')) displayError = lang === 'ar' ? 'البريد الإلكتروني غير موجود' : 'Email not found';
            else if (msg.includes('Invalid credentials')) displayError = lang === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect password';
            else if (msg.includes('ليس لديك صلاحية')) displayError = msg;

            setError(displayError);`;

content = content.replace(oldErrorBlock, newErrorBlock);
fs.writeFileSync(file, content);
console.log("Updated handleLogin to display smart permission errors from the backend.");
