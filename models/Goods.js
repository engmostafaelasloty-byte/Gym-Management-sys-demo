import mongoose from 'mongoose';

const GoodsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    salePrice: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 },
    minStock: { type: Number, default: 5 },
    barcode: { type: String },
    date: { type: Date, default: Date.now },
    note: { type: String },
    gender: { type: String, enum: ['male', 'female', 'general', 'mix'], default: 'general', required: false },
    systemType: { type: String, enum: ['mix', 'separate'], default: 'separate', index: true },
}, { timestamps: true });

GoodsSchema.index({ barcode: 1 });
GoodsSchema.index({ title: 'text' });

if (mongoose.models.Goods) delete mongoose.models.Goods;
export default mongoose.model('Goods', GoodsSchema);
