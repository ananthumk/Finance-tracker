import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    familyId: {type: Schema.Types.ObjectId, ref: 'Family', default: null},
    type: {type: String, enum: ['income','expense'], required: true},
    category: {type: String, required: true},
    amount: {type: Number, required: true}, 
    date: {type: Date, required: true},
    note: {type: String},
    settings: {type: Boolean, default: false}
}, {timestamps: true})

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema)