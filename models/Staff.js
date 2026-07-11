import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: {
    type: String,
    enum: ['admin', 'trainer', 'receptionist', 'accountant', 'data_entry', 'marketing', 'sales'],
    required: true
  },
  password: { type: String, required: true },
  salary: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  specialization: { type: String },
  experience: { type: Number },
  photo: { type: String },
  active: { type: Boolean, default: true },
  hireDate: { type: Date, default: Date.now },
  permissions: {
    canAddSubscribers: { type: Boolean, default: false },
    canEditSubscribers: { type: Boolean, default: false },
    canDeleteSubscribers: { type: Boolean, default: false },
    canRenewSubscribers: { type: Boolean, default: false },
    canFreezeSubscribers: { type: Boolean, default: false },
    canCheckInSubscribers: { type: Boolean, default: false },
    canViewDashboard: { type: Boolean, default: true },
    canViewReports: { type: Boolean, default: false },
    canManageFinances: { type: Boolean, default: false },
    canManageStaff: { type: Boolean, default: false },
    canManageEquipment: { type: Boolean, default: false },
    canManageLoyalty: { type: Boolean, default: false },
    canManageGoods: { type: Boolean, default: false },
    canViewSalaries: { type: Boolean, default: false },
  },
  gender: { type: String, enum: ['male', 'female'], required: true },
  systemType: { type: String, enum: ['mix', 'separate', 'men', 'women'], default: 'separate' },
  resetOTP: { type: String },
  resetOTPExpires: { type: Date },
}, { timestamps: true });

if (mongoose.models.Staff) delete mongoose.models.Staff;
export default mongoose.model('Staff', StaffSchema);
