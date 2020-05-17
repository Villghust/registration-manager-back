import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password_hash: {
            type: String,
            required: true,
        },
        reviewer: {
            type: Boolean,
            required: true,
            default: false,
        },
        course: {
            type: String,
            default: null,
        },
        team: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: false,
    }
);

export default mongoose.model('User', UserSchema);
