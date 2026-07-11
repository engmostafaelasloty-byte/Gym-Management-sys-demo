const fs = require('fs');
const file = 'app/actions.js';
let content = fs.readFileSync(file, 'utf8');

const oldLoginFunc = `export async function loginStaff(email, password, systemType = 'separate') {
    await dbConnect();
    const cleanEmail = email.trim().toLowerCase();

    // البحث بالبريد الإلكتروني ونوع النظام فقط (بدون تحديد الدور مسبقاً)
    let searchType = systemType;
    if (systemType === 'men' || systemType === 'women') searchType = 'separate';
    const staff = await Staff.findOne({ email: cleanEmail, systemType: searchType, active: true });

    if (!staff) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return serializeDoc(staff);
}`;

const newLoginFunc = `export async function loginStaff(email, password, loginSystemType = 'separate') {
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
            // إذا كان الموظف 'separate' (كلاهما) فيمكنه دخول 'men' أو 'women' ولكن ليس 'mix'
            (loginSystemType === 'mix' && sType === 'separate' && staff.role !== 'admin')
        );

        if (isAccessDenied) {
            throw new Error(
                'ليس لديك صلاحية للدخول لهذا النظام. صلاحيتك مسجلة لـ: ' + 
                (sType === 'men' ? 'نظام الرجال' : sType === 'women' ? 'نظام السيدات' : sType === 'mix' ? 'النظام المختلط' : 'الأنظمة المنفصلة')
            );
        }
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return serializeDoc(staff);
}`;

content = content.replace(oldLoginFunc, newLoginFunc);
fs.writeFileSync(file, content);
console.log("Updated login logic to strictly enforce system access permissions.");
