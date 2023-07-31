import dayjs from "@/src/app/utils/dayjs";
import { Dot } from "lucide-react";

export default function DueStatus({ dueDate }: { dueDate: Date }) {
    return dueDate.valueOf() < Date.now().valueOf() ? (
        <div className="flex items-center font-semibold text-orange-600 pl-5">
            <Dot size={42} className="absolute -left-4 animate-pulse" />
            {"Due now"}
        </div>
    ) : (
        <div className="flex items-center font-medium text-[#1f52de]  pl-5">
            <Dot size={42} className="absolute -left-4" />
            {`Due ${dayjs().to(dayjs(dueDate))}`}
        </div>
    );
}
