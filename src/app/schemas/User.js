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
        user_type: {
            type: String,
            required: true,
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
