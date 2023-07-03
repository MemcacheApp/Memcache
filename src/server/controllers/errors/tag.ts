import { createError } from "../../utils";

export const CreateTagError = createError({
    TagExist: "The tag already exists",
});

export const GetTagError = createError({
    TagNotExist: "The tag does not exist",
});
