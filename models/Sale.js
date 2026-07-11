import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
    good: { type: mongoose.Schema.Types.ObjectId, ref: 'Goods', required: true },
    title: { type: String, required: true },
    salePrice: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    qty: { type: Number, default: 1 },
    gender: { type: String, enum: ['male', 'female', 'mix', 'admin'], required: true },
    barcode: { type: String },
    date: { type: Date, default: Date.now },
    systemType: { type: String, enum: ['mix', 'separate'], default: 'separate' },
}, { timestamps: true });

if (mongoose.models.Sale) {
    delete mongoose.models.Sale;
}
export default mongoose.model('Sale', SaleSchema);
