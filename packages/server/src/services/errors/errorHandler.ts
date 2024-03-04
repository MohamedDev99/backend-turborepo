import { env } from "@s-config/env";
import { ErrorHandler } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { StatusCodes } from "http-status-codes";

export default class AppError extends Error {
    statusCode: number;
    status: "fail" | "error";
    isOperational: boolean;
    type?: string;
    errors?: any[];
    location?: string;

    constructor(message: string, statusCode: number, type?: string, errors?: any[], location?: string) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        this.type = type || "AppError";
        this.errors = errors || [];
        this.location = location || "global";
        Error.captureStackTrace(this, this.constructor);
    }
}

// Cast Error Handler
const castErrorHandler = (err: any, location: string) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400, "CAST_ERROR", [], location);
};

// Duplicate Error Handler
const duplicateErrorHandler = (err: any, location: string) => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `field value:${value} aleady exist. please use another`;
    return new AppError(message, 400, "DUPLICATE_ERROR", [], location);
};

// Validation Error Handler
const validationErrorHandler = (err: any, location: string) => {
    const errors = { type: "VALIDATION_ERROR", fieldErrors: err.errors.map((el: any) => ({ path: el.path, message: el.message })) };
    const message = `Invalid input data.`;
    return new AppError(message, 409, "VALIDATION_ERROR", [errors], location);
};

export const errorHandler = (err: any, type?: string, location?: string) => {
    // cast error
    if (err?.name === "CastError") {
        return castErrorHandler(err, location || "");
    }
    // duplicate error
    if (err?.code === 11000) {
        return duplicateErrorHandler(err, location || "");
    }
    // validation error
    if (err?.name === "ValidationError") {
        return validationErrorHandler(err, location || "");
    }

    return new AppError(err.message, 500, type || "APP_ERROR", [], location || "global");
};

// hono error handler
export const honoErrorHandler: ErrorHandler = (err, c) => {
    // const customError = c.get("Custom-Error");

    // custom error is undefined
    if (!c.get("Custom-Error")) {
        return c.json(
            {
                status: "error",
                message: "Something went wrong",
                error: err,
            },
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }

    let { statusCode, status, message, errors, type, ...customError } = c.get("Custom-Error");

    // console.log("honoErrorHandler :: ", { ...customError });

    // if (env.HONO_ENV === "production") {
    //     statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    //     message = "Something went wrong";
    // }

    const response = {
        status,
        ...(type && { type }),
        message,
        ...(errors.length > 0 && { errors }),
        ...(env.HONO_ENV !== "production" && { stack: customError.stack, ...customError }),
    };

    return c.json(response, statusCode as StatusCode);
};
