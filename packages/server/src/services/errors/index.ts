import { env } from "@s-config/env";
import { NextFunction, Request, Response } from "express";
import AppError from "./errorHandler";

// Error Handler For Development Environment
const devError = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        type: err.type,
        error: err,
        message: err.message,
        ...(err.type === "VALIDATION_ERROR" && { errors: err.errors }),
        stack: err.stack,
    });
};

//Error Handler For Production Environment
const prodError = (err: AppError, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            type: err.type,
            ...(err.type === "VALIDATION_ERROR" && { errors: err.errors }),
        });
    } else {
        res.status(500).json({
            status: "error",
            message: "something went very wrong!",
        });
    }
};

//Global Error Handler
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("from global error handler ....");
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (env.NODE_ENV === "development") {
        devError(err, res);
    } else if (env.NODE_ENV === "production") {
        prodError(err, res);
    }
};

export default globalErrorHandler;
