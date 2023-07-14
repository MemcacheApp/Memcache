"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { trpc } from "../../src/app/utils/trpc";

import { includeCaseInsensitive } from "../../src/app/utils";
import { Package2, Plus, RefreshCw, Tag } from "lucide-react";
import { cn } from "../utils";
import { FocusScope } from "@radix-ui/react-focus-scope";
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
                    }
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
    const [metadata, setMetadata] = useState<ItemMetadata | null>(null);

    const [isHidden, setIsHidden] = useState(true);
    const [isCollapse, setIsCollapse] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);
    const fetchMetadataTimer = useRef<number | NodeJS.Timeout | null>(null);

    const collectionsQuery = trpc.collection.getUserCollections.useQuery();
    const tagsQuery = trpc.tag.getUserTags.useQuery();
    const fetchMetadataQuery = trpc.item.fetchMetadata.useQuery(
        {
            url,
        },
        { refetchOnWindowFocus: false, enabled: false }
    );
    const createItemMutation = trpc.item.createItem.useMutation({
        onSuccess: () => ctx.item.getUserItems.invalidate(),
    });

    const refresh = useCallback(() => {
        fetchMetadataQuery.refetch();
    }, []);

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

    useEffect(() => {
        if (url) {
            if (fetchMetadataTimer.current) {
                clearTimeout(fetchMetadataTimer.current);
                fetchMetadataTimer.current = null;
            }
            fetchMetadataTimer.current = setTimeout(refresh, 2000);
        }
    }, [url]);

    useEffect(() => {
        if (fetchMetadataQuery.isFetched) {
            setIsLoading(false);
            if (fetchMetadataQuery.data) {
                setMetadata(fetchMetadataQuery.data);
            } else {
                setMetadata({
                    title: url,
                    url: url,
                    siteName: hostname(url),
                });
            }
        } else {
            setIsLoading(true);
        }
    }, [fetchMetadataQuery.isFetched]);

    useEffect(() => {
        if (createItemMutation.isSuccess) {
            setUrl("");
            setTags([]);
            onDismiss();
        }
    }, [createItemMutation.isSuccess]);

    const _onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            onDismiss();
        }
    };

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

    const removeTag = (index: number) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (url === "") return;
        createItemMutation.mutate({
            url,
            collectionName: collection,
            tagNames: tags,
        });
    };

    return (
        <div
            className={cn("z-50", {
                hidden: isHidden,
            })}
            onKeyDown={_onKeyDown}
        >
            <FocusScope trapped={isShow} loop>
                <form
                    className={cn(
                        "flex flex-col absolute -left-1 -top-1 -right-1 z-10 transition-[transform,opacity]",
                        isCollapse
                            ? "opacity-0 scale-95"
                            : "opacity-100 scale-100"
                    )}
                    action=""
                    onSubmit={handleSubmit}
                >
                    <div className="relative h-12 bg-background shadow-lg rounded-t-lg rounded-br-md border">
                        <Input
                            className="absolute top-0 bottom-0 h-full bg-transparent text-base border-none px-4 z-10"
                            placeholder="https://"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            ref={inputRef}
                        />
                    </div>
                    <div className="relative bg-background p-3 max-w-xl rounded-b-lg border-b border-x shadow-lg">
                        <SimpleItemCard
                            loading={isLoading}
                            url={url}
                            title={metadata?.title}
                            description={metadata?.description}
                            thumbnail={metadata?.thumbnail}
                            siteName={metadata?.siteName}
                            footerRight={
                                isLoading ? undefined : (
                                    <Button
                                        className="shrink-0"
                                        type="button"
                                        variant="icon"
                                        size="none"
                                        onClick={refresh}
                                        disabled={createItemMutation.isLoading}
                                    >
                                        <RefreshCw size={18} />
                                    </Button>
                                )
                            }
                        />
                        <div className="flex flex-col gap-3 my-4 mx-2">
                            <div className="flex gap-4 flex-wrap items-center">
                                <Package2
                                    className="text-slate-500"
                                    size={20}
                                />
                                <CollectionSelector
                                    collections={collectionsQuery.data}
                                    value={collection}
                                    setValue={setCollection}
                                    disabled={createItemMutation.isLoading}
                                />
                            </div>
                            <div className="flex gap-4 flex-wrap items-center">
                                <Tag className="text-slate-500" size={20} />
                                {tags.map((tag, index) => (
                                    <TagSelector
                                        key={tag}
                                        index={index}
                                        tags={tagsQuery.data}
                                        value={tag}
                                        setValue={setTag}
                                        remove={removeTag}
                                        disabled={createItemMutation.isLoading}
                                    />
                                ))}
                                <TagSelector
                                    tags={tagsQuery.data}
                                    value=""
                                    index={-1}
                                    setValue={setTag}
                                    remove={removeTag}
                                    disabled={createItemMutation.isLoading}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                            <Loader
                                varient="ring"
                                className={cn("w-6 h-6", {
                                    hidden: !createItemMutation.isLoading,
                                })}
                            />
                            <Button
                                type="submit"
                                disabled={createItemMutation.isLoading}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
                <div
                    className={cn(
                        "fixed top-0 bottom-0 left-0 right-0 transition-[background-color,backdrop-filter]",
                        {
                            "bg-white/80 backdrop-blur-sm": !isCollapse,
                        }
                    )}
                    onClick={onDismiss}
                ></div>
            </FocusScope>
        </div>
    );
}
