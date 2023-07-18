import { FlashcardExperience, FlashcardRange } from "@/src/datatypes/flashcard";
import ContentScraper from "@/src/utils/content-scraper";
import { Flashcard } from "@prisma/client";
import {
    ChatCompletionFunctions,
    ChatCompletionRequestMessage,
    ChatCompletionResponseMessage,
} from "openai";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { prisma } from "../db/prisma";
import openai from "../utils/openai";
import { GenerateFlashcardError } from "./errors/flashcard";
import ItemController from "./item-controller";

const GetFlashcardParams = z.object({
    question: z.string(),
    answer: z.string(),
});

type GetFlashCardParams = z.infer<typeof GetFlashcardParams>;

const FlashcardType = z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
});

type FlashcardType = z.infer<typeof FlashcardType>;

function getFlashcard({ question, answer }: GetFlashCardParams): FlashcardType {
    return {
        id: uuidv4(),
        question,
        answer,
    };
}

const functionName = "getFlashcard";

const functions: ChatCompletionFunctions[] = [
    {
        name: functionName,
        description: "Creates a flashcard with a question and answer",
        parameters: {
            type: "object",
            properties: {
                question: {
                    type: "string",
                    description:
                        "The question to ask the user and test their knowledge about the subject matter.",
                },
                answer: {
                    type: "string",
                    description:
                        "The answer to the question, to help the user revise the subject matter prompted by the question.",
                },
            },
            required: ["question", "answer"],
        },
    },
];

export default class FlashcardController {
    static async getUserFlashcards(userId: string) {
        try {
            const flashcards = await prisma.flashcard.findMany({
                where: {
                    userId,
                },
                include: {
                    reviews: true,
                },
            });
            return flashcards;
        } catch (e) {
            console.log(e);
        }
    }

    static async generateFlashcards(
        userId: string,
        itemId: string,
        numOfFlashcards: number,
        experience: FlashcardExperience,
        range: FlashcardRange,
    ) {
        const item = await ItemController.getItem(itemId);
        const content = await ContentScraper.scrapeContent({
            url: item.url,
        });
        const truncatedContent = content.slice(0, 5000); // About 1000 words
        // console.log(`Content: ${truncatedContent}`);

        const systemPrompt = generateSystemPrompt(
            item.description,
            truncatedContent,
            experience,
            range,
        );

        const messages: (
            | ChatCompletionResponseMessage // role, content, function_call
            // role, name, content, function_call
            | ChatCompletionRequestMessage
        )[] = [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content:
                    "Please generate one flashcard that tests my knowledge on the subject matter given the content.",
            },
        ];

        for (let i = 0; i < numOfFlashcards; i++) {
            // TODO: Lengths over 13000 chars but under 18000 chars work, > 18000 chars don't
            const chatCompletion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo", // $0.002USD per 1K tokens (don't use GPT-4 it's 30x more expensive)
                // n: 4, // Number of flashcards to generate
                max_tokens: 200, // About 75 words
                temperature: 1.4, // Between 0-2. Using a higher temp for flashcards to reduce repetition
                user: userId, // Track user patterns to prevent API abuse
                messages: messages,
                functions,
                function_call: {
                    name: functionName, // Force the AI to call this function on next chat response
                },
            });
            const response_message = chatCompletion.data.choices[0].message;
            console.log(response_message);

            // console.log(
            //     `\nGenerating flashcard ${i} (AI makes function call):`
            // );
            // console.dir(chatCompletion.data, { depth: null });

            // Check if the AI wants to call a function
            if (response_message?.function_call) {
                const functionCall = response_message.function_call;

                if (functionCall.name === functionName) {
                    // Parse and validate function arguments provided by the AI before passing them to the function
                    const functionArguments = functionCall.arguments
                        ? JSON.parse(functionCall.arguments)
                        : {};
                    try {
                        const parsedGetFlashcardParams =
                            GetFlashcardParams.parse(functionArguments);
                        // Call the function
                        const functionCallResult = getFlashcard(
                            parsedGetFlashcardParams,
                        );

                        // console.dir(functionCallResult, { depth: null });
                        const today = new Date();
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        tomorrow.setHours(0, 0, 0, 0);
                        const newFlashcard: Flashcard = {
                            id: functionCallResult.id,
                            question: functionCallResult.question,
                            answer: functionCallResult.answer,
                            itemId,
                            userId,
                            dueDate: tomorrow, // Initial due date when flashcard is created is the next day
                        };
                        try {
                            await prisma.flashcard.create({
                                data: newFlashcard,
                            });
                        } catch (e) {
                            console.log(e);
                        }

                        // Put function call response into message history for the AI to read
                        messages.push(response_message); // This is a ChatCompletionResponseMessage authored by the AI assistant
                        messages.push({
                            // This is a ChatCompletionRequestMessage authored by the function `getFlashcard`
                            role: "function",
                            name: functionCall.name, // functionName
                            content: JSON.stringify(functionCallResult),
                        });

                        // Send new flashcard to user
                        // return { flashcards: [functionCallResult] };
                    } catch (e) {
                        if (e instanceof z.ZodError) {
                            throw new GenerateFlashcardError(
                                "InvalidAIFunctionArgumentsGenerated",
                                `Bad AI function call: invalid arguments to ${functionName}: ${functionArguments}`,
                            );
                        } else {
                            throw e;
                        }
                    }
                } else {
                    throw new GenerateFlashcardError(
                        "InvalidAIFunctionnameCalled",
                        `Bad AI function call: unknown function name called: ${functionCall.name}`,
                    );
                }
            } else {
                throw new GenerateFlashcardError(
                    "IncorrectAIResponse",
                    `AI did not call function ${functionName}`,
                );
            }

            // return {
            //     flashcards: chatCompletion.data.choices.map((choice) => ({
            //         id: uuidv4(),
            //         content: choice?.message?.content,
            //     })),
            // };
        }
    }
}

function generateSystemPrompt(
    itemDescription: string,
    itemContent: string,
    experience: FlashcardExperience,
    range: FlashcardRange,
) {
    // Initialise GPT's Role
    let systemPrompt = `You are a revolutionary AI flashcard-generating AI. You excel in integrating a wide array of information into comprehensive flashcards, ensuring a holistic yet in-depth understanding of any given topic. You also creatively infuse engaging elements, like innovative mnemonics and captivating trivia, to foster interest and enhance memory retention. You generate flashcards that maximise learning outcomes by using advanced data analysis to identify challenging areas and then personalise flashcards to individual experience levels and learning preferences.
        
            A flashcard consists of a question and answer. The question is a prompt that tests the user's knowledge about a subject matter. The answer is a description that helps the user revise the subject matter prompted by the question. The question and answer are both written in natural language.
    
            Given a piece of text on some subject matter, your job is to generate one or more flashcards that tests the user's knowledge on the subject matter.\n\n`;

    // Introduce the Theme
    if (itemDescription.length >= 35) {
        systemPrompt += `Here is a brief description of the topic that the user wishes to learn about:
                               """
                               ${itemDescription}
                               """\n\n`;
    }

    systemPrompt += `The main content that the user wishes to learn about is the following:
                           """
                            ${itemContent}	
                           """
                           You must remember the topic and content so that you can generate relevant, accurate, useful flashcards for the user.\n\n`;

    // Modify Prompt Depending on Experience
    switch (experience) {
        case FlashcardExperience.Beginner:
            systemPrompt += `The user is a complete novice in the subject matter. They want to use flashcards to learn basic but important information related to the subject matter, so you must ensure that the flashcards you generate are easy to understand, use simple language and avoid technical jargon that might confuse a beginner. The knowledge assessed in each question and revealed in each answer should help the user build a solid understanding of the subject without assuming any prior knowledge.\n`;
            break;
        case FlashcardExperience.Intermediate:
            systemPrompt += `The user is an undergraduate student, who is new yet enthusiastic about this subject. They seek to use flashcards to master important details and cultivate a profound understanding of the topic. Therefore, the flashcards you generate should uphold academic integrity, presenting detailed insights and promoting inquisitive thinking. The aim is to challenge and expand the student's knowledge base in this field.\n`;
            break;
        case FlashcardExperience.Advanced:
            systemPrompt += `The user is a renowned expert with a doctoral degree and three decades of experience in this subject matter. They aim to refresh advanced concepts and fuel novel research through flashcard revision. Thus, generate flashcards delving into both essential and niche areas of the subject. Focus on areas with potential for groundbreaking discoveries. The goal is to stimulate thought and inspire innovation in this field.\n`;
            break;
    }

    // Modify Prompt Depending on Finetuning
    switch (range) {
        case FlashcardRange.Depth:
            systemPrompt += `Your flashcards must concentrate deeply and intensively on the most relevant areas of the subject matter, helping the user in learning specialized facts, understanding root causes and drawing deep profound insights about the field.\n`;
            break;
        case FlashcardRange.Breadth:
            systemPrompt += `Your flashcards should investigate the subject matter in relation to tangentially connected fields, sourcing insights and drawing parallels from a variety of disciplines. However, the primary focus should remain on the central topic, thus aiding the user in gaining a comprehensive understanding of the subject and its intersections with other domains.\n`;
            break;
        case FlashcardRange.Balanced:
            systemPrompt += `Your flashcards must strike a balance between depth and breadth, encapsulating the crucial aspects of the subject matter while not getting lost in extreme specialization. The flashcards should have an awareness of the broader context of the field, offering a glimpse into its relationship with other areas without straying too far from the core topic. This balanced approach will provide the user with a solid foundation in the subject matter, while also equipping them with the ability to see its place in a larger interdisciplinary context.\n`;
            break;
    }

    // Strictly Define Output Structure
    systemPrompt += `Please keep each question no longer than 25 words. Please keep each answer no longer than 100 words. Please ensure that no two flashcards explore exactly the same concept or idea.\n`;
    return systemPrompt;
}
