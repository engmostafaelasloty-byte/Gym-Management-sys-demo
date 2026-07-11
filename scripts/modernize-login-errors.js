const fs = require('fs');
const file = 'app/actions.js';
let content = fs.readFileSync(file, 'utf8');

const sTypeLogic = `        const sType = staff.systemType; // mix, men, women, separate
        
        const isAccessDenied = (
            (loginSystemType === 'mix' && sType !== 'mix' && sType !== 'separate') ||
            (loginSystemType === 'men' && sType !== 'men' && sType !== 'separate') ||
            (loginSystemType === 'women' && sType !== 'women' && sType !== 'separate') ||
            // الموظف المنفصل لا يمكنه دخول المكس إلا لو كان مديراً
            (loginSystemType === 'mix' && sType === 'separate')
        );

        if (isAccessDenied) {
            let sTypeArabic = '';
            if (sType === 'men') sTypeArabic = 'نظام الرجال';
            else if (sType === 'women') sTypeArabic = 'نظام السيدات';
            else if (sType === 'mix') sTypeArabic = 'النظام المختلط';
            else sTypeArabic = 'الأنظمة المنفصلة';

            throw new Error('ليس لديك صلاحية للدخول لهذا النظام. صلاحيتك مسجلة لـ: ' + sTypeArabic);
        }
    }`;

const betterSTypeLogic = `        const sType = staff.systemType; // mix, men, women, separate
        
        const isAccessDenied = (
            (loginSystemType === 'mix' && sType !== 'mix' && sType !== 'separate') ||
            (loginSystemType === 'men' && sType !== 'men' && sType !== 'separate') ||
            (loginSystemType === 'women' && sType !== 'women' && sType !== 'separate') ||
            (loginSystemType === 'mix' && sType === 'separate')
        );

        if (isAccessDenied) {
            throw new Error('Access denied: ' + sType);
        }
    }`;

content = content.replace(sTypeLogic, betterSTypeLogic);
fs.writeFileSync(file, content);
console.log("Updated actions.js to throw machine-readable access denied errors.");
