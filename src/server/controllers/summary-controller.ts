import { Experience, Finetuning } from "@/src/datatypes/summary";
import ContentScraper from "@/src/utils/content-scraper";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../db/prisma";
import openai from "../utils/openai";
import { GetSummaryError } from "./errors/summary";
import ItemController from "./item-controller";

export default class SummaryController {
    static async getSummary(summaryId: string) {
        const summary = await prisma.summary.findUnique({
            where: {
                id: summaryId,
            },
            include: {
                item: {
                    include: {
                        collection: true,
                        tags: true,
                    },
                },
            },
        });

        if (summary === null) {
            throw new GetSummaryError("SummaryNotExist");
        }

        return summary;
    }

    static async getItemSummaries(itemId: string) {
        const summaries = await prisma.summary.findMany({
            where: {
                itemId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const trimmedSummaries = summaries.map((summary) => {
            const isFullText = summary.content.length <= 300;
            return {
                ...summary,
                isFullText,
                content: isFullText
                    ? summary.content
                    : summary.content.substring(0, 300) + "…",
            };
        });

        return trimmedSummaries;
    }

    static async getUserSummaries(userId: string) {
        const summaries = await prisma.summary.findMany({
            where: {
                item: {
                    userId,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                item: {
                    include: {
                        collection: true,
                        tags: true,
                    },
                },
            },
        });
        const trimmedSummaries = summaries.map((summary) => {
            const isFullText = summary.content.length <= 300;
            return {
                ...summary,
                isFullText,
                content: isFullText
                    ? summary.content
                    : summary.content.substring(0, 300) + "…",
            };
        });

        return trimmedSummaries;
    }

    static async getLatestSummaries(userId: string) {
        const summaries = await prisma.summary.findMany({
            where: {
                item: {
                    userId,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 6,
            include: {
                item: {
                    include: {
                        collection: true,
                        tags: true,
                    },
                },
            },
        });

        const hasMore = summaries.length > 5;
        const trimmedSummaries = summaries.slice(0, 5).map((summary) => {
            const isFullText = summary.content.length <= 300;
            return {
                ...summary,
                isFullText,
                content: isFullText
                    ? summary.content
                    : summary.content.substring(0, 300) + "…",
            };
        });

        return {
            hasMore,
            summaries: trimmedSummaries,
        };
    }

    static async generateSummary(
        itemId: string,
        numOfWords: number,
        experience: Experience,
        finetuning: Finetuning
    ) {
        const item = await ItemController.getItem(itemId);
        const content = await ContentScraper.scrapeContent({
            url: item.url,
        });

        // Initialise GPT's Role
        let gptrequest = `You are a professor at Harvard with a PhD in Education. 
                            You have a genius ability to summarise and explain difficult 
                            and convoluted texts for all levels of background knowledge 
                            from beginner to expert, in an incredibly easy to understand way. 
                            In fact, you have an incredibly successful YouTube channel where you 
                            read random pages on the internet and re-explain it to your 
                            viewers in a much more easy to understand and engaging fashion. 
                            
                            Hence, your task is to summarise a convoluted text for me.`;

        // Introduce the Theme
        if (item.description.length >= 35) {
            gptrequest += `The main theme and description of the text, which you need to remember 
                           when summarising is the following:
                           """
                           ${item.description}
                           """
                           With the above theme and description in mind, here's the main text, and `;
        }

        gptrequest += `I want you to ONLY focus on the most common theme in the text. You MUST 
                       IGNORE sections of the content that are unrelated to the most common theme 
                       you detect. Here's the text:
                       """
                        ${content}	
                       """
                       Now, I want you to summarise the text, remembering the fact that you need 
                       to focus on the main theme only.`;

        // Modify Prompt Depending on Experience
        switch (experience) {
            case 0:
                gptrequest += `I want you to summarise the content so that a complete novice 
                               can understand what's going on, someone that's only in middle school 
                               with no background knowledge should be able to completely grasp the 
                               text using your summary, so use language that you deem fitting for such 
                               an audience.`;
                break;
            case 1:
                gptrequest += `I want you to summarise the content so that a undergraduate college 
                               freshman at Harvard can understand what's going on, someone that's 
                               bright and relatively smart but has no background or previous experience 
                               in the field and subject matter of the content, so use frame the summary 
                               in a way that would allow such a student to grasp things easily. Your 
                               summary MUST use technical words and vocabulary fitting of a college 
                               textbook, your lexical density must be intermediate to dense`;
                break;
            case 2:
                gptrequest += `I want you to summarise the content in the style of a tenured MIT professor 
                               who is writing a memo for another tenured professor at Harvard university. 
                               It is a memo amongst experts, so there's no need to explain basic concepts, 
                               the audience already understands these things, the summary should be dense 
                               like a medical journal and have very high lexical density to articulate 
                               the concepts of the text with the lexical rigour they deserve`;
                break;
        }

        // Modify Prompt Depending on Finetuning
        switch (finetuning) {
            case 0:
                gptrequest += `Furthermore, I want your summary to be as descriptive and illustrious 
                               as possible, so you MUST use vibrant metaphors, hypotheticals scenarios, 
                               and similes that don't take away from the content but add to it by 
                               expanding upon it`;
                break;
            case 1:
                gptrequest += `Furthermore, I want your summary to be as technical and quantitative 
                               as possible, focusing on statistics, hard facts, hard data, and technical 
                               manual descriptions that could bolster the summary while refraining from 
                               using any metaphors or hypotheticals whatsoever.`;
                break;
            case 2:
                gptrequest += `Furthermore, I want your summary to strike the perfect balance between 
                               detailed technical explanations with hard facts that are backed by 
                               quantitative descriptions and statistics while also using illustrious 
                               metaphors, similes, and engaging hypothetical scenarios. Use a system 
                               where each technical explanation is then followed up with an engaging 
                               qualitative description, such as a metaphor.`;
                break;
        }

        // Strictly Define Output Structure
        gptrequest += `Finally, your summary MUST be AT LEAST ${numOfWords} words and MUST conform to
                       the following structure:
                       """
                       {Summary: AT LEAST ${numOfWords / 5} words}
                       {Point 1: AT LEAST ${numOfWords / 5} words}
                       {Point 2: AT LEAST ${numOfWords / 5} words}
                       {Point 3: AT LEAST ${numOfWords / 5} words}
                       {Conclusion: AT LEAST ${numOfWords / 5} words}
                       """
                       Thank you.`;

        let summaryContent;

        if (process.env.NODE_ENV === "development") {
            summaryContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sit amet vulputate arcu. Suspendisse blandit nunc et vulputate pellentesque. Quisque non neque blandit, facilisis lectus tempus, ullamcorper elit. Nulla facilisi. Ut vel justo metus. Nulla placerat mi tortor, vitae rhoncus felis luctus eget. Phasellus sit amet elit bibendum, elementum erat in, luctus orci. Praesent vel lorem dui. Integer blandit molestie sem condimentum fringilla.
            Curabitur pharetra purus ac ante gravida semper. Nam sit amet sapien enim. Phasellus blandit et sem non pellentesque. Nulla dictum orci at scelerisque tempor. Proin ultricies luctus odio, nec pellentesque arcu blandit vitae. Ut quis varius eros. Morbi vitae suscipit nisl, ut rutrum lorem. Donec tincidunt elementum imperdiet.
            Quisque dictum nisl mi, non posuere mi egestas et. Pellentesque pellentesque sem id quam hendrerit tincidunt. Morbi volutpat fringilla lorem id venenatis. Nunc hendrerit lorem ut lacus egestas dapibus. Nullam non luctus urna. Duis convallis tincidunt ipsum, at pretium dui dapibus sit amet. Nam justo est, aliquet a vulputate fringilla, gravida eleifend eros. Sed vel accumsan neque. Maecenas vitae laoreet elit. Fusce quis dapibus lectus, eu fringilla lacus. Quisque eget ipsum pellentesque, porta augue euismod, efficitur turpis. Cras ut venenatis libero. Duis nulla ante, vulputate fringilla ante in, semper consequat metus. Quisque at tempor sem, sit amet porta libero. Fusce semper, sem eu commodo porttitor, dolor nunc ultrices elit, eget tincidunt lectus nunc non tortor.
            Donec congue elit est. Donec vitae eros ut ipsum dapibus blandit. Pellentesque fringilla, lectus tempor pretium condimentum, nibh elit semper risus, at dapibus ipsum massa eget nisl. In placerat elit eu pellentesque luctus. Phasellus rhoncus erat eros, et egestas lectus consectetur vel. Nullam at maximus ante, id tristique mi. Aliquam sollicitudin justo odio, vitae aliquam metus vestibulum ac.
            Pellentesque semper nec quam ac dignissim. Maecenas vestibulum sollicitudin fermentum. Praesent dignissim dolor nec nisl consectetur, at euismod nisl euismod. Donec tincidunt tincidunt felis quis volutpat. In facilisis a ligula ac vehicula. Integer ut mauris in nulla vehicula fringilla. Etiam a erat tempus massa mollis facilisis. In nec erat vitae tortor suscipit congue nec ac dui. Phasellus non elementum ligula.`;
        } else {
            // TODO: Lengths over 13000 chars but under 18000 chars work, > 18000 chars don't
            const chatCompletion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: gptrequest,
                    },
                ],
                max_tokens: numOfWords * 2,
                temperature: 1, // Neutral temperature due to extensive prompt
            });
            summaryContent =
                chatCompletion.data.choices[0].message?.content || "";
        }

        await prisma.summary.create({
            data: {
                id: uuidv4(),
                content: summaryContent,
                createdAt: new Date(),
                itemId,
                wordCount: summaryContent.split(" ").length,
                experience: experience,
                finetuning: finetuning,
            },
        });
    }
}
