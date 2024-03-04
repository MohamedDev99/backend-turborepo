import { authenticationMiddleware } from "@s-middlewares/access.middleware";
import { createConversationValidationMiddleware, updateConversationValidationMiddleware } from "@s-middlewares/conversation.middleware";
import conversationController from "@s-n-controllers/conversation.controller";
import { Router } from "express";

// conversation routes for Express
const conversationRouter = Router();

// path: /api/v1/conversations/
conversationRouter
    .route("/")
    .post(authenticationMiddleware, createConversationValidationMiddleware, conversationController.createConversation) // create conversation
    .get(authenticationMiddleware, conversationController.getConversations); // get all conversations

// TODO : check if parameters are valid
// conversationRouter.param("conversationId", conversationController.checkIfConversationExists);

// path: /api/v1/conversations/:conversationId
conversationRouter
    .route("/:conversationId")
    .get(authenticationMiddleware, conversationController.getConversationById) // get conversation
    .patch(authenticationMiddleware, updateConversationValidationMiddleware, conversationController.updateConversation) // update conversation
    .delete(authenticationMiddleware, conversationController.deleteConversation); // delete conversation

export default conversationRouter;
