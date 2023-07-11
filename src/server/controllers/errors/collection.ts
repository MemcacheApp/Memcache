import { createError } from "../../utils/error";

export const CreateCollectionError = createError("CreateCollectionError", {
    CollectionExist: "The collection already exists",
});

export const GetCollectionError = createError("GetCollectionError", {
    CollectionNotExist: "The collection does not exist",
});
