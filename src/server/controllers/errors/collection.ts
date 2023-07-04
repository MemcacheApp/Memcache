import { createError } from "../../utils";

export const CreateCollectionError = createError("CreateCollectionError", {
    CollectionExist: "The collection already exists",
});
