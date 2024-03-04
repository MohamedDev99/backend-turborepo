import { zValidator } from "@hono/zod-validator";
import { loginSchema, signupSchema } from "@s-services/validation/auth.validation";
import { honoSendErrors, honoValidateRequestMiddleware, validateExpressRequestMiddleware } from "@s-utils/validation";
import { validator } from "hono/validator";

// ? node server middlewares
// auth/signup middleware validation
export const signupValidationMiddleware = validateExpressRequestMiddleware({ body: signupSchema });

// auth/login middleware validation
export const loginValidationMiddleware = validateExpressRequestMiddleware({ body: loginSchema });

// ? hono server middlewares
// auth/signup middleware validation
export const honoSignupBodyVM = validator("json", honoValidateRequestMiddleware({ body: signupSchema }));

// auth/login middleware validation
export const honoLoginBodyVM = validator("json", honoValidateRequestMiddleware({ body: loginSchema }));
