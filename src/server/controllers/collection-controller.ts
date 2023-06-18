import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";

export default class CollectionController {
    static async createCollection(name: string, userId: string) {
        if (await this.getCollection(name, userId)) {
            throw Error("Collection already exists");
        }

        const collection = await prisma.collection.create({
            data: {
                id: uuidv4(),
                name,
                userId,
            },
        });
        return collection;
    }

    static async getCollection(name: string, userId: string) {
        const collection = await prisma.collection.findFirst({
            where: {
                name,
                userId,
            },
        });
        return collection;
    }

    static async getOrCreateCollection(name: string, userId: string) {
        let collection = await prisma.collection.findFirst({
            where: {
                name,
                userId,
            },
        });

        if (!collection) {
            collection = await prisma.collection.create({
                data: {
                    id: uuidv4(),
                    name,
                    userId,
                },
            });
        }

        return collection;
    }
}
