"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("@s-n-controllers/auth.controller"));
const auth_middleware_1 = require("@s-middlewares/auth.middleware");
// auth routes for Express
const authRouter = (0, express_1.Router)();
// auth/login
authRouter.post("/login", auth_middleware_1.loginValidationMiddleware, auth_controller_1.default.login);
// auth/logout
authRouter.post("/logout", auth_controller_1.default.logout);
// auth/signup
authRouter.post("/signup", auth_middleware_1.signupValidationMiddleware, auth_controller_1.default.signup);
exports.default = authRouter;
