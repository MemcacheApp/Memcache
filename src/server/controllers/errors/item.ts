import { createError } from "../../utils/error";

export const FetchURLError = createError("FetchURLError", {
    FetchError: "Failed to fetch metadata",
    InvalidURL: "Invalid URL",
});

export const GetItemError = createError("GetItemError", {
    ItemNotExist: "The item does not exist",
    PrivateProfile: "The profile of the user is private",
});
