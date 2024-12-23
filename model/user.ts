import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    clerkId: string;
    username: string;
    email: string;
    role: string;
    drawing: mongoose.Schema.Types.ObjectId[];
    order: Schema.Types.ObjectId
}

const userSchema = new Schema<IUser>({
    clerkId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"]
    },
    drawing: [{
        type: Schema.Types.ObjectId,
        ref: "Drawing",
        required: false,
    }],
    order: [{
        type: Schema.Types.ObjectId,
        ref: "Order"
    }],
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export { User };