export const ACCESS_GRANTED = { status: "success", message: "Access granted" };
export const ACCESS_DENIED = { status: "fail", message: "Access denied" };
export const ACCESS_FORBIDDEN = { status: "fail", message: "Access forbidden" };
export const ACCESS_UNAUTHORIZED_NO_TOKEN_FOUND = {
    status: "fail",
    message: "Access unauthorized - No token found",
};

export const ACCESS_UNAUTHORIZED_INVALID_TOKEN = {
    status: "fail",
    message: "Access unauthorized - Invalid token",
};

export const ACCESS_UNAUTHORIZED_EXPIRED_TOKEN = {
    status: "fail",
    message: "Access unauthorized - Expired token",
};
