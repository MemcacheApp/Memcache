import bcrypt from "bcryptjs";
import { Prisma, Session } from "@prisma/client";
import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import CollectionController from "./collection-controller";

const SECRET_KEY = "superSecretTestKey"; // TODO: move to .env

export default class UserController {
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
                    throw new Error("Email is already registered");
                } else {
                    throw err;
                }
            });

        CollectionController.createCollection("Default", user.id);

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

    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new Error("No account exists for this email");
        }

        if (!bcrypt.compareSync(password, user.password)) {
            throw new Error("Incorrect password");
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

    static async validate(cookieString: string | null) {
        if (!cookieString) {
            throw new Error("No cookie in header");
        }

        const cookieEntries = cookie.parse(cookieString);
        if (!cookieEntries.jwt) throw new Error("No JWT token in cookie");

        let session;
        try {
            session = jwt.verify(cookieEntries.jwt, SECRET_KEY) as Session;
        } catch (err) {
            throw new Error("invalid jwt");
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
                        throw new Error("Session has expired");
                    }
                } else {
                    throw err;
                }
            });

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: session.userId,
            },
        });

        return {
            userId: session.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
    }
}
