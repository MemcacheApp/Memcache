import { trpc } from "@/src/app/utils/trpc";
import { Collection, Item, Tag } from "@prisma/client";
import { Link } from "lucide-react";
import { useState } from "react";
import { GenerateFlashcardsDialog } from "./GenerationDialog";
import { Input } from "./Input";

/**
 * Previously used for searching items to generate flashcards for. Replaced by ItemSelector.
 * Currently not used.
 */

export default function ItemSearchBar() {
    const [itemInput, setItemInput] = useState("");
    const itemsQuery = trpc.item.getUserItemsIncludeFlashcards.useQuery();

    return (
        <div className="relative mt-3 mb-4">
            <Input
                className="text-base border-solid rounded-md"
                placeholder="Article title..."
                value={itemInput}
                onChange={(e) => setItemInput(e.target.value)}
            />

            {itemInput &&
                itemsQuery.data &&
                itemsQuery.data.filter((item) => {
                    return item.title
                        .toLowerCase()
                        .includes(itemInput.toLowerCase());
                }).length > 0 && (
                    <div className="absolute z-10 w-full px-1 py-1 bg-white border border-solid rounded-md top-12 border-input">
                        {itemsQuery.data
                            ?.filter((item) => {
                                return item.title
                                    .toLowerCase()
                                    .includes(itemInput.toLowerCase());
                            })
                            .map((item) => {
                                return (
                                    <FlashcardSearchResult
                                        key={item.id}
                                        item={item}
                                    />
                                );
                            })}
                    </div>
                )}
        </div>
    );
}

function FlashcardSearchResult({
    item,
}: {
    item: Item & { tags: Tag[]; collection: Collection };
}) {
    const [isOpenFlashcards, setIsOpenFlashcards] = useState(false);

    return (
        <>
            <div
                key={item.id}
                onClick={() => setIsOpenFlashcards(true)}
                className="flex justify-between h-24 px-2 py-3 rounded-md hover:bg-slate-100"
            >
                <div className="flex flex-col justify-between">
                    <div className="flex">
                        <h3 className="mr-2 text-lg font-semibold leading-6 tracking-tight">
                            {item.title}
                        </h3>
                        {/* <ExternalLink /> */}
                    </div>
                    <div>
                        {item.tags.map((tag: Tag) => {
                            return (
                                <div key={tag.id}>
                                    <Link
                                        className="flex items-center px-3 py-1.5 rounded-lg hover:no-underline hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border shadow-sm w-fit"
                                        href={`/app/tag/${tag.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {tag.name}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {item.thumbnail ? (
                    <img
                        src={item.thumbnail}
                        alt="Image"
                        className="rounded-sm w-36"
                    />
                ) : (
                    ""
                )}
            </div>
            <GenerateFlashcardsDialog
                data={item}
                open={isOpenFlashcards}
                onOpenChange={setIsOpenFlashcards}
            />
        </>
    );
}
