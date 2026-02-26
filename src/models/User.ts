import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    familyId: {type: Schema.Types.ObjectId, ref: 'Family', default: null},
    role: {type: String, default: 'member'}
}, {timestamps: true})

export default mongoose.models.User || mongoose.model('User', UserSchema)