import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import CollectionController from "./collection-controller";
import TagController from "./tag-controller";
import { Collection, Item, Tag } from "@prisma/client";

export default class ItemController {
    static async createItem(
        userId: string,
        title: string,
        url: string,
        description: string,
        thumbnail: string | null,
        collectionName: string,
        tagNames: string[]
    ) {
        const collection = await CollectionController.getOrCreateCollection(
            userId,
            collectionName
        );
        const tags = await TagController.getOrCreateTags(userId, tagNames);
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

    static async createFromURL(
        userId: string,
        url: string,
        collectionName: string,
        tagNames: string[]
    ) {
        return await this.createItem(
            userId,
            "Title",
            url,
            "Description",
            null,
            collectionName,
            tagNames
        );
    }

    static async getItem(itemId: string) {
        const item = await prisma.item.findUnique({
            where: {
                id: itemId,
            },
            include: {
                tags: true,
                collection: true,
            },
        });
        return item;
    }

    static async getItems(userId: string) {
        const items = await prisma.item.findMany({
            where: {
                userId,
            },
            include: {
                tags: true,
                collection: true,
            },
        });
        return items;
    }

    static async deleteItem(userId: string, itemId: string) {
        const item = await prisma.item.findUnique({
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

	static async updateItemStatus(userId: string, itemId: string, status: number) {
		const item = await prisma.item.findUnique({
			where: {
				id: itemId,
			},
		});

		if (item && item.userId === userId) {
			return await prisma.item.update({
				where: {
					id: itemId,
				},
				data: {
					status: status,
				},
			});
		}
	}


    static async setCollection(
        userId: string,
        itemId: string,
        collectionName: string
    ) {
        const collection = await CollectionController.getOrCreateCollection(
            userId,
            collectionName
        );

        let item: (Item & { collection: Collection; tags: Tag[] }) | null =
            await this.getItem(itemId);

        if (item && item.userId === userId) {
            item = await prisma.item.update({
                where: {
                    id: itemId,
                },
                data: {
                    // collection: {
                    //     connect: { id: collection.id },
                    // },
                    collectionId: collection.id,
                },
                include: {
                    tags: true,
                    collection: true,
                },
            });
        }
        return item;
    }

    static async addTag(userId: string, itemId: string, tagName: string) {
        const tag = await TagController.getOrCreateTag(userId, tagName);

        let item: (Item & { collection: Collection; tags: Tag[] }) | null =
            await this.getItem(itemId);

        if (item && item.userId === userId) {
            item = await prisma.item.update({
                where: {
                    id: itemId,
                },
                data: {
                    tags: {
                        connect: [{ id: tag.id }],
                    },
                },
                include: {
                    tags: true,
                    collection: true,
                },
            });
        }
        return item;
    }

    static async removeTag(userId: string, itemId: string, tagId: string) {
        let item: (Item & { collection: Collection; tags: Tag[] }) | null =
            await this.getItem(itemId);

        if (item && item.userId === userId) {
            item = await prisma.item.update({
                where: {
                    id: itemId,
                },
                data: {
                    tags: {
                        disconnect: [{ id: tagId }],
                    },
                },
                include: {
                    tags: true,
                    collection: true,
                },
            });
        }
        return item;
    }
}
