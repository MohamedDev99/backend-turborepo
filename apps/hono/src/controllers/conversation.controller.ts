import { errorHandler } from "@s-services/errors/errorHandler";
import { Context } from "hono";
import {
    CONVERSATIONS_FETCHED_SUCCESSFULLY,
    CONVERSATIONS_NOT_FOUND,
    CONVERSATION_CREATED,
    CONVERSATION_DELETED,
    CONVERSATION_UPDATED,
} from "@s-constants/message";
import { StatusCodes } from "http-status-codes";
import { createFactory } from "hono/factory";
import { honoAuthMiddleware } from "@s-middlewares/access.middleware";
import { honoCreateConversationBodyVM, honoUpdateConversationBodyVM } from "@s-middlewares/conversation.middleware";
import Conversation from "@s-models/conversation.model";

const conversationFactory = createFactory();

// path /api/v1/conversations/ - get all conversations
const getConversations = conversationFactory.createHandlers(honoAuthMiddleware, async (c: Context) => {
    try {
        // get userId
        const { _id: userId } = c.get("user");

        // get all conversations for user
        const conversations = await Conversation.find({
            participants: userId,
        });

        if (!conversations) {
            return c.json(CONVERSATIONS_NOT_FOUND, StatusCodes.BAD_REQUEST);
        }

        // send success response
        return c.json(
            {
                ...CONVERSATIONS_FETCHED_SUCCESSFULLY,
                data: conversations,
            },
            StatusCodes.OK
        );
    } catch (error) {
        c.set("Custom-Error", errorHandler(error, "Hono", "sendMessage controller"));
        throw new Error("Something went wrong");
    }
});

// path /api/v1/conversations/ - create conversation
// const createConversation = conversationFactory.createHandlers(honoAuthMiddleware, honoCreateConversationBodyVM, async (c: Context) => {
//     try {
//         // create conversation
//         // send success response
//         // return c.json(CONVERSATION_CREATED, StatusCodes.CREATED);
//     } catch (error) {
//         c.set("Custom-Error", errorHandler(error, "Hono", "sendMessage controller"));
//         throw new Error("Something went wrong");
//     }
// });

// path /api/v1/conversations/:conversationId - get conversation
const getConversationById = conversationFactory.createHandlers(honoAuthMiddleware, async (c: Context) => {
    try {
        // get conversationId from params
        const { conversationId } = c.req.param();

        // get conversation
        const conversation = await Conversation.findById(conversationId);
        // invalid conversation
        if (!conversation) {
            return c.json(CONVERSATIONS_NOT_FOUND, StatusCodes.BAD_REQUEST);
        }

        // send success response
        return c.json(
            {
                ...CONVERSATIONS_FETCHED_SUCCESSFULLY,
                data: conversation,
            },
            StatusCodes.OK
        );
    } catch (error) {
        c.set("Custom-Error", errorHandler(error, "Hono", "sendMessage controller"));
        throw new Error("Something went wrong");
    }
});

// path /api/v1/conversations/:conversationId - update conversation
const updateConversation = conversationFactory.createHandlers(honoAuthMiddleware, honoUpdateConversationBodyVM, async (c: Context) => {
    try {
        // receive params
        const { conversationId } = c.req.param();

        // update conversation
        const conversation = await Conversation.findByIdAndUpdate(conversationId, {
            ...(await c.req.json()),
        });
        // if conversation not found
        if (!conversation) {
            return c.json(CONVERSATIONS_NOT_FOUND, StatusCodes.BAD_REQUEST);
        }

        // send success response
        return c.json(CONVERSATION_UPDATED, StatusCodes.OK);
    } catch (error) {
        c.set("Custom-Error", errorHandler(error, "Hono", "sendMessage controller"));
        throw new Error("Something went wrong");
    }
});

// path /api/v1/conversations/:conversationId - delete conversation
const deleteConversation = conversationFactory.createHandlers(honoAuthMiddleware, async (c: Context) => {
    try {
        // receive params
        const { conversationId } = c.req.param();

        // delete conversation
        const deleteConversation = await Conversation.findByIdAndDelete(conversationId);
        // if conversation not found
        if (!deleteConversation) {
            return c.json(CONVERSATIONS_NOT_FOUND, StatusCodes.BAD_REQUEST);
        }

        // send success response
        return c.json(CONVERSATION_DELETED, StatusCodes.OK);
    } catch (error) {
        c.set("Custom-Error", errorHandler(error, "Hono", "sendMessage controller"));
        throw new Error("Something went wrong");
    }
});

export default {
    getConversations,
    // createConversation,
    getConversationById,
    updateConversation,
    deleteConversation,
};
