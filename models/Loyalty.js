import mongoose from 'mongoose';

const LoyaltySchema = new mongoose.Schema({
    subscriber: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber', required: true, unique: true },
    points: { type: Number, default: 0 },
    tier: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum'],
        default: 'bronze'
    },
    totalEarned: { type: Number, default: 0 }, // إجمالي النقاط المكتسبة
    totalRedeemed: { type: Number, default: 0 }, // إجمالي النقاط المستبدلة
    referrals: { type: Number, default: 0 }, // عدد الإحالات
    history: [{
        type: { type: String, enum: ['earned', 'redeemed', 'expired'] },
        points: { type: Number },
        reason: { type: String },
        date: { type: Date, default: Date.now },
    }],
}, { timestamps: true });

// حساب المستوى بناءً على النقاط
LoyaltySchema.methods.updateTier = function () {
    if (this.totalEarned >= 1000) this.tier = 'platinum';
    else if (this.totalEarned >= 500) this.tier = 'gold';
    else if (this.totalEarned >= 100) this.tier = 'silver';
    else this.tier = 'bronze';
};

export default mongoose.models.Loyalty || mongoose.model('Loyalty', LoyaltySchema);
