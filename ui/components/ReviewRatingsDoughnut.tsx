import { FlashcardReviewRating } from "@prisma/client";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
    plugins: {
        legend: {
            display: false,
        },
    },
};

export function ReviewRatingsDoughnut({
    ratingsCount,
}: {
    ratingsCount: Record<FlashcardReviewRating, number>;
}) {
    const data = {
        labels: ["Easy", "Medium", "Hard", "Forgot"],
        datasets: [
            {
                label: "# of flashcards",
                data: Object.values(ratingsCount),
                backgroundColor: [
                    "rgba(135, 217, 192, 0.5)",
                    "rgba(135, 175, 222, 0.5)",
                    "rgba(181, 136, 225, 0.5)",
                    "rgba(225, 138, 154, 0.5)",
                ],
                borderColor: [
                    "rgba(135, 217, 192, 1)",
                    "rgba(135, 175, 222, 1)",
                    "rgba(181, 136, 225, 1)",
                    "rgba(225, 138, 154, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };
    return (
        <div className="h-full w-auto relative">
            <Doughnut
                width="300px"
                height="300px"
                data={data}
                options={options}
            />
        </div>
    );
}
