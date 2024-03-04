import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        content: {
            messageType: {
                type: String,
                enum: ["text", "image", "video", "file", "location", "url"],
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
