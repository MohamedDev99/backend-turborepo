import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import { env } from "server/src/config/env";
import connectToMongoDB from "server/src/db/connectToMongoDB";
import authHonoRouter from "./routes/auth.routes";
import AppError, { honoErrorHandler } from "@s-services/errors/errorHandler";
import { PATH_NOT_FOUND } from "@s-constants/server";
import { IProtectedUser } from "@s-types/user";
import conversationHonoRouter from "@s-h-routes/conversation.routes";
import messageHonoRouter from "@s-h-routes/message.routes";

declare module "hono" {
    interface ContextVariableMap {
        "Custom-Error": AppError;
        user: IProtectedUser;
    }
}

const app = new Hono().basePath(env.API_VERSION);

// connect to database
connectToMongoDB();

// middleware
app.use(
    `/*`,
    cors({
        origin: "http://localhost:3000",
        allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
        allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
        exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
        maxAge: 600,
        credentials: true,
    })
); // cors
// app.use(
//     "*",
//     csrf({
//         origin: (origin) => /https:\/\/(\w+\.)?myapp\.example\.com$/.test(origin),
//     })
// );
app.use(logger()); // logger
app.use(timing()); // timing

app.get("/", (c) => {
    return c.text("Hello World! from hono server");
});

// auth routes
app.route(`/auth`, authHonoRouter);
app.route(`/messages`, messageHonoRouter);
app.route(`/conversations`, conversationHonoRouter);

// hono not found
app.notFound((c) => {
    return c.json(PATH_NOT_FOUND(c.req.path), 404);
});

// onError
app.onError(honoErrorHandler);

export default {
    fetch: app.fetch,
    port: env.HONO_PORT,
};

