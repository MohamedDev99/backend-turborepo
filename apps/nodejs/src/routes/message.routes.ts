import messageController from "@s-n-controllers/message.controller";
import { Router } from "express";
import { authenticationMiddleware } from "@s-middlewares/access.middleware";

// message routes for Express
const massageRouter = Router();

// send a message
// messages/send/:receiverId
massageRouter.post("/send/:receiverId", authenticationMiddleware, messageController.sendMessage);

// messages/
// massageRouter.get("/:messageId", authenticationMiddleware, getMessage);

// TODO : check if parameters are valid
// massageRouter.param("messageId", messageController.checkIfMessageExists);

// messages/:messageId
massageRouter
    .route("/:messageId")
    .delete(authenticationMiddleware, messageController.deleteMessage) // delete a message
    .put(authenticationMiddleware, messageController.updateMessage); // update a message

export default massageRouter;
