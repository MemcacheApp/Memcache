import { createError } from "../../utils";

export const CreateUserError = createError({
    EmailUsed: "The email is already registered",
});

export const LoginError = createError({
    EmailNotExist: "No account exists for this email",
    WrongPassword: "Incorrect password",
});

export const ValidateError = createError({
    NoJWT: "No JWT provided in user header",
    InvalidJWT: "JWT is invalid",
    SessionExpired: "Session has expired",
});
