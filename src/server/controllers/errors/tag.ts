import { createError } from "../../utils/error";

export const CreateTagError = createError("CreateTagError", {
    TagExist: "The tag already exists",
});

export const GetTagError = createError("GetTagError", {
    TagNotExist: "The tag does not exist",
});
