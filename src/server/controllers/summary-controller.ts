import * as scrapeIt from "scrape-it";
import { v4 as uuidv4 } from "uuid";

export default class SummaryController {
    static async generateSummary({ url, title, description, siteName }) {
        const { data } = await scrapeIt.default(url, {
            headers: {
                listItem: "h1,h2,h3,h4,h5,h6",
                data: {
                    content: {
                        how: "text"
                    }
                }
            },
            paragraphs: {
                listItem: "p",
                data: {
                    content: {
                        how: "text"
                    }
                }
            }
        });

		const headersContent = data.headers.map(header => header.content);
		const paragraphsContent = data.paragraphs.map(paragraph => paragraph.content);

		// Join into a single string
		const content = headersContent.concat(paragraphsContent).join('\n\n');

        return content;
    }
}
