"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("@s-constants/message");
const conversation_model_1 = __importDefault(require("@s-models/conversation.model"));
const message_model_1 = __importDefault(require("@s-models/message.model"));
const _s_utils_1 = require("@s-utils");
const http_status_codes_1 = require("http-status-codes");
// path: /api/v1/messages/send/:id
const sendMessage = async (req, res, next) => {
    try {
        // get params and body
        const { receiverId } = req.params;
        const { message, messageType } = req.body;
        const { _id: senderId } = req.user;
        // get conversation
        let conversation = await conversation_model_1.default.findOne({
            participants: {
                $all: [senderId, receiverId],
            },
        });
        // check if conversation exists
        if (!conversation) {
            // create new conversation
            conversation = await conversation_model_1.default.create({
                participants: [senderId, receiverId],
            });
        }
        // send message
        const newMessage = await message_model_1.default.create({
            senderId,
            receiverId,
            content: {
                // messageType,
                message,
            },
        });
        // push message to conversation
        if (newMessage)
            conversation.messages.push(newMessage._id);
        // save message and conversation to db promiseAll
        await Promise.all([conversation.save(), newMessage.save()]);
        // return success response
        return res.status(http_status_codes_1.StatusCodes.OK).json(message_1.MESSAGE_SENT_SUCCESSFULLY);
    }
    catch (error) {
        (0, _s_utils_1.logCatchErrors)(error, res, next, "sendMessage controller");
    }
};
// path: /api/v1/messages/ // TODO : get all messages
const getMessages = async (req, res, next) => {
    try {
        // get userId
        const { id: receiverIdToChatWith } = req.params;
        const { _id: userId } = req.user;
        // get messages
        const conversation = await conversation_model_1.default.findOne({
            participants: {
                $all: [receiverIdToChatWith, userId],
            },
        }).populate("messages");
        // send success response
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            ...message_1.MESSAGES_FETCHED_SUCCESSFULLY,
            data: conversation,
        });
    }
    catch (error) {
        (0, _s_utils_1.logCatchErrors)(error, res, next, "getMessages controller");
    }
};
// path: /api/v1/messages/:messageId
const deleteMessage = async (req, res, next) => {
    try {
        // get messageId
        const { messageId } = req.params;
        const { _id: userId } = req.user;
        // delete message
        const message = await message_model_1.default.findByIdAndDelete(messageId);
        // invalid message
        if (!message) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(message_1.MESSAGE_NOT_FOUND);
        }
        // remove message from conversation
        let conversation = await conversation_model_1.default.updateOne({ messages: messageId }, { $pull: { messages: messageId } });
        if (!conversation) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(message_1.CONVERSATION_NOT_FOUND);
        }
        // send success response
        return res.status(http_status_codes_1.StatusCodes.OK).json(message_1.MESSAGE_DELETED);
    }
    catch (error) {
        (0, _s_utils_1.logCatchErrors)(error, res, next, "deleteMessage controller");
    }
};
// path: /api/v1/messages/:messageId
const updateMessage = async (req, res, next) => {
    try {
        // get messageId
        const { messageId } = req.params;
        const { message } = req.body;
        // update message
        const updateMessage = await message_model_1.default.findByIdAndUpdate(messageId, { message });
        // invalid message
        if (!updateMessage) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(message_1.MESSAGE_NOT_FOUND);
        }
        // send success response
        return res.status(http_status_codes_1.StatusCodes.OK).json(message_1.MESSAGE_UPDATED);
    }
    catch (error) {
        (0, _s_utils_1.logCatchErrors)(error, res, next, "updateMessage controller");
    }
};
exports.default = {
    sendMessage,
    getMessages,
    deleteMessage,
    updateMessage,
};
