import { TMessageType } from "@s-types/common";
import { IProtectedUser } from "@s-types/user";
import {
    CONVERSATION_NOT_FOUND,
    MESSAGES_FETCHED_SUCCESSFULLY,
    MESSAGE_DELETED,
    MESSAGE_NOT_FOUND,
    MESSAGE_SENT_SUCCESSFULLY,
    MESSAGE_UPDATED,
} from "@s-constants/message";
import Conversation from "@s-models/conversation.model";
import Message from "@s-models/message.model";
import { logCatchErrors } from "@s-utils";
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

declare module "express-serve-static-core" {
    interface Request {
        user: IProtectedUser;
    }
}

// path: /api/v1/messages/send/:id
const sendMessage: RequestHandler = async (req: Request, res: Response, next) => {
    try {
        // get params and body
        const { receiverId } = req.params;
        const { message, messageType } = req.body as { message: string; messageType: TMessageType };

        const { _id: senderId } = req.user;

        // get conversation
        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId],
            },
        });

        // check if conversation exists
        if (!conversation) {
            // create new conversation
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // send message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            content: {
                // messageType,
                message,
            },
        });

        // push message to conversation
        if (newMessage) conversation.messages.push(newMessage._id);

        // save message and conversation to db promiseAll
        await Promise.all([conversation.save(), newMessage.save()]);
        // return success response
        return res.status(StatusCodes.OK).json(MESSAGE_SENT_SUCCESSFULLY);
    } catch (error) {
        logCatchErrors(error, res, next, "sendMessage controller");
    }
};

// path: /api/v1/messages/ // TODO : get all messages
const getMessages: RequestHandler = async (req: Request, res: Response, next) => {
    try {
        // get userId
        const { id: receiverIdToChatWith } = req.params;
        const { _id: userId } = req.user;

        // get messages
        const conversation = await Conversation.findOne({
            participants: {
                $all: [receiverIdToChatWith, userId],
            },
        }).populate("messages");

        // send success response
        return res.status(StatusCodes.OK).json({
            ...MESSAGES_FETCHED_SUCCESSFULLY,
            data: conversation,
        });
    } catch (error) {
        logCatchErrors(error, res, next, "getMessages controller");
    }
};

// path: /api/v1/messages/:messageId
const deleteMessage: RequestHandler = async (req: Request, res: Response, next) => {
    try {
        // get messageId
        const { messageId } = req.params;
        const { _id: userId } = req.user;

        // delete message
        const message = await Message.findByIdAndDelete(messageId);

        // invalid message
        if (!message) {
            return res.status(StatusCodes.BAD_REQUEST).json(MESSAGE_NOT_FOUND);
        }

        // remove message from conversation
        let conversation = await Conversation.updateOne({ messages: messageId }, { $pull: { messages: messageId } });

        if (!conversation) {
            return res.status(StatusCodes.BAD_REQUEST).json(CONVERSATION_NOT_FOUND);
        }

        // send success response
        return res.status(StatusCodes.OK).json(MESSAGE_DELETED);
    } catch (error) {
        logCatchErrors(error, res, next, "deleteMessage controller");
    }
};

// path: /api/v1/messages/:messageId
const updateMessage: RequestHandler = async (req: Request, res: Response, next) => {
    try {
        // get messageId
        const { messageId } = req.params;
        const { message } = req.body;

        // update message
        const updateMessage = await Message.findByIdAndUpdate(messageId, { message });

        // invalid message
        if (!updateMessage) {
            return res.status(StatusCodes.BAD_REQUEST).json(MESSAGE_NOT_FOUND);
        }

        // send success response
        return res.status(StatusCodes.OK).json(MESSAGE_UPDATED);
    } catch (error) {
        logCatchErrors(error, res, next, "updateMessage controller");
    }
};

export default {
    sendMessage,
    getMessages,
    deleteMessage,
    updateMessage,
};
