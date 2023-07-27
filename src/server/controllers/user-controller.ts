import bcrypt from "bcryptjs";
import { Prisma, Session } from "@prisma/client";
import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import CollectionController from "./collection-controller";
import {
    CreateUserError,
    LoginError,
    AuthError,
    GetUserError,
    SendEmailError,
    VerifyCodeError,
} from "./errors/user";
import { Resend } from "resend";
import { createElement } from "react";

const SECRET_KEY = "superSecretTestKey"; // TODO: move to .env
const resend = new Resend("re_GtdRBzuT_h45BGz4jbSN5bK2mrSL7GM8c");

export default class UserController {
    /**
     * @throws {CreateUserError}
     */
    static async createUser(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
    ) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const user = await prisma.user
            .create({
                data: {
                    id: uuidv4(),
                    firstName: firstName,
                    lastName: lastName,
                    password: hashPassword,
                    email: email,
                },
            })
            .catch((err) => {
                if (
                    err instanceof Prisma.PrismaClientKnownRequestError &&
                    err.code === "P2002"
                ) {
                    throw new CreateUserError("EmailUsed");
                } else {
                    throw err;
                }
            });

        await CollectionController.createCollection(user.id, "Default");

        const session = await prisma.session.create({
            data: {
                id: uuidv4(),
                userId: user.id,
            },
        });

        const token = jwt.sign(session, SECRET_KEY, {
            expiresIn: "90d",
        });

        return {
            token,
        };
    }

    /**
     * @throws {LoginError}
     */
    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new LoginError("EmailNotExist");
        }

        if (!bcrypt.compareSync(password, user.password)) {
            throw new LoginError("PasswordIncorrect");
        }

        const session: Session = await prisma.session.create({
            data: {
                id: uuidv4(),
                userId: user.id,
            },
        });

        const token = jwt.sign(session, SECRET_KEY, {
            expiresIn: "90d",
        });

        return {
            token,
        };
    }

    /**
     * @throws {AuthError}
     */
    static async validate(cookieString: string | null) {
        if (!cookieString) {
            throw new AuthError("NoJWT");
        }

        const cookieEntries = cookie.parse(cookieString);
        if (!cookieEntries.jwt) throw new AuthError("NoJWT");

        let session;
        try {
            session = jwt.verify(cookieEntries.jwt, SECRET_KEY) as Session;
        } catch (err) {
            throw new AuthError("InvalidJWT");
        }

        await prisma.session
            .findFirstOrThrow({
                where: {
                    id: session.id,
                    userId: session.userId,
                },
            })
            .catch((err) => {
                if (err instanceof Prisma.PrismaClientKnownRequestError) {
                    if (err.code === "P2025") {
                        throw new AuthError("SessionExpired");
                    }
                } else {
                    throw err;
                }
            });

        return {
            userId: session.userId,
        };
    }

    /**
     * @throws {GetUserError}
     */
    static async userInfo(userId: string) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (user === null) {
            throw new GetUserError("UserNotExist");
        }

        // Do not return the user object directly, as it contains the hashed password
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
    }

    /**
     * @throws {GetUserError}
     */
    static async userInfoByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (user === null) {
            throw new GetUserError("UserNotExist");
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastname: user.lastName,
            email: user.email,
        };
    }

    /**
     * @throws {GetUserError}
     * @throws {SendEmailError}
     */
    static async sendResetEmail(email: string) {
        // Resend API keys
        // re_U6PbCMXV_NRrF4vTFmSsRjqG6phfcrtwA
        // re_GtdRBzuT_h45BGz4jbSN5bK2mrSL7GM8c

        // memcache3900@gmail.com
        // bendermen3900

        const user = await this.userInfoByEmail(email);

        const lastResetCode = await prisma.resetCode.findUnique({
            where: {
                userId: user.id,
            },
        });

        const now = new Date();
        if (
            lastResetCode &&
            now.getTime() - lastResetCode.createAt.getTime() < 60000 // less than 1 min
        ) {
            throw new SendEmailError("TooManyRequests");
        }

        const code = Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0");
        console.log(code);
        const salt = bcrypt.genSaltSync(10);
        const hashCode = bcrypt.hashSync(code, salt);

        await prisma.resetCode.upsert({
            where: {
                userId: user.id,
            },
            update: {
                code: hashCode,
                createAt: now,
            },
            create: {
                userId: user.id,
                code: hashCode,
                createAt: now,
            },
        });

        const ResetPasswordEmail = (
            await import(
                "../../../react-email-templates/emails/reset-password-email"
            )
        ).default;
        resend.sendEmail({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Memcache Password Reset Code",
            react: createElement(ResetPasswordEmail, {
                code,
            }),
        });
    }

    /**
     * @throws {GetUserError}
     * @throws {VerifyCodeError}
     */
    static async verifyResetCode(email: string, code: string) {
        const user = await this.userInfoByEmail(email);
        const resetCode = await prisma.resetCode.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (!resetCode) {
            throw new VerifyCodeError("CodeIncorrect");
        }

        if (Date.now() - resetCode.createAt.getTime() > 7200000) {
            // 2 hours
            throw new VerifyCodeError("CodeExpired");
        }

        if (!bcrypt.compareSync(code, resetCode?.code)) {
            throw new VerifyCodeError("CodeIncorrect");
        }
    }

    /**
     * @throws {GetUserError}
     * @throws {VerifyCodeError}
     */
    static async updatePassword(
        email: string,
        code: string,
        newPassword: string,
    ) {
        await this.verifyResetCode(email, code);

        const user = await this.userInfoByEmail(email);

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newPassword, salt);

        await prisma.resetCode.delete({
            where: { userId: user.id },
        });

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashPassword },
        });
    }

    /**
     * @throws {GetUserError}
     */
    static async updateEmail(id: string, newEmail: string) {
        await prisma.user
            .update({
                where: { id },
                data: { email: newEmail },
            })
            .catch((err) => {
                if (
                    err instanceof Prisma.PrismaClientKnownRequestError &&
                    err.code === "P2025"
                ) {
                    throw new GetUserError("UserNotExist");
                } else {
                    throw err;
                }
            });
    }

    /**
     * @throws {GetUserError}
     */
    static async updateFirstName(id: string, newFirstName: string) {
        await prisma.user
            .update({
                where: { id },
                data: { firstName: newFirstName },
            })
            .catch((err) => {
                if (
                    err instanceof Prisma.PrismaClientKnownRequestError &&
                    err.code === "P2025"
                ) {
                    throw new GetUserError("UserNotExist");
                } else {
                    throw err;
                }
            });
    }

    /**
     * @throws {GetUserError}
     */
    static async updateLastName(id: string, newlastName: string) {
        await prisma.user
            .update({
                where: { id },
                data: { lastName: newlastName },
            })
            .catch((err) => {
                if (
                    err instanceof Prisma.PrismaClientKnownRequestError &&
                    err.code === "P2025"
                ) {
                    throw new GetUserError("UserNotExist");
                } else {
                    throw err;
                }
            });
    }
}
