import { INVALID_CREDENTIALS, INVALID_USER_DATA, NEW_USER, USER_EXISTS, USER_LOGIN_SUCCESS, USER_LOGOUT_SUCCESS } from "@s-constants/user";
import User from "@s-models/user.model";
import { generateJwtTokenAndSetCookieForNodejs } from "@s-utils/jwtToken";
import { comparePassword, hashPassword, logCatchErrors } from "@s-utils/index";
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

const login: RequestHandler = async (req: Request, res: Response, next) => {
    try {
        const { username, password } = req.body;

        // check if user exists and password is correct
        const user = await User.findOne({ username });
        const isPasswordCorrect = await comparePassword(password, user?.password || "");

        // invalid credentials
        if (!user || !isPasswordCorrect) {
            return res.status(StatusCodes.BAD_REQUEST).json(INVALID_CREDENTIALS);
        }

        // generate jwt token
        generateJwtTokenAndSetCookieForNodejs(user._id.toString(), res);

        return res.status(StatusCodes.OK).json({
            ...USER_LOGIN_SUCCESS,
            data: user,
        });
    } catch (error) {
        logCatchErrors(error, res, next, "login controller");
    }
};

const logout: RequestHandler = (req: Request, res: Response, next) => {
    try {
        // update user cookie
        res.cookie("jwt", "", {
            maxAge: 0,
        });
        // logout success
        res.status(StatusCodes.OK).json(USER_LOGOUT_SUCCESS);
    } catch (error) {
        logCatchErrors(error, res, next, "logout controller");
    }
};

const signup: RequestHandler = async (req: Request, res: Response, next) => {
    try {
        const { fullName, username, gender, password } = req.body;
        // check if user exists
        const user = await User.findOne({ username });
        if (user) {
            return res.status(StatusCodes.BAD_REQUEST).json(USER_EXISTS);
        }

        // hash password
        const hashedPassword = await hashPassword(password);

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

        // invalid user data
        if (!newUser) {
            return res.status(StatusCodes.BAD_REQUEST).json(INVALID_USER_DATA);
        }
        // generate jwt token
        generateJwtTokenAndSetCookieForNodejs(newUser._id.toString(), res);
        // save user
        await newUser.save();

        return res.status(StatusCodes.CREATED).json(NEW_USER);
    } catch (error) {
        logCatchErrors(error, res, next, "signup controller");
    }
};

export default {
    login,
    logout,
    signup,
};
