import conversationController from "@s-h-controllers/conversation.controller";
import { Hono } from "hono";

// conversation routes for Hono
const conversationHonoRouter = new Hono();

// path: /api/v1/conversations/
conversationHonoRouter
    .route("/")
    // .post(...conversationController.createConversation) // create conversation // TODO :
    .get(...conversationController.getConversations); // get all conversations

// TODO : check if parameters are valid
// conversationHonoRouter.param("conversationId", conversationController.checkIfConversationExists);

// path: /api/v1/conversations/:conversationId
conversationHonoRouter
    .route("/:conversationId")
    .get(...conversationController.getConversationById) // get conversation
    .patch(...conversationController.updateConversation) // update conversation
    .delete(...conversationController.deleteConversation); // delete conversation

export default conversationHonoRouter;
