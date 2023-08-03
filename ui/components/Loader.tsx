import ellipsisStyles from "@/ui/styles/lds-ellipsis.module.css";
import ringStyles from "@/ui/styles/lds-ring.module.css";
import { cn } from "../utils";

interface LoaderProps {
    className?: string;
    varient: "ellipsis" | "ring";
    colorWhite?: boolean;
}

export function Loader(props: LoaderProps) {
    if (props.varient === "ellipsis") {
        return (
            <Ellipsis
                className={props.className}
                colorWhite={props.colorWhite}
            />
        );
    } else {
        return (
            <Ring className={props.className} colorWhite={props.colorWhite} />
        );
    }
}

interface LoaderImplProps {
    className?: string;
    colorWhite?: boolean;
}

/**
 * Source: https://loading.io/css/
 */
function Ellipsis(props: LoaderImplProps) {
    return (
        <div
            className={cn(
                ellipsisStyles["lds-ellipsis"],
                "inline-block relative w-20 h-20",
                props.className,
            )}
        >
            <div
                className={cn(
                    props.colorWhite &&
                        "!border-[white_transparent_transparent_transparent]",
                )}
            ></div>
            <div
                className={cn(
                    props.colorWhite &&
                        "!border-[white_transparent_transparent_transparent]",
                )}
            ></div>
            <div
                className={cn(
                    props.colorWhite &&
                        "!border-[white_transparent_transparent_transparent]",
                )}
            ></div>
            <div
                className={cn(
                    props.colorWhite &&
                        "!border-[white_transparent_transparent_transparent]",
                )}
            ></div>
        </div>
    );
}

/**
 * Source: https://loading.io/css/
 */
function Ring(props: LoaderImplProps) {
    return (
        <div
            className={cn(
                ringStyles["lds-ring"],
                "inline-block relative w-10 h-10",
                props.className,
            )}
        >
            <div
                className={cn(
                    props.colorWhite &&
                        "!border-[white_transparent_transparent_transparent]",
                )}
            ></div>
            <div
                className={cn(
                    props.colorWhite &&
                        "!border-[white_transparent_transparent_transparent]",
                )}
            ></div>
            <div
                className={cn(
                    props.colorWhite &&
                        "!border-[white_transparent_transparent_transparent]",
                )}
            ></div>
            <div
                className={cn(
                    props.colorWhite &&
                        "!border-[white_transparent_transparent_transparent]",
                )}
            ></div>
        </div>
    );
}
