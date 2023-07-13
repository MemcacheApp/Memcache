import { protectedProcedure, router } from "../trpc";
import SummaryController from "../../controllers/summary-controller";
import openai from "../../utils/openai";
import { z } from "zod";

export const summaryRouter = router({
    summariserGenerate: protectedProcedure
        .input(
            z.object({
                url: z.string(),
                description: z.string(),
                id: z.string(),
                wordCount: z.number(),
                experience: z.number(),
                finetuning: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const { url, description, id, wordCount, experience, finetuning } = input;
                const content = await SummaryController.scrapeContent({
                    url,
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
				if (description.length >= 35) {
					gptrequest += `The main theme and description of the text, which you need to remember 
								   when summarising is the following:
								   """
								   ${description}
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
									   metaphors, smiles, and engaging hypothetical scenarios. Use a system 
								       where each technical explanation is then followed up with an engaging 
								       qualitative description, such as a metaphor.`;
                        break;
                }
				
                // Strictly Define Output Structure
                gptrequest += `Finally, your summary MUST be AT LEAST ${wordCount} words and MUST conform to
							   the following structure:
							   """
							   {Summary: AT LEAST ${wordCount / 5} words}
							   {Point 1: AT LEAST ${wordCount / 5} words}
							   {Point 2: AT LEAST ${wordCount / 5} words}
							   {Point 3: AT LEAST ${wordCount / 5} words}
							   {Conclusion: AT LEAST ${wordCount / 5} words}
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
                    max_tokens: wordCount * 2,
                    temperature: 1, // Neutral temperature due to extensive prompt
                });

                const summaryContent =
                    chatCompletion.data.choices[0].message?.content || "";
                await SummaryController.createSummary(
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
