import { createError } from "../../utils";

export const CreateFromURLError = createError("CreateFromURLError", {
    FetchError: "Failed to fetch metadata",
    InvalidURL: "Invalid URL",
});

export const GetItemError = createError("GetItemError", {
    ItemNotExist: "The item does not exist",
});
