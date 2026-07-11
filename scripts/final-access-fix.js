const fs = require('fs');
const file = 'app/actions.js';
let content = fs.readFileSync(file, 'utf8');

// 1. FIX getStaff
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
content = content.replace(oldGetStaff, newGetStaff);

// 2. FIX loginStaff (ENFORCED REPLACEMENT)
const startLogin = content.indexOf('export async function loginStaff');
const endLogin = content.indexOf('return serializeDoc(staff);', startLogin) + 'return serializeDoc(staff);'.length + 2;
// Note: we need to find the ending brace.

const robustLoginFunc = `export async function loginStaff(email, password, loginSystemType = 'separate') {
    await dbConnect();
    const cleanEmail = email.trim().toLowerCase();

    // نجد الموظف أولاً بالبريد الإلكتروني فقط لنتعرف على صلاحياته ونوعه
    const staff = await Staff.findOne({ email: cleanEmail, active: true });

    if (!staff) {
        throw new Error('User not found');
    }

    // للمديرين: يمكنهم الدخول إلى أي نظام
    if (staff.role === 'admin') {
        // لا يوجد قياس على نوع النظام للمدير
    } else {
        // التحقق من صلاحية الوصول لنوع النظام للموظفين العاديين
        const sType = staff.systemType; // mix, men, women, separate
        
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
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return serializeDoc(staff);
}`;

// I will use a more surgical approach to replace the entire export block
const loginRegex = /export async function loginStaff[\s\S]*?return serializeDoc\(staff\);[\s\S]*?\}/;
content = content.replace(loginRegex, robustLoginFunc);

fs.writeFileSync(file, content);
console.log("Applied final fixes for staff visibility and login enforcement.");
