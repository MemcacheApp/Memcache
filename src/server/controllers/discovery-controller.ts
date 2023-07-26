import { prisma } from "../db/prisma";

// Randomize (shuffle) a JavaScript array
// Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array: any[]) {
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
    static async getSuggestedDiscoveryItems(userId: string) {
        const userTagNamesRes = await prisma.tag.findMany({
            where: {
                userId,
            },
            select: {
                name: true,
            },
        });
        const userCollectionNamesRes = await prisma.collection.findMany({
            where: {
                userId,
            },
            select: {
                name: true,
            },
        });

        const userTagNames: string[] = userTagNamesRes.map((t) => {
            return t.name;
        });
        const userCollectionNames: string[] = userCollectionNamesRes.map(
            (c) => {
                return c.name;
            },
        );
        const userItemUrlsRes = await prisma.item.findMany({
            where: {
                userId,
            },
            select: {
                url: true,
            },
        });
        const userItemUrls: string[] = userItemUrlsRes.map((i) => {
            return i.url;
        });

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
                url: { notIn: userItemUrls },
            },
            select: {
                url: true,
                thumbnail: true,
                title: true,
                description: true,
            },
        });

        const existingItems: { [key: string]: boolean } = {};
        const res = [];
        suggestedItems.forEach((item) => {
            if (existingItems[item.url] === undefined) {
                existingItems[item.url] = true;
                res.push(item);
            }
        });

        return shuffle(suggestedItems);
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
