import { Globe, Package2 } from "lucide-react";
import { Button, Card, CardFooter, CardHeader, CardTitle, Skeleton } from ".";
import ExternalLink from "./ExternalLink";
import { cn } from "../utils";
import { Collection, Tag } from "@prisma/client";
import Link from "next/link";

interface SimpleItemCardProps {
    title?: string;
    url?: string;
    className?: string;
    description?: string;
    collection?: Collection;
    tags?: Tag[];
    thumbnail?: string | null;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    loading?: boolean;
    siteName?: string;
    favicon?: string | null;
    footerLeft?: React.ReactNode;
    footerRight?: React.ReactNode;
}

export function SimpleItemCard(props: SimpleItemCardProps) {
    return (
        <Card
            className={cn(
                "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden",
                { "cursor-pointer hover:border-slate-500": props.onClick },
                props.className
            )}
            tabIndex={props.onClick ? 0 : undefined}
            onClick={props.onClick}
        >
            <div className="flex">
                <CardHeader className="grow">
                    {props.loading ? (
                        <>
                            <Skeleton className="h-8 rounded-lg" />
                            <Skeleton className="h-5 rounded-lg" />
                            <Skeleton className="h-5 w-40 rounded-lg" />
                        </>
                    ) : (
                        <>
                            {props.title ? (
                                <CardTitle>{props.title}</CardTitle>
                            ) : null}
                            {props.description ? (
                                <p className="mt-3">{props.description}</p>
                            ) : null}
                        </>
                    )}
                </CardHeader>
                {props.loading ? (
                    <Skeleton className="w-[320px] max-w-[32%] aspect-[16/9] m-6 shrink-0 rounded-lg" />
                ) : props.thumbnail ? (
                    <div className="w-[320px] max-w-[32%] aspect-[16/9] m-6 shrink-0">
                        <img
                            src={props.thumbnail}
                            alt="Image"
                            className="rounded-lg object-cover object-center relative w-full h-full"
                        />
                    </div>
                ) : null}
            </div>
            <CardFooter className="flex flex-wrap gap-5 justify-between pb-3">
                {props.loading ? (
                    <Skeleton className="h-5 w-24 rounded-lg" />
                ) : (
                    <>
                        <div className="flex flex-wrap gap-5 text-slate-450 text-sm">
                            {props.siteName ? (
                                <ExternalLink
                                    href={props.url ? props.url : "#"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <div className="h-full flex items-center gap-2">
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
                                    </div>
                                </ExternalLink>
                            ) : null}
                            {props.collection ? (
                                <Link
                                    href={`/app/collection/${props.collection.id}`}
                                >
                                    <div className="h-full flex items-center gap-2">
                                        <Package2 size={16} />
                                        {props.collection.name}
                                    </div>
                                </Link>
                            ) : null}
                            {props.tags ? (
                                <div className="flex flex-wrap gap-3">
                                    {props.tags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={`/app/tag/${tag.id}`}
                                            tabIndex={-1}
                                        >
                                            <Button
                                                className="px-4"
                                                variant="secondary"
                                                size="xs"
                                            >
                                                {tag.name}
                                            </Button>
                                        </Link>
                                    ))}
                                </div>
                            ) : null}
                            {props.footerLeft}
                        </div>
                        <div className="flex gap-3">{props.footerRight}</div>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
