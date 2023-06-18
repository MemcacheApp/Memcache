import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import CollectionController from "./collection-controller";
import TagController from "./tag-controller";

export default class ItemController {
    static async createItem(
        title: string,
        url: string,
        description: string,
        collectionName: string,
        tagNames: string[],
        thumbnail: string | null,
        userId: string
    ) {
        const collection = await CollectionController.getOrCreateCollection(
            collectionName,
            userId
        );
        const tags = await TagController.getOrCreateTags(tagNames, userId);
        const item = await prisma.item.create({
            data: {
                id: uuidv4(),
                status: 0,
                collectionId: collection.id,
                tags: {
                    connect: tags.map((tag) => ({ id: tag.id })),
                },
                title,
                url,
                description,
                thumbnail,
                createdAt: new Date(),
                userId,
            },
        });

        return item;
    }

    static async getItem(itemId: string) {
        const item = await prisma.item.findFirst({
            where: {
                id: itemId,
            },
        });
        return item;
    }

    static async getItems(userId: string) {
        const items = await prisma.item.findMany({
            where: {
                userId,
            },
        });
        return items;
    }

    static async deleteItem(itemId: string, userId: string) {
        const item = await prisma.item.findFirst({
            where: {
                id: itemId,
            },
        });

        if (item && item.userId === userId) {
            await prisma.item.delete({
                where: {
                    id: itemId,
                },
            });
        }
    }
}
