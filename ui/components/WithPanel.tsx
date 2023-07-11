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
                "max-[2050px]:mr-[calc(360px-(100vw-16rem)/2+50%)]":
                    isSidebarExpand && isShowPanel,
                "max-[1800px]:mr-[calc(360px-100vw/2+50%)]":
                    !isSidebarExpand && isShowPanel,
            })}
        >
            {children}
        </div>
    );
}
