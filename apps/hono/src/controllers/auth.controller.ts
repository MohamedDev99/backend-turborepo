import { INVALID_CREDENTIALS, NEW_USER, USER_EXISTS, USER_LOGIN_SUCCESS, USER_LOGOUT_SUCCESS } from "@s-constants/user";
import User from "@s-models/user.model";
import { errorHandler } from "@s-services/errors/errorHandler";
import type { THonoContext } from "@s-types/common";
import { comparePassword, hashPassword } from "@s-utils";
import { generateJwtTokenAndSetCookieForHono } from "@s-utils/jwtToken";
import { Next } from "hono";
import { setCookie } from "hono/cookie";
import { createFactory } from "hono/factory";
import { StatusCodes } from "http-status-codes";
import { honoLoginBodyVM, honoSignupBodyVM } from "@s-middlewares/auth.middleware";

const authFactory = createFactory();

const login = authFactory.createHandlers(honoLoginBodyVM, async (c: THonoContext<"/login">) => {
    // TODO : body validation
    // get body from hono context
    const { username, password } = await c.req.json();

    try {
        // get user by username
        const user = await User.findOne({ username });
        // check if password is correct and username is correct
        const isValidPassword = await comparePassword(password, user?.password || "");
        if (!user || !isValidPassword) {
            return c.json(INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
        }

        // generate jwt token
        await generateJwtTokenAndSetCookieForHono(user._id.toString(), c);

        // success res
        return c.json({ ...USER_LOGIN_SUCCESS, data: user }, StatusCodes.OK);
    } catch (error) {
        c.set("Custom-Error", errorHandler(error, "Hono", "login controller"));
        throw new Error("Something went wrong");
    }
});

const logout = authFactory.createHandlers((c: THonoContext<"/logout">) => {
    try {
        // set cookie
        setCookie(c, "jwt-hono", "", {
            maxAge: 0,
        });

        return c.json(USER_LOGOUT_SUCCESS, StatusCodes.OK);
    } catch (error) {
        c.set("Custom-Error", errorHandler(error, "Hono", "logout controller"));
        throw new Error("Something went wrong");
    }
});

const signup = authFactory.createHandlers(honoSignupBodyVM, async (c: THonoContext<"/signup">, next: Next) => {
    const { fullName, username, gender, password } = await c.req.json();

    try {
        // check if user exists
        const user = await User.findOne({ username, fullName });
        if (user) {
            return c.json(USER_EXISTS, StatusCodes.BAD_REQUEST);
        }

        // hash password
        const hashedPassword = await hashPassword(password);

        // profile pic
        // profile pic
        const profilePic = `https://avatar.iran.liara.run/public/${
            (gender === "male" && "boy") || (gender === "female" && "girl")
        }/username=${username}`;
        console.log("create user to db ...");

        // create user
        const newUser = new User({
            fullName,
            username,
            gender,
            password: hashedPassword,
            profilePic,
        });

        // create jwt token
        await generateJwtTokenAndSetCookieForHono(newUser._id.toString(), c);
        // save user
        await newUser.save();

        return c.json(NEW_USER, StatusCodes.CREATED);
    } catch (error) {
        c.set("Custom-Error", errorHandler(error, "Hono", "signup controller"));
        throw new Error("Something went wrong");
    }
});

export default { login, logout, signup };
