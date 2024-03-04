import authController from "@s-h-controllers/auth.controller";
import { Hono } from "hono";

// auth routes for hono
const authHonoRouter = new Hono();

// auth/login
authHonoRouter.post("/login", ...authController.login); // TODO : need body validation

// auth/logout
authHonoRouter.post("/logout", ...authController.logout);

// auth/signup
authHonoRouter.post("/signup", ...authController.signup); //  TODO : need body validation

export default authHonoRouter;
