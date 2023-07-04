import { createError } from "../../utils";

export const CreateUserError = createError("CreateUserError", {
    EmailUsed: "The email is already registered",
});

export const LoginError = createError("LoginError", {
    EmailNotExist: "No account exists for this email",
    PasswordIncorrect: "The password is incorrect",
});

export const AuthError = createError("ValidateError", {
    NoJWT: "No JWT provided in user header",
    InvalidJWT: "JWT is invalid",
    SessionExpired: "Session has expired",
    NoPermission: "The user does not have permission to perform the operation",
});

export const GetUserError = createError("GetUserError", {
    UserNotExist: "The user does not exist",
});

export const SendResetEmailError = createError("SendResetEmailError", {
    TooManyRequests: "Only one email can be sent within one minute",
});

export const UpdatePasswordError = createError("UpdatePasswordError", {
    CodeIncorrect: "The code is incorrect",
});
