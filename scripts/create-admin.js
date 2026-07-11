// Script to create an admin manually with custom credentials
// node scripts/create-admin.js <email> <password> [name]

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-management';

const StaffSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    role: String,
    password: String,
    salary: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    gender: { type: String, default: 'male' },
    systemType: { type: String, default: 'mix' },
    permissions: {
        canAddSubscribers: { type: Boolean, default: true },
        canEditSubscribers: { type: Boolean, default: true },
        canDeleteSubscribers: { type: Boolean, default: true },
        canRenewSubscribers: { type: Boolean, default: true },
        canFreezeSubscribers: { type: Boolean, default: true },
        canCheckInSubscribers: { type: Boolean, default: true },
        canViewDashboard: { type: Boolean, default: true },
        canViewReports: { type: Boolean, default: true },
        canManageFinances: { type: Boolean, default: true },
        canManageStaff: { type: Boolean, default: true },
        canManageEquipment: { type: Boolean, default: true },
        canManageLoyalty: { type: Boolean, default: true },
        canManageGoods: { type: Boolean, default: true },
    },
}, { timestamps: true });

async function createAdmin() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('❌ Usage: node scripts/create-admin.js <email> <password> [name]');
        process.exit(1);
    }

    const email = args[0].trim().toLowerCase();
    const password = args[1];
    const name = args[2] || 'System Admin';

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        console.error('❌ Error: Invalid email format.');
        process.exit(1);
    }

    // Validate password length
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[1-9]).{6,}$/;
    if (!passwordRegex.test(password)) {
        console.error('❌ Error: Password must be at least 6 characters, containing a letter and a number from 1 to 9.');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        if (mongoose.models.Staff) delete mongoose.models.Staff;
        const Staff = mongoose.model('Staff', StaffSchema);

        const hashedPassword = await bcrypt.hash(password, 10);

        const existing = await Staff.findOne({ email });
        if (existing) {
            existing.password = hashedPassword;
            existing.active = true;
            existing.role = 'admin';
            existing.name = name;
            await existing.save();
            console.log(`✅ Updated existing admin account: ${email}`);
        } else {
            await Staff.create({
                name,
                email,
                password: hashedPassword,
                role: 'admin',
                gender: 'male',
                systemType: 'mix',
                active: true,
            });
            console.log(`✅ Created new admin account successfully: ${email}`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

createAdmin();
