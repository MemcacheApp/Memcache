import { Experience, Finetuning } from "@/src/datatypes/summary";
import { prisma } from "../db/prisma";
import * as scrapeIt from "scrape-it";
import { v4 as uuidv4 } from "uuid";
import ItemController from "./item-controller";
import openai from "../utils/openai";

type ScrapeItDataType = {
    headers: { content: string }[];
    paragraphs: { content: string }[];
};

/**
 *
 * Type guard for validating scraped data from scrapeIt API.
 * @returns
 */
function validateScrapedData(data: any): data is ScrapeItDataType {
    if (typeof data !== "object") return false;
    if (!(data.headers instanceof Array)) return false;
    for (const header of data.headers) {
        if (typeof header !== "object") return false;
        if (typeof header.content !== "string") return false;
    }
    if (!(data.paragraphs instanceof Array)) return false;
    for (const paragraph of data.paragraphs) {
        if (typeof paragraph !== "object") return false;
        if (typeof paragraph.content !== "string") return false;
    }
    return true;
}

export default class SummaryController {
    static async getSummary(itemId: string) {
        const summary = await prisma.summary.findUnique({
            where: {
                id: itemId,
            },
        });

        if (summary === null) {
            throw new GetItemError("SummaryNotExist");
        }

        return summary;
    }

	static async getSummaryMeta(summaryId: string) {
		const summary = await prisma.summary.findUnique({
			where: {
				id: summaryId,
			},
			select: {
				id: true,
				createdAt: true,
				wordCount: true,
				experience: true,
				finetuning: true,
			},
		});

		if (summary === null) {
			throw new GetItemError("SummaryMetaNotExist");
		}

		return summary;
	}

    static async scrapeContent({ url }: { url: string }) {
        const { data } = await scrapeIt.default(url, {
            headers: {
                listItem: "h1,h2,h3,h4,h5,h6",
                data: {
                    content: {
                        how: "text",
                    },
                },
            },
            paragraphs: {
                listItem: "p",
                data: {
                    content: {
                        how: "text",
                    },
                },
            },
        });

        if (!validateScrapedData(data)) {
            throw new Error("Scraped data is invalid");
        }

        const headersContent = data.headers.map((header) => header.content);
        const paragraphsContent = data.paragraphs.map(
            (paragraph) => paragraph.content
        );

        // Join into a single string
        const content = headersContent.concat(paragraphsContent).join("\n\n");

        return content;
    }

    static async generateSummary(
        itemId: string,
        numOfWords: number,
        experience: Experience,
        finetuning: Finetuning
    ) {
        const item = await ItemController.getItem(itemId);
        const content = await SummaryController.scrapeContent({
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

        const summaryContent =
            chatCompletion.data.choices[0].message?.content || "";

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
