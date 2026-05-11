import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    familyId: {type: Schema.Types.ObjectId, ref: 'Family', default: null},
    type: {type: String, enum: ['income','expense'], required: true},
    category: {type: String, required: true},
    amount: {type: Number, required: true}, 
    date: {type: Date, required: true},
    note: {type: String}
}, {timestamps: true})

TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, type: 1, date: -1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema)