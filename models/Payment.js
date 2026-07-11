import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    subscriber: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber', required: true },
    amount: { type: Number, required: true },
    method: {
        type: String,
        enum: ['cash', 'card', 'bank_transfer', 'online', 'installment'],
        default: 'cash'
    },
    type: {
        type: String,
        enum: ['subscription', 'class', 'product', 'penalty', 'other'],
        default: 'subscription'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'completed'
    },
    reference: { type: String }, // رقم مرجعي للدفعة
    notes: { type: String },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }, // من استلم الدفعة
    receiptNumber: { type: String, unique: true }, // رقم الإيصال
    dueDate: { type: Date }, // للأقساط
    installmentNumber: { type: Number },
    totalInstallments: { type: Number },
    systemType: { type: String, enum: ['mix', 'separate'], default: 'separate', index: true },
}, { timestamps: true });

PaymentSchema.index({ subscriber: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ dueDate: 1 });

// توليد رقم إيصال تلقائي
PaymentSchema.pre('save', async function (next) {
    if (!this.receiptNumber) {
        const count = await mongoose.models.Payment.countDocuments();
        this.receiptNumber = `REC-${Date.now()}-${count + 1}`;
    }
    next();
});

if (mongoose.models.Payment) delete mongoose.models.Payment;
export default mongoose.model('Payment', PaymentSchema);
