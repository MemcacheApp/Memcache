import { protectedProcedure, router } from "../trpc";
import SummaryController from "../../controllers/summary-controller";
import openai from "../../utils/openai";
import { z } from "zod";

export const summaryRouter = router({
    summariserGenerate: protectedProcedure
        .input(
            z.object({
                url: z.string(),
                title: z.string(),
                description: z.string(),
                id: z.string(),
                wordCount: z.number(),
                experience: z.number(),
                finetuning: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const { url, title, description, id, wordCount, experience, finetuning } = input;
                const content = await SummaryController.scrapeContent({
                    url,
                });

                const chatCompletion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are an expert content analyser assistant. I will give you a stream of content the includes headers and paragraphs. Some of the content may seem unrelated to each other, this is not a problem. I want you to highlight the most common theme of the stream of content, and focus purely on the most common theme. Ignore anything that does not have anything to do with the common theme. From there, I want you to summarise the key points and message behind the most common theme of the stream of content in 300 words. You must structure your output in a hierarchal manner following the Pyramid Principle. You must not repeat the same phrase more than twice, particularly phrases that reference the word content. Your summary must have high lexical density, and your prose should be fitting for an academic journal.",
                        },
                        {
                            role: "user",
                            content: content,
                        },
                    ],
                    max_tokens: 300,
                    temperature: 0.2, // lower temperature for more deterministic output
                });

                const summaryContent =
                    chatCompletion.data.choices[0].message?.content || "";
                const summary = await SummaryController.createSummary(
                    id,
                    summaryContent, 
					experience,
					finetuning
                );

                return summaryContent;
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                } else {
                    throw new Error("Summary generation failed: unknown error");
                }
            }
        }),
});
