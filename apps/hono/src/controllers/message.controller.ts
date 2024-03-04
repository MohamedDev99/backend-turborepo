import { errorHandler } from "@s-services/errors/errorHandler";
import { Context } from "hono";
import { MESSAGE_DELETED, MESSAGE_NOT_FOUND, MESSAGE_SENT_SUCCESSFULLY, MESSAGE_UPDATED } from "@s-constants/message";
import { StatusCodes } from "http-status-codes";
import Conversation from "@s-models/conversation.model";
import Message from "@s-models/message.model";
import { createFactory } from "hono/factory";
import { honoAuthMiddleware } from "@s-middlewares/access.middleware";

const messageFactory = createFactory();

// path /api/v1/messages/send/:receiverId - send message
const sendMessage = messageFactory.createHandlers(honoAuthMiddleware, async (c: Context) => {
    try {
        // receive params and body
        const { receiverId } = c.req.param();
        const { message, messageType } = await c.req.json();
        // get user id from context
        const { _id: userId } = c.get("user");

        // get conversation between user and receiver - check if conversation exists , if not exist, create new conversation
        let conversation = await Conversation.findOne({
            participants: {
                $all: [receiverId, userId],
            },
        });
        if (!conversation) {
            // create new conversation
            conversation = await Conversation.create({
                participants: [receiverId, userId],
            });
        }

        // create new message
        const newMessage = await Message.create({
            senderId: userId,
            receiverId,
            content: {
                messageType,
                message,
            },
        });

        // update conversation
        conversation.messages.push(newMessage._id);

        // save conversation and new message
        await Promise.all([conversation.save(), newMessage.save()]);

        // send success response
        return c.json(MESSAGE_SENT_SUCCESSFULLY, StatusCodes.OK);
    } catch (error) {
        c.set("Custom-Error", errorHandler(error, "Hono", "sendMessage controller"));
        throw new Error("Something went wrong");
    }
});

// path /api/v1/messages/:messageId - update message
const updateMessage = messageFactory.createHandlers(honoAuthMiddleware, async (c: Context) => {
    try {
        // receive params
        const { messageId } = c.req.param();

        // update message by id
        const message = await Message.findByIdAndUpdate(messageId, {
            ...(await c.req.json()),
        });
        // if message not found
        if (!message) {
            return c.json(MESSAGE_NOT_FOUND, StatusCodes.BAD_REQUEST);
        }

        // send success response
        return c.json(MESSAGE_UPDATED, StatusCodes.OK);
    } catch (error) {
        c.set("Custom-Error", errorHandler(error, "Hono", "updateMessage controller"));
        throw new Error("Something went wrong");
    }
});

// path /api/v1/messages/:messageId - delete message
const deleteMessage = messageFactory.createHandlers(honoAuthMiddleware, async (c: Context) => {
    try {
        // receive params
        const { messageId } = c.req.param();

        const deleteMessage = await Message.findByIdAndDelete(messageId);
        // invalid message
        if (!deleteMessage) {
            return c.json(MESSAGE_NOT_FOUND, StatusCodes.BAD_REQUEST);
        }
        // send success response
        return c.json(MESSAGE_DELETED, StatusCodes.OK);
    } catch (error) {
        c.set("Custom-Error", errorHandler(error, "Hono", "deleteMessage controller"));
        throw new Error("Something went wrong");
    }
});

export default {
    sendMessage,
    updateMessage,
    deleteMessage,
};
