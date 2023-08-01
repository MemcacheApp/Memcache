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

// const labels = ["January", "February", "March", "April", "May", "June", "July"];

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
                data: ratingsCount[FlashcardReviewRating.Easy],
                backgroundColor: "rgba(135, 217, 192, 0.5)",
            },
            {
                label: "Medium",
                data: ratingsCount[FlashcardReviewRating.Medium],
                backgroundColor: "rgba(135, 175, 222, 0.5)",
            },
            {
                label: "Easy",
                data: ratingsCount[FlashcardReviewRating.Hard],
                backgroundColor: "rgba(181, 136, 225, 0.5)",
            },
            {
                label: "Medium",
                data: ratingsCount[FlashcardReviewRating.Forgot],
                backgroundColor: "rgba(225, 138, 154, 0.5)",
            },
        ],
    };
    return <Bar options={options} data={data} />;
}
