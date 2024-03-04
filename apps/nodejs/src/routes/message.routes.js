"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_controller_1 = __importDefault(require("@s-n-controllers/message.controller"));
const express_1 = require("express");
const access_middleware_1 = require("@s-middlewares/access.middleware");
// message routes for Express
const massageRouter = (0, express_1.Router)();
// send a message
// messages/send/:receiverId
massageRouter.post("/send/:receiverId", access_middleware_1.authenticationMiddleware, message_controller_1.default.sendMessage);
// messages/
// massageRouter.get("/:messageId", authenticationMiddleware, getMessage);
// TODO : check if parameters are valid
// massageRouter.param("messageId", messageController.checkIfMessageExists);
// messages/:messageId
massageRouter
    .route("/:messageId")
    .delete(access_middleware_1.authenticationMiddleware, message_controller_1.default.deleteMessage) // delete a message
    .put(access_middleware_1.authenticationMiddleware, message_controller_1.default.updateMessage); // update a message
exports.default = massageRouter;
