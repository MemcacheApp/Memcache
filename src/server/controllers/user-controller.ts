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
} from "./errors/user";

const SECRET_KEY = "superSecretTestKey"; // TODO: move to .env

export default class UserController {
    /**
     * @throws {CreateUserError}
     */
    static async createUser(
        firstName: string,
        lastName: string,
        email: string,
        password: string
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

        CollectionController.createCollection(user.id, "Default");

        const session = await prisma.session.create({
            data: {
                id: uuidv4(),
                userId: user.id,
            },
        });

        const token = jwt.sign(session, SECRET_KEY, {
            expiresIn: 31556926, // 1 year in seconds
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
            throw new LoginError("WrongPassword");
        }

        const session: Session = await prisma.session.create({
            data: {
                id: uuidv4(),
                userId: user.id,
            },
        });

        const token = jwt.sign(session, SECRET_KEY, {
            expiresIn: 31556926, // 1 year in seconds TODO: fix this?
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
        const user = await prisma.user.findUniqueOrThrow({
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
     */
    static async isValidEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (user === null) {
            throw new GetUserError("UserNotExist");
        }

        if (user) {
            return true;
        } else {
            return false;
        }
    }

    static async updatePassword(email: string, newPassword: string) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newPassword, salt);

        const user = await prisma.user.update({
            where: { email },
            data: { password: hashPassword },
        });

        return user;
    }

    static async updateEmail(id: string, newEmail: string) {
        const user = await prisma.user.update({
            where: { id },
            data: { email: newEmail },
        });
        return user;
    }

    static async updateFirstName(id: string, newFirstName: string) {
        const user = await prisma.user.update({
            where: { id },
            data: { firstName: newFirstName },
        });
        return user;
    }

    static async updateLastName(id: string, newlastName: string) {
        const user = await prisma.user.update({
            where: { id },
            data: { lastName: newlastName },
        });
        return user;
    }
}
