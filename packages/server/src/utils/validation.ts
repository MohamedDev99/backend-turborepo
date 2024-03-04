import { RequestHandler, Response } from "express";
import { ZodError, ZodIssue, ZodSchema, z } from "zod";
import { RequestValidation } from "zod-express-middleware";
import { StatusCodes } from "http-status-codes";
import { Context, Env, MiddlewareHandler, ValidationTargets } from "hono";
import { ValidationFunction } from "hono/validator";

type ErrorListItem = { type: "Query" | "Params" | "Body"; errors: ZodError<any> };

// ? this middleware is used to validate express request
export const validateExpressRequestMiddleware: <TParams = any, TQuery = any, TBody = any>(
    schemas: RequestValidation<TParams, TQuery, TBody>
) => RequestHandler<TParams, any, TBody, TQuery> =
    ({ params, query, body }) =>
    (req, res, next) => {
        const errors: Array<ErrorListItem> = [];
        if (params) {
            const parsed = params.safeParse(req.params);
            if (!parsed.success) {
                errors.push({ type: "Params", errors: parsed.error });
            }
        }
        if (query) {
            const parsed = query.safeParse(req.query);
            if (!parsed.success) {
                errors.push({ type: "Query", errors: parsed.error });
            }
        }
        if (body) {
            const parsed = body.safeParse(req.body);
            if (!parsed.success) {
                errors.push({ type: "Body", errors: parsed.error });
            }
        }
        if (errors.length > 0) {
            return sendErrors(errors, res);
        }
        return next();
    };

const sendErrors: (errors: Array<ErrorListItem>, res: Response) => void = (errors, res) => {
    return res.status(StatusCodes.CONFLICT).send({
        status: "fail",
        type: "VALIDATION_ERROR",
        message: "Invalid input data.",
        errors: errors.map((error) => ({
            type: error.type,
            fieldErrors: error.errors.flatten((issue: ZodIssue) => ({
                message: issue.message,
                errorCode: issue.code,
            })).fieldErrors,
        })),
    });
};

// ? this middleware is used to validate hono request

export const honoValidateRequestMiddleware: <TParams = any, TQuery = any, TBody = any>(
    schemas: RequestValidation<TParams, TQuery, TBody>
) => ValidationFunction<any, any> = (schemas) => async (value, c) => {
    // console.log("hello from honoValidateRequestMiddleware");

    if (!schemas) {
        return c.json(
            {
                status: "fail",
                message: "No schemas provided",
            },
            StatusCodes.CONFLICT
        );
    }

    // errors
    let errors: Array<ErrorListItem> = [];

    // ? validate body
    if (schemas.body) {
        await validateData(value, schemas.body, "Body", errors);
    }

    // ? validate query
    if (schemas.query) {
        await validateData(value, schemas.query, "Query", errors);
    }

    // ? validate params
    if (schemas.params) {
        await validateData(value, schemas.params, "Params", errors);
    }

    if (errors.length > 0) {
        return honoSendErrors(errors, c);
    }

    return value;
};

export const honoSendErrors = (errors: Array<ErrorListItem>, c: Context) => {
    return c.json(
        {
            status: "fail",
            type: "VALIDATION_ERROR",
            message: "Invalid input data.",
            errors: errors.map((error) => ({
                type: error.type,
                fieldErrors: error.errors.flatten((issue: ZodIssue) => ({
                    message: issue.message,
                    errorCode: issue.code,
                })).fieldErrors,
            })),
        },
        StatusCodes.CONFLICT
    );
};

const validateData = async <T, K extends any>(
    data: T,
    schema: ZodSchema<K, z.ZodTypeDef, K>,
    type: "Query" | "Params" | "Body",
    errors: Array<ErrorListItem>
) => {
    // console.log("hello from validateData");
    const parsed = await schema.safeParseAsync(data);
    if (!parsed.success) {
        errors.push({ type: "Body", errors: parsed.error });
    }
};
