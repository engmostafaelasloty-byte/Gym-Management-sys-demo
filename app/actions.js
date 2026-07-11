'use server';

import dbConnect from '../lib/mongodb';
import nodemailer from 'nodemailer';
import Subscriber from '../models/Subscriber';
import Goods from '../models/Goods';
import Expense from '../models/Expense';
import Staff from '../models/Staff';
import Class from '../models/Class';
import Booking from '../models/Booking';
import Attendance from '../models/Attendance';
import Payment from '../models/Payment';
import Measurement from '../models/Measurement';
import Equipment from '../models/Equipment';
import Maintenance from '../models/Maintenance';
import Loyalty from '../models/Loyalty';
import Notification from '../models/Notification';
import AuditLog from '../models/AuditLog';
import Discount from '../models/Discount';
import Settings from '../models/Settings';
import Sale from '../models/Sale';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

function blockDemoAction() {
    throw new Error('هذه الميزة معطلة في النسخة التجريبية (الديمو)، اشترِ النسخة الأصلية للتمتع بجميع مميزات النظام! / This feature is disabled in the demo version. Purchase the original version to enjoy all the system features!');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function serializeDoc(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return JSON.parse(JSON.stringify(obj));
}

function serializeDocs(docs) {
    return docs.map(serializeDoc);
}

// Helper to log user actions to AuditLog
export async function logAudit(performerId, action, entity, entityId, description, changes = null) {
    try {
        await dbConnect();
        let userId = null;
        if (performerId) {
            if (typeof performerId === 'string' && performerId.length === 24) {
                userId = performerId;
            } else if (performerId._id) {
                userId = performerId._id.toString();
            }
        }
        await AuditLog.create({
            user: userId,
            action,
            entity,
            entityId: entityId ? entityId.toString() : null,
            description,
            changes
        });
    } catch (err) {
        console.error('Failed to log audit action:', err);
    }
}

// Fetch audit logs for dashboard view
export async function getAuditLogs(filters = {}) {
    await dbConnect();
    const query = {};
    if (filters.userId) query.user = filters.userId;
    if (filters.action) query.action = filters.action;
    if (filters.entity) query.entity = filters.entity;
    if (filters.startDate && filters.endDate) {
        query.createdAt = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate)
        };
    }

    const logs = await AuditLog.find(query)
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .limit(200)
        .lean();
    return serializeDocs(logs);
}

// Calculate performance stats for each staff member
export async function getStaffPerformanceStats() {
    await dbConnect();
    const allStaff = await Staff.find({}).sort({ role: 1, name: 1 }).lean();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = await Promise.all(allStaff.map(async (s) => {
        const staffIdStr = s._id.toString();

        const [totalActions, subLogs, expenseLogs, payments, goodsSoldLogs] = await Promise.all([
            AuditLog.countDocuments({ user: s._id }),
            AuditLog.find({ user: s._id, action: 'create', entity: 'subscriber' }).select('entityId').lean(),
            AuditLog.find({ user: s._id, action: 'create', entity: 'expense' }).select('entityId').lean(),
            Payment.find({ staff: s._id, status: 'completed' }).select('amount createdAt').lean(),
            AuditLog.find({ user: s._id, action: 'update', entity: 'goods', description: { $regex: /(بيع منتج|sell goods)/i } }).select('entityId description createdAt').lean(),
        ]);

        // 1. Filter out deleted subscribers
        const subIds = subLogs.map(l => l.entityId).filter(Boolean);
        const activeSubs = await Subscriber.find({ _id: { $in: subIds } }).select('createdAt').lean();

        const subsAdded = activeSubs.length;
        const subsAddedThisMonth = activeSubs.filter(sub => sub.createdAt >= startOfMonth).length;

        // 2. Filter out deleted expenses and sum amounts
        const expenseIds = expenseLogs.map(l => l.entityId).filter(Boolean);
        const activeExpenses = await Expense.find({ _id: { $in: expenseIds } }).select('amount createdAt').lean();

        const expensesAdded = activeExpenses.length;
        const totalExpensesAmount = activeExpenses.reduce((sum, e) => sum + e.amount, 0);
        const totalExpensesAmountThisMonth = activeExpenses.filter(e => e.createdAt >= startOfMonth).reduce((sum, e) => sum + e.amount, 0);

        // 3. Payments
        const totalPaymentsAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        const paymentsCount = payments.length;

        const paymentsThisMonth = payments.filter(p => p.createdAt >= startOfMonth);
        const totalPaymentsAmountThisMonth = paymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);
        const paymentsCountThisMonth = paymentsThisMonth.length;

        // 4. Products sold and profit from AuditLogs
        const goodsSold = goodsSoldLogs.length;
        const goodIds = goodsSoldLogs.map(l => l.entityId).filter(Boolean);

        const goodsMap = {};
        const goodsList = await Goods.find({ _id: { $in: goodIds } }).select('salePrice costPrice').lean();
        goodsList.forEach(g => {
            goodsMap[g._id.toString()] = (g.salePrice || 0) - (g.costPrice || 0);
        });

        const getQtyFromDesc = (desc) => {
            const match = desc.match(/(?:الكمية|Qty):\s*(\d+)/i);
            return match ? parseInt(match[1]) : 1;
        };

        const totalGoodsProfit = goodsSoldLogs.reduce((sum, log) => {
            const profitPerItem = goodsMap[log.entityId?.toString()] || 0;
            const qty = getQtyFromDesc(log.description);
            return sum + (profitPerItem * qty);
        }, 0);

        const goodsSoldLogsThisMonth = goodsSoldLogs.filter(log => log.createdAt >= startOfMonth);
        const totalGoodsProfitThisMonth = goodsSoldLogsThisMonth.reduce((sum, log) => {
            const profitPerItem = goodsMap[log.entityId?.toString()] || 0;
            const qty = getQtyFromDesc(log.description);
            return sum + (profitPerItem * qty);
        }, 0);

        const lastLog = await AuditLog.findOne({ user: s._id }).sort({ createdAt: -1 }).select('createdAt description').lean();

        return {
            staff: serializeDoc(s),
            totalActions,
            subsAdded,
            subsAddedThisMonth,
            expensesAdded,
            totalExpensesAmount,
            totalExpensesAmountThisMonth,
            paymentsCount,
            paymentsCountThisMonth,
            totalPaymentsAmount,
            totalPaymentsAmountThisMonth,
            goodsSold,
            totalGoodsProfit,
            totalGoodsProfitThisMonth,
            netStaffProfit: totalPaymentsAmount + totalGoodsProfit - totalExpensesAmount,
            netStaffProfitThisMonth: totalPaymentsAmountThisMonth + totalGoodsProfitThisMonth - totalExpensesAmountThisMonth,
            lastActive: lastLog ? lastLog.createdAt : null,
            lastAction: lastLog ? lastLog.description : null,
        };
    }));

    return stats;
}


// ============================================
// SUBSCRIBER ACTIONS
// ============================================

export async function getSubscribers(filter = {}, systemType = 'separate', gender = null) {
    await dbConnect();
    await checkAndAutoUnfreezeSubscribers();
    const genderFilter = gender ? { gender } : {};
    const query = { ...filter, systemType, ...genderFilter };
    const subs = await Subscriber.find(query).sort({ createdAt: -1 }).lean();
    return serializeDocs(subs);
}

export async function getSubscriberById(id) {
    await dbConnect();
    const sub = await Subscriber.findById(id).lean();
    return serializeDoc(sub);
}

export async function addSubscriber(formData, performerId) {
    await dbConnect();
    const count = await Subscriber.countDocuments();
    if (count >= 3) {
        throw new Error('حد الديمو المسموح به: 3 مشتركين كحد أقصى. اشترِ النسخة الأصلية للتمتع بميزات غير محدودة! / Demo Limit Reached: Maximum 3 subscribers. Purchase the original version for unlimited access!');
    }
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        months: parseFloat(formData.get('months')),
        count: parseInt(formData.get('count') || '1'),
        gender: formData.get('gender'),
        dateOfBirth: formData.get('dateOfBirth') ? new Date(formData.get('dateOfBirth')) : null,
        goal: formData.get('goal') || 'fitness',
        notes: formData.get('notes'),
        planType: formData.get('planType') || 'time',
        totalSessions: parseInt(formData.get('sessions') || '0'),
        remainingSessions: parseInt(formData.get('sessions') || '0'),
    };

    const startDateVal = formData.get('startDate');
    const startDate = startDateVal ? new Date(startDateVal) : new Date();

    // Calculate End Date
    let endDate = new Date(startDate);
    if (data.months === 0) { // Daily
        endDate.setHours(23, 59, 59, 999);
    } else if (data.months === 0.25) { // Weekly
        endDate.setDate(startDate.getDate() + 7);
    } else if (data.months === 0.5) { // Half Month
        endDate.setDate(startDate.getDate() + 15);
    } else {
        endDate.setMonth(startDate.getMonth() + data.months);
    }

    data.startDate = startDate;
    data.endDate = endDate;
    data.systemType = formData.get('systemType') || 'separate';

    const subscriber = await Subscriber.create(data);

    // إنشاء سجل نقاط للمشترك الجديد
    await Loyalty.create({ subscriber: subscriber._id });

    // إضافة نقاط ترحيبية
    await addLoyaltyPoints(subscriber._id.toString(), 50, 'welcome_bonus');

    // إنشاء سجل الدفعة المالية تلقائياً لتظهر في إحصائيات الموظف والمدفوعات
    const paymentStatus = formData.get('paymentStatus') || 'completed';
    const installmentsCount = parseInt(formData.get('installmentsCount') || '1');

    if (data.price > 0) {
        if (paymentStatus === 'completed') {
            await Payment.create({
                subscriber: subscriber._id,
                amount: data.price,
                method: 'cash',
                type: 'subscription',
                status: 'completed',
                staff: performerId || null,
                systemType: data.systemType || 'separate',
            });
            subscriber.stats.totalPaid = data.price;
            await subscriber.save();
        } else if (paymentStatus === 'pending') {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7); // Default due in 7 days
            await Payment.create({
                subscriber: subscriber._id,
                amount: data.price,
                method: 'cash',
                type: 'subscription',
                status: 'pending',
                dueDate,
                staff: performerId || null,
                systemType: data.systemType || 'separate',
            });
        } else if (paymentStatus === 'installments' && installmentsCount > 1) {
            const installmentAmount = data.price / installmentsCount;
            for (let i = 0; i < installmentsCount; i++) {
                const dueDate = new Date(startDate);
                dueDate.setMonth(dueDate.getMonth() + i);
                await Payment.create({
                    subscriber: subscriber._id,
                    amount: installmentAmount,
                    method: 'installment',
                    type: 'subscription',
                    status: i === 0 ? 'completed' : 'pending',
                    dueDate,
                    installmentNumber: i + 1,
                    totalInstallments: installmentsCount,
                    staff: i === 0 ? (performerId || null) : null,
                    systemType: data.systemType || 'separate',
                });
            }
            subscriber.stats.totalPaid = installmentAmount;
            await subscriber.save();
        }
    }

    await logAudit(performerId, 'create', 'subscriber', subscriber._id, `إضافة مشترك جديد: ${subscriber.name}`);

    revalidatePath('/');
    return serializeDoc(subscriber);
}

export async function updateSubscriber(id, formData, performerId) {
    await dbConnect();
    const subscriber = await Subscriber.findById(id);
    if (!subscriber) throw new Error('Subscriber not found');

    const newPrice = parseFloat(formData.get('price'));
    const oldPrice = subscriber.price || 0;
    const diff = newPrice - oldPrice;

    subscriber.name = formData.get('name');
    subscriber.email = formData.get('email');
    subscriber.phone = formData.get('phone');
    subscriber.category = formData.get('category');
    subscriber.price = newPrice;
    subscriber.months = parseFloat(formData.get('months'));
    subscriber.gender = formData.get('gender');
    subscriber.goal = formData.get('goal');
    subscriber.notes = formData.get('notes');

    const startDateVal = formData.get('startDate');
    if (startDateVal) {
        const startDate = new Date(startDateVal);
        let endDate = new Date(startDate);

        if (subscriber.months === 0) {
            endDate.setHours(23, 59, 59, 999);
        } else if (subscriber.months === 0.25) {
            endDate.setDate(startDate.getDate() + 7);
        } else if (subscriber.months === 0.5) {
            endDate.setDate(startDate.getDate() + 15);
        } else {
            endDate.setMonth(startDate.getMonth() + subscriber.months);
        }

        subscriber.startDate = startDate;
        subscriber.endDate = endDate;
    }

    if (diff !== 0) {
        // Find the latest subscription payment for this subscriber
        const latestPayment = await Payment.findOne({
            subscriber: id,
            type: 'subscription'
        }).sort({ createdAt: -1 });

        if (latestPayment) {
            latestPayment.amount = newPrice;
            await latestPayment.save();

            // If it is completed, update the totalPaid stat
            if (latestPayment.status === 'completed') {
                subscriber.stats.totalPaid = (subscriber.stats.totalPaid || 0) + diff;
            }
        }
    }

    await subscriber.save();
    await logAudit(performerId, 'update', 'subscriber', id, `تعديل بيانات المشترك: ${subscriber.name}`);
    revalidatePath('/');
}

export async function deleteSubscriber(id, performerId) {
    await dbConnect();
    const sub = await Subscriber.findById(id);
    const subName = sub ? sub.name : id;
    await Subscriber.findByIdAndDelete(id);
    // حذف السجلات المرتبطة
    await Loyalty.deleteOne({ subscriber: id });
    await Attendance.deleteMany({ subscriber: id });
    await Payment.deleteMany({ subscriber: id });
    await Measurement.deleteMany({ subscriber: id });
    await logAudit(performerId, 'delete', 'subscriber', id, `حذف المشترك: ${subName}`);
    revalidatePath('/');
}
export async function renewSubscriber(id, durationMonths, sessions = 0, isExtension = false, customPrice = 0, performerId) {
    blockDemoAction();
    await dbConnect();
    const subscriber = await Subscriber.findById(id);
    if (!subscriber) throw new Error('Subscriber not found');

    const months = parseFloat(durationMonths);
    const price = parseFloat(customPrice || 0);

    if (isExtension) {
        // --- EXTENSION ---
        // Start calculation from the current endDate if it is in the future, otherwise from now
        let baseDate = new Date(subscriber.endDate);
        if (baseDate < new Date()) {
            baseDate = new Date();
        }

        let newEndDate = new Date(baseDate);
        if (months === 0) {
            newEndDate.setHours(23, 59, 59, 999);
        } else if (months === 0.25) {
            newEndDate.setDate(baseDate.getDate() + 7);
        } else if (months === 0.5) {
            newEndDate.setDate(baseDate.getDate() + 15);
        } else {
            newEndDate.setMonth(baseDate.getMonth() + Math.floor(months));
            if (months % 1 !== 0) {
                newEndDate.setDate(newEndDate.getDate() + Math.round((months % 1) * 30));
            }
        }

        // Add additional price to the current price
        subscriber.price = (subscriber.price || 0) + price;
        // Add additional months to current months
        subscriber.months = (subscriber.months || 0) + months;
        // Set new end date
        subscriber.endDate = newEndDate;

        if (sessions > 0) {
            subscriber.totalSessions = (subscriber.totalSessions || 0) + sessions;
            subscriber.remainingSessions = (subscriber.remainingSessions || 0) + sessions;
        }

        subscriber.stats.totalRenewals += 1;

        // Create payment record for the extension amount
        if (price > 0) {
            await Payment.create({
                subscriber: subscriber._id,
                amount: price,
                method: 'cash',
                type: 'subscription',
                status: 'completed',
                staff: performerId || null,
                systemType: subscriber.systemType || 'separate',
            });
            subscriber.stats.totalPaid = (subscriber.stats.totalPaid || 0) + price;
        }

        await subscriber.save();
        await addLoyaltyPoints(id, 20, 'extension');
        await logAudit(performerId, 'update', 'subscriber', id, `تمديد اشتراك المشترك: ${subscriber.name} بمبلغ إضافي ${price} ولمدة إضافية ${durationMonths} شهر`);
    } else {
        // --- RENEWAL (New Cycle) ---
        // Archive the old cycle to subscriptionHistory
        subscriber.subscriptionHistory.push({
            startDate: subscriber.startDate,
            endDate: subscriber.endDate,
            months: subscriber.months,
            price: subscriber.price,
        });

        let startDate = new Date();
        let endDate = new Date(startDate);

        if (months === 0) {
            endDate.setHours(23, 59, 59, 999);
        } else if (months === 0.25) {
            endDate.setDate(startDate.getDate() + 7);
        } else if (months === 0.5) {
            endDate.setDate(startDate.getDate() + 15);
        } else {
            endDate.setMonth(startDate.getMonth() + Math.floor(months));
            if (months % 1 !== 0) {
                endDate.setDate(endDate.getDate() + Math.round((months % 1) * 30));
            }
        }

        subscriber.startDate = startDate;
        subscriber.endDate = endDate;
        subscriber.months = months;
        subscriber.price = price; // Reset active price to the new cycle price

        if (sessions > 0) {
            subscriber.totalSessions = sessions;
            subscriber.remainingSessions = sessions;
            subscriber.planType = 'sessions';
        } else {
            subscriber.planType = 'time';
        }

        subscriber.stats.totalRenewals += 1;

        // Create payment record for the new renewal price
        if (price > 0) {
            await Payment.create({
                subscriber: subscriber._id,
                amount: price,
                method: 'cash',
                type: 'subscription',
                status: 'completed',
                staff: performerId || null,
                systemType: subscriber.systemType || 'separate',
            });
            subscriber.stats.totalPaid = (subscriber.stats.totalPaid || 0) + price;
        }

        await subscriber.save();
        await addLoyaltyPoints(id, 20, 'renewal');
        await logAudit(performerId, 'update', 'subscriber', id, `تجديد اشتراك المشترك: ${subscriber.name} بقيمة ${price} ولمدة ${durationMonths} شهر`);
    }
    revalidatePath('/');
}

// دالة الفحص التلقائي وإلغاء التجميد المنتهي
export async function checkAndAutoUnfreezeSubscribers() {
    const now = new Date();
    const frozenSubs = await Subscriber.find({ isFrozen: true });

    for (const sub of frozenSubs) {
        const lastFreeze = sub.freezeHistory[sub.freezeHistory.length - 1];
        if (lastFreeze && lastFreeze.endDate && now >= lastFreeze.endDate) {
            // تمديد تاريخ الانتهاء بمقدار المدة المخططة للتجميد كاملة
            const freezeDurationMs = lastFreeze.endDate.getTime() - lastFreeze.startDate.getTime();
            sub.endDate = new Date(sub.endDate.getTime() + freezeDurationMs);
            sub.isFrozen = false;

            await sub.save();
            await logAudit('system', 'update', 'subscriber', sub._id, `إلغاء تجميد تلقائي للمشترك: ${sub.name} بعد انتهاء فترة التجميد`);
        }
    }
}

// تعديلات التجميد (Freeze)
export async function freezeSubscriber(id, reason, days, performerId) {
    await dbConnect();
    const sub = await Subscriber.findById(id);
    if (!sub || sub.isFrozen) return;

    const freezeDays = parseInt(days) || 7;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + freezeDays * 24 * 60 * 60 * 1000);

    sub.isFrozen = true;
    sub.freezeHistory.push({
        startDate,
        endDate,
        reason
    });
    await sub.save();
    await logAudit(performerId, 'update', 'subscriber', id, `تجميد اشتراك المشترك: ${sub.name} لسبب: ${reason} لمدة ${freezeDays} أيام`);
    revalidatePath('/');
}

export async function unfreezeSubscriber(id, performerId) {
    await dbConnect();
    const sub = await Subscriber.findById(id);
    if (!sub || !sub.isFrozen) return;

    const lastFreeze = sub.freezeHistory[sub.freezeHistory.length - 1];
    if (lastFreeze) {
        const actualEndDate = new Date();
        // تمديد تاريخ الانتهاء بمقدار مدة التجميد الفعلية المنقضية
        const freezeDurationMs = actualEndDate - lastFreeze.startDate;

        lastFreeze.endDate = actualEndDate;
        sub.endDate = new Date(sub.endDate.getTime() + freezeDurationMs);
    }

    sub.isFrozen = false;
    await sub.save();
    await logAudit(performerId, 'update', 'subscriber', id, `إلغاء تجميد اشتراك المشترك: ${sub.name}`);
    revalidatePath('/');
}

// ============================================
// ATTENDANCE ACTIONS
// ============================================

export async function checkIn(subscriberId, method = 'manual', performerId) {
    blockDemoAction();
    await dbConnect();
    const subscriber = await Subscriber.findById(subscriberId);
    if (!subscriber) throw new Error('Subscriber not found');

    if (subscriber.isFrozen) {
        throw new Error('Account is frozen');
    }

    // التحقق من صلاحية الاشتراك
    if (subscriber.planType === 'time') {
        if (subscriber.isExpired()) {
            throw new Error('Subscription expired');
        }
    } else {
        if (subscriber.remainingSessions <= 0) {
            throw new Error('No sessions left');
        }
        subscriber.remainingSessions -= 1;
    }

    const attendance = await Attendance.create({
        subscriber: subscriberId,
        checkIn: new Date(),
        method,
        systemType: subscriber.systemType,
    });

    // تحديث إحصائيات المشترك
    subscriber.stats.totalVisits += 1;
    subscriber.stats.lastVisit = new Date();
    await subscriber.save();

    // إضافة نقاط للزيارة
    await addLoyaltyPoints(subscriberId, 10, 'visit');

    await logAudit(performerId, 'create', 'subscriber', subscriberId, `تسجيل دخول (حضور) للمشترك: ${subscriber.name}`);

    revalidatePath('/');
    return serializeDoc(attendance);
}

export async function checkOut(attendanceId, performerId) {
    blockDemoAction();
    await dbConnect();
    const att = await Attendance.findById(attendanceId).populate('subscriber', 'name');
    await Attendance.findByIdAndUpdate(attendanceId, {
        checkOut: new Date()
    });
    const subName = att?.subscriber?.name || 'غير معروف';
    await logAudit(performerId, 'update', 'subscriber', att?.subscriber?._id, `تسجيل خروج (انصراف) للمشترك: ${subName}`);
    revalidatePath('/');
}

export async function getAttendanceHistory(subscriberId, limit = 50) {
    await dbConnect();
    const history = await Attendance.find({ subscriber: subscriberId })
        .sort({ checkIn: -1 })
        .limit(limit)
        .lean();
    return serializeDocs(history);
}

export async function getTodayAttendance(systemType = 'separate') {
    await dbConnect();
    const today = new Date();
    today.setHours(0, 0, 0, 0);


    const attendance = await Attendance.find({
        checkIn: { $gte: today },
        systemType
    }).populate('subscriber', 'name gender').lean();

    return serializeDocs(attendance);
}

// ============================================
// LOYALTY POINTS ACTIONS
// ============================================

export async function addLoyaltyPoints(subscriberId, points, reason) {
    await dbConnect();
    let loyalty = await Loyalty.findOne({ subscriber: subscriberId });

    if (!loyalty) {
        loyalty = await Loyalty.create({ subscriber: subscriberId });
    }

    loyalty.points += points;
    loyalty.totalEarned += points;
    loyalty.history.push({ type: 'earned', points, reason });
    loyalty.updateTier();
    await loyalty.save();

    return serializeDoc(loyalty);
}

export async function redeemLoyaltyPoints(subscriberId, points) {
    blockDemoAction();
    await dbConnect();
    const loyalty = await Loyalty.findOne({ subscriber: subscriberId });

    if (!loyalty || loyalty.points < points) {
        throw new Error('Insufficient points');
    }

    loyalty.points -= points;
    loyalty.totalRedeemed += points;
    loyalty.history.push({ type: 'redeemed', points, reason: 'redemption' });
    await loyalty.save();

    return serializeDoc(loyalty);
}

export async function getLoyaltyInfo(subscriberId) {
    await dbConnect();
    const loyalty = await Loyalty.findOne({ subscriber: subscriberId }).lean();
    return serializeDoc(loyalty);
}

// ============================================
// GOODS ACTIONS (محدّثة)
// ============================================

export async function getGoods(systemType = 'separate') {
    await dbConnect();
    const goods = await Goods.find({ systemType }).sort({ createdAt: -1 }).lean();
    return goods.map(g => ({
        ...serializeDoc(g),
        profit: (g.salePrice - g.costPrice) * g.qty,
    }));
}

export async function addGoods(formData, performerId) {
    await dbConnect();
    const count = await Goods.countDocuments();
    if (count >= 3) {
        throw new Error('حد الديمو المسموح به: 3 بضائع كحد أقصى. اشترِ النسخة الأصلية للتمتع بميزات غير محدودة! / Demo Limit Reached: Maximum 3 items. Purchase the original version for unlimited access!');
    }
    const good = await Goods.create({
        title: formData.get('title'),
        salePrice: parseFloat(formData.get('salePrice')),
        costPrice: parseFloat(formData.get('costPrice')),
        qty: parseInt(formData.get('qty')),
        minStock: parseInt(formData.get('minStock') || '5'),
        barcode: formData.get('barcode'),
        gender: formData.get('gender') || 'general',
        note: formData.get('note'),
        date: new Date(),
        systemType: formData.get('systemType') || 'separate',
    });
    await logAudit(performerId, 'create', 'goods', good._id, `إضافة منتج جديد: ${good.title}`);
    revalidatePath('/');
}

export async function updateGoods(id, formData, performerId) {
    await dbConnect();
    await Goods.findByIdAndUpdate(id, {
        title: formData.get('title'),
        salePrice: parseFloat(formData.get('salePrice')),
        costPrice: parseFloat(formData.get('costPrice')),
        qty: parseInt(formData.get('qty')),
        minStock: parseInt(formData.get('minStock') || '5'),
        barcode: formData.get('barcode'),
        gender: formData.get('gender') || 'general',
        note: formData.get('note'),
    });
    await logAudit(performerId, 'update', 'goods', id, `تعديل منتج: ${formData.get('title')}`);
    revalidatePath('/');
}

export async function deleteGoods(id, performerId) {
    await dbConnect();
    const good = await Goods.findById(id);
    const goodTitle = good ? good.title : id;
    await Goods.findByIdAndDelete(id);
    await logAudit(performerId, 'delete', 'goods', id, `حذف منتج: ${goodTitle}`);
    revalidatePath('/');
}


export async function sellGoodsByBarcode(barcode, gender, quantity = 1, systemType = 'separate', performerId) {
    await dbConnect();
    const good = await Goods.findOne({ barcode });
    if (!good) throw new Error('Product not found');
    if (good.qty < quantity) throw new Error('Insufficient stock');

    good.qty -= quantity;
    await good.save();

    // توحيد مسمى النوع/الوضع قبل التخزين ليتوافق مع الـ Enum
    let saleGender = 'mix';
    if (gender === 'men' || gender === 'male') saleGender = 'male';
    else if (gender === 'women' || gender === 'female') saleGender = 'female';
    else if (gender === 'admin') saleGender = 'admin';

    // سجل العملية في جدول المبيعات
    const sale = await Sale.create({
        good: good._id,
        title: good.title,
        salePrice: good.salePrice,
        costPrice: good.costPrice,
        qty: quantity,
        gender: saleGender,
        barcode: barcode,
        date: new Date(),
        systemType
    });

    await logAudit(performerId, 'update', 'goods', good._id, `بيع منتج بالباركود: ${good.title} (الكمية: ${quantity})`);

    revalidatePath('/');
    return serializeDoc(good);
}

export async function sellGoodsById(id, gender, quantity = 1, systemType = 'separate', performerId) {
    await dbConnect();
    const good = await Goods.findById(id);
    if (!good) throw new Error('Product not found');
    if (good.qty < quantity) throw new Error('Insufficient stock');

    good.qty -= quantity;
    await good.save();

    let saleGender = 'mix';
    if (gender === 'men' || gender === 'male') saleGender = 'male';
    else if (gender === 'women' || gender === 'female') saleGender = 'female';
    else if (gender === 'admin') saleGender = 'admin';

    const sale = await Sale.create({
        good: good._id,
        title: good.title,
        salePrice: good.salePrice,
        costPrice: good.costPrice,
        qty: quantity,
        gender: saleGender,
        barcode: good.barcode,
        date: new Date(),
        systemType
    });

    await logAudit(performerId, 'update', 'goods', good._id, `بيع منتج: ${good.title} (الكمية: ${quantity})`);

    revalidatePath('/');
    return serializeDoc(good);
}

export async function getSalesByMonth(month, year, systemType = 'separate') {
    await dbConnect();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const sales = await Sale.find({
        date: { $gte: startDate, $lte: endDate },
        systemType
    })
        .sort({ date: -1 })
        .lean();
    return serializeDocs(sales);
}

export async function undoSale(saleId, performerId) {
    await dbConnect();

    const sale = await Sale.findById(saleId);
    if (!sale) throw new Error('Sale not found');

    // Restore the quantity to the product
    const good = await Goods.findById(sale.good);
    if (good) {
        good.qty += sale.qty;
        await good.save();
    }

    await logAudit(performerId, 'delete', 'goods', sale.good, `تراجع عن عملية بيع: ${sale.title} (الكمية: ${sale.qty})`);

    // Delete the sale record
    await Sale.findByIdAndDelete(saleId);

    revalidatePath('/');
    return { success: true };
}

// ============================================
// EXPENSE ACTIONS (محدّثة)
// ============================================

export async function getExpenses(systemType = 'separate', gender = null) {
    await dbConnect();
    // لو كان الجنس محدد، نجيب مصروفات الجنس المحدد + العامة (general)
    const query = gender
        ? { systemType, gender: { $in: [gender, 'general', 'mix'] } }
        : { systemType };
    const exps = await Expense.find(query).sort({ createdAt: -1 }).lean();
    return serializeDocs(exps);
}

export async function addExpense(formData, performerId) {
    await dbConnect();
    const count = await Expense.countDocuments();
    if (count >= 3) {
        throw new Error('حد الديمو المسموح به: 3 مصروفات كحد أقصى. اشترِ النسخة الأصلية للتمتع بميزات غير محدودة! / Demo Limit Reached: Maximum 3 expenses. Purchase the original version for unlimited access!');
    }
    const exp = await Expense.create({
        name: formData.get('name'),
        amount: parseFloat(formData.get('amount')),
        gender: formData.get('gender') || 'general',
        note: formData.get('note'),
        category: formData.get('category') || 'other',
        period: formData.get('period') || 'general',
        isRecurring: formData.get('isRecurring') === 'on',
        date: formData.get('date') ? new Date(formData.get('date')) : new Date(),
        systemType: formData.get('systemType') || 'separate'
    });
    await logAudit(performerId, 'create', 'expense', exp._id, `إضافة مصروف جديد: ${exp.name} بقيمة ${exp.amount}`);
    revalidatePath('/');
}

export async function updateExpense(id, formData, performerId) {
    await dbConnect();
    const updateData = {
        name: formData.get('name'),
        amount: parseFloat(formData.get('amount')),
        gender: formData.get('gender') || 'general',
        note: formData.get('note'),
        category: formData.get('category') || 'other',
        period: formData.get('period') || 'general',
        isRecurring: formData.get('isRecurring') === 'on',
    };
    if (formData.get('date')) {
        updateData.date = new Date(formData.get('date'));
    }
    try {
        await Expense.findByIdAndUpdate(id, updateData, { runValidators: false });
        await logAudit(performerId, 'update', 'expense', id, `تعديل المصروف: ${updateData.name}`);
    } catch (err) {
        console.error('Update expense error:', err);
        throw err;
    }
    revalidatePath('/');
}

export async function deleteExpense(id, performerId) {
    await dbConnect();
    const exp = await Expense.findById(id);
    const expName = exp ? exp.name : id;
    await Expense.findByIdAndDelete(id);
    await logAudit(performerId, 'delete', 'expense', id, `حذف المصروف: ${expName}`);
    revalidatePath('/');
}

// ============================================
// STATS ACTIONS (محدّثة ومتقدمة)
// ============================================

export async function getStats(systemType = 'separate', gender = null) {
    await dbConnect();
    await checkAndAutoUnfreezeSubscribers();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // فلتر الجنس — يُطبَّق فقط لأنظمة الرجال/النساء المنفصلة
    const genderFilter = gender ? { gender } : {};

    // فلتر الموظفين
    const staffFilter = { active: true };
    if (systemType === 'mix') {
        staffFilter.systemType = 'mix';
    } else if (systemType === 'separate') {
        staffFilter.systemType = { $in: ['separate', 'men', 'women'] };
    } else if (systemType && systemType !== 'all') {
        staffFilter.systemType = systemType;
    }
    if (gender) {
        staffFilter.gender = gender;
    }

    const [allSubs, sales, expenses, attendanceToday, activeStaff, completedPayments] = await Promise.all([
        Subscriber.find({ systemType, ...genderFilter }).select('price startDate endDate isFrozen').lean(),
        Sale.find({ date: { $gte: startOfMonth, $lte: endOfMonth }, systemType, ...genderFilter }).select('salePrice costPrice qty').lean(),
        Expense.find({ date: { $gte: startOfMonth, $lte: endOfMonth }, systemType, ...genderFilter }).select('amount').lean(),
        Attendance.countDocuments({ checkIn: { $gte: new Date().setHours(0, 0, 0, 0) }, systemType }),
        Staff.find(staffFilter).select('salary hireDate').lean(),
        Payment.find({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            status: 'completed',
            type: 'subscription',
            systemType
        }).populate('subscriber', 'gender').lean()
    ]);

    const totalSalaries = activeStaff.reduce((acc, curr) => {
        const hire = curr.hireDate ? new Date(curr.hireDate) : null;
        if (!hire || hire <= endOfMonth) {
            return acc + (curr.salary || 0);
        }
        return acc;
    }, 0);

    const filteredPayments = gender
        ? completedPayments.filter(p => p.subscriber && p.subscriber.gender === gender)
        : completedPayments;

    const subIncome = filteredPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const goodsProfit = sales.reduce((acc, curr) => acc + (((curr.salePrice || 0) - (curr.costPrice || 0)) * (curr.qty || 1)), 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const activeSubs = allSubs.filter(s => !s.isFrozen && new Date(s.endDate) > now).length;
    const expiredSubs = allSubs.filter(s => new Date(s.endDate) <= now).length;

    return {
        totalSubscribers: allSubs.length,
        activeSubscribers: activeSubs,
        expiredSubscribers: expiredSubs,
        todayAttendance: attendanceToday,
        monthlyRevenue: subIncome,
        monthlyExpenses: totalExpenses,
        totalSalaries: totalSalaries,
        goodsProfit: goodsProfit,
        netProfit: subIncome + goodsProfit - totalExpenses - totalSalaries,
        monthName: now.toLocaleString('default', { month: 'long' }),
    };
}

export async function getAdvancedStats(startDate, endDate) {
    await dbConnect();

    const start = new Date(startDate);
    const end = new Date(endDate);

    const [subscribers, payments, attendance, sales, expenses] = await Promise.all([
        Subscriber.find({ createdAt: { $gte: start, $lte: end } }),
        Payment.find({ createdAt: { $gte: start, $lte: end }, status: 'completed' }),
        Attendance.find({ checkIn: { $gte: start, $lte: end } }),
        Sale.find({ date: { $gte: start, $lte: end } }),
        Expense.find({ date: { $gte: start, $lte: end } }),
    ]);

    return {
        totalSubscribers: subscribers.length,
        newSubscribers: subscribers.filter(s => s.createdAt >= start).length,
        activeSubscribers: subscribers.filter(s => !s.isExpired()).length,
        totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
        totalAttendance: attendance.length,
        averageAttendancePerDay: attendance.length / Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
        goodsProfit: sales.reduce((sum, s) => sum + (((s.salePrice || 0) - (s.costPrice || 0)) * (s.qty || 1)), 0),
        totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    };
}

export async function getMonthlyComparison(year, systemType = null) {
    await dbConnect();

    // Query active staff salaries matching systemType
    const staffFilter = { active: true };
    if (systemType && systemType !== 'all') {
        staffFilter.systemType = systemType;
    }
    const activeStaff = await Staff.find(staffFilter).select('salary hireDate').lean();

    const months = [];
    const now = new Date();
    for (let month = 0; month < 12; month++) {
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);

        // إذا تم تحديد systemType، نفلتر عليه — وإلا نجيب الكل (للأدمن)
        const systemFilter = systemType ? { systemType } : {};

        const [payments, sales, expenses] = await Promise.all([
            Payment.find({ createdAt: { $gte: startOfMonth, $lte: endOfMonth }, status: 'completed', type: 'subscription', ...systemFilter }),
            Sale.find({ date: { $gte: startOfMonth, $lte: endOfMonth }, ...systemFilter }),
            Expense.find({ date: { $gte: startOfMonth, $lte: endOfMonth }, ...systemFilter }),
        ]);

        // Calculate salaries only if this month has started (i.e. startOfMonth <= now)
        let monthlySalaries = 0;
        if (startOfMonth <= now) {
            monthlySalaries = activeStaff.reduce((sum, s) => {
                const hire = s.hireDate ? new Date(s.hireDate) : null;
                if (!hire || hire <= endOfMonth) {
                    return sum + (s.salary || 0);
                }
                return sum;
            }, 0);
        }

        const income = payments.reduce((sum, p) => sum + p.amount, 0);
        const goodsProfit = sales.reduce((sum, s) => sum + (((s.salePrice || 0) - (s.costPrice || 0)) * (s.qty || 1)), 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

        months.push({
            month: startOfMonth.toLocaleString('default', { month: 'long' }),
            income,
            goodsProfit,
            expenses: totalExpenses,
            salaries: monthlySalaries,
            profit: income + goodsProfit - totalExpenses - monthlySalaries,
        });
    }

    return months;
}

// ============================================
// STAFF ACTIONS
// ============================================

export async function getStaff(systemType = 'separate') {
    await dbConnect();
    let query = { active: true };
    if (systemType === 'mix') {
        query = { active: true, $or: [{ role: 'admin' }, { systemType: 'mix' }] };
    } else if (systemType === 'separate') {
        query = { active: true, $or: [{ role: 'admin' }, { systemType: { $in: ['separate', 'men', 'women'] } }] };
    } else if (systemType !== 'all') {
        query = { active: true, $or: [{ role: 'admin' }, { systemType: systemType }] };
    }
    const staff = await Staff.find(query).sort({ role: 1, name: 1 }).lean();
    return serializeDocs(staff);
}

export async function addStaff(formData, performerId) {
    blockDemoAction();
    await dbConnect();
    const name = formData.get('name');
    const email = (formData.get('email') || '').trim().toLowerCase();
    const phone = formData.get('phone');
    const role = formData.get('role');
    const gender = formData.get('gender');
    const password = formData.get('password') || 'gms123';

    if (!name || !email || !role || !gender) {
        throw new Error('Name, Email, Role, and Gender are required / الاسم، البريد، الوظيفة، والجنس حقول مطلوبة');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format. / صيغة البريد الإلكتروني غير صالحة.');
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[1-9]).{6,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error('Password must contain at least one letter and a number from 1 to 9, and be at least 6 characters. / كلمة المرور يجب أن تحتوي على حرف ورقم (1-9) وتكون 6 رموز على الأقل.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
        name: name,
        email: email,
        phone: phone,
        role: role,
        salary: parseFloat(formData.get('salary') || '0'),
        commission: parseFloat(formData.get('commission') || '0'),
        gender: gender,
        password: hashedPassword,
        permissions: {
            canAddSubscribers: ['admin', 'data_entry', 'sales'].includes(formData.get('role')),
            canEditSubscribers: ['admin', 'data_entry'].includes(formData.get('role')),
            canDeleteSubscribers: ['admin'].includes(formData.get('role')),
            canViewReports: ['admin', 'accountant', 'marketing'].includes(formData.get('role')),
            canManageFinances: ['admin', 'accountant'].includes(formData.get('role')),
            canManageStaff: ['admin'].includes(formData.get('role')),
        },
        systemType: formData.get('systemType') || 'separate',
    });
    await logAudit(performerId, 'create', 'staff', staff._id, `إضافة موظف جديد: ${staff.name} بدور ${staff.role}`);
    revalidatePath('/');
    return serializeDoc(staff);
}

export async function updateStaff(id, data, performerId) {
    blockDemoAction();
    await dbConnect();
    if (data.email) {
        data.email = data.email.trim().toLowerCase();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(data.email)) {
            throw new Error('Invalid email format. / صيغة البريد الإلكتروني غير صالحة.');
        }
    }
    if (data.password) {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[1-9]).{6,}$/;
        if (!passwordRegex.test(data.password)) {
            throw new Error('Password must contain at least one letter and a number from 1 to 9, and be at least 6 characters. / كلمة المرور يجب أن تحتوي على حرف ورقم (1-9) وتكون 6 رموز على الأقل.');
        }
        data.password = await bcrypt.hash(data.password, 10);
    }
    const staff = await Staff.findByIdAndUpdate(id, data, { new: true });
    await logAudit(performerId, 'update', 'staff', id, `تعديل بيانات الموظف: ${staff ? staff.name : id}`);
    revalidatePath('/');
}

export async function deleteStaff(id, performerId) {
    blockDemoAction();
    await dbConnect();
    console.log('SERVER: Deleting staff with ID:', id);
    const staff = await Staff.findById(id);
    const staffName = staff ? staff.name : id;
    await Staff.findByIdAndDelete(id);
    await logAudit(performerId, 'delete', 'staff', id, `حذف الموظف: ${staffName}`);
    revalidatePath('/');
}

export async function deleteAuditLogs(logIds, performerId) {
    await dbConnect();
    console.log('SERVER: Deleting audit logs:', logIds);
    await AuditLog.deleteMany({ _id: { $in: logIds } });
    await logAudit(performerId, 'delete', 'audit_log', null, `حذف عدد ${logIds.length} من سجلات الأنشطة`);
    revalidatePath('/');
}

export async function loginStaff(email, password, loginSystemType = 'separate') {
    await dbConnect();
    const cleanEmail = email.trim().toLowerCase();

    // نجد الموظف أولاً بالبريد الإلكتروني فقط لنتعرف على صلاحياته ونوعه
    const staff = await Staff.findOne({ email: cleanEmail, active: true });

    if (!staff) {
        throw new Error('User not found');
    }

    // للمديرين: يمكنهم الدخول إلى أي نظام
    if (staff.role === 'admin') {
        // لا يوجد قياس على نوع النظام للمدير
    } else {
        // التحقق من صلاحية الوصول لنوع النظام للموظفين العاديين
        const sType = staff.systemType; // mix, men, women, separate

        const isAccessDenied = (
            (loginSystemType === 'mix' && sType !== 'mix' && sType !== 'separate') ||
            (loginSystemType === 'men' && sType !== 'men' && sType !== 'separate') ||
            (loginSystemType === 'women' && sType !== 'women' && sType !== 'separate') ||
            (loginSystemType === 'mix' && sType === 'separate')
        );

        if (isAccessDenied) {
            throw new Error('Access denied: ' + sType);
        }
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) throw new Error('Invalid credentials');

    await logAudit(staff._id, 'login', 'staff', staff._id, `تسجيل دخول للموظف: ${staff.name}`);

    return serializeDoc(staff);
}

export async function changeStaffPassword(staffId, currentPassword, newPassword, performerId) {
    blockDemoAction();
    await dbConnect();
    const staff = await Staff.findById(staffId);
    if (!staff) throw new Error('Staff not found');

    const performer = await Staff.findById(performerId);
    const isAdmin = performer && performer.role === 'admin';

    if (!isAdmin) {
        const isMatch = await bcrypt.compare(currentPassword, staff.password);
        if (!isMatch) throw new Error('Current password is incorrect');
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[1-9]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
        throw new Error('Password must contain at least one letter and a number from 1 to 9, and be at least 6 characters. / كلمة المرور يجب أن تحتوي على حرف ورقم (1-9) وتكون 6 رموز على الأقل.');
    }

    staff.password = await bcrypt.hash(newPassword, 10);
    await staff.save();
    await logAudit(performerId || staffId, 'update', 'staff', staffId, `تغيير كلمة مرور الموظف: ${staff.name}`);
    revalidatePath('/');
    return { success: true };
}

export async function updateStaffPermissions(id, permissions, performerId) {
    blockDemoAction();
    await dbConnect();
    const staff = await Staff.findByIdAndUpdate(id, { permissions });
    await logAudit(performerId, 'update', 'staff', id, `تعديل صلاحيات الموظف: ${staff ? staff.name : id}`);
    revalidatePath('/');
}

// ============================================
// CLASS ACTIONS
// ============================================

export async function getClasses(systemType = 'separate') {
    await dbConnect();
    const classes = await Class.find({ active: true, systemType })
        .populate('trainer', 'name photo')
        .lean();
    return serializeDocs(classes);
}

export async function addClass(formData, performerId) {
    blockDemoAction();
    await dbConnect();
    const classDoc = await Class.create({
        name: formData.get('name'),
        nameAr: formData.get('nameAr'),
        description: formData.get('description'),
        descriptionAr: formData.get('descriptionAr'),
        trainer: formData.get('trainer'),
        capacity: parseInt(formData.get('capacity') || '20'),
        duration: parseInt(formData.get('duration') || '60'),
        price: parseFloat(formData.get('price') || '0'),
        time: formData.get('time'),
        gender: formData.get('gender') || 'mixed',
        systemType: formData.get('systemType') || 'separate',
    });
    await logAudit(performerId, 'create', 'class', classDoc._id, `إضافة حصة تدريبية: ${classDoc.name}`);
    revalidatePath('/');
    return serializeDoc(classDoc);
}

export async function updateClass(id, data, performerId) {
    blockDemoAction();
    await dbConnect();
    await Class.findByIdAndUpdate(id, data);
    await logAudit(performerId, 'update', 'class', id, `تعديل الحصة التدريبية: ${data.name || id}`);
    revalidatePath('/');
}

export async function deleteClass(id, performerId) {
    blockDemoAction();
    await dbConnect();
    const classDoc = await Class.findById(id);
    const className = classDoc ? classDoc.name : id;
    await Class.findByIdAndDelete(id);
    await Booking.deleteMany({ class: id });
    await logAudit(performerId, 'delete', 'class', id, `حذف الحصة التدريبية: ${className}`);
    revalidatePath('/');
}

// ============================================
// BOOKING ACTIONS
// ============================================

export async function bookClass(subscriberId, classId, date) {
    blockDemoAction();
    await dbConnect();

    const classDoc = await Class.findById(classId);
    if (!classDoc) throw new Error('Class not found');

    // التحقق من السعة
    const existingBookings = await Booking.countDocuments({
        class: classId,
        date: new Date(date),
        status: 'confirmed'
    });

    if (existingBookings >= classDoc.capacity) {
        throw new Error('Class is full');
    }

    const booking = await Booking.create({
        subscriber: subscriberId,
        class: classId,
        date: new Date(date),
    });

    revalidatePath('/');
    return serializeDoc(booking);
}

export async function cancelBooking(bookingId) {
    blockDemoAction();
    await dbConnect();
    await Booking.findByIdAndUpdate(bookingId, { status: 'cancelled' });
    revalidatePath('/');
}

export async function getSubscriberBookings(subscriberId) {
    await dbConnect();
    const bookings = await Booking.find({ subscriber: subscriberId })
        .populate('class', 'name nameAr trainer schedule')
        .sort({ date: -1 })
        .lean();
    return serializeDocs(bookings);
}

// ============================================
// MEASUREMENT ACTIONS
// ============================================

export async function addMeasurement(data, performerId) {
    blockDemoAction();
    await dbConnect();
    const measurement = await Measurement.create(data);
    await logAudit(performerId, 'create', 'subscriber', data.subscriber, `إضافة قياسات جديدة للمشترك (وزن: ${data.weight || '-'}, دهون: ${data.bodyFat || '-'}%)`);
    revalidatePath('/');
    return serializeDoc(measurement);
}

export async function getSubscriberMeasurements(subscriberId) {
    await dbConnect();
    const measurements = await Measurement.find({ subscriber: subscriberId })
        .sort({ createdAt: -1 })
        .lean();
    return serializeDocs(measurements);
}

export async function updateMeasurement(id, data, performerId) {
    await dbConnect();
    const updated = await Measurement.findByIdAndUpdate(id, data, { new: true });
    await logAudit(performerId, 'update', 'subscriber', data.subscriber, `تعديل قياسات المشترك (وزن: ${data.weight || '-'})`);
    revalidatePath('/');
    return serializeDoc(updated);
}

export async function deleteMeasurement(id, performerId) {
    blockDemoAction();
    await dbConnect();
    const measurement = await Measurement.findById(id);
    const subId = measurement ? measurement.subscriber : null;
    await Measurement.findByIdAndDelete(id);
    await logAudit(performerId, 'delete', 'subscriber', subId, `حذف سجل قياسات المشترك ID: ${id}`);
    revalidatePath('/');
    return true;
}

// ============================================
// EQUIPMENT & MAINTENANCE ACTIONS
// ============================================

export async function getEquipment(systemType = 'separate') {
    await dbConnect();
    const equipment = await Equipment.find({ systemType }).lean();
    return serializeDocs(equipment);
}

export async function addEquipment(data, performerId) {
    blockDemoAction();
    await dbConnect();
    const equipment = await Equipment.create(data);
    await logAudit(performerId, 'create', 'equipment', equipment._id, `إضافة جهاز/معدة: ${equipment.name}`);
    revalidatePath('/');
    return serializeDoc(equipment);
}

export async function updateEquipment(id, data, performerId) {
    blockDemoAction();
    await dbConnect();
    await Equipment.findByIdAndUpdate(id, data);
    await logAudit(performerId, 'update', 'equipment', id, `تعديل بيانات الجهاز/المعدة: ${data.name}`);
    revalidatePath('/');
}

export async function deleteEquipment(id, performerId) {
    blockDemoAction();
    await dbConnect();
    const equipment = await Equipment.findById(id);
    const equipName = equipment ? equipment.name : id;
    await Equipment.findByIdAndDelete(id);
    await logAudit(performerId, 'delete', 'equipment', id, `حذف الجهاز/المعدة: ${equipName}`);
    revalidatePath('/');
}

export async function addMaintenance(data, performerId) {
    blockDemoAction();
    await dbConnect();
    const maintenance = await Maintenance.create(data);

    // تحديث تاريخ الصيانة القادمة للجهاز
    if (data.nextScheduled) {
        await Equipment.findByIdAndUpdate(data.equipment, {
            lastMaintenance: new Date(),
            nextMaintenance: new Date(data.nextScheduled)
        });
    }

    const equipment = await Equipment.findById(data.equipment);
    const equipName = equipment ? equipment.name : data.equipment;
    await logAudit(performerId, 'create', 'equipment', data.equipment, `تسجيل صيانة للجهاز: ${equipName} (التكلفة: ${data.cost || 0})`);

    revalidatePath('/');
    return serializeDoc(maintenance);
}

export async function getMaintenanceDue() {
    await dbConnect();
    const today = new Date();
    const equipment = await Equipment.find({
        nextMaintenance: { $lte: today },
        active: true
    }).lean();
    return serializeDocs(equipment);
}

// ============================================
// NOTIFICATION ACTIONS
// ============================================

export async function sendNotification(data) {
    await dbConnect();
    const notification = await Notification.create(data);

    // هنا يمكن إضافة منطق إرسال الإشعار الفعلي (SMS, Email, etc.)

    revalidatePath('/');
    return serializeDoc(notification);
}

export async function getSubscriberNotifications(subscriberId) {
    await dbConnect();
    const notifications = await Notification.find({ subscriber: subscriberId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
    return serializeDocs(notifications);
}

export async function markNotificationAsRead(notificationId) {
    await dbConnect();
    await Notification.findByIdAndUpdate(notificationId, {
        status: 'read',
        readAt: new Date()
    });
    revalidatePath('/');
}

// ============================================
// SETTINGS ACTIONS
// ============================================

export async function getSettings() {
    await dbConnect();
    let settings = await Settings.findOne().lean();

    if (!settings) {
        settings = await Settings.create({});
        await Settings.updateOne({ _id: settings._id }, {
            $set: {
                defaultPasswords: {
                    admin: 'admin111',
                    men: 'm000',
                    women: 'w111',
                    mix: 'mix111',
                    recoveryPhone: ''
                }
            }
        });
        settings = await Settings.findOne({ _id: settings._id }).lean();
    } else if (!settings.defaultPasswords || !settings.defaultPasswords.mix) {
        await Settings.updateOne({ _id: settings._id }, {
            $set: {
                'defaultPasswords.admin': settings.defaultPasswords?.admin || 'admin111',
                'defaultPasswords.men': settings.defaultPasswords?.men || 'm000',
                'defaultPasswords.women': settings.defaultPasswords?.women || 'w111',
                'defaultPasswords.mix': 'mix111',
                'defaultPasswords.recoveryPhone': settings.defaultPasswords?.recoveryPhone || ''
            }
        }, { upsert: true });
        settings = await Settings.findOne({ _id: settings._id }).lean();
    }

    return serializeDoc(settings);
}

export async function updateSettings(data, performerId) {
    blockDemoAction();
    await dbConnect();
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create(data);
    } else {
        Object.assign(settings, data);
        await settings.save();
    }

    await logAudit(performerId, 'update', 'settings', null, 'تحديث إعدادات النظام العامة');
    revalidatePath('/');
    return serializeDoc(settings);
}

export async function updatePasswords(passwords, performerId) {
    blockDemoAction();
    await dbConnect();
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[1-9]).{6,}$/;

    if (passwords.admin && !passwordRegex.test(passwords.admin)) {
        throw new Error('Admin password must contain at least one letter and numbers from 1 to 9, and be at least 6 characters. / كلمة مرور الأدمن يجب أن تحتوي على حرف ورقم (1-9) وتكون 6 رموز على الأقل.');
    }
    if (passwords.men && !passwordRegex.test(passwords.men)) {
        throw new Error('Men system password must contain at least one letter and numbers from 1 to 9, and be at least 6 characters. / كلمة مرور نظام الرجال يجب أن تحتوي على حرف ورقم (1-9) وتكون 6 رموز على الأقل.');
    }
    if (passwords.women && !passwordRegex.test(passwords.women)) {
        throw new Error('Women system password must contain at least one letter and numbers from 1 to 9, and be at least 6 characters. / كلمة مرور نظام السيدات يجب أن تحتوي على حرف ورقم (1-9) وتكون 6 رموز على الأقل.');
    }
    if (passwords.mix && !passwordRegex.test(passwords.mix)) {
        throw new Error('Mixed system password must contain at least one letter and numbers from 1 to 9, and be at least 6 characters. / كلمة مرور النظام المختلط يجب أن تحتوي على حرف ورقم (1-9) وتكون 6 رموز على الأقل.');
    }

    if (passwords.admin) settings.defaultPasswords.admin = passwords.admin;
    if (passwords.men) settings.defaultPasswords.men = passwords.men;
    if (passwords.women) settings.defaultPasswords.women = passwords.women;
    if (passwords.mix) settings.defaultPasswords.mix = passwords.mix;
    if (passwords.recoveryPhone) settings.defaultPasswords.recoveryPhone = passwords.recoveryPhone;

    await settings.save();
    await logAudit(performerId, 'update', 'settings', null, 'تحديث كلمات المرور الافتراضية للأنظمة');
    revalidatePath('/');
}

// ============================================
// BACKUP & RESTORE ACTIONS
// ============================================

export async function createBackup(performerId) {
    await dbConnect();

    const [subscribers, goods, expenses, payments, staff, classes, equipment] = await Promise.all([
        Subscriber.find({}).lean(),
        Goods.find({}).lean(),
        Expense.find({}).lean(),
        Payment.find({}).lean(),
        Staff.find({}).lean(),
        Class.find({}).lean(),
        Equipment.find({}).lean(),
    ]);

    const backup = {
        version: '2.0',
        timestamp: new Date().toISOString(),
        data: {
            subscribers: serializeDocs(subscribers),
            goods: serializeDocs(goods),
            expenses: serializeDocs(expenses),
            payments: serializeDocs(payments),
            staff: serializeDocs(staff),
            classes: serializeDocs(classes),
            equipment: serializeDocs(equipment),
        }
    };

    // تحديث آخر نسخة احتياطية في الإعدادات
    await Settings.findOneAndUpdate({}, { 'backup.lastBackup': new Date() });
    await logAudit(performerId, 'export', 'settings', null, 'تصدير نسخة احتياطية من البيانات');

    return backup;
}

export async function restoreBackup(backupData, performerId) {
    blockDemoAction();
    await dbConnect();

    try {
        const data = typeof backupData === 'string' ? JSON.parse(backupData) : backupData;

        // استعادة البيانات
        if (data.data.subscribers) {
            await Subscriber.insertMany(data.data.subscribers);
        }
        if (data.data.goods) {
            await Goods.insertMany(data.data.goods);
        }
        if (data.data.expenses) {
            await Expense.insertMany(data.data.expenses);
        }

        await logAudit(performerId, 'import', 'settings', null, 'استيراد واستعادة نسخة احتياطية من البيانات');
        revalidatePath('/');
        return { success: true, message: 'Backup restored successfully' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function clearAllData(performerId) {
    blockDemoAction();
    await dbConnect();

    await Promise.all([
        Subscriber.deleteMany({}),
        Goods.deleteMany({}),
        Expense.deleteMany({}),
        Payment.deleteMany({}),
        Attendance.deleteMany({}),
        Booking.deleteMany({}),
        Measurement.deleteMany({}),
        Loyalty.deleteMany({}),
        Notification.deleteMany({}),
        Sale.deleteMany({}),
        AuditLog.deleteMany({}),
        Class.deleteMany({}),
        Discount.deleteMany({}),
        Equipment.deleteMany({}),
        Maintenance.deleteMany({}),
        Settings.deleteMany({}),
        Staff.deleteMany({}),
    ]);

    // Seed default settings (do not seed admin account so onboarding triggers)
    await Settings.create({
        defaultPasswords: {
            admin: 'admin111',
            men: 'm000',
            women: 'w111',
            mix: 'mix111',
            recoveryPhone: ''
        }
    });

    await logAudit(performerId, 'delete', 'settings', null, 'مسح جميع البيانات وتهيئة النظام');
    revalidatePath('/');
    return { success: true };
}

export async function getLowStockGoods(systemType = 'separate') {
    await dbConnect();
    const goods = await Goods.find({
        systemType,
        $expr: { $lte: ["$qty", "$minStock"] }
    }).lean();
    return serializeDocs(goods);
}

export async function getDashboardAnalytics(systemType = null) {
    await dbConnect();

    // إذا تم تحديد systemType، نفلتر عليه — وإلا نجيب الكل (للأدمن)
    const systemFilter = systemType ? { systemType } : {};

    // 1. Churn Rate (مشتركين لم يحضروا منذ 30 يوم وانتهى اشتراكهم)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const churned = await Subscriber.find({
        endDate: { $lt: new Date() },
        'stats.lastVisit': { $lt: thirtyDaysAgo },
        ...systemFilter
    }).countDocuments();

    // 2. Peak Hours Analysis
    const attendance = await Attendance.find(systemFilter).lean();
    const hours = Array(24).fill(0);
    attendance.forEach(a => {
        const h = new Date(a.checkIn).getHours();
        hours[h]++;
    });

    return {
        churnedCount: churned,
        peakHours: hours
    };
}

export async function getSmartNotifications(systemType = 'separate') {
    await dbConnect();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [birthdays, absent, lowStock] = await Promise.all([
        Subscriber.find({
            systemType,
            $expr: {
                $and: [
                    { $eq: [{ $dayOfMonth: "$dateOfBirth" }, { $dayOfMonth: now }] },
                    { $eq: [{ $month: "$dateOfBirth" }, { $month: now }] }
                ]
            }
        }).lean(),
        Subscriber.find({
            systemType,
            'stats.lastVisit': { $lt: sevenDaysAgo },
            endDate: { $gt: now }
        }).lean(),
        Goods.find({
            systemType,
            $expr: { $lte: ["$qty", "$minStock"] }
        }).lean()
    ]);

    return {
        birthdays: serializeDocs(birthdays),
        absent: serializeDocs(absent),
        lowStock: serializeDocs(lowStock)
    };
}

// ============================================
// SEARCH ACTIONS
// ============================================

export async function searchSubscribers(query, searchBy = 'name') {
    await dbConnect();

    let filter = {};

    if (searchBy === 'name') {
        filter = { name: { $regex: query, $options: 'i' } };
    } else if (searchBy === 'phone') {
        filter = { phone: { $regex: query, $options: 'i' } };
    } else if (searchBy === 'category') {
        filter = { category: { $regex: query, $options: 'i' } };
    } else if (searchBy === 'qr') {
        filter = { qrCode: query };
    }

    const subscribers = await Subscriber.find(filter).limit(50).lean();
    return serializeDocs(subscribers);
}

// ============================================
// DISCOUNT ACTIONS
// ============================================

export async function validateDiscount(code) {
    await dbConnect();
    const discount = await Discount.findOne({ code: code.toUpperCase() });

    if (!discount) {
        return { valid: false, message: 'Invalid discount code' };
    }

    if (!discount.isValid()) {
        return { valid: false, message: 'Discount code expired or limit reached' };
    }

    return { valid: true, discount: serializeDoc(discount) };
}

export async function applyDiscount(code, amount) {
    await dbConnect();
    const discount = await Discount.findOne({ code: code.toUpperCase() });

    if (!discount || !discount.isValid()) {
        throw new Error('Invalid discount code');
    }

    let discountAmount = 0;

    if (discount.type === 'percentage') {
        discountAmount = (amount * discount.value) / 100;
        if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
            discountAmount = discount.maxDiscount;
        }
    } else {
        discountAmount = discount.value;
    }

    // تحديث عدد مرات الاستخدام
    discount.usedCount += 1;
    await discount.save();

    return {
        originalAmount: amount,
        discountAmount,
        finalAmount: amount - discountAmount,
    };
}


// ============================================
// PAYMENT ACTIONS (CONSOLIDATED)
// ============================================

export async function addPayment(data, performerId) {
    blockDemoAction();
    await dbConnect();

    const sub = await Subscriber.findById(data.subscriberId);
    const subSystemType = sub ? sub.systemType : 'separate';

    const payment = await Payment.create({
        subscriber: data.subscriberId,
        amount: parseFloat(data.amount),
        method: data.method || 'cash',
        type: data.type || 'subscription',
        status: data.status || 'completed',
        reference: data.reference,
        notes: data.notes,
        staff: performerId || data.staffId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        installmentNumber: data.installmentNumber,
        totalInstallments: data.totalInstallments,
        systemType: subSystemType,
    });

    if (payment.status === 'completed') {
        await Subscriber.findByIdAndUpdate(data.subscriberId, {
            $inc: { 'stats.totalPaid': payment.amount }
        });
    }

    const subName = sub ? sub.name : 'غير معروف';
    await logAudit(performerId || data.staffId, 'create', 'payment', payment._id, `تسجيل دفعة مالية بقيمة ${payment.amount} للمشترك: ${subName}`);

    revalidatePath('/');
    return serializeDoc(payment);
}

export async function getSubscriberPayments(subscriberId) {
    await dbConnect();
    const payments = await Payment.find({ subscriber: subscriberId })
        .sort({ createdAt: -1 })
        .populate('staff', 'name')
        .lean();
    return serializeDocs(payments);
}

export async function getAllPayments(filter = {}) {
    await dbConnect();
    const payments = await Payment.find(filter)
        .sort({ createdAt: -1 })
        .populate('subscriber', 'name phone')
        .populate('staff', 'name')
        .lean();
    return serializeDocs(payments);
}

export async function getPendingInstallments(systemType = 'separate') {
    await dbConnect();
    const today = new Date();

    const installments = await Payment.find({
        status: 'pending',
        dueDate: { $lte: today },
        systemType
    })
        .populate('subscriber', 'name phone')
        .lean();

    return serializeDocs(installments);
}

export async function updatePaymentStatus(paymentId, status, performerId) {
    blockDemoAction();
    await dbConnect();

    if (status === 'completed') {
        // Use native MongoDB collection to bypass Mongoose timestamp overrides on createdAt
        await Payment.collection.updateOne(
            { _id: new mongoose.Types.ObjectId(paymentId) },
            { $set: { status, createdAt: new Date() } }
        );
    } else {
        await Payment.findByIdAndUpdate(paymentId, { status });
    }

    const payment = await Payment.findById(paymentId).populate('subscriber', 'name');

    if (status === 'completed' && payment) {
        await Subscriber.findByIdAndUpdate(payment.subscriber, {
            $inc: { 'stats.totalPaid': payment.amount }
        });
    }

    const subName = payment?.subscriber?.name || 'غير معروف';
    await logAudit(performerId, 'update', 'payment', paymentId, `تحديث حالة الدفعة للمشترك ${subName} بقيمة ${payment?.amount || 0} إلى: ${status}`);

    revalidatePath('/');
    return serializeDoc(payment);
}

export async function createInstallmentPlan(subscriberId, totalAmount, numberOfInstallments, startDate) {
    await dbConnect();

    const sub = await Subscriber.findById(subscriberId);
    const subSystemType = sub ? sub.systemType : 'separate';

    const installmentAmount = totalAmount / numberOfInstallments;
    const payments = [];

    for (let i = 0; i < numberOfInstallments; i++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        const payment = await Payment.create({
            subscriber: subscriberId,
            amount: installmentAmount,
            method: 'installment',
            type: 'subscription',
            status: i === 0 ? 'completed' : 'pending',
            dueDate,
            installmentNumber: i + 1,
            totalInstallments: numberOfInstallments,
            systemType: subSystemType,
        });

        payments.push(payment);
    }

    revalidatePath('/');
    return serializeDocs(payments);
}

export async function getPaymentStats(startDate, endDate) {
    await dbConnect();

    const filter = {
        status: 'completed',
        createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    };

    const payments = await Payment.find(filter);

    const stats = {
        totalAmount: 0,
        byMethod: {},
        byType: {},
        count: payments.length,
    };

    payments.forEach(payment => {
        stats.totalAmount += payment.amount;
        stats.byMethod[payment.method] = (stats.byMethod[payment.method] || 0) + payment.amount;
        stats.byType[payment.type] = (stats.byType[payment.type] || 0) + payment.amount;
    });

    return stats;
}

// ============================================
// OWNER ONBOARDING & PASSWORD RESET (OTP)
// ============================================

export async function checkHasAdmin() {
    await dbConnect();
    const count = await Staff.countDocuments({ role: 'admin' });
    return count > 0;
}

export async function registerFirstAdmin(formData) {
    await dbConnect();
    const count = await Staff.countDocuments({ role: 'admin' });
    if (count > 0) {
        throw new Error('Admin already exists');
    }

    const name = formData.get('name');
    const email = (formData.get('email') || '').trim().toLowerCase();
    const phone = formData.get('phone');
    const password = formData.get('password');
    const gender = formData.get('gender') || 'male';
    const systemType = formData.get('systemType') || 'mix';

    if (!name || !email || !phone || !password) {
        throw new Error('All fields are required');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format. Please use a valid email address (e.g. gmail) / صيغة البريد الإلكتروني غير صالحة.');
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[1-9]).{6,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error('Password must contain at least one letter and numbers from 1 to 9, and be at least 6 characters. / كلمة المرور يجب أن تحتوي على حرف ورقم (1-9) وتكون 6 رموز على الأقل.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const staff = await Staff.create({
        name,
        email,
        phone,
        role: 'admin',
        gender,
        systemType,
        password: hashedPassword,
        active: true,
        permissions: {
            canAddSubscribers: true,
            canEditSubscribers: true,
            canDeleteSubscribers: true,
            canRenewSubscribers: true,
            canFreezeSubscribers: true,
            canCheckInSubscribers: true,
            canViewDashboard: true,
            canViewReports: true,
            canManageFinances: true,
            canManageStaff: true,
            canManageEquipment: true,
            canManageLoyalty: true,
            canManageGoods: true,
            canViewSalaries: true,
        }
    });

    revalidatePath('/');
    return serializeDoc(staff);
}

async function sendGmailOTP(toEmail, otp) {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    if (!user || !pass) {
        throw new Error(
            'Gmail SMTP credentials are not configured in your .env.local file. Please add GMAIL_USER and GMAIL_PASS (Gmail App Password) / لم يتم إعداد بريد Gmail في ملف .env.local. يرجى إضافة GMAIL_USER و GMAIL_PASS (كلمة مرور التطبيق) لتفعيل استعادة كلمة المرور.'
        );
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });

    const mailOptions = {
        from: `"GMS Gym System" <${user}>`,
        to: toEmail,
        subject: 'Reset Password Verification Code - رمز تحقق استعادة كلمة المرور',
        html: `
            <div style="direction: rtl; font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h2 style="color: #0b6b8a; margin: 0; font-size: 22px;">نظام إدارة الصالة الرياضية (GMS)</h2>
                    <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">استعادة كلمة المرور / Password Recovery</p>
                </div>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                <p style="font-size: 15px; line-height: 1.6; color: #334155; text-align: right;">
                    مرحباً، لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحساب المدير الخاص بك. يرجى استخدام رمز التحقق التالي لإكمال العملية:
                </p>
                <div style="text-align: center; margin: 30px 0; padding: 15px; background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 12px;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #0d9488;">${otp}</span>
                </div>
                <p style="font-size: 13px; color: #64748b; text-align: center; margin-bottom: 25px; line-height: 1.5;">
                    هذا الرمز صالح لمدة 10 دقائق فقط. إذا لم تكن أنت من طلب هذا، يرجى تجاهل هذه الرسالة.
                </p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                <div style="direction: ltr; font-size: 14px; line-height: 1.6; color: #334155; text-align: left;">
                    <p>Hello, we received a request to reset your admin account password. Please use the verification code below to complete the process:</p>
                    <div style="text-align: center; margin: 20px 0; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <span style="font-size: 26px; font-weight: bold; letter-spacing: 4px; color: #1e3a8a;">${otp}</span>
                    </div>
                    <p style="font-size: 12px; color: #64748b;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
}

export async function requestPasswordResetOTP(emailOrPhone) {
    await dbConnect();
    const cleanInput = (emailOrPhone || '').trim().toLowerCase();

    // Find admin staff by email or phone
    const staff = await Staff.findOne({
        role: 'admin',
        active: true,
        $or: [
            { email: cleanInput },
            { phone: cleanInput }
        ]
    });

    if (!staff) {
        throw new Error('Owner admin account not found with the provided email or phone');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    staff.resetOTP = otp;
    staff.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await staff.save();

    // Log to server console for development access
    console.log('\n=========================================');
    console.log('   GMS SYSTEM OTP CODE (SECURITY LOG)    ');
    console.log(`   Time: ${new Date().toISOString()}`);
    console.log(`   Account: ${staff.email} (${staff.phone})`);
    console.log(`   OTP Code: ${otp}`);
    console.log('=========================================\n');

    let sentMethod = 'console';
    let emailErr = null;
    let smsErr = null;

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    // 1. Attempt Gmail SMTP send if configured
    if (gmailUser && gmailPass) {
        try {
            await sendGmailOTP(staff.email, otp);
            sentMethod = 'email';
        } catch (err) {
            console.error('Failed to send OTP via Gmail SMTP:', err);
            emailErr = err;
        }
    }

    // 2. Fallback to SMS if Gmail failed/not configured and SMS settings are active
    if (sentMethod === 'console') {
        const settings = await Settings.findOne();
        const isSmsEnabled = settings && settings.notifications && settings.notifications.smsEnabled;
        const gatewayUrl = settings && settings.notifications && settings.notifications.smsGatewayUrl;

        if (isSmsEnabled && gatewayUrl) {
            try {
                const rawUrl = gatewayUrl;
                const apiKey = settings.notifications.smsApiKey || '';
                const senderId = settings.notifications.smsSenderId || '';
                const recipient = staff.phone || cleanInput;
                const messageText = `رمز التحقق لتغيير كلمة المرور في نظام GMS هو: ${otp}`;

                let finalUrl = rawUrl
                    .replace(/{API_KEY}/g, encodeURIComponent(apiKey))
                    .replace(/{TO}/g, encodeURIComponent(recipient))
                    .replace(/{MESSAGE}/g, encodeURIComponent(messageText))
                    .replace(/{SENDER_ID}/g, encodeURIComponent(senderId));

                console.log('Sending OTP SMS via gateway URL:', finalUrl);
                const response = await fetch(finalUrl, { method: 'GET' });
                if (!response.ok) {
                    throw new Error(`Gateway returned error status: ${response.status}`);
                }
                sentMethod = 'sms';
            } catch (err) {
                console.error('Failed to send SMS OTP via gateway:', err);
                smsErr = err;
            }
        }
    }

    // 3. Throw descriptive error if no delivery method succeeded
    if (sentMethod === 'console') {
        if (!gmailUser || !gmailPass) {
            throw new Error('Gmail recovery is not configured. Please add GMAIL_USER and GMAIL_PASS (Gmail App Password) in your .env.local file. / خدمة استعادة كلمة المرور عبر Gmail غير مهيأة. يرجى إضافة GMAIL_USER و GMAIL_PASS في ملف .env.local.');
        } else {
            throw new Error(`Failed to send verification email: ${emailErr?.message || 'Unknown error'} / فشل إرسال البريد الإلكتروني.`);
        }
    }

    return { success: true, method: sentMethod };
}

export async function verifyPasswordResetOTP(emailOrPhone, otp) {
    await dbConnect();
    const cleanInput = (emailOrPhone || '').trim().toLowerCase();

    const staff = await Staff.findOne({
        role: 'admin',
        active: true,
        $or: [
            { email: cleanInput },
            { phone: cleanInput }
        ]
    });

    if (!staff) {
        throw new Error('Owner admin account not found / لم يتم العثور على حساب المالك.');
    }

    if (!staff.resetOTP || staff.resetOTP !== otp) {
        throw new Error('Invalid verification code / رمز التحقق غير صحيح.');
    }

    if (!staff.resetOTPExpires || new Date(staff.resetOTPExpires).getTime() < Date.now()) {
        throw new Error('Verification code has expired / انتهت صلاحية رمز التحقق.');
    }

    return { success: true };
}

export async function resetPasswordWithOTP(emailOrPhone, otp, newPassword) {
    await dbConnect();
    const cleanInput = (emailOrPhone || '').trim().toLowerCase();

    const staff = await Staff.findOne({
        role: 'admin',
        active: true,
        $or: [
            { email: cleanInput },
            { phone: cleanInput }
        ]
    });

    if (!staff) {
        throw new Error('Owner admin account not found');
    }

    if (!staff.resetOTP || staff.resetOTP !== otp) {
        throw new Error('Invalid verification code');
    }

    if (!staff.resetOTPExpires || new Date(staff.resetOTPExpires).getTime() < Date.now()) {
        throw new Error('Verification code has expired');
    }

    // Hash and update password
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[1-9]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
        throw new Error('Password must contain at least one letter and a number from 1 to 9, and be at least 6 characters. / كلمة المرور يجب أن تحتوي على حرف ورقم (1-9) وتكون 6 رموز على الأقل.');
    }

    staff.password = await bcrypt.hash(newPassword, 10);
    staff.resetOTP = undefined;
    staff.resetOTPExpires = undefined;
    await staff.save();

    return { success: true };
}
