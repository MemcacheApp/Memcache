import { prisma } from "../db/prisma";
import * as scrapeIt from "scrape-it";
import { v4 as uuidv4 } from "uuid";

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

    static async createSummary(
		itemId: string, 
		summaryContent: string, 
		experience: number,
		finetuning: number
	) {
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
