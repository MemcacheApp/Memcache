import { useSidebarStore } from "@/src/app/store/sidebar";
import { cn } from "../utils";
import { ReactNode } from "react";
import { useItemListStore } from "@/src/app/store/item-list";

interface WithPanelProps {
    children?: ReactNode;
}

export function WithPanel({ children }: WithPanelProps) {
    const isShowPanel = useItemListStore((state) => state.isShowPanel);
    const isSidebarExpand = useSidebarStore((state) => state.isExpand);

    return (
        <div
            className={cn("transition-[margin-right] max-md:mr-0", {
                // (#main)1200px + (panel)360px * 2 + (sidebar) 256px = 2176px
                "max-[2176px]:mr-[calc(360px-(100vw-16rem)/2+50%)]":
                    isSidebarExpand && isShowPanel,
                // (#main)1200px + (panel)360px * 2 = 1920px
                "max-[1920px]:mr-[calc(360px-100vw/2+50%)]":
                    !isSidebarExpand && isShowPanel,
            })}
        >
            {children}
        </div>
    );
}
