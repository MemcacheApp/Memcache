import { createError } from "../../utils/error";

export const GetSummaryError = createError("GetSummaryError", {
    SummaryNotExist: "The summary does not exist",
});
