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
        },
        course: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const RatingSchema = new mongoose.Schema(
    {
        reviewer_id: {
            type: String,
            required: true,
        },
        software: {
            type: Number,
            default: null,
        },
        process: {
            type: Number,
            default: null,
        },
        pitch: {
            type: Number,
            default: null,
        },
        innovation: {
            type: Number,
            default: null,
        },
        team_formation: {
            type: Number,
            default: null,
        },
    },
    { _id: false }
);

const TeamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        user_list: {
            type: [UserSchema],
            required: true,
        },
        ratings: {
            type: [RatingSchema],
        },
    },
    {
        timestamps: false,
    }
);

export default mongoose.model('Team', TeamSchema);
