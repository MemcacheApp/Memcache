import { createError } from "../../utils";

export const GetItemError = createError({
    ItemNotExist: "The item does not exist",
});

export const DeleteItemError = createError({
    NoPermission: "The user does not have permission to perform the operation",
    ItemNotExist: "The item does not exist",
});
