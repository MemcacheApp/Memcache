import { Collection, Tag } from "@prisma/client";
import { Globe, Package2, TagIcon, UserIcon } from "lucide-react";
import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
    ExternalLink,
    Link,
    SimpleTag,
    Skeleton,
} from ".";
import { cn } from "../utils";

export interface SimpleItemCardFormat {
    growHeight?: boolean; // Height of SimpleItemCard grows to fit container
    forceList?: boolean;
}

interface SimpleItemCardProps {
    className?: string;
    url?: string;
    title?: string;
    description?: string;
    type?: string;
    collection?: Collection;
    tags?: Tag[];
    thumbnail?: string | null;
    onClick?: React.MouseEventHandler<HTMLElement>;
    loading?: boolean;
    siteName?: string;
    favicon?: string | null;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    footerLeft?: React.ReactNode;
    footerRight?: React.ReactNode;
    thumbnailOverlay?: React.ReactNode;
    format?: SimpleItemCardFormat;
    titleOpenLink?: boolean;
}

export function SimpleItemCard(props: SimpleItemCardProps) {
    return (
        <Card
            className={cn(
                "@container flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0 overflow-hidden h-full",
                {
                    "cursor-pointer hover:border-slate-500": props.onClick,
                    "h-full flex flex-col": props.format?.growHeight,
                },
                props.className,
            )}
            onClick={props.onClick}
        >
            <div
                className={cn(
                    "flex flex-col overflow-hidden",
                    props.format?.forceList
                        ? "flex-row items-start"
                        : "@lg:flex-row @lg:items-start",
                    {
                        grow: props.format?.growHeight,
                    },
                )}
            >
                <CardHeader className="grow order-2 overflow-hidden">
                    {props.loading ? (
                        <>
                            <Skeleton className="h-8 rounded-lg" />
                            <Skeleton className="h-5 rounded-lg" />
                            <Skeleton className="h-5 w-40 rounded-lg" />
                        </>
                    ) : (
                        <>
                            {props.title ? (
                                props.url && props.titleOpenLink ? (
                                    <Link href={props.url}>
                                        <CardTitle>{props.title}</CardTitle>
                                    </Link>
                                ) : props.onClick ? (
                                    <Link
                                        href={"#"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            props.onClick?.(e);
                                        }}
                                    >
                                        <CardTitle>{props.title}</CardTitle>
                                    </Link>
                                ) : (
                                    <CardTitle>{props.title}</CardTitle>
                                )
                            ) : null}
                            {props.description ? (
                                <p className="mt-3 overflow-hidden text-slate-500">
                                    {props.description}
                                </p>
                            ) : null}
                        </>
                    )}
                </CardHeader>
                <Thumbnail
                    type={props.type}
                    loading={props.loading}
                    thumbnail={props.thumbnail}
                    format={props.format}
                    thumbnailOverlay={props.thumbnailOverlay}
                />
            </div>
            <SimpleItemCardFooter {...props} />
        </Card>
    );
}

export function SimpleItemCardFooter(props: SimpleItemCardProps) {
    return (
        <CardFooter
            className={cn(
                "w-full items-start flex-col gap-5 mt-3 mb-1",
                props.format?.forceList
                    ? "flex-row justify-between items-end"
                    : "@lg:flex-row @lg:justify-between @lg:items-end",
            )}
        >
            <div className="flex flex-wrap-reverse gap-x-5 gap-y-1 text-slate-450 text-sm">
                {props.loading ? (
                    <Skeleton className="h-5 w-24 rounded-lg" />
                ) : (
                    <>
                        {props.user ? (
                            <Link
                                className="flex items-center gap-2 my-2"
                                href={`/app/profile/${props.user.id}`}
                            >
                                <UserIcon size={16} />
                                {`${props.user.firstName} ${props.user.lastName}`}
                            </Link>
                        ) : null}
                        {props.siteName ? (
                            <ExternalLink
                                className="flex items-center gap-2 my-2"
                                href={props.url ? props.url : "#"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                {props.favicon ? (
                                    <img
                                        width={16}
                                        height={16}
                                        src={props.favicon}
                                    />
                                ) : (
                                    <Globe size={16} />
                                )}
                                {props.siteName}
                            </ExternalLink>
                        ) : null}
                        {props.collection ? (
                            <Link
                                className="flex items-center gap-2 my-2"
                                href={`/app/collection/${props.collection.id}`}
                            >
                                <Package2 size={16} />
                                {props.collection.name}
                            </Link>
                        ) : null}
                        {props.tags && props.tags.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-2">
                                <TagIcon size={16} />
                                {props.tags.map((tag) => (
                                    <Link
                                        tabIndex={-1}
                                        key={tag.id}
                                        href={`/app/tag/${tag.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <SimpleTag size="sm" value={tag.name} />
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </>
                )}
                {props.footerLeft}
            </div>
            {props.footerRight ? (
                <div className="flex gap-3 @lg:w-auto">{props.footerRight}</div>
            ) : null}
        </CardFooter>
    );
}

interface ThumbnailProps {
    type?: string;
    loading?: boolean;
    thumbnail?: string | null;
    format?: SimpleItemCardFormat;
    thumbnailOverlay?: React.ReactNode;
}

function Thumbnail(props: ThumbnailProps) {
    if (props.loading) {
        return (
            <Skeleton className="order-1 @lg:order-2 @lg:max-w-[32%] max-h-64 @lg:max-h-48 aspect-[16/9] @lg:m-6 shrink-0 rounded-t-lg overflow-hidden" />
        );
    } else if (props.thumbnail) {
        return (
            <div
                className={cn(
                    "order-1 max-h-64 shrink-0 rounded-t-lg overflow-hidden relative",
                    props.format?.forceList
                        ? "order-2 max-w-[32%] max-h-48 m-6 border rounded-lg"
                        : "@lg:order-2 @lg:max-w-[32%] @lg:max-h-48 @lg:m-6 @lg:border @lg:rounded-lg",
                    props.type?.startsWith("music")
                        ? "aspect-square"
                        : "aspect-[16/9]",
                )}
            >
                <img
                    src={props.thumbnail}
                    alt="Image"
                    className="object-cover object-center relative w-full h-full"
                />
                <div className="absolute left-5 bottom-4">
                    {props.thumbnailOverlay ?? null}
                </div>
            </div>
        );
    } else {
        return null;
    }
}
