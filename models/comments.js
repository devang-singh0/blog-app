import { Schema } from "mongoose";
import { mongoose } from "mongoose";

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export let Comment = mongoose.model('comment', CommentSchema);