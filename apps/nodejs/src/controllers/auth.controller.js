"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("@s-constants/user");
const user_model_1 = __importDefault(require("@s-models/user.model"));
const jwtToken_1 = require("@s-utils/jwtToken");
const index_1 = require("@s-utils/index");
const http_status_codes_1 = require("http-status-codes");
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        // check if user exists and password is correct
        const user = await user_model_1.default.findOne({ username });
        const isPasswordCorrect = await (0, index_1.comparePassword)(password, user?.password || "");
        // invalid credentials
        if (!user || !isPasswordCorrect) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(user_1.INVALID_CREDENTIALS);
        }
        // generate jwt token
        (0, jwtToken_1.generateJwtTokenAndSetCookieForNodejs)(user._id.toString(), res);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            ...user_1.USER_LOGIN_SUCCESS,
            data: user,
        });
    }
    catch (error) {
        (0, index_1.logCatchErrors)(error, res, next, "login controller");
    }
};
const logout = (req, res, next) => {
    try {
        // update user cookie
        res.cookie("jwt", "", {
            maxAge: 0,
        });
        // logout success
        res.status(http_status_codes_1.StatusCodes.OK).json(user_1.USER_LOGOUT_SUCCESS);
    }
    catch (error) {
        (0, index_1.logCatchErrors)(error, res, next, "logout controller");
    }
};
const signup = async (req, res, next) => {
    try {
        const { fullName, username, gender, password } = req.body;
        // check if user exists
        const user = await user_model_1.default.findOne({ username });
        if (user) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(user_1.USER_EXISTS);
        }
        // hash password
        const hashedPassword = await (0, index_1.hashPassword)(password);
        // profile pic
        const profilePic = `https://avatar.iran.liara.run/public/${(gender === "male" && "boy") || (gender === "female" && "girl")}/username=${username}`;
        console.log("create user to db ...");
        // create user
        const newUser = new user_model_1.default({
            fullName,
            username,
            gender,
            password: hashedPassword,
            profilePic,
        });
        // invalid user data
        if (!newUser) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(user_1.INVALID_USER_DATA);
        }
        // generate jwt token
        (0, jwtToken_1.generateJwtTokenAndSetCookieForNodejs)(newUser._id.toString(), res);
        // save user
        await newUser.save();
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(user_1.NEW_USER);
    }
    catch (error) {
        (0, index_1.logCatchErrors)(error, res, next, "signup controller");
    }
};
exports.default = {
    login,
    logout,
    signup,
};
