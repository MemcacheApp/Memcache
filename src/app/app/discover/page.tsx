"use client";

import { SuggestedItem } from "@/src/datatypes/item";
import { Loader, SimpleItemCard } from "@/ui/components";
import { PageTitle } from "@/ui/components/typography";
import { useMemo } from "react";
import { trpc } from "../../utils/trpc";

export default function DiscoverPage() {
    const getSuggestedItemsQuery = trpc.discovery.getSuggestedItems.useQuery(
        undefined,
        {
            refetchOnWindowFocus: false,
        },
    );

    const columns = useMemo(() => {
        if (getSuggestedItemsQuery.data) {
            const numColumn = 3;
            const result: SuggestedItem[][] = Array.from(
                { length: numColumn },
                () => [],
            );

            for (let i = 0; i < getSuggestedItemsQuery.data.length; i++) {
                const index = i % numColumn;
                result[index].push(getSuggestedItemsQuery.data[i]);
            }
            return result;
        } else {
            return undefined;
        }
    }, [getSuggestedItemsQuery.data]);

    return (
        <div className="@container">
            <PageTitle>Discover</PageTitle>
            <div className="md:mx-8 mb-8 grid grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 gap-3">
                {columns !== undefined ? (
                    columns.map((column, i) => (
                        <div className="grid gap-3" key={i}>
                            {column.map((item) => (
                                <SimpleItemCard
                                    key={item.url}
                                    thumbnail={item.thumbnail}
                                    title={item.title}
                                    description={item.description}
                                />
                            ))}
                        </div>
                    ))
                ) : (
                    <Loader varient="ellipsis" />
                )}
            </div>
        </div>
    );
}
