import scrapeIt from "scrape-it";
import { z } from "zod";

export const ScrapedData = z.object({
    headers: z
        .object({
            content: z.string(),
        })
        .array(),
    paragraphs: z
        .object({
            content: z.string(),
        })
        .array(),
});

export default class ContentScraper {
    static async scrapeContent({ url }: { url: string }) {
        const { data } = await scrapeIt(url, {
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

        const scrapedData = ScrapedData.parse(data);

        const headersContent = scrapedData.headers.map(
            (header) => header.content
        );
        const paragraphsContent = scrapedData.paragraphs.map(
            (paragraph) => paragraph.content
        );

        // Join into a single string
        const content = headersContent.concat(paragraphsContent).join("\n\n");

        return content;
    }
}
