import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import { CreateCollectionError, GetCollectionError } from "./errors/collection";

export default class CollectionController {
    /**
     * @throws {CreateCollectionError}
     */
    static async createCollection(userId: string, name: string) {
        if (await this.getCollectionByName(userId, name)) {
            throw new CreateCollectionError(
                "CollectionExist",
                `Collection ${name} already exists for user ${userId}`
            );
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

    /**
     * @throws {GetCollectionError}
     */
    static async getCollection(id: string) {
        const collection = await prisma.collection.findUnique({
            where: {
                id,
            },
        });

        if (collection === null) {
            throw new GetCollectionError("CollectionNotExist");
        }

        return collection;
    }

    /**
     * @throws {GetCollectionError}
     */
    static async getCollectionByName(userId: string, name: string) {
        const collection = await prisma.collection.findFirst({
            where: {
                name,
                userId,
            },
        });

        if (collection === null) {
            throw new GetCollectionError("CollectionNotExist");
        }

        return collection;
    }

    static async getUserCollections(userId: string) {
        const collections = await prisma.collection.findMany({
            where: {
                userId,
            },
        });
        return collections;
    }

    static async getOrCreateCollection(userId: string, name: string) {
        return await prisma.collection.upsert({
            where: {
                userId_name: {
                    userId,
                    name,
                },
            },
            update: {},
            create: {
                id: uuidv4(),
                name,
                userId,
            },
        });
    }
}
