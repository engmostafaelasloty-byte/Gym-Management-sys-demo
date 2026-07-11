import mongoose from 'mongoose';

const EquipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nameAr: { type: String, required: true },
    category: {
        type: String,
        enum: ['cardio', 'strength', 'free_weights', 'functional', 'other'],
        required: true
    },
    brand: { type: String },
    model: { type: String },
    serialNumber: { type: String, unique: true, sparse: true },
    purchaseDate: { type: Date },
    purchasePrice: { type: Number },
    condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor', 'broken'],
        default: 'good'
    },
    maintenanceSchedule: {
        type: String,
        enum: ['weekly', 'monthly', 'quarterly', 'annually'],
        default: 'monthly'
    },
    lastMaintenance: { type: Date },
    nextMaintenance: { type: Date },
    location: { type: String },
    notes: { type: String },
    active: { type: Boolean, default: true },
    systemType: { type: String, enum: ['mix', 'separate'], default: 'separate' },
}, { timestamps: true });

if (mongoose.models.Equipment) delete mongoose.models.Equipment;
export default mongoose.model('Equipment', EquipmentSchema);
