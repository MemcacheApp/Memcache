import { createError } from "../../utils";

export const CreateCollectionError = createError({
    CollectionExist: "The collection already exists",
});
