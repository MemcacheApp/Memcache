"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Card } from "./Card";
import { PanelRightClose } from "lucide-react";
import { Button } from "./Button";
import { CollectionSelector, TagSelector } from ".";
import { useQueryClient } from "@tanstack/react-query";

interface ItemPanelProps {
    selectedItems: Set<string>;
    dismiss: () => void;
}

export function ItemPanel({ selectedItems, dismiss }: ItemPanelProps) {
    const ids = Array.from(selectedItems);

    return (
        <Card className="fixed flex flex-col right-5 w-80 p-4">
            <Button
                variant="ghost"
                className="m-3 w-10 rounded-full p-0"
                onClick={dismiss}
            >
                <div className="h-4 w-4">
                    <PanelRightClose size={16} />
                </div>
                <span className="sr-only">Toggle sidebar</span>
            </Button>
            {ids.length > 1 ? (
                <div>Select {ids.length} items</div>
            ) : (
                <SingleItem id={ids[0]} />
            )}
        </Card>
    );
}

function SingleItem({ id }: { id: string }) {
    const queryClient = useQueryClient();

    const itemQuery = trpc.item.getItem.useQuery({ itemId: id });
    const data = itemQuery.data;

    const collectionsQuery = trpc.collection.getCollections.useQuery();
    const tagsQuery = trpc.tag.getTags.useQuery();

    const setCollectionOnItem = trpc.item.setCollection.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [["item", "getItems"], { type: "query" }],
                exact: true,
            });
            queryClient.invalidateQueries({
                queryKey: [["collection", "getCollections"], { type: "query" }],
                exact: true,
            });
            console.log("set collection on item?");
        },
    });

    const addTagToItemMutation = trpc.item.addTag.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [["item", "getItems"], { type: "query" }],
                exact: true,
            });
            queryClient.invalidateQueries({
                queryKey: [["tag", "getTags"], { type: "query" }],
                exact: true,
            });
            console.log("added tag to item?");
        },
    });

    const removeTagFromItemMutation = trpc.item.removeTag.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [["item", "getItems"], { type: "query" }],
                exact: true,
            });
            console.log("removed tag from item?");
        },
    });

    return (
        <div>
            {data ? (
                <div>
                    <div className="text-xl font-bold">{data.title}</div>
                    <div>{data.description}</div>
                    <div>{data.type}</div>
                    <div>{data.status}</div>
                    <div>{data.collection.name}</div>
                    <div>{data.url}</div>
                    <div>{data.thumbnail}</div>
                    <div>{`${data.createdAt.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}`}</div>
                    {data.releaseTime ? (
                        <div>{`${data.releaseTime.toLocaleDateString(
                            undefined,
                            {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }
                        )}`}</div>
                    ) : null}
                    <div>{data.siteName}</div>
                    {data.duration ? <div>{data.duration}</div> : null}
                    {data.author ? <div>{data.author}</div> : null}
                    <CollectionSelector
                        collections={collectionsQuery.data}
                        value={data.collection.name}
                        setValue={(newCollection) => {
                            setCollectionOnItem.mutate({
                                itemId: data.id,
                                collectionName: newCollection,
                            });
                        }}
                        size={"xs"}
                    />
                    <div>
                        {data.tags.map((tag, index) => (
                            <TagSelector
                                key={tag.id}
                                index={index}
                                tags={tagsQuery.data}
                                value={tag.name}
                                setValue={(newTag) =>
                                    addTagToItemMutation.mutate({
                                        itemId: data.id,
                                        tagName: newTag,
                                    })
                                }
                                remove={(index) => {
                                    removeTagFromItemMutation.mutate({
                                        itemId: data.id,
                                        tagId: data.tags[index].id,
                                    });
                                }}
                            />
                        ))}
                        <TagSelector
                            tags={tagsQuery.data}
                            value=""
                            index={-1}
                            setValue={(newTag) => {
                                addTagToItemMutation.mutate({
                                    itemId: data.id,
                                    tagName: newTag,
                                });
                            }}
                            remove={(index) => {
                                removeTagFromItemMutation.mutate({
                                    itemId: data.id,
                                    tagId: data.tags[index].id,
                                });
                            }}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}
