import styles from "@/ui/styles/loader.module.css";
import classNames from "classnames";

interface LoaderProps {
    className?: string;
}

/**
 * Source: https://loading.io/css/
 */
export function Loader(props: LoaderProps) {
    return (
        <div
            className={classNames(
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
