import mongoose from 'mongoose';

const MaintenanceSchema = new mongoose.Schema({
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    type: {
        type: String,
        enum: ['routine', 'repair', 'inspection', 'replacement'],
        required: true
    },
    description: { type: String, required: true },
    cost: { type: Number, default: 0 },
    performedBy: { type: String }, // اسم الفني أو الشركة
    performedDate: { type: Date, default: Date.now },
    nextScheduled: { type: Date },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
        default: 'completed'
    },
    notes: { type: String },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }, // من سجل الصيانة
}, { timestamps: true });

export default mongoose.models.Maintenance || mongoose.model('Maintenance', MaintenanceSchema);
