import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";

// files
import authRouter from "@s-n-routes/auth.routes";
import messageRouter from "@s-n-routes/message.routes";
import { logger } from "@s-utils";
import connectToMongoDB from "@s-db/connectToMongoDB";
import { env } from "@s-config/env";
import conversationRouter from "@s-n-routes/conversation.routes";
import globalErrorHandler from "@s-services/errors";
import AppError from "@s-services/errors/errorHandler";

// port
const port = env.NODE_PORT;

// express server
const app: Express = express();

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(logger);
app.use(`${env.API_VERSION}/auth`, authRouter); // auth routes
app.use(`${env.API_VERSION}/messages`, messageRouter); // message routes
app.use(`${env.API_VERSION}/conversations`, conversationRouter); // conversation routes

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World! from express server");
});

// not found path
app.all("*", (req, res, next) => {
    console.log(new AppError(`This path ${req.originalUrl} isn't on this server!`, 404, "NOT_FOUND"));
    next(new AppError(`This path ${req.originalUrl} isn't on this server!`, 404, "NOT_FOUND"));
});

// global error handler
app.use(globalErrorHandler);

// start server
app.listen(port, () => {
    // connect to MongoDB
    connectToMongoDB();
    console.log(`Server is running on url : http://localhost:${port} `);
});
