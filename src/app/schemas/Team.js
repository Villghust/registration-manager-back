import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
        },
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

const RatingSchema = new Schema(
    {
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

const TeamSchema = new Schema(
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
        rating: {
            type: RatingSchema,
        },
    },
    {
        timestamps: false,
    }
);

export default model('Team', TeamSchema);
