import { Schema, mongoose } from "mongoose";

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

export let Blog = mongoose.model('blog', BlogSchema);