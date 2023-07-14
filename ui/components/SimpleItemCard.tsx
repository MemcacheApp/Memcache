import { Globe } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle, Skeleton } from ".";
import ExternalLink from "./ExternalLink";
import { cn } from "../utils";

interface SimpleItemCardProps {
    title?: string;
    url?: string;
    className?: string;
    description?: string;
    thumbnail?: string | null;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    loading?: boolean;
    siteName?: string;
    favicon?: string;
    footerLeft?: React.ReactNode;
    footerRight?: React.ReactNode;
}

export function SimpleItemCard(props: SimpleItemCardProps) {
    return (
        <Card
            className={cn(
                "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
                                        <Globe size={16} />
                                        {props.siteName}
                                    </div>
                                </ExternalLink>
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
