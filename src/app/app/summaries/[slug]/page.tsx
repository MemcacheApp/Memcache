"use client";

import { PageTitle } from "@/ui/components";
import { trpc } from "@/src/app/utils/trpc";

interface SummaryDetailPageProps {
    params: {
        slug: string;
    };
}

export default function SummaryDetailPage({ params }: SummaryDetailPageProps) {
    const itemQuery = trpc.summary.getSummary.useQuery({
        summaryId: params.slug,
    });
    const data = itemQuery.data;

    return (
        <div className="flex flex-col">
            <PageTitle>Summary of {data?.item.title} </PageTitle>
            <div>
                <h1>ID: {params.slug}</h1>
                <p> {data?.content} </p>
            </div>
        </div>
    );
}
