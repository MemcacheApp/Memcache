import { Prisma, Session } from "@prisma/client";
import bcrypt from "bcryptjs";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { createElement } from "react";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../db/prisma";
import CollectionController from "./collection-controller";
import {
    AuthError,
    CreateUserError,
    GetUserError,
    LoginError,
    SendEmailError,
    VerifyCodeError,
} from "./errors/user";

const SECRET_KEY = "superSecretTestKey"; // TODO: move to .env
const resend = new Resend("re_U6PbCMXV_NRrF4vTFmSsRjqG6phfcrtwA");

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
                    publicProfile: true,
                    preferences: {
                        create: {
                            publicNewItem: true,
                        },
                    },
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

    static async logout(cookieString: string | null) {
        if (!cookieString) {
            throw new AuthError("NoJWT");
        }

        const cookieEntries = cookie.parse(cookieString);
        if (!cookieEntries.jwt) throw new AuthError("NoJWT");

        const session = jwt.verify(cookieEntries.jwt, SECRET_KEY) as Session;
        await prisma.session.delete({
            where: {
                id: session.id,
            },
        });
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
        return await prisma.user
            .findUniqueOrThrow({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    publicProfile: true,
                },
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
    static async userInfoByEmail(email: string) {
        return await prisma.user
            .findUniqueOrThrow({
                where: {
                    email,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    publicProfile: true,
                },
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
     * @throws {SendEmailError}
     */
    static async sendResetEmail(email: string) {
        // Resend API keys
        // re_U6PbCMXV_NRrF4vTFmSsRjqG6phfcrtwA
        // re_GtdRBzuT_h45BGz4jbSN5bK2mrSL7GM8c
        // demo: re_cNJGaKt2_NVL8pguqbXn1GCHqwZysVyos

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

        await resend.emails.send({
            from: "memcache@m-xue.dev",
            to: [email],
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
    static async updateProfile(
        userId: string,
        profile: {
            email?: string;
            firstName?: string;
            lastName?: string;
            publicProfile?: boolean;
        },
    ) {
        await prisma.user
            .update({
                where: {
                    id: userId,
                },
                data: profile,
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

    static async getPreferences(userId: string) {
        return await prisma.userPreferences
            .findUnique({
                where: {
                    userId,
                },
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

    static async updatePreferences(
        userId: string,
        preferences: {
            publicNewItem?: boolean;
        },
    ) {
        await prisma.userPreferences
            .update({
                where: {
                    userId,
                },
                data: preferences,
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
