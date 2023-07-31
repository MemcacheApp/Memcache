import dayjs from "@/src/app/utils/dayjs";

export default function LastReview({ reviewTime }: { reviewTime?: Date }) {
    return (
        <div className="text-slate-500">
            {reviewTime
                ? `Last reviewed ${dayjs().to(dayjs(reviewTime))}`
                : "First review"}
        </div>
    );
}
