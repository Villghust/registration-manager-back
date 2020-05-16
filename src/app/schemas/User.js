import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
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

export default model('User', UserSchema);
