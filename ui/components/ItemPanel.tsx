"use client";

import { useItemListStore } from "@/src/app/store/item-list";
import { DEBUG } from "@/src/app/utils/constants";
import { trpc } from "@/src/app/utils/trpc";
import { ItemStatus } from "@prisma/client";
import {
    ArrowLeftRightIcon,
    EditIcon,
    Eye,
    Package2,
    TagIcon,
    X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AddTag, CollectionSelector, ExternalLink, Loader, SimpleTag } from ".";
import { cn } from "../utils";
import { Button } from "./Button";
import { Card } from "./Card";
import MultiToggle from "./MultiToggle";
import { Separator } from "./Separator";
import { StatusIcon } from "./StatusIcon";
import { Table, TableBody, TableCell, TableRow } from "./Table";

export function ItemPanel() {
    const { selectedItems, isShowPanel, dismissPanel } = useItemListStore(
        (state) => ({
            selectedItems: state.selectedItems,
            isShowPanel: state.isShowPanel,
            dismissPanel: state.dismissPanel,
        }),
    );

    const itemIds = useMemo(() => Array.from(selectedItems), [selectedItems]);
    const getItemsQuery = trpc.item.getItems.useQuery({
        itemIds,
    });
    const items = getItemsQuery.data;

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
        <div className="z-50">
            <div
                className={cn(
                    "fixed top-0 bottom-0 left-0 right-0 bg-white/40 md:hidden backdrop-blur-sm transition-opacity",
                    isCollapse ? "opacity-0" : "opacity-100",
                    {
                        hidden: isHidden,
                    },
                )}
            ></div>
            <Card
                className={cn(
                    "fixed flex flex-col right-5 w-[360px] overflow-auto p-4 top-3 bottom-3 max-md:w-auto max-md:left-0 max-md:right-0 max-md:bottom-0 max-md:top-14 transition-transform",
                    {
                        hidden: isHidden,
                        "md:translate-x-[20rem]": isCollapse,
                        "max-md:translate-y-[100%]": isCollapse,
                    },
                )}
            >
                <div className="max-h-64 min-h-[3.5rem] shrink-0 overflow-hidden -mt-4 -mx-4 mb-4">
                    <div className="flex absolute top-0 w-full h-14 p-2 gap-2 items-center bg-gradient-to-b z-10 from-black/50 to-black/0 text-white">
                        <Button
                            variant="ghost"
                            className="w-9 rounded-full p-0 hover:bg-white/20 hover:text-white shrink-0"
                            size="sm"
                            onClick={dismissPanel}
                        >
                            <div className="h-4 w-4">
                                <X size={16} />
                            </div>
                            <span className="sr-only">Close sidebar</span>
                        </Button>
                        {items && items.length > 0 ? (
                            <>
                                <div className="font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                                    {items[0].title}
                                </div>
                                {items.length > 1 ? (
                                    <div className="bg-white text-black font-medium px-1 rounded-md">
                                        +{items.length - 1}
                                    </div>
                                ) : null}
                            </>
                        ) : null}
                    </div>
                    {items && items.length > 0 && items[0].thumbnail ? (
                        <ExternalLink href={items[0].thumbnail}>
                            <div className="mx-auto aspect-[16/9] shrink-0">
                                <img
                                    src={items[0].thumbnail}
                                    alt="Image"
                                    className="object-cover object-center relative w-full h-full"
                                />
                            </div>
                        </ExternalLink>
                    ) : null}
                </div>
                {items ? (
                    items.length > 0 ? (
                        <>
                            <div className="text-xl font-bold">
                                {items.map((item, i) => (
                                    <>
                                        {i ? (
                                            <span className="text-gray-500 mr-2">
                                                ,
                                            </span>
                                        ) : null}
                                        <ExternalLink
                                            key={item.id}
                                            href={item.url}
                                        >
                                            {item.title}
                                        </ExternalLink>
                                    </>
                                ))}
                            </div>
                        </>
                    ) : null
                ) : (
                    <Loader varient="ellipsis" />
                )}
                <SingleItem itemId={itemIds[0]} />
            </Card>
        </div>
    );
}

export function SingleItem({ itemId }: { itemId: string }) {
    const ctx = trpc.useContext();
    const { push } = useRouter();

    const itemQuery = trpc.item.getItem.useQuery({ itemId });
    const data = itemQuery.data;

    const collectionsQuery = trpc.collection.getUserCollections.useQuery();
    const tagsQuery = trpc.tag.getUserTags.useQuery();

    const [isTagEditMode, setIsTagEditMode] = useState(false);

    DEBUG &&
        console.log(
            `Rendering single item ${data?.title}, status is ${data?.status}}`,
        );

    const setCollectionOnItem = trpc.item.setItemCollection.useMutation({
        onSuccess: () => {
            ctx.item.getItem.invalidate({ itemId });
            ctx.item.getUserItems.invalidate();
            ctx.collection.getUserCollections.invalidate();
        },
    });

    const addTagToItemMutation = trpc.item.addTag.useMutation({
        onSuccess: () => {
            ctx.item.getItem.invalidate({ itemId });
            ctx.item.getUserItems.invalidate();
            ctx.tag.getUserTags.invalidate();
        },
    });

    const removeTagFromItemMutation = trpc.item.removeTag.useMutation({
        onSuccess: () => {
            ctx.item.getItem.invalidate({ itemId });
            ctx.item.getUserItems.invalidate();
        },
    });

    const updateItemStatusMutation = trpc.item.setItemStatus.useMutation({
        onSuccess: async () => {
            ctx.item.getItem.invalidate({ itemId });
            ctx.item.getUserItems.invalidate();
        },
    });

    const setItemVisibilityMutation = trpc.item.setItemVisibility.useMutation({
        onSuccess: async () => {
            ctx.item.getItem.invalidate({ itemId });
        },
    });

    const handleUpdateItemStatus = async (newStatus: ItemStatus) => {
        if (!data) {
            return;
        }
        try {
            await updateItemStatusMutation.mutateAsync({
                itemId: data.id,
                status: newStatus,
            });
            DEBUG && console.log(`Updated item status to ${newStatus}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {data ? (
                <div>
                    <div className="mt-1 mb-3 text-slate-450 ">
                        <ExternalLink href={data.url}>
                            {data.siteName}
                        </ExternalLink>
                    </div>
                    <div className="mt-3">{data.description}</div>

                    <Separator className="my-4" />

                    <Subtitle Icon={<Eye size={18} />}>Visibility</Subtitle>
                    <div className="flex justify-between items-center my-1">
                        <p className="text-slate-600 font-medium">
                            {data.public ? "Public" : "Private"}
                        </p>
                        <Button
                            variant="icon"
                            size="none"
                            onClick={() => {
                                setItemVisibilityMutation.mutate({
                                    itemId: data.id,
                                    isPublic: !data.public,
                                });
                            }}
                        >
                            <ArrowLeftRightIcon size={18} />
                        </Button>
                    </div>

                    <Subtitle
                        Icon={<StatusIcon status={data.status} size={18} />}
                    >
                        Status
                    </Subtitle>
                    <div className="flex justify-between items-center">
                        <Link
                            href={`/app/saves`}
                            className="text-slate-600 font-medium underline"
                        >
                            {ItemStatus[data.status]}
                        </Link>
                        <MultiToggle
                            currentStatus={data.status}
                            setStatus={(newStatus) =>
                                handleUpdateItemStatus(newStatus)
                            }
                        />
                    </div>

                    <Subtitle Icon={<Package2 size={18} />}>
                        Collection
                    </Subtitle>
                    <div className="flex justify-between items-center">
                        <Link
                            href={`/app/collections/${data.collection.id}`}
                            className="text-slate-600 font-medium underline"
                        >
                            {data.collection.name}
                        </Link>
                        <CollectionSelector
                            collections={collectionsQuery.data}
                            value={data.collection.name}
                            onSelect={(newCollection) => {
                                setCollectionOnItem.mutate({
                                    itemId: data.id,
                                    collectionName: newCollection,
                                });
                            }}
                        />
                    </div>
                    <Subtitle Icon={<TagIcon size={18} />}>Tags</Subtitle>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="icon"
                            size="none"
                            onClick={() => setIsTagEditMode((state) => !state)}
                        >
                            <EditIcon size={18} />
                        </Button>
                        {data.tags.map((tag, index) => (
                            <SimpleTag
                                key={tag.id}
                                value={tag.name}
                                onClick={() =>
                                    push(`/app/saves?tag=${tag.name}`)
                                }
                                remove={() => {
                                    removeTagFromItemMutation.mutate({
                                        itemId: data.id,
                                        tagId: data.tags[index].id,
                                    });
                                }}
                                editMode={isTagEditMode}
                            />
                        ))}
                        {isTagEditMode ? (
                            <AddTag
                                tags={tagsQuery.data}
                                onSelect={(newTag) => {
                                    addTagToItemMutation.mutate({
                                        itemId: data.id,
                                        tagName: newTag,
                                    });
                                }}
                                selectedTags={data.tags.map((tag) => tag.name)}
                            />
                        ) : null}
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
                                            },
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
                                        },
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

function Subtitle({
    Icon,
    children,
}: {
    Icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="mt-4 mb-1 text-slate-450 text-sm tracking-wide uppercase flex items-center">
            {Icon ? <div className="inline mr-2">{Icon}</div> : null}
            {children}
        </div>
    );
}
