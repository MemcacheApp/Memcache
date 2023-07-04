import { createError } from "../../utils";

export const CreateFromURLError = createError("CreateFromURLError", {
    FetchError: "Failed to fetch metadata",
});

export const GetItemError = createError("GetItemError", {
    ItemNotExist: "The item does not exist",
});

export const DeleteItemError = createError("DeleteItemError", {
    NoPermission: "The user does not have permission to perform the operation",
    ItemNotExist: "The item does not exist",
});
