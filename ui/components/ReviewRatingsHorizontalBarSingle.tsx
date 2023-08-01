import { FlashcardReviewRating } from "@prisma/client";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

export const options = {
    indexAxis: "y" as const,
    elements: {
        bar: {
            borderWidth: 2,
        },
    },
    responsive: true,
    plugins: {
        legend: {
            display: false,
            position: "right" as const,
        },
        title: {
            display: false,
            text: "Ratings Horizontal Bar Chart",
        },
        tooltip: {
            titleSpacing: 1,
            titleMarginBottom: 3,
            bodySpacing: 1,
            footerSpacing: 1,
            padding: 3,
            boxPadding: 0,
        },
    },
    scales: {
        x: {
            stacked: true,
            display: false,
        },
        y: {
            stacked: true,
            display: false,
        },
    },
};

export function HorizontalBarSingle({
    ratingsCount,
}: {
    ratingsCount: Record<FlashcardReviewRating, number>;
}) {
    const labels = ["Ratings"];

    const data = {
        labels,
        datasets: [
            {
                label: "Easy",
                data: [ratingsCount[FlashcardReviewRating.Easy]],
                backgroundColor: "rgba(135, 217, 192, 0.5)",
            },
            {
                label: "Medium",
                data: [ratingsCount[FlashcardReviewRating.Medium]],
                backgroundColor: "rgba(135, 175, 222, 0.5)",
            },
            {
                label: "Hard",
                data: [ratingsCount[FlashcardReviewRating.Hard]],
                backgroundColor: "rgba(181, 136, 225, 0.5)",
            },
            {
                label: "Forgot",
                data: [ratingsCount[FlashcardReviewRating.Forgot]],
                backgroundColor: "rgba(225, 138, 154, 0.5)",
            },
        ],
    };
    return (
        <div className="h-full w-auto relative">
            <Bar width="320px" height="36px" options={options} data={data} />
        </div>
    );
}
