"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const access_middleware_1 = require("@s-middlewares/access.middleware");
const conversation_middleware_1 = require("@s-middlewares/conversation.middleware");
const conversation_controller_1 = __importDefault(require("@s-n-controllers/conversation.controller"));
const express_1 = require("express");
// conversation routes for Express
const conversationRouter = (0, express_1.Router)();
// path: /api/v1/conversations/
conversationRouter
    .route("/")
    .post(access_middleware_1.authenticationMiddleware, conversation_middleware_1.createConversationValidationMiddleware, conversation_controller_1.default.createConversation) // create conversation
    .get(access_middleware_1.authenticationMiddleware, conversation_controller_1.default.getConversations); // get all conversations
// TODO : check if parameters are valid
// conversationRouter.param("conversationId", conversationController.checkIfConversationExists);
// path: /api/v1/conversations/:conversationId
conversationRouter
    .route("/:conversationId")
    .get(access_middleware_1.authenticationMiddleware, conversation_controller_1.default.getConversationById) // get conversation
    .patch(access_middleware_1.authenticationMiddleware, conversation_middleware_1.updateConversationValidationMiddleware, conversation_controller_1.default.updateConversation) // update conversation
    .delete(access_middleware_1.authenticationMiddleware, conversation_controller_1.default.deleteConversation); // delete conversation
exports.default = conversationRouter;
