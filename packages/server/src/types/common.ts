import { Context, Env } from "hono";
import { BlankInput } from "hono/types";

export type TRoutes = "/login" | "/logout" | "/signup";

export type THonoContext<T extends TRoutes> = Context<Env, T, BlankInput>;

export type TMessageType = "text" | "image" | "video" | "file" | "location" | "url";
