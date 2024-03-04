"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const message_1 = require("@s-constants/message");
const conversation_model_1 = __importDefault(require("@s-models/conversation.model"));
const _s_utils_1 = require("@s-utils");
// path: /api/v1/conversations
const getConversations = async (req, res, next) => {
    try {
        // get userId
        const { _id: userId } = req.user;
        // get conversations
        const conversations = await conversation_model_1.default.find({ participants: userId });
        // invalid conversations
        if (!conversations) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(message_1.CONVERSATION_NOT_FOUND);
        }
        // send success response
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            ...message_1.CONVERSATIONS_FETCHED_SUCCESSFULLY,
            data: conversations,
        });
    }
    catch (error) {
        (0, _s_utils_1.logCatchErrors)(error, res, next, "getConversations controller");
    }
};
// path: /api/v1/conversations - create conversation
const createConversation = async (req, res, next) => {
    try {
        // get userId
        const { _id: userId } = req.user;
        const { participants } = req.body;
        // create conversation
        const conversation = await conversation_model_1.default.create({
            participants: [userId, ...participants],
        });
        if (!conversation) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(message_1.CONVERSATION_NOT_CREATED);
        }
        // send success response
        return res.status(http_status_codes_1.StatusCodes.OK).json(message_1.CONVERSATION_CREATED);
    }
    catch (error) {
        (0, _s_utils_1.logCatchErrors)(error, res, next, "createConversation controller");
    }
};
// path: /api/v1/conversations/conversationId - get conversation by id
const getConversationById = async (req, res, next) => {
    try {
        // get conversationId
        const { conversationId } = req.params;
        // get conversation
        const conversation = await conversation_model_1.default.findById(conversationId);
        // invalid conversation
        if (!conversation) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(message_1.CONVERSATION_NOT_FOUND);
        }
        // send success response
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            ...message_1.CONVERSATIONS_FETCHED_SUCCESSFULLY,
            data: conversation,
        });
    }
    catch (error) {
        (0, _s_utils_1.logCatchErrors)(error, res, next, "getConversationById controller");
    }
};
// path: /api/v1/conversations - update conversation
const updateConversation = async (req, res, next) => {
    try {
        // get conversationId
        const { conversationId } = req.params;
        // get conversation
        const conversation = await conversation_model_1.default.findById(conversationId);
        // invalid conversation
        if (!conversation) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(message_1.CONVERSATION_NOT_FOUND);
        }
        // update conversation
        const updateConversation = await conversation_model_1.default.findByIdAndUpdate(conversationId, req.body);
        // send success response
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            ...message_1.CONVERSATION_UPDATED,
            data: updateConversation,
        });
    }
    catch (error) {
        (0, _s_utils_1.logCatchErrors)(error, res, next, "updateConversation controller");
    }
};
// path: /api/v1/conversations - delete conversation
const deleteConversation = async (req, res, next) => {
    try {
        // get conversationId
        const { conversationId } = req.params;
        // get conversation
        const conversation = await conversation_model_1.default.findById(conversationId);
        // invalid conversation
        if (!conversation) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(message_1.CONVERSATION_NOT_FOUND);
        }
        // delete conversation
        await conversation_model_1.default.findByIdAndDelete(conversationId);
        // send success response
        return res.status(http_status_codes_1.StatusCodes.OK).json(message_1.CONVERSATION_DELETED);
    }
    catch (error) {
        (0, _s_utils_1.logCatchErrors)(error, res, next, "deleteConversation controller");
    }
};
exports.default = {
    getConversations,
    getConversationById,
    updateConversation,
    deleteConversation,
    createConversation,
};
