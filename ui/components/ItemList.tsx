"use client";

import EmptyInbox from "@/public/EmptyInbox.svg";
import { useItemListStore } from "@/src/app/store/item-list";
import { StatusEnum, StatusIcons, StatusNames } from "@/src/app/utils/Statuses";
import renderIcon from "@/src/app/utils/renderIcon";
import { trpc } from "@/src/app/utils/trpc";
import { SquareStack, Tags, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import {
    Button,
    Card,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    ItemCard,
    TagSelector,
} from ".";
import { cn } from "../utils";
import SimpleTag from "./SimpleTag";

interface ItemListProps {
    collectionId?: string;
}

export function ItemList(props: ItemListProps) {
    const { collectionId } = props;

    const {
        selectItem,
        activeStatus,
        selectedItems,
        includedTags,
        excludedTags,
        tagCount,
    } = useItemListStore((state) => ({
        selectItem: state.selectItem,
        activeStatus: state.activeStatus,
        selectedItems: state.selectedItems,
        includedTags: state.includedTags,
        excludedTags: state.excludedTags,
        tagCount: state.tagCount,
    }));

    const itemsQuery = trpc.item.getUserItems.useQuery({
        includedTags:
            includedTags.size > 0 ? Array.from(includedTags) : undefined,
        excludedTags:
            excludedTags.size > 0 ? Array.from(excludedTags) : undefined,
    });

    const items = useMemo(() => {
        if (itemsQuery.data) {
            let items = itemsQuery.data;

            if (collectionId) {
                items = items.filter(
                    (item) => collectionId === item.collection.id,
                );
            }
            return items
                .filter((item) => activeStatus === item.status)
                .sort(
                    (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf(), // sort by createdAt
                );
        } else {
            return [];
        }
    }, [itemsQuery.data, activeStatus, tagCount]);

    return (
        <div className="flex flex-col gap-3 pb-8 md:mx-8">
            <Options />
            {items && items.length > 0 ? (
                items.map((item) => (
                    <ItemCard
                        data={item}
                        key={item.id}
                        selected={selectedItems.has(item.id)}
                        onSelect={selectItem}
                    />
                ))
            ) : (
                <div className="flex flex-col items-center w-full gap-4 px-6 my-8">
                    <Image
                        src={EmptyInbox}
                        width="128"
                        height="128"
                        alt="Empty Inbox"
                    />
                    <div>{`No saves in ${StatusNames[activeStatus]}`}</div>
                </div>
            )}
        </div>
    );
}

function Options() {
    const isMultiselect = useItemListStore((state) => state.isMultiselect);

    return (
        <div className="flex items-center gap-5 max-md:mx-5">
            {isMultiselect ? <MultiselectOptions /> : <NormalOptions />}
        </div>
    );
}

function NormalOptions() {
    const enableMultiselect = useItemListStore(
        (state) => state.enableMultiselect,
    );

    return (
        <>
            <StatusToggle />
            <TagFilterSelector />
            <Button
                variant="outline"
                className="w-10 p-0 rounded-full shrink-0"
                onClick={enableMultiselect}
            >
                <div className="flex items-center justify-center w-4 h-4">
                    <SquareStack />
                </div>
                <span className="sr-only">Multiselect</span>
            </Button>
        </>
    );
}

function MultiselectOptions() {
    const { selectedItems, showPanel, disableMultiselect } = useItemListStore(
        (state) => ({
            selectedItems: state.selectedItems,
            showPanel: state.showPanel,
            disableMultiselect: state.disableMultiselect,
        }),
    );

    const ctx = trpc.useContext();

    const deleteItemMutation = trpc.item.deleteItem.useMutation({
        onSuccess: () => ctx.item.getUserItems.invalidate(),
    });

    const handleDeleteItems = async () => {
        selectedItems.forEach(async (id) => {
            try {
                await deleteItemMutation.mutateAsync({ id });
            } catch (error) {
                console.error(error);
            }
        });
        selectedItems.clear();
    };

    const updateItemStatusMutation = trpc.item.setItemStatus.useMutation({
        onSuccess: () => ctx.item.getUserItems.invalidate(),
    });

    const handleUpdateItemsStatus = async (status: number) => {
        selectedItems.forEach(async (itemId) => {
            try {
                await updateItemStatusMutation.mutateAsync({
                    itemId,
                    status,
                });
            } catch (error) {
                console.error(error);
            }
        });
        selectedItems.clear();
    };

    const statusNames = Object.values(StatusEnum).filter(
        (value): value is string => typeof value === "string",
    );
    const statusNums = Array.from(statusNames.keys());

    return (
        <>
            <div className="flex items-center h-12 gap-5 overflow-x-auto whitespace-nowrap grow">
                <div className="flex items-center">
                    <SquareStack size={18} className="mr-2" />
                    <span className="font-medium">
                        Selected {selectedItems.size}
                        {selectedItems.size === 1 ? " item" : " items"}
                    </span>
                </div>
                <div
                    className={cn("flex items-center gap-3", {
                        hidden: selectedItems.size === 0,
                    })}
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Set status</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {statusNums.map((value) => (
                                <DropdownMenuItem
                                    key={value}
                                    onClick={() => {
                                        handleUpdateItemsStatus(value);
                                    }}
                                >
                                    <div className="mr-2">
                                        {renderIcon(StatusIcons[value])}
                                    </div>
                                    {statusNames[value]}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="outline"
                        className="text-red-600"
                        onClick={handleDeleteItems}
                    >
                        <Trash2 className="mr-2" size={18} />
                        Delete
                    </Button>
                </div>
            </div>
            <Button variant="outline" onClick={showPanel}>
                More
            </Button>
            <Button
                variant="outline"
                className="w-10 p-0 rounded-full shrink-0"
                onClick={disableMultiselect}
            >
                <div className="flex items-center justify-center w-4 h-4">
                    <X />
                </div>
                <span className="sr-only">Exit Multiselect</span>
            </Button>
        </>
    );
}

function StatusToggle() {
    const { activeStatus, setActiveStatus } = useItemListStore((state) => ({
        activeStatus: state.activeStatus,
        setActiveStatus: state.setActiveStatus,
    }));

    return (
        <div className="flex items-center h-12 space-x-3 overflow-x-auto grow">
            {Object.values(StatusEnum)
                .filter((value) => typeof value === "number")
                .map((value) => {
                    return (
                        <Button
                            key={value}
                            variant={
                                activeStatus === value ? "default" : "outline"
                            }
                            onClick={() => setActiveStatus(value as StatusEnum)}
                        >
                            {renderIcon(
                                StatusIcons[value as StatusEnum],
                                "mr-2",
                            )}
                            {StatusNames[value as StatusEnum]}
                        </Button>
                    );
                })}
        </div>
    );
}

function TagFilterSelector() {
    const tagsQuery = trpc.tag.getUserTags.useQuery();

    const { includedTags, excludedTags, tagCount, setTagCount } =
        useItemListStore((state) => ({
            includedTags: state.includedTags,
            excludedTags: state.excludedTags,
            tagCount: state.tagCount,
            setTagCount: state.setTagCount,
        }));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="outline">
                    <Tags className="mr-2" size={18} />
                    Tags
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-1 w-[300px]">
                <Card className="p-1">
                    <div className="font-medium">Include:</div>
                    <div className="flex flex-wrap gap-3">
                        {Array.from(includedTags).map((tag, index) => (
                            <SimpleTag
                                key={index}
                                value={tag}
                                remove={() => {
                                    includedTags.delete(tag);
                                    setTagCount(tagCount - 1);
                                }}
                            />
                        ))}
                        <TagSelector
                            tags={tagsQuery.data}
                            index={-1}
                            value=""
                            setValue={(tag) => {
                                includedTags.add(tag);
                                setTagCount(tagCount + 1);
                            }}
                            remove={(tag) => {
                                includedTags.delete(tag);
                                setTagCount(tagCount - 1);
                            }}
                        />
                    </div>
                </Card>
                <Card className="p-1">
                    <div className="text-red-600 font-medium">Exclude:</div>
                    <div className="flex flex-wrap gap-3">
                        {Array.from(excludedTags).map((tag, index) => (
                            <SimpleTag
                                key={index}
                                value={tag}
                                remove={() => {
                                    excludedTags.delete(tag);
                                    setTagCount(tagCount - 1);
                                }}
                            />
                        ))}
                        <TagSelector
                            tags={tagsQuery.data}
                            index={-1}
                            value=""
                            setValue={(tag) => {
                                excludedTags.add(tag);
                                setTagCount(tagCount + 1);
                            }}
                            remove={(tag) => {
                                excludedTags.delete(tag);
                                setTagCount(tagCount - 1);
                            }}
                        />
                    </div>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
