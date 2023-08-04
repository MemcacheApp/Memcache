"use client";

import { useItemListStore } from "@/src/app/store/item-list";
import { trpc } from "@/src/app/utils/trpc";
import { ItemExt } from "@/src/datatypes/item";
import { ItemStatus } from "@prisma/client";
import {
    CheckIcon,
    EditIcon,
    Eye,
    Globe,
    Package2,
    TagIcon,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
    AddTag,
    CollectionSelector,
    ExternalLink,
    Link,
    Loader,
    SimpleTag,
    Switch,
} from ".";
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
                <Header items={items} dismissPanel={dismissPanel} />
                {items ? (
                    items.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            <Title items={items} />
                            <SiteName items={items} />
                            {items.length === 1 ? (
                                <div>{items[0].description}</div>
                            ) : null}
                            <Separator className="my-4" />
                            <Options itemIds={itemIds} items={items} />
                            <Separator className="my-4" />
                            <Metadata items={items} />
                        </div>
                    ) : null
                ) : (
                    <Loader varient="ellipsis" />
                )}
            </Card>
        </div>
    );
}

interface HeaderProps {
    items: ItemExt[] | undefined;
    dismissPanel: () => void;
}

function Header({ items, dismissPanel }: HeaderProps) {
    return (
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
                <div className="mx-auto aspect-[16/9] shrink-0">
                    <img
                        src={items[0].thumbnail}
                        alt="Image"
                        className="object-cover object-center relative w-full h-full"
                    />
                </div>
            ) : null}
        </div>
    );
}

function Title({ items }: { items: ItemExt[] }) {
    return (
        <div className="text-xl font-bold">
            {items.slice(0, 3).map((item, i) => (
                <Fragment key={item.id}>
                    {i ? <span className="text-gray-500 mr-3">,</span> : null}
                    <ExternalLink href={item.url}>{item.title}</ExternalLink>
                </Fragment>
            ))}
            {items.length > 3 ? (
                <span className="ml-2 text-gray-500 mr-2">
                    +{items.length - 3}
                </span>
            ) : null}
        </div>
    );
}

function SiteName({ items }: { items: ItemExt[] }) {
    return (
        <div className="text-slate-450">
            {items.slice(0, 3).map((item, i) => (
                <Fragment key={item.id}>
                    {i ? <span className="text-gray-500 mr-3">,</span> : null}
                    <ExternalLink key={item.id} href={item.url}>
                        {item.favicon ? (
                            <img
                                className="inline-block mr-2"
                                width={16}
                                height={16}
                                src={item.favicon}
                            />
                        ) : (
                            <Globe className="inline-block mr-2" size={16} />
                        )}
                        {item.siteName}
                    </ExternalLink>
                </Fragment>
            ))}
            {items.length > 3 ? (
                <span className="ml-2 text-gray-500 mr-2">
                    +{items.length - 3}
                </span>
            ) : null}
        </div>
    );
}

interface OptionsProps {
    itemIds: string[];
    items: ItemExt[];
}

function Options(props: OptionsProps) {
    return (
        <div className="flex flex-col gap-4">
            <Visibility {...props} />
            <Status {...props} />
            <Collection {...props} />
            <Tags {...props} />
        </div>
    );
}

function Visibility({ itemIds, items }: OptionsProps) {
    const ctx = trpc.useContext();

    const setItemVisibilityMutation = trpc.item.setItemVisibility.useMutation({
        onSuccess: async () => {
            ctx.item.getItems.invalidate({ itemIds });
        },
    });

    const visibility = useMemo(() => {
        const publics = items.map((item) => item.public);
        if (publics.every((i) => i)) {
            return "Public";
        } else if (publics.every((i) => !i)) {
            return "Private";
        } else {
            return "Mixed";
        }
    }, [items]);

    const handleChange = (isPublic: boolean) => {
        setItemVisibilityMutation.mutate({
            itemId: itemIds,
            isPublic,
        });
    };

    return (
        <div className="flex flex-col">
            <Subtitle Icon={<Eye size={18} />}>Visibility</Subtitle>
            <div className="flex justify-between items-center my-1">
                <p className="text-slate-600 font-medium">{visibility}</p>
                <Switch
                    className={cn({
                        "opacity-60": visibility === "Mixed",
                    })}
                    checked={visibility === "Public"}
                    onCheckedChange={handleChange}
                />
            </div>
        </div>
    );
}

function Status({ itemIds, items }: OptionsProps) {
    const ctx = trpc.useContext();

    const status = useMemo(() => {
        if (items.every((item) => item.status === items[0].status)) {
            return items[0].status;
        } else {
            return "Mixed";
        }
    }, [items]);

    const updateItemStatusMutation = trpc.item.setItemStatus.useMutation({
        onSuccess: async () => {
            ctx.item.getItems.invalidate({ itemIds });
            ctx.item.getUserItems.invalidate();
        },
    });

    const handleChange = (newStatus: ItemStatus) => {
        updateItemStatusMutation.mutateAsync({
            itemId: itemIds,
            status: newStatus,
        });
    };

    return (
        <div className="flex flex-col">
            <Subtitle Icon={<StatusIcon status={"Inbox"} size={18} />}>
                Status
            </Subtitle>
            <div className="flex justify-between items-center">
                <Link
                    href={`/app/saves`}
                    className="text-slate-600 font-medium underline"
                >
                    {status}
                </Link>
                <MultiToggle currentStatus={status} setStatus={handleChange} />
            </div>
        </div>
    );
}

function Collection({ itemIds, items }: OptionsProps) {
    const ctx = trpc.useContext();

    const collectionsQuery = trpc.collection.getUserCollections.useQuery();

    const setCollectionOnItem = trpc.item.setItemCollection.useMutation({
        onSuccess: () => {
            ctx.item.getItems.invalidate({ itemIds });
            ctx.item.getUserItems.invalidate();
            ctx.collection.getUserCollections.invalidate();
        },
    });

    const collection = useMemo(() => {
        if (
            items.every((item) => item.collectionId === items[0].collectionId)
        ) {
            return items[0].collection;
        } else {
            return "Mixed";
        }
    }, [items]);

    const handleChange = (newCollection: string) => {
        setCollectionOnItem.mutate({
            itemId: itemIds,
            collectionName: newCollection,
        });
    };

    return (
        <div className="flex flex-col">
            <Subtitle Icon={<Package2 size={18} />}>Collection</Subtitle>
            <div className="flex justify-between items-center">
                <Link
                    href={
                        collection === "Mixed"
                            ? "#"
                            : `/app/collections/${collection.id}`
                    }
                    className="text-slate-600 font-medium underline"
                >
                    {collection === "Mixed" ? "Mixed" : collection.name}
                </Link>
                <CollectionSelector
                    collections={collectionsQuery.data}
                    value={collection === "Mixed" ? undefined : collection.name}
                    onSelect={handleChange}
                    trigger={
                        <Button variant="icon" size="none">
                            <EditIcon size={18} />
                        </Button>
                    }
                />
            </div>
        </div>
    );
}

function Tags({ itemIds, items }: OptionsProps) {
    const ctx = trpc.useContext();
    const { push } = useRouter();

    const [isEditMode, setIsEditMode] = useState(false);

    const tagsQuery = trpc.tag.getUserTags.useQuery();
    const addTagToItemMutation = trpc.item.addTag.useMutation({
        onSuccess: () => {
            ctx.item.getItems.invalidate({ itemIds });
            ctx.item.getUserItems.invalidate();
            ctx.tag.getUserTags.invalidate();
        },
    });

    const removeTagFromItemMutation = trpc.item.removeTag.useMutation({
        onSuccess: () => {
            ctx.item.getItems.invalidate({ itemIds });
            ctx.item.getUserItems.invalidate();
        },
    });

    if (items.length > 1) {
        return null;
    }

    const item = items[0];

    return (
        <div>
            <Subtitle Icon={<TagIcon size={18} />}>Tags</Subtitle>
            <div className="flex flex-wrap mt-2">
                <div className="flex flex-wrap gap-3 grow">
                    {item.tags.map((tag, index) => (
                        <SimpleTag
                            key={tag.id}
                            value={tag.name}
                            onClick={() => push(`/app/saves?tag=${tag.name}`)}
                            remove={() => {
                                removeTagFromItemMutation.mutate({
                                    itemId: item.id,
                                    tagId: item.tags[index].id,
                                });
                            }}
                            editMode={isEditMode}
                        />
                    ))}
                    {isEditMode ? (
                        <AddTag
                            tags={tagsQuery.data}
                            onSelect={(newTag) => {
                                addTagToItemMutation.mutate({
                                    itemId: item.id,
                                    tagName: newTag,
                                });
                            }}
                            selectedTags={item.tags.map((tag) => tag.name)}
                        />
                    ) : null}
                </div>

                <Button
                    variant="icon"
                    size="none"
                    onClick={() => setIsEditMode((state) => !state)}
                >
                    {isEditMode ? (
                        <CheckIcon size={18} />
                    ) : (
                        <EditIcon size={18} />
                    )}
                </Button>
            </div>
        </div>
    );
}

function Metadata({ items }: { items: ItemExt[] }) {
    if (items.length > 1) {
        return null;
    }

    const item = items[0];

    return (
        <div>
            <Subtitle>Metadata</Subtitle>
            <Table className="mt-2 pb-2">
                <TableBody>
                    <TableRow divider={false} interactive={false}>
                        <TableCell className="text-slate-450 min-w-56px">
                            Type
                        </TableCell>
                        <TableCell className="capitalize">
                            {item.type}
                        </TableCell>
                    </TableRow>
                    <TableRow divider={false} interactive={false}>
                        <TableCell className="text-slate-450">URL</TableCell>
                        <TableCell className="whitespace-nowrap">
                            {item.url}
                        </TableCell>
                    </TableRow>
                    {item.releaseTime ? (
                        <TableRow divider={false} interactive={false}>
                            <TableCell className="text-slate-450">
                                Published
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                <div>{`${item.releaseTime.toLocaleDateString(
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
                            <div>{`${item.createdAt.toLocaleDateString(
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
                    {item.duration ? (
                        <TableRow divider={false} interactive={false}>
                            <TableCell className="text-slate-450">
                                Duration
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                <div>{item.duration}</div>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {item.author ? (
                        <TableRow divider={false} interactive={false}>
                            <TableCell className="text-slate-450">
                                Author
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                <div>{item.author}</div>
                            </TableCell>
                        </TableRow>
                    ) : null}
                </TableBody>
            </Table>
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
        <div className="mb-1 text-slate-450 text-sm tracking-wide uppercase flex items-center">
            {Icon ? <div className="inline mr-2">{Icon}</div> : null}
            {children}
        </div>
    );
}
