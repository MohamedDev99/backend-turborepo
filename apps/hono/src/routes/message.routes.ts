import { Hono } from "hono";
import messageController from "@s-h-controllers/message.controller";
import { honoAuthMiddleware } from "@s-middlewares/access.middleware";

// message routes for hono
const messageHonoRouter = new Hono();

// send a message
// messages/send/:receiverId
messageHonoRouter.post("/send/:receiverId", ...messageController.sendMessage); // TODO : need body validation / authentication middleware

// messages/
// messageHonoRouter.get("/:messageId", authenticationMiddleware, getMessage);

// TODO : check if parameters are valid
// messageHonoRouter.param("messageId", messageController.checkIfMessageExists);

// messages/:messageId
messageHonoRouter
    .route("/:messageId")
    .delete(...messageController.deleteMessage) // delete a message // TODO : authentication middleware
    .put(...messageController.updateMessage); // update a message // TODO : authentication middleware / body validation middleware

export default messageHonoRouter;
