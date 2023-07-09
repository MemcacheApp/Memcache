import { protectedProcedure, router } from "../trpc";
import openai from "../../utils/openai";
import { v4 as uuidv4 } from "uuid";
import * as scrapeIt from "scrape-it";


export const summaryRouter = router({

    summariserGenerate: protectedProcedure.query(async ({ ctx }) => {
        try {
            const { data } = await scrapeIt.default("https://www.abc.net.au/news/2023-06-06/sheep-face-recognition-trial-arrives-in-australia-genesmith/102414936", {
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

            const chatCompletion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert content analyser assistant. I will give you a stream of content the includes headers and paragraphs. Some of the content may seem unrelated to each other, this is not a problem. I want you to highlight the most common theme of the stream of content, and focus purely on the most common theme. Ignore anything that does not have anything to do with the common theme. From there, I want you to summarise the key points and message behind the most common theme of the stream of content in 300 words. You must structure your output in a hierarchal manner following the Pyramid Principle. You must not repeat the same phrase more than twice, particularly phrases that reference the word content. Your summary must have high lexical density, and your prose should be fitting for an academic journal."
                    },
                    {
                        role: "user",
                        content: content,  
                    },
                ],
                max_tokens: 300, 
                temperature: 0.2, // lower temperature for more deterministic output
                user: ctx.userId,
            });

            return chatCompletion.data.choices[0].message.content;
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error("Summary generation failed: unknown error");
            }
        }
    }),

});
