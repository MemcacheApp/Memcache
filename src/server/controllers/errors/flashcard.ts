import { createError } from "../../utils/error";

export const GetFlashcardError = createError("GetFlashcardError", {
    FlashcardNotExist: "The flashcard does not exist",
});

export const GenerateFlashcardError = createError("GenerateFlashcardError", {
    InvalidAIFunctionArgumentsGenerated:
        "Bad AI function call: invalid arguments generated",
    InvalidAIFunctionnameCalled:
        "Bad AI function call: unknown function name called",
    IncorrectAIResponse: "AI did not call function",
});
