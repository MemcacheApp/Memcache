import { useSidebarStore } from "@/src/app/store/sidebar";
import { useTopbarStore } from "@/src/app/store/topbar";
import { MenuIcon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Button } from ".";
import { cn } from "../utils";

interface TopbarProps {
    children?: React.ReactNode;
    startPos?: number;
}

export function Topbar({ children, startPos = 65 }: TopbarProps) {
    const setIsShow = useTopbarStore((state) => state.setIsShow);

    useEffect(() => {
        window.addEventListener("scroll", scrollListener);
        return () => window.removeEventListener("scroll", scrollListener);
    }, []);

    const scrollListener = useCallback(() => {
        if (window.scrollY >= startPos) {
            setIsShow(true);
        } else {
            setIsShow(false);
        }
    }, []);

    return <TopbarInner>{children}</TopbarInner>;
}

function TopbarInner({ children }: TopbarProps) {
    const isShow = useTopbarStore((state) => state.isShow);
    const { isExpand, toggle } = useSidebarStore();

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current?.parentElement) {
            new ResizeObserver(updateDimensions).observe(
                containerRef.current.parentElement,
            );
        }
    }, [containerRef.current]);

    const updateDimensions = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.style.width =
                containerRef.current.parentElement?.offsetWidth + "px";
        }
    }, [containerRef.current]);

    return (
        <div
            ref={containerRef}
            className={cn("fixed h-12 z-10 items-center md:top-3 md:px-8", {
                hidden: !isShow,
            })}
        >
            <div className="flex h-full items-center bg-background/95 backdrop-blur-lg px-5 shadow-sm border md:rounded-md">
                <Button
                    className={cn(
                        "w-10 -ml-3 mr-1 shrink-0 rounded-full p-0 min-[1240px]:hidden",
                        {
                            hidden: isExpand,
                        },
                    )}
                    variant="ghost"
                    onClick={toggle}
                >
                    <MenuIcon size={18} />
                </Button>
                {children}
            </div>
        </div>
    );
}

export function TopbarTitle(props: React.HTMLProps<HTMLHeadingElement>) {
    const { className, ...other } = props;

    return (
        <h1
            className={cn("text-lg font-semibold whitespace-nowrap", className)}
            {...other}
        />
    );
}
