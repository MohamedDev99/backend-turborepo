import type { Request, Response, RequestHandler, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import {
    CONVERSATION_CREATED,
    CONVERSATION_NOT_FOUND,
    CONVERSATION_UPDATED,
    CONVERSATION_DELETED,
    CONVERSATIONS_FETCHED_SUCCESSFULLY,
    CONVERSATION_NOT_CREATED,
} from "@s-constants/message";
import Conversation from "@s-models/conversation.model";
import { logCatchErrors } from "@s-utils";

// path: /api/v1/conversations
const getConversations: RequestHandler = async (req: Request, res: Response, next) => {
    try {
        // get userId
        const { _id: userId } = req.user;

        // get conversations
        const conversations = await Conversation.find({ participants: userId });

        // invalid conversations
        if (!conversations) {
            return res.status(StatusCodes.BAD_REQUEST).json(CONVERSATION_NOT_FOUND);
        }

        // send success response
        return res.status(StatusCodes.OK).json({
            ...CONVERSATIONS_FETCHED_SUCCESSFULLY,
            data: conversations,
        });
    } catch (error) {
        logCatchErrors(error, res, next, "getConversations controller");
    }
};

// path: /api/v1/conversations - create conversation
const createConversation: RequestHandler = async (req: Request, res: Response, next) => {
    try {
        // get userId
        const { _id: userId } = req.user;
        const { participants } = req.body as { participants: string[] };

        // create conversation
        const conversation = await Conversation.create({
            participants: [userId, ...participants],
        });

        if (!conversation) {
            return res.status(StatusCodes.BAD_REQUEST).json(CONVERSATION_NOT_CREATED);
        }

        // send success response
        return res.status(StatusCodes.OK).json(CONVERSATION_CREATED);
    } catch (error) {
        logCatchErrors(error, res, next, "createConversation controller");
    }
};

// path: /api/v1/conversations/conversationId - get conversation by id
const getConversationById: RequestHandler = async (req: Request, res: Response, next) => {
    try {
        // get conversationId
        const { conversationId } = req.params;

        // get conversation
        const conversation = await Conversation.findById(conversationId);

        // invalid conversation
        if (!conversation) {
            return res.status(StatusCodes.BAD_REQUEST).json(CONVERSATION_NOT_FOUND);
        }

        // send success response
        return res.status(StatusCodes.OK).json({
            ...CONVERSATIONS_FETCHED_SUCCESSFULLY,
            data: conversation,
        });
    } catch (error) {
        logCatchErrors(error, res, next, "getConversationById controller");
    }
};

// path: /api/v1/conversations - update conversation
const updateConversation: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get conversationId
        const { conversationId } = req.params;

        // get conversation
        const conversation = await Conversation.findById(conversationId);

        // invalid conversation
        if (!conversation) {
            return res.status(StatusCodes.BAD_REQUEST).json(CONVERSATION_NOT_FOUND);
        }

        // update conversation
        const updateConversation = await Conversation.findByIdAndUpdate(conversationId, req.body);

        // send success response
        return res.status(StatusCodes.OK).json({
            ...CONVERSATION_UPDATED,
            data: updateConversation,
        });
    } catch (error) {
        logCatchErrors(error, res, next, "updateConversation controller");
    }
};

// path: /api/v1/conversations - delete conversation
const deleteConversation: RequestHandler = async (req: Request, res: Response, next) => {
    try {
        // get conversationId
        const { conversationId } = req.params;

        // get conversation
        const conversation = await Conversation.findById(conversationId);

        // invalid conversation
        if (!conversation) {
            return res.status(StatusCodes.BAD_REQUEST).json(CONVERSATION_NOT_FOUND);
        }

        // delete conversation
        await Conversation.findByIdAndDelete(conversationId);

        // send success response
        return res.status(StatusCodes.OK).json(CONVERSATION_DELETED);
    } catch (error) {
        logCatchErrors(error, res, next, "deleteConversation controller");
    }
};

export default {
    getConversations,
    getConversationById,
    updateConversation,
    deleteConversation,
    createConversation,
};
