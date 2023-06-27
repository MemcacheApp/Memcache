import CollectionController from "../controllers/collection-controller";
import UserController from "../controllers/user-controller";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

const ADMIN_FIRST_NAME = "Ender";
const ADMIN_LAST_NAME = "Man";
const ADMIN_PASSWORD = "123456";
const ADMIN_EMAIL = "admin@endermen.com";

const ITEMS = [
    {
        title: "Competitive programming with AlphaCode",
        url: "https://www.deepmind.com/blog/competitive-programming-with-alphacode",
        description:
            "Solving novel problems and setting a new milestone in competitive programming.",
        thumbnail:
            "https://assets-global.website-files.com/621e749a546b7592125f38ed/6221e6c759f19819bd5bec04_CodeGen.jpg",
        type: "article",
    },
    {
        title: "Writing WebSocket client applications - Web APIs | MDN",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications",
        description:
            "WebSocket client applications use the WebSocket API to communicate with WebSocket servers using the WebSocket protocol.",
        thumbnail:
            "https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png",
        type: "article",
    },
    {
        title: "Just-In-Time: The Next Generation of Tailwind CSS - Tailwind CSS",
        url: "https://tailwindcss.com/blog/just-in-time-the-next-generation-of-tailwind-css",
        description:
            "One of the hardest constraints we've had to deal with as we've improved Tailwind CSS over the years is the generated file size in development. Today I'm super excited to share a new project that makes this constraint a thing of the past: a just-in-time compiler for Tailwind CSS.",
        thumbnail:
            "https://tailwindcss.com/_next/static/media/card.79a37188.jpg",
        type: "article",
    },
    {
        title: "Meta bets big on AI with custom chips -- and a supercomputer",
        url: "https://techcrunch.com/2023/05/18/meta-bets-big-on-ai-with-custom-chips-and-a-supercomputer/",
        description:
            "Meta wants the world -- and particularly investors -- to know it's going big or going home where it concerns AI and the hardware to build it.",
        thumbnail:
            "https://techcrunch.com/wp-content/uploads/2021/11/facebook-meta-twist.jpg?resize=1200,675",
        type: "article",
    },
    {
        title: "Twitter's Recommendation Algorithm",
        url: "https://blog.twitter.com/engineering/en_us/topics/open-source/2023/twitter-recommendation-algorithm",
        description:
            "Twitter aims to deliver you the best of what’s happening in the world right now. This blog is an introduction to how the algorithm selects Tweets for your timeline.",
        thumbnail:
            "https://cdn.cms-twdigitalassets.com/content/dam/blog-twitter/engineering/en_us/main-template-assets/Eng_EXPLORE_Pink.png.twimg.768.png",
        type: "article",
    },
    {
        title: "Just-In-Time: The Next Generation of Tailwind CSS - Tailwind CSS",
        url: "https://tailwindcss.com/blog/just-in-time-the-next-generation-of-tailwind-css",
        description:
            "One of the hardest constraints we've had to deal with as we've improved Tailwind CSS over the years is the generated file size in development. Today I'm super excited to share a new project that makes this constraint a thing of the past: a just-in-time compiler for Tailwind CSS.",
        thumbnail:
            "https://tailwindcss.com/_next/static/media/card.79a37188.jpg",
        type: "article",
    },
    {
        title: "Ten Years of TypeScript",
        url: "https://devblogs.microsoft.com/typescript/ten-years-of-typescript/",
        description:
            "Today is TypeScript’s birthday! But this birthday is a special one – 10 years ago today, on October 1st, 2012, TypeScript was unveiled publicly for the first time. The Early Days When TypeScript first debuted, there was a lot of skepticism –",
        thumbnail:
            "https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2018/08/typescriptfeature.png",
        type: "article",
        site_name: "TypeScript",
    },
];

async function main() {
    try {
        const token = await UserController.createUser(
            ADMIN_FIRST_NAME,
            ADMIN_LAST_NAME,
            ADMIN_EMAIL,
            ADMIN_PASSWORD
        );
        console.log(
            `Created admin user ${ADMIN_EMAIL} with password ${ADMIN_PASSWORD}`
        );
    } catch (e) {
        if (e instanceof Error) {
            console.log(`${e.message}... email: ${ADMIN_EMAIL}`);
        }
    }

    const admin_user = await UserController.userInfoByEmail(ADMIN_EMAIL);
    const defaultCollection = await CollectionController.getCollectionByName(
        admin_user.id,
        "Default"
    );

    await prisma.item.createMany({
        data: ITEMS.map((item) => ({
            id: uuidv4(),
            type: item.type,
            status: 0,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            collectionId: defaultCollection!.id,
            title: item.title,
            url: item.url,
            description: item.description,
            thumbnail: item.thumbnail,
            createdAt: new Date(),
            userId: admin_user.id,
            siteName: "Default Site",
        })),
    });

    console.log(`Created ${ITEMS.length} items for user ${admin_user.email}`);
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
