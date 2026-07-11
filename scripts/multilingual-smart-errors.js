const fs = require('fs');
const file = 'app/page.js';
let content = fs.readFileSync(file, 'utf8');

const catchBlockStart = 'catch (err) {';
const catchBlockEnd = 'setError(displayError);';

const newCatchContent = `        } catch (err) {
            console.error(err);
            const msg = err.message;
            let displayError = lang === 'ar' ? 'خطأ في البريد أو كلمة المرور' : 'Invalid email or password';

            if (msg.includes('User not found')) {
                displayError = lang === 'ar' ? 'البريد الإلكتروني غير موجود' : 'Email not found';
            } else if (msg.includes('Invalid credentials')) {
                displayError = lang === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect password';
            } else if (msg.includes('Access denied')) {
                const type = msg.split(': ')[1];
                if (lang === 'ar') {
                    let typeAr = '';
                    if (type === 'men') typeAr = 'نظام الرجال فقط';
                    else if (type === 'women') typeAr = 'نظام السيدات فقط';
                    else if (type === 'mix') typeAr = 'نظام المختلط فقط';
                    else typeAr = 'الأنظمة المنفصلة';
                    displayError = 'ليس لديك صلاحية للدخول لهذا النظام. صلاحيتك مسجلة لـ: ' + typeAr;
                } else {
                    let typeEn = '';
                    if (type === 'men') typeEn = 'Men system only';
                    else if (type === 'women') typeEn = 'Women system only';
                    else if (type === 'mix') typeEn = 'Mixed system only';
                    else typeEn = 'Separate systems';
                    displayError = 'Access denied. Your permission is for: ' + typeEn;
                }
            }

            setError(displayError);`;

// Find the handleLogin function catch block and replace it
const handleLoginRegex = /async function handleLogin\(e\) \{[\s\S]*?catch \(err\) \{[\s\S]*?setError\(displayError\);/;
content = content.replace(handleLoginRegex, (match) => {
    return match.split('catch (err) {')[0] + newCatchContent;
});

fs.writeFileSync(file, content);
console.log("Updated handleLogin in page.js to support multilingual smart error messages.");
