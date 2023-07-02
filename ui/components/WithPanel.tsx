import { useSidebarStore } from "@/src/app/store/sidebar";
import { cn } from "../utils";
import { ReactNode } from "react";

interface WithPanelProps {
    isShowPanel: boolean;
    children?: ReactNode;
}

export function WithPanel({ isShowPanel, children }: WithPanelProps) {
    const isSidebarExpand = useSidebarStore((state) => state.isExpand);

    return (
        <div
            className={cn("transition-[margin-right] max-md:mr-0", {
                "max-[1800px]:mr-[calc(20rem-(100vw-16rem)/2+50%)]":
                    isSidebarExpand && isShowPanel,
                "max-[1800px]:mr-[calc(20rem-100vw/2+50%)]":
                    !isSidebarExpand && isShowPanel,
            })}
        >
            {children}
        </div>
    );
}
