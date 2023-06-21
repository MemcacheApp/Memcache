import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";

export default class TagController {
    static async createTag(userId: string, name: string) {
        if (await this.getTagByName(userId, name)) {
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

    static async getTag(id: string) {
        const tag = await prisma.tag.findUnique({
            where: {
                id,
            },
        });
        return tag;
    }

    static async getTagByName(userId: string, name: string) {
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

    static async getTagNames(userId: string) {
        const tags = await this.getTags(userId);
        return tags.map((tag) => tag.name);
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
        return prisma.tag.createMany({
            data: names.map((name) => ({
                id: uuidv4(),
                name,
                userId,
            })),
        });
    }
}
