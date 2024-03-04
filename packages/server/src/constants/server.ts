export const INVALID_ENVIRONMENT = { status: "fail", message: "Invalid environment" };
export const INTERNAL_SERVER_ERROR = { status: "server error", message: "Internal server error" };
export const PATH_NOT_FOUND = (path: string) => ({ status: "fail", message: `This path ${path} isn't on this server! ` });
