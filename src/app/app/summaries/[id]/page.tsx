"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Loader, P, PageTitle } from "@/ui/components";
import { TimerIcon, WholeWordIcon } from "lucide-react";
import { useMemo } from "react";

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
            {data ? (
                <>
                    <PageTitle>{data.item.title}</PageTitle>
                    <div className="flex flex-col gap-3 max-md:mx-5 mx-8">
                        <div className="flex justify-between flex-wrap gap-3 text-slate-500 my-3 text-sm">
                            <div className="flex gap-3 items-center">
                                <span>
                                    {data.createdAt.toLocaleDateString()}
                                </span>
                                <span className="border-2 border-red-500 text-red-500 px-2 rounded-md">
                                    {data.experience}
                                </span>
                                <span className="border-2 border-blue-500 text-blue-500 px-2 rounded-md">
                                    {data.finetuning}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <span className="flex gap-2 items-center">
                                    <WholeWordIcon size={16} />
                                    {data.wordCount} words
                                </span>
                                <span className="flex gap-2 items-center">
                                    <TimerIcon size={16} />
                                    {Math.round(data.wordCount / 265)} min
                                </span>
                            </div>
                        </div>
                        <SummaryContent content={data.content} />
                    </div>
                </>
            ) : (
                <Loader varient="ellipsis" />
            )}
        </div>
    );
}

interface SummaryContentProps {
    content: string;
}

function SummaryContent({ content }: SummaryContentProps) {
    const paras = useMemo(() => {
        return content.split("\n\n");
    }, [content]);

    return (
        <div>
            {paras.map((para, i) => (
                <P key={i} className="whitespace-pre-line">
                    {para}
                </P>
            ))}
        </div>
    );
}
