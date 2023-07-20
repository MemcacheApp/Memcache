"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { trpc } from "../../src/app/utils/trpc";

import { includeCaseInsensitive } from "../../src/app/utils";
import { Package2, Plus, RefreshCw, Tag, X } from "lucide-react";
import { cn } from "../utils";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { RemoveScroll } from "react-remove-scroll";
import {
    CollectionSelector,
    TagSelector,
    Input,
    Button,
    SimpleItemCard,
    Loader,
} from ".";
import { ItemMetadata } from "@/src/datatypes/item";
import { hostname } from "@/src/utils";
import { Slot } from "@radix-ui/react-slot";

export function SaveInput() {
    const [isShowPopover, setIsShowPopover] = useState(false);

    const showPopover = () => {
        setIsShowPopover(true);
    };

    const dismissPopOver = () => {
        setIsShowPopover(false);
    };

    return (
        <div className="flex flex-col relative mb-5 mx-8 max-md:mx-5">
            <button
                className={cn(
                    "flex items-center text-left text-base box-border bg-background hover:border-slate-500 transition-colors py-3 px-4 rounded-lg border border-input cursor-text text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    {
                        "opacity-0": isShowPopover,
                    },
                )}
                onClick={showPopover}
            >
                <Plus size={18} className="mr-2" />
                Save a URL...
            </button>
            <SaveInputPopover
                isShow={isShowPopover}
                onDismiss={dismissPopOver}
            />
        </div>
    );
}

interface SaveInputPopoverProps {
    isShow: boolean;
    onDismiss: () => void;
}

function SaveInputPopover({ isShow, onDismiss }: SaveInputPopoverProps) {
    const ctx = trpc.useContext();

    const [url, setUrl] = useState("");
    const [collection, setCollection] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const [isHidden, setIsHidden] = useState(true);
    const [isCollapse, setIsCollapse] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);

    const createItemMutation = trpc.item.createItem.useMutation({
        onSuccess: () => ctx.item.getUserItems.invalidate(),
    });

    useEffect(() => {
        if (createItemMutation.isSuccess) {
            setUrl("");
            setTags([]);
            onDismiss();
        }
    }, [createItemMutation.isSuccess]);

    useEffect(() => {
        if (isShow) {
            setIsHidden(false);
            setTimeout(() => {
                setIsCollapse(false);
                inputRef.current?.focus();
            }, 10);
        } else {
            setIsCollapse(true);
            setTimeout(() => {
                setIsHidden(true);
            }, 200);
        }
    }, [isShow]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (url === "") return;
        createItemMutation.mutate({
            url,
            collectionName: collection,
            tagNames: tags,
        });
    };

    const clearInput = () => {
        setUrl("");
        inputRef.current?.focus();
    };

    return (
        <RemoveScroll enabled={isShow} as={Slot} allowPinchZoom>
            <FocusScope asChild trapped={isShow} loop>
                <DismissableLayer asChild onDismiss={onDismiss}>
                    <div
                        className={cn("z-50", {
                            hidden: isHidden,
                        })}
                    >
                        <div
                            className={cn(
                                "fixed top-0 bottom-0 left-0 right-0 transition-[background-color,backdrop-filter]",
                                {
                                    "bg-white/80 backdrop-blur-sm": !isCollapse,
                                },
                            )}
                            onClick={onDismiss}
                        ></div>
                        <form
                            className={cn(
                                "@container flex flex-col absolute -left-1 -top-1 -right-1 z-10 transition-[transform,opacity] pointer-events-none",
                                isCollapse
                                    ? "opacity-0 scale-95"
                                    : "opacity-100 scale-100",
                            )}
                            action=""
                            onSubmit={handleSubmit}
                        >
                            <div
                                className={cn(
                                    "relative h-12 bg-background shadow-lg rounded-t-lg border pointer-events-auto",
                                    url
                                        ? "@xl:rounded-br-md"
                                        : "rounded-br-md rounded-bl-md",
                                )}
                            >
                                <Input
                                    className="absolute top-0 bottom-0 h-full bg-transparent text-base border-none pl-4 pr-10 z-10"
                                    placeholder="https://"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    ref={inputRef}
                                />
                                <Button
                                    className={cn(
                                        "absolute right-2 top-1/2 -translate-y-1/2 z-10 text-slate-500 rounded-full p-1",
                                        { hidden: !url },
                                    )}
                                    onClick={clearInput}
                                    type="button"
                                    variant="ghost"
                                    size="none"
                                >
                                    <X size={20} />
                                </Button>
                            </div>
                            <SaveOptions
                                url={url}
                                isCreating={createItemMutation.isLoading}
                                collection={collection}
                                setCollection={setCollection}
                                tags={tags}
                                setTags={setTags}
                            />
                        </form>
                    </div>
                </DismissableLayer>
            </FocusScope>
        </RemoveScroll>
    );
}

interface SaveOptionsProps {
    url: string;
    isCreating: boolean;
    collection: string;
    setCollection: (collection: string) => void;
    tags: string[];
    setTags: (tags: string[]) => void;
}

function SaveOptions({
    url,
    isCreating,
    collection,
    setCollection,
    tags,
    setTags,
}: SaveOptionsProps) {
    const [isHidden, setIsHidden] = useState(true);
    const [isCollapse, setIsCollapse] = useState(true);

    const [metadata, setMetadata] = useState<ItemMetadata | null>(null);

    const collectionsQuery = trpc.collection.getUserCollections.useQuery();
    const tagsQuery = trpc.tag.getUserTags.useQuery();

    const fetchMetadataTimer = useRef<number | NodeJS.Timeout | null>(null);
    const fetchMetadataQuery = trpc.item.fetchMetadata.useQuery(
        {
            url,
        },
        { refetchOnWindowFocus: false, enabled: false },
    );

    const refresh = useCallback(() => {
        fetchMetadataQuery.refetch();
    }, []);

    useEffect(() => {
        if (url) {
            setIsHidden(false);
            setTimeout(() => {
                setIsCollapse(false);
            }, 10);

            if (fetchMetadataTimer.current) {
                clearTimeout(fetchMetadataTimer.current);
                fetchMetadataTimer.current = null;
            }
            fetchMetadataTimer.current = setTimeout(refresh, 2000);
        } else {
            setIsCollapse(true);
            setTimeout(() => {
                setIsHidden(true);
            }, 200);
        }
    }, [url]);

    useEffect(() => {
        if (fetchMetadataQuery.isFetched) {
            if (fetchMetadataQuery.data) {
                setMetadata(fetchMetadataQuery.data);
            } else {
                setMetadata({
                    title: url,
                    url: url,
                    siteName: hostname(url),
                });
            }
        }
    }, [fetchMetadataQuery.isFetched]);

    const setTag = (name: string, index: number) => {
        if (includeCaseInsensitive(tags, name)) {
            if (index !== -1) {
                const newTags = [...tags];
                newTags.splice(index, 1);
                setTags(newTags);
            }
        } else {
            if (index === -1) {
                setTags([...tags, name]);
            } else {
                const newTags = [...tags];
                newTags[index] = name;
                setTags(newTags);
            }
        }
    };

    const removeTag = (name: string) => {
        setTags(tags.filter((tagName) => tagName != name));
    };

    return (
        <div
            className={cn(
                "relative flex flex-col max-h-[75vh] overflow-auto gap-3 bg-background p-3 max-w-xl rounded-b-lg border-b border-x shadow-lg transition-[transform,opacity] pointer-events-auto",
                { hidden: isHidden, "-translate-y-5 opacity-0": isCollapse },
            )}
        >
            <SimpleItemCard
                loading={fetchMetadataQuery.isLoading}
                url={metadata?.url}
                title={metadata?.title}
                description={metadata?.description}
                thumbnail={metadata?.thumbnail}
                siteName={metadata?.siteName}
                favicon={metadata?.favicon}
                footerRight={
                    fetchMetadataQuery.isLoading ? undefined : (
                        <Button
                            className="shrink-0"
                            type="button"
                            variant="icon"
                            size="none"
                            onClick={refresh}
                            disabled={isCreating}
                        >
                            <RefreshCw size={18} />
                        </Button>
                    )
                }
            />
            <div className="flex flex-col rounded-lg bg-slate-50 gap-3 py-4 px-5">
                <div className="flex gap-3 flex-wrap items-center">
                    <Package2 className="text-slate-500" size={18} />
                    <CollectionSelector
                        collections={collectionsQuery.data}
                        value={collection}
                        setValue={setCollection}
                        disabled={isCreating}
                    />
                </div>
                <div className="flex gap-3 flex-wrap items-center">
                    <Tag className="text-slate-500" size={18} />
                    {tags.map((tag, index) => (
                        <TagSelector
                            key={tag}
                            index={index}
                            tags={tagsQuery.data}
                            value={tag}
                            setValue={setTag}
                            remove={removeTag}
                            disabled={isCreating}
                        />
                    ))}
                    <TagSelector
                        tags={tagsQuery.data}
                        value=""
                        index={-1}
                        setValue={setTag}
                        remove={removeTag}
                        disabled={isCreating}
                    />
                </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
                <Loader
                    varient="ring"
                    className={cn("w-6 h-6", {
                        hidden: !isCreating,
                    })}
                />
                <Button type="submit" disabled={isCreating}>
                    Save
                </Button>
            </div>
        </div>
    );
}
