import { createError } from "../../utils/error";

export const CreateFromURLError = createError("CreateFromURLError", {
    FetchError: "Failed to fetch metadata",
    InvalidURL: "Invalid URL",
});

export const GetItemError = createError("GetItemError", {
    ItemNotExist: "The item does not exist",
});
