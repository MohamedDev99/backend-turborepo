import { env } from "@s-config/env";
import type { Response } from "express";
import jwt from "jsonwebtoken";
import { sign, verify } from "hono/jwt";
import { THonoContext, TRoutes } from "@s-types/common";
import { setCookie } from "hono/cookie";
import { addDays, addHours, addMilliseconds } from "date-fns";

//? nodejs jwt token
// generate jwt token
export const generateJwtTokenAndSetCookieForNodejs = async (userId: string, res: Response) => {
    const isSecure = env.NODE_ENV !== "development";

    const token = jwt.sign({ userId }, env.JWT_SECRET, {
        expiresIn: `${env.JWT_EXPIRES_IN.toString()}d`,
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: addDays(Date.now(), env.JWT_EXPIRES_IN).getMilliseconds(),
        sameSite: "strict",
        secure: isSecure,
    });
};

// verify jwt token in node js
export const verifyJwtTokenForNodejs = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET);
};

//? hono jwt token
// generate jwt token
export const generateJwtTokenAndSetCookieForHono = async <T extends TRoutes>(userId: string, c: THonoContext<T>) => {
    // const isSecure =  env.NODE_ENV !== "development"

    const token = await sign({ userId }, env.JWT_SECRET);

    setCookie(c, "jwt-hono", token, {
        httpOnly: true,
        maxAge: addDays(Date.now(), env.JWT_EXPIRES_IN).getMilliseconds(),
        sameSite: "Strict",
        secure: true,
        path: "/",
    });
};

// verify jwt token in hono
export const verifyJwtTokenForHono = async (token: string) => {
    return await verify(token, env.JWT_SECRET);
};
