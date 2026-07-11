import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    // معلومات الصالة
    gymInfo: {
        name: { type: String, default: 'Gym Management System' },
        nameAr: { type: String, default: 'نظام إدارة الصالة الرياضية' },
        logo: { type: String },
        phone: { type: String },
        email: { type: String },
        address: { type: String },
        addressAr: { type: String },
        website: { type: String },
        socialMedia: {
            facebook: { type: String },
            instagram: { type: String },
            twitter: { type: String },
            youtube: { type: String },
        }
    },

    // إعدادات النظام
    system: {
        language: { type: String, enum: ['ar', 'en'], default: 'ar' },
        currency: { type: String, default: 'EGP' },
        timezone: { type: String, default: 'Africa/Cairo' },
        dateFormat: { type: String, default: 'DD/MM/YYYY' },
        timeFormat: { type: String, enum: ['12h', '24h'], default: '12h' },
    },

    // إعدادات الاشتراكات
    subscriptions: {
        allowMultipleActive: { type: Boolean, default: false },
        autoRenewal: { type: Boolean, default: false },
        expiryWarningDays: { type: Number, default: 7 },
        gracePeriodDays: { type: Number, default: 3 },
    },

    // إعدادات الدفع
    payment: {
        allowInstallments: { type: Boolean, default: true },
        minInstallmentAmount: { type: Number, default: 100 },
        lateFee: { type: Number, default: 0 },
        acceptedMethods: [{ type: String, enum: ['cash', 'card', 'bank_transfer', 'online'] }],
    },

    // إعدادات النقاط
    loyalty: {
        enabled: { type: Boolean, default: true },
        pointsPerEGP: { type: Number, default: 1 }, // نقطة لكل جنيه
        pointsPerVisit: { type: Number, default: 10 },
        referralPoints: { type: Number, default: 100 },
        redemptionRate: { type: Number, default: 0.1 }, // 10 نقاط = 1 جنيه
    },

    // إعدادات الإشعارات
    notifications: {
        emailEnabled: { type: Boolean, default: false },
        smsEnabled: { type: Boolean, default: false },
        whatsappEnabled: { type: Boolean, default: false },
        pushEnabled: { type: Boolean, default: true },
        expiryReminders: { type: Boolean, default: true },
        birthdayWishes: { type: Boolean, default: true },
        promotions: { type: Boolean, default: true },
        smsGatewayUrl: { type: String, default: '' },
        smsApiKey: { type: String, default: '' },
        smsSenderId: { type: String, default: '' },
    },

    // إعدادات النسخ الاحتياطي
    backup: {
        autoBackup: { type: Boolean, default: true },
        frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
        lastBackup: { type: Date },
    },

    // كلمات المرور الافتراضية
    defaultPasswords: {
        admin: { type: String, default: 'admin111' },
        men: { type: String, default: 'm000' },
        women: { type: String, default: 'w111' },
        mix: { type: String, default: 'mix111' },
        recoveryPhone: { type: String },
    },

}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
