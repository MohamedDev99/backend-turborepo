import { z } from "zod";

const EnvSchema = z.object({
    MONGO_DB_URL: z
        .string({
            description: "CosmosDB Connection string",
            required_error: "😱 You forgot to add a database URL",
        })
        .url()
        .min(3),
    HONO_PORT: z.coerce
        .number({
            description: ".env files convert numbers to strings, therefoore we have to enforce them to be numbers",
        })
        .positive()
        .max(65536, `options.port should be >= 0 and < 65536`)
        .default(3000),
    NODE_PORT: z.coerce
        .number({
            description: ".env files convert numbers to strings, therefoore we have to enforce them to be numbers",
        })
        .positive()
        .max(65536, `options.port should be >= 0 and < 65536`)
        .default(3000),
    API_VERSION: z.string().default("api/v1"),
    MONGO_DB_USERNAME: z.string(),
    MONGO_DB_PASSWORD: z.string(),
    MONGO_DB_NAME: z.string(),
    JWT_SECRET: z.string().default("secret"),
    JWT_EXPIRES_IN: z.number().default(3600),
    JWT_REFRESH_EXPIRES_IN: z.number().default(86400),
    NODE_ENV: z.string().default("development"),
    HONO_ENV: z.string().default("development"),
});

const envServer = EnvSchema.safeParse({
    HONO_PORT: process.env["HONO_PORT"],
    API_VERSION: process.env["API_VERSION"],
    MONGO_DB_URL: process.env["MONGO_DB_URL"],
    MONGO_DB_USERNAME: process.env["MONGO_DB_USERNAME"],
    MONGO_DB_PASSWORD: process.env["MONGO_DB_PASSWORD"],
    MONGO_DB_NAME: process.env["MONGO_DB_NAME"],
    NODE_PORT: process.env["NODE_PORT"],
    JWT_SECRET: process.env["JWT_SECRET"],
    JWT_EXPIRES_IN: parseInt(process.env["JWT_EXPIRES_IN"]!),
    JWT_REFRESH_EXPIRES_IN: parseInt(process.env["JWT_REFRESH_EXPIRES_IN"]!),
    NODE_ENV: process.env["NODE_ENV"],
    HONO_ENV: process.env["HONO_ENV"],
});

if (!envServer.success) {
    console.error(envServer.error.issues);
    throw new Error("There is an error with the server environment variables");
    process.exit(1);
}

export const env = envServer.data;
