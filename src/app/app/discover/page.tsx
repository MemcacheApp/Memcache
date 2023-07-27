"use client";

import { Loader, SimpleItemCard } from "@/ui/components";
import { PageTitle } from "@/ui/components/typography";
import { trpc } from "../../utils/trpc";

export default function DiscoverPage() {
    const getSuggestedItemsQuery = trpc.discovery.getSuggestedItems.useQuery();

    return (
        <div className="@container">
            <PageTitle>Discover</PageTitle>
            <div className="md:mx-8 mb-8 grid grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 gap-3">
                {getSuggestedItemsQuery.data ? (
                    getSuggestedItemsQuery.data.map((item) => (
                        <SimpleItemCard
                            key={item.url}
                            thumbnail={item.thumbnail}
                            title={item.title}
                            description={item.description}
                        />
                    ))
                ) : (
                    <Loader varient="ellipsis" />
                )}
            </div>
        </div>
    );
}
