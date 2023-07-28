import { SuggestedItem } from "@/src/datatypes/item";
import { prisma } from "../db/prisma";

// Randomize (shuffle) a JavaScript array
// Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle<T>(array: T[]) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

export default class DiscoveryController {
    static async getSuggestedItems(userId: string) {
        const userTagNames = (
            await prisma.tag.findMany({
                where: {
                    userId,
                },
                select: {
                    name: true,
                },
            })
        ).map((tag) => tag.name);

        const userCollectionNames = (
            await prisma.collection.findMany({
                where: {
                    userId,
                },
                select: {
                    name: true,
                },
            })
        ).map((collection) => collection.name);

        const userItemUrls = (
            await prisma.item.findMany({
                where: {
                    userId,
                },
                select: {
                    url: true,
                },
            })
        ).map((item) => item.url);

        const suggestedItems = await prisma.item.findMany({
            where: {
                OR: [
                    {
                        tags: {
                            some: {
                                name: { in: userTagNames },
                            },
                        },
                    },
                    {
                        collection: {
                            name: { in: userCollectionNames },
                        },
                    },
                ],
                NOT: {
                    OR: [
                        {
                            url: {
                                in: userItemUrls,
                            },
                        },
                        {
                            public: {
                                equals: false,
                            },
                        },
                    ],
                },
            },
            select: {
                type: true,
                url: true,
                thumbnail: true,
                title: true,
                description: true,
                siteName: true,
            },
        });

        const existingItems: { [key: string]: boolean } = {};
        const uniqueSuggestedItems: SuggestedItem[] = [];
        suggestedItems.forEach((item) => {
            if (existingItems[item.url] === undefined) {
                existingItems[item.url] = true;
                uniqueSuggestedItems.push(item);
            }
        });

        return shuffle(uniqueSuggestedItems);
    }
}

/*
1. Get all tags belonging to a user
2. Get all items that share the same tag name
3. Recommend items that the user does not have

select * 
from item i
    join tag t on ()
    join collection c on ()
where i.url not in
        (
            select i2.url
            from item i2
            where i2.userId = ${userId}
        )
    and 
    (
      t.name in
          (
              select t2.name
              from tag t2
              where t2.userId = ${userId}
          )
      or c.name in 
          (
              select c2.name
              from collection c2
              where c2.userId = ${userId}
          )
    )

*/

// const result = await prisma.$queryRaw`
//     select *
//     from item i
//         join tag t on ()
//     where t.name in
//             (
//                 select t2.name
//                 from tag t2
//                 where t2.userId = ${userId}
//             )
//         and i.url not in
//             (
//                 select i.url
//                 from item i
//                 where i.userId = ${userId}
//             )
//     `;
