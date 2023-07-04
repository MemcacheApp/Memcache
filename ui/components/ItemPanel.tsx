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
import { Separator } from "./Separator";
import { Table, TableBody, TableCell, TableRow } from "./Table";
import { StatusEnum, StatusIcons, StatusNames } from "@/src/app/utils/Statuses";
import ExternalLink from "./ExternalLink";
import renderIcon from "@/src/app/utils/renderIcon";
import MultiToggle from "./MultiToggle";

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

    const updateItemStatusMutation = trpc.item.updateItemStatus.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [["item", "getItems"], { type: "query" }],
                exact: true,
            });
            console.log("updated item status");
        },
    });

    const handleUpdateItemStatus = async (newStatus: StatusEnum) => {
        if (!data || newStatus === data.status) {
            // Same status, no need to change
            return;
        }
        try {
            await updateItemStatusMutation.mutateAsync({
                itemId: data.id,
                status: newStatus,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {data ? (
                <div>
                    <div className="text-xl font-bold">
                        <ExternalLink href={data.url}>
                            {data.title}
                        </ExternalLink>
                    </div>
                    <div className="mt-1 mb-3 text-slate-450 ">
                        <ExternalLink href={data.url}>
                            {data.siteName}
                        </ExternalLink>
                    </div>
                    {data.thumbnail ? (
                        <div className="w-full max-w-[240px] mx-auto aspect-[16/9] my-4 shrink-0">
                            <ExternalLink href={data.url}>
                                <img
                                    src={data.thumbnail}
                                    alt="Image"
                                    className="rounded-lg object-cover object-center relative w-full h-full"
                                />
                            </ExternalLink>
                        </div>
                    ) : null}
                    <div className="mt-3">{data.description}</div>

                    <Separator className="my-4" />

                    <Subtitle>Status</Subtitle>
                    <div className="flex justify-between items-center">
                        <div className="text-lg">
                            {StatusNames[data.status as StatusEnum]}
                        </div>
                        <MultiToggle
                            currentStatus={data.status}
                            setStatus={(newStatus) =>
                                handleUpdateItemStatus(newStatus)
                            }
                        />
                    </div>
                    <Subtitle>Collection</Subtitle>
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
                    <Subtitle>Tags</Subtitle>

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
                    <Separator className="my-4" />
                    <Subtitle>Metadata</Subtitle>
                    <Table className="mt-2 pb-2">
                        <TableBody>
                            <TableRow divider={false} interactive={false}>
                                <TableCell className="text-slate-450 min-w-56px">
                                    Type
                                </TableCell>
                                <TableCell className="capitalize">
                                    {data.type}
                                </TableCell>
                            </TableRow>
                            <TableRow divider={false} interactive={false}>
                                <TableCell className="text-slate-450">
                                    URL
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {data.url}
                                </TableCell>
                            </TableRow>
                            {data.releaseTime ? (
                                <TableRow divider={false} interactive={false}>
                                    <TableCell className="text-slate-450">
                                        Published
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div>{`${data.releaseTime.toLocaleDateString(
                                            undefined,
                                            {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        )}`}</div>
                                    </TableCell>
                                </TableRow>
                            ) : null}
                            <TableRow divider={false} interactive={false}>
                                <TableCell className="text-slate-450">
                                    Date added
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <div>{`${data.createdAt.toLocaleDateString(
                                        undefined,
                                        {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )}`}</div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    {data.duration ? <div>{data.duration}</div> : null}
                    {data.author ? <div>{data.author}</div> : null}
                </div>
            ) : null}
        </div>
    );
}

function Subtitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-4 mb-2 text-slate-450 text-sm tracking-wide uppercase">
            {children}
        </div>
    );
}
