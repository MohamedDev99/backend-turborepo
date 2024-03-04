import { Router } from "express";
import authController from "@s-n-controllers/auth.controller";
import { loginValidationMiddleware, signupValidationMiddleware } from "@s-middlewares/auth.middleware";

// auth routes for Express
const authRouter = Router();

// auth/login
authRouter.post("/login", loginValidationMiddleware, authController.login);

// auth/logout
authRouter.post("/logout", authController.logout);

// auth/signup
authRouter.post("/signup", signupValidationMiddleware, authController.signup);

export default authRouter;
