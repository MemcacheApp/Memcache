import ellipsisStyles from "@/ui/styles/lds-ellipsis.module.css";
import ringStyles from "@/ui/styles/lds-ring.module.css";
import { cn } from "../utils";

interface LoaderProps {
    className?: string;
    varient: "ellipsis" | "ring";
}

export function Loader(props: LoaderProps) {
    if (props.varient === "ellipsis") {
        return <Ellipsis className={props.className} />;
    } else {
        return <Ring className={props.className} />;
    }
}

interface LoaderImplProps {
    className?: string;
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
            <div></div>
            <div></div>
            <div></div>
            <div></div>
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
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}
