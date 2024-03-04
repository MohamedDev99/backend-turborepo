import z from "zod";

export const signupSchema = z.object({
    fullName: z
        .string({
            required_error: "😱 You forgot to add a full name",
            invalid_type_error: "🚨 Type of full name should be a string",
        })
        .min(3, { message: "😱 Must be at least 3 characters " }),
    username: z
        .string({
            required_error: "😱 You forgot to add a user name",
            invalid_type_error: "🚨 Type of user name should be a string",
        })
        .min(3, { message: "😱 Must be at least 3 characters " }),
    gender: z.enum(["male", "female"], {
        required_error: "😱 You forgot to add a gender",
        invalid_type_error: "🚨 Type of gender should be 'male' or 'female'",
    }),
    password: z
        .string({
            required_error: "😱 You forgot to add a password",
            invalid_type_error: "🚨 You forgot to add a password",
        })
        .min(6),
});

export const loginSchema = z.object({
    username: z
        .string({
            required_error: "😱 You forgot to add a username",
            invalid_type_error: "🚨 Type of username should be a string",
        })
        .min(3, { message: "😱 Must be at least 3 characters " }),
    password: z
        .string({
            required_error: "😱 You forgot to add a password",
            invalid_type_error: "🚨 Type of password should be a string",
        })
        .min(6, { message: "😱 Must be at least 6 characters " }),
});

export const logoutSchema = z.object({});
