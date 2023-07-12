import { protectedProcedure, router } from "../trpc";
import openai from "../../utils/openai";
import { v4 as uuidv4 } from "uuid";

type GetFlashCardParams = {
    question: string;
    answer: string;
};

type FlashcardType = {
    id: string;
    question: string;
    answer: string;
};

function getFlashcard({ question, answer }: GetFlashCardParams): FlashcardType {
    return {
        id: uuidv4(),
        question,
        answer,
    };
}

/**
 * Type guard to narrow an object to a `GetFlashCardParams` type.
 * Made to check OpenAI's returned function call parameters to the `getCurrentWeather` function.
 */
function isGetFlashcardParams(obj: any): obj is GetFlashCardParams {
    if (typeof obj !== "object") return false;
    if (typeof obj.question !== "string") return false;
    if (typeof obj.answer !== "string") return false;
    return true;
}
import {
    ChatCompletionFunctions,
    ChatCompletionRequestMessage,
    ChatCompletionResponseMessage,
} from "openai";

const functions: ChatCompletionFunctions[] = [
    {
        name: "getFlashcard",
        description: "Creates a flashcard with a question and answer",
        parameters: {
            type: "object",
            properties: {
                question: {
                    type: "string",
                    description:
                        "The question to ask the user and test their knowledge about.",
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
        const messages: (
            | ChatCompletionResponseMessage // role, content, function_call
            // role, name, content, function_call
            | ChatCompletionRequestMessage
        )[] = [
            {
                role: "system",
                content:
                    "You are a helpful assistant whose job is to help the user study their areas of interest and learn the most important knowledge in those areas. Ask the user an a question about their area of interest. Provide a correct answer to the question you have asked.",
            },
            {
                role: "user",
                content:
                    "Recently I've picked up a new hobby: I'm learning to fly light aircraft and I find it very fun and interesting. However I have a lot to learn.",
            },
        ];

        try {
            const chatCompletion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo", // $0.002USD per 1K tokens (don't use GPT-4 it's 30x more expensive)
                // n: 4, // Number of flashcards to generate
                // max_tokens: 100, // About 75 words
                temperature: 1.2, // between 0-2, lower is more deterministic, higher is more random
                user: ctx.userId, // Track user patterns to prevent API abuse
                messages,
                functions,
                function_call: {
                    name: "getFlashcard", // Force the AI to call this function on first chat response
                },
            });

            const response_message = chatCompletion.data.choices[0].message;

            console.log(
                "\nChat completion response 1 (AI makes function call):"
            );
            console.dir(chatCompletion.data, { depth: null });

            // Check if the AI wants to call a function
            if (response_message?.function_call) {
                const functionCall = response_message.function_call;

                if (functionCall.name === "getFlashcard") {
                    // Parse and validate function arguments provided by the AI before passing them to the function
                    const functionArguments = functionCall.arguments
                        ? JSON.parse(functionCall.arguments)
                        : {};
                    if (isGetFlashcardParams(functionArguments)) {
                        // Call the function
                        const functionCallResult =
                            getFlashcard(functionArguments);
                        // TODO: Store new Flashcard in database
                        // Put function call response into message history for the AI to read
                        messages.push(response_message); // This is a ChatCompletionResponseMessage authored by the AI assistant
                        messages.push({
                            // This is a ChatCompletionRequestMessage authored by the function `getCurrentWeather`
                            role: "function",
                            name: functionCall.name, // "getFlashcard"
                            content: JSON.stringify(functionCallResult),
                        });

                        // Send new flashcard to user
                        return { flashcards: [functionCallResult] };
                    } else {
                        throw new Error(
                            `Bad AI function call: invalid arguments to getCurrentWeather: ${functionArguments}`
                        );
                    }
                } else {
                    throw new Error(
                        `Bad AI function call: invalid function name: ${functionCall.name}`
                    );
                }
            } else {
                throw new Error("AI did not call function");
            }

            // return {
            //     flashcards: chatCompletion.data.choices.map((choice) => ({
            //         id: uuidv4(),
            //         content: choice?.message?.content,
            //     })),
            // };
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error("Flashcards generation failed: unknown error");
            }
        }
    }),
});
