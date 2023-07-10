import { protectedProcedure, router } from "../trpc";
import openai from "../../utils/openai";
import { v4 as uuidv4 } from "uuid";

export const flashcardsRouter = router({
    /**
     * Returns:
     *  {
     *     flashcards: [
     *        {
     *          id: string,
     *          content: string,
     *        },
     *     ...  ]
     *  }
     */
    generateFlashcards: protectedProcedure.query(async ({ ctx }) => {
        try {
            const chatCompletion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo", // $0.002USD per 1K tokens (don't use GPT-4 it's 30x more expensive)
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a helpful assistant whose job is to help the user study their areas of interest and learn the most important knowledge in those areas. Give the user an interesting and educational fact about their area of interest. Keep each response no longer than 75 words.",
                    },
                    {
                        role: "user",
                        content:
                            "Recently I've picked up a new hobby: I'm learning to fly light aircraft and I find it very fun and interesting. However I have a lot to learn.",
                    },
                ],
                n: 4, // Number of flashcards to generate
                max_tokens: 100, // About 75 words
                temperature: 1.2, // between 0-2, lower is more deterministic, higher is more random
                user: ctx.userId, // Track user patterns to prevent API abuse
            });

            return {
                flashcards: chatCompletion.data.choices.map((choice) => ({
                    id: uuidv4(),
                    content: choice?.message?.content,
                })),
            };
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error("Flashcards generation failed: unknown error");
            }
        }
    }),
});
