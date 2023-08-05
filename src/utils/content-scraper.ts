import scrapeIt from "scrape-it";
import { z } from "zod";
import { normaliseURL } from ".";
import { ItemMetadata } from "../datatypes/item";

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
        const tweetMatch = url.match(
            /^(https?:\/\/)?(www.)?(twitter|x)\.com\/.+\/status\/(\d+)/,
        );
        if (tweetMatch) {
            return (await fetchTweetMetadata(url, tweetMatch[4])).description;
        }

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
            (header) => header.content,
        );
        const paragraphsContent = scrapedData.paragraphs.map(
            (paragraph) => paragraph.content,
        );

        // Join into a single string
        const content = headersContent.concat(paragraphsContent).join("\n\n");

        return content;
    }
}

export async function fetchTweetMetadata(
    url: string,
    tweetId: string,
): Promise<ItemMetadata> {
    url = normaliseURL(url);
    const result = await fetch(
        `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}`,
    ).then((res) => res.json());

    return {
        type: "post",
        url,
        siteName: "Twitter",
        title: "Tweet",
        description: result.text,
        favicon: "https://abs.twimg.com/favicons/twitter.3.ico",
        thumbnail: result.mediaDetails
            ? result.mediaDetails[0]["media_url_https"]
            : undefined,
        author: result.user?.name,
        releaseTime: result["created_at"],
    };
}
