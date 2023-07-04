import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import { CreateTagError, GetTagError } from "./errors/tag";

export default class TagController {
    static async createTag(userId: string, name: string) {
        if (await this.getTagByName(userId, name)) {
            throw new CreateTagError(
                "TagExist",
                `Tag ${name} already exists for user ${userId}`
            );
        }

        const tag = await prisma.tag.create({
            data: {
                id: uuidv4(),
                name,
                userId,
            },
        });
        return tag;
    }

    static async getTag(id: string) {
        const tag = await prisma.tag.findUnique({
            where: {
                id,
            },
        });

        if (tag === null) {
            throw new GetTagError("TagNotExist");
        }

        return tag;
    }

    static async getTagByName(userId: string, name: string) {
        const tag = await prisma.tag.findFirst({
            where: {
                name,
                userId,
            },
        });

        if (tag === null) {
            throw new GetTagError("TagNotExist");
        }

        return tag;
    }

    static async getUserTags(userId: string) {
        const tags = await prisma.tag.findMany({
            where: {
                userId,
            },
        });
        return tags;
    }

    static async getOrCreateTag(userId: string, name: string) {
        let tag = await prisma.tag.findFirst({
            where: {
                name,
                userId,
            },
        });

        if (!tag) {
            tag = await prisma.tag.create({
                data: {
                    id: uuidv4(),
                    name,
                    userId,
                },
            });
        }

        return tag;
    }

    static async getOrCreateTags(userId: string, names: string[]) {
        return Promise.all(
            names.map((name) => this.getOrCreateTag(userId, name))
        );
    }
}
