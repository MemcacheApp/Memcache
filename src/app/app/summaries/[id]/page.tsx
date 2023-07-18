"use client";

import { P, PageTitle } from "@/ui/components";
import { trpc } from "@/src/app/utils/trpc";

interface SummaryDetailPageProps {
    params: {
        id: string;
    };
}

export default function SummaryDetailPage({ params }: SummaryDetailPageProps) {
    const itemQuery = trpc.summary.getSummary.useQuery({
        summaryId: params.id,
    });
    const data = itemQuery.data;

    return (
        <div className="flex flex-col">
            <PageTitle>Summary of {data?.item.title} </PageTitle>
            <div className="mx-8">
                <P>ID: {params.id}</P>
                <P className="whitespace-pre-line">{data?.content}</P>
            </div>
        </div>
    );
}
