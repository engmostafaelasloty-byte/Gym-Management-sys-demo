import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    action: {
        type: String,
        enum: ['create', 'update', 'delete', 'login', 'logout', 'export', 'import'],
        required: true
    },
    entity: {
        type: String,
        enum: ['subscriber', 'staff', 'class', 'payment', 'expense', 'goods', 'equipment', 'settings'],
        required: true
    },
    entityId: { type: String },
    changes: { type: mongoose.Schema.Types.Mixed }, // التغييرات التي تمت
    ipAddress: { type: String },
    userAgent: { type: String },
    description: { type: String },
}, { timestamps: true });

// إنشاء index للبحث السريع
AuditLogSchema.index({ user: 1, createdAt: -1 });
AuditLogSchema.index({ entity: 1, entityId: 1 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
