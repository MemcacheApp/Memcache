import { createError } from "../../utils";

export const CreateUserError = createError("CreateUserError", {
    EmailUsed: "The email is already registered",
});

export const LoginError = createError("LoginError", {
    EmailNotExist: "No account exists for this email",
    WrongPassword: "Incorrect password",
});

export const AuthError = createError("ValidateError", {
    NoJWT: "No JWT provided in user header",
    InvalidJWT: "JWT is invalid",
    SessionExpired: "Session has expired",
    NoPermission: "The user does not have permission to perform the operation",
});
