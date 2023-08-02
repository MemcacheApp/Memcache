import { formatDistanceToNow } from "date-fns";

export default function (date: Date | number) {
    return formatDistanceToNow(date, { addSuffix: true });
}
