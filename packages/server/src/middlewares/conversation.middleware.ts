import { createConversationSchema, updateConversationSchema } from "@s-services/validation/conversation.validation";
import { honoValidateRequestMiddleware, validateExpressRequestMiddleware } from "@s-utils/validation";
import { validator } from "hono/validator";

// ? this middleware is used to validate express request
// create conversation middleware validation
export const createConversationValidationMiddleware = validateExpressRequestMiddleware({
    body: createConversationSchema,
});

// update conversation middleware validation
export const updateConversationValidationMiddleware = validateExpressRequestMiddleware({
    body: updateConversationSchema,
});

// ? hono server middlewares
// create conversation middleware validation
export const honoCreateConversationBodyVM = validator("json", honoValidateRequestMiddleware({ body: createConversationSchema }));
// update conversation middleware validation
export const honoUpdateConversationBodyVM = validator("json", honoValidateRequestMiddleware({ body: updateConversationSchema }));
