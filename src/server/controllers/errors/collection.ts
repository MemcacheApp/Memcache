import { createError } from "../../utils";

export const CreateCollectionError = createError("CreateCollectionError", {
    CollectionExist: "The collection already exists",
});

export const GetCollectionError = createError("GetCollectionError", {
    CollectionNotExist: "The collection does not exist",
});
