import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";

export default class TagController {
    static async createTag(name: string, userId: string) {
        if (await this.getTag(name, userId)) {
            throw Error("Tag already exists");
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

    static async getTag(name: string, userId: string) {
        const tag = await prisma.tag.findFirst({
            where: {
                name,
                userId,
            },
        });
        return tag;
    }

    static async getTags(userId: string) {
        const tags = await prisma.tag.findMany({
            where: {
                userId,
            },
        });
        return tags;
    }

    static async getOrCreateTag(name: string, userId: string) {
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

    static async getOrCreateTags(names: string[], userId: string) {
        return Promise.all(
            names.map((name) => this.getOrCreateTag(name, userId))
        );
    }
}
