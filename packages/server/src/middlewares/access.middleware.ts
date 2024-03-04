import { StatusCodes } from "http-status-codes";
import type { Request, RequestHandler, Response, NextFunction } from "express";
import { USER_NOT_FOUND, USER_UNAUTHORIZED } from "@s-constants/user";
import { logCatchErrors } from "@s-utils";
import { ACCESS_UNAUTHORIZED_INVALID_TOKEN, ACCESS_UNAUTHORIZED_NO_TOKEN_FOUND } from "@s-constants/access";
import { verifyJwtTokenForHono, verifyJwtTokenForNodejs } from "@s-utils/jwtToken";
import User from "@s-models/user.model";
import { IProtectedUser } from "@s-types/user";
import { createMiddleware } from "hono/factory";
import { errorHandler } from "@s-services/errors/errorHandler";
import { getCookie } from "hono/cookie";

declare module "express-serve-static-core" {
    interface Request {
        user: IProtectedUser;
    }
}

// ? auth middleware for nodejs
export const authenticationMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get token from cookie
        const token = req.cookies.jwt;
        // check if token exists
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json(ACCESS_UNAUTHORIZED_NO_TOKEN_FOUND);
        }

        // check if token is valid
        const isValidToken = verifyJwtTokenForNodejs(token);
        // invalid token
        if (!isValidToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json(ACCESS_UNAUTHORIZED_INVALID_TOKEN);
        }

        // valid token -- get user by id
        const { userId } = isValidToken as { userId: string };
        const user = await User.findById(userId).select("-password");

        // invalid user
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json(USER_NOT_FOUND);
        }

        // valid user -- add user to req
        req.user = user as unknown as IProtectedUser;
        next();
    } catch (error) {
        logCatchErrors(error, res, next, "authorization middleware");
    }
};

//? hono auth middleware
export const honoAuthMiddleware = createMiddleware(async (c, next) => {
    try {
        // get token from cookie
        const token = getCookie(c, "jwt-hono");

        // token not found
        if (!token) {
            return c.json(ACCESS_UNAUTHORIZED_NO_TOKEN_FOUND, StatusCodes.UNAUTHORIZED);
        }

        // verify token
        const isValidToken = await verifyJwtTokenForHono(token);

        // invalid token
        if (!isValidToken) {
            return c.json(ACCESS_UNAUTHORIZED_INVALID_TOKEN, StatusCodes.UNAUTHORIZED);
        }

        // valid token -- get user by id
        const { userId } = isValidToken as { userId: string };
        const user = await User.findById(userId).select("-password");

        // invalid user
        if (!user) {
            return c.json(USER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        // valid user -- add user to req
        c.set("user", user);
        await next();
    } catch (error) {
        c.set("Custom-Error", errorHandler(error, "Hono", "auth middleware"));
        throw new Error("Something went wrong");
    }
});
