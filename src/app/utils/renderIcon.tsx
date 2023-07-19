import { LucideIcon } from "lucide-react";

const renderIcon = (Icon: LucideIcon, className?: string, size?: number) => (
    <Icon className={className} size={size ?? 18} />
);

export default renderIcon;
