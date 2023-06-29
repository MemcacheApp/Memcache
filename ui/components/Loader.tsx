import styles from "@/ui/styles/loader.module.css";
import { cn } from "../utils";

interface LoaderProps {
    className?: string;
}

/**
 * Source: https://loading.io/css/
 */
export function Loader(props: LoaderProps) {
    return (
        <div
            className={cn(
                styles.ldsEllipsis,
                "[&>div]:bg-foreground",
                props.className
            )}
        >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}
