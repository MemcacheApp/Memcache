"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Card } from "./Card";
import { X } from "lucide-react";
import { Button } from "./Button";
import { CollectionSelector, TagSelector } from ".";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { cn } from "../utils";
import { useItemListStore } from "@/src/app/store/item-list";

export function ItemPanel() {
    const { selectedItems, isShowPanel, dismissPanel } = useItemListStore(
        (state) => ({
            selectedItems: state.selectedItems,
            isShowPanel: state.isShowPanel,
            dismissPanel: state.dismissPanel,
        })
    );

    const ids = Array.from(selectedItems);

    const [isCollapse, setIsCollapse] = useState(true);
    const [isHidden, setIsHidden] = useState(true);

    useEffect(() => {
        if (isShowPanel) {
            setIsHidden(false);
            setTimeout(() => {
                setIsCollapse(false);
            }, 10);
        } else {
            setIsCollapse(true);
            setTimeout(() => {
                setIsHidden(true);
            }, 200);
        }
    }, [isShowPanel]);

    return (
        <div>
            <div
                className={cn(
                    "fixed top-0 bottom-0 left-0 right-0 bg-black/40 md:hidden transition-opacity",
                    isCollapse ? "opacity-0" : "opacity-100",
                    {
                        hidden: isHidden,
                    }
                )}
            ></div>
            <Card
                className={cn(
                    "fixed flex flex-col right-5 w-80 p-4 top-3 max-md:w-auto max-md:left-0 max-md:right-0 max-md:bottom-0 max-md:top-14 transition-transform",
                    {
                        hidden: isHidden,
                        "md:translate-x-[20rem]": isCollapse,
                        "max-md:translate-y-[100%]": isCollapse,
                    }
                )}
            >
                <div className="flex">
                    <Button
                        variant="ghost"
                        className="w-10 rounded-full p-0"
                        onClick={dismissPanel}
                    >
                        <div className="h-4 w-4">
                            <X size={16} />
                        </div>
                        <span className="sr-only">Toggle sidebar</span>
                    </Button>
                </div>

                {ids.length > 1 ? (
                    <div>Select {ids.length} items</div>
                ) : (
                    <SingleItem id={ids[0]} />
                )}
            </Card>
        </div>
    );
}

function SingleItem({ id }: { id: string }) {
    const queryClient = useQueryClient();

    const itemQuery = trpc.item.getItem.useQuery({ itemId: id });
    const data = itemQuery.data;

    const collectionsQuery = trpc.collection.getUserCollections.useQuery();
    const tagsQuery = trpc.tag.getUserTags.useQuery();

    const setCollectionOnItem = trpc.item.setItemCollection.useMutation({
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
