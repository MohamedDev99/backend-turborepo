import { errorHandler } from "@s-services/errors/errorHandler";
import bcrypt from "bcryptjs";
import { NextFunction, Response } from "express";
import { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";

// api logger
export const logger = morgan(":method :url :status :res[content-length] - :response-time ms");

// hash password
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, await bcrypt.genSalt(10));
};

// compare password
export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const logCatchErrors = (
    error: any,
    res: Response,
    next: NextFunction,
    errorLocation: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
) => {
    console.error(`Error in ${errorLocation} ::: `, error.message);
    next(errorHandler(error));
};

export const logCatchErrorsForHono = (error: any, c: Context, errorLocation: string) => {
    console.error(`Error in ${errorLocation} ::: `, error.message);
    c.set("", errorHandler(error, "Hono", errorLocation));
    throw new Error("Something went wrong");
};
