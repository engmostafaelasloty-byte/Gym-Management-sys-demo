import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String },
    gender: { type: String, enum: ['male', 'female', 'mix', 'general'], default: 'general' },
    category: {
        type: String,
        enum: ['salary', 'electricity', 'water', 'rent', 'maintenance', 'new_equipment', 'equipment_exchange', 'cleaning', 'marketing', 'insurance', 'taxes', 'supplies', 'returns', 'other'],
        default: 'other'
    },
    period: {
        type: String,
        enum: ['men', 'women', 'mix', 'general'],
        default: 'general'
    },
    isRecurring: { type: Boolean, default: false },
    systemType: { type: String, enum: ['mix', 'separate'], default: 'separate' },
}, { timestamps: true });

// Delete cached model to pick up schema changes during hot-reload
if (mongoose.models.Expense) {
    delete mongoose.models.Expense;
}

export default mongoose.model('Expense', ExpenseSchema);
