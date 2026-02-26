import mongoose, { Schema } from "mongoose";

const BudgetSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    month: {type: String, required: true},
    totalLimit: {type: Number, required: true},
   categories: [{
  name: { type: String },
  limit: { type: Number }
}]
}, {timestamps: true})

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema)