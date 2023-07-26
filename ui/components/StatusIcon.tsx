import { ItemStatus } from "@prisma/client";
import {
    ArchiveIcon,
    CheckCircle2Icon,
    CircleDotIcon,
    InboxIcon,
    LucideProps,
} from "lucide-react";

interface StatusIconProps extends LucideProps {
    status: ItemStatus;
}

export function StatusIcon(props: StatusIconProps) {
    const { status, ...other } = props;

    switch (status) {
        case "Inbox":
            return <InboxIcon {...other} />;
        case "Underway":
            return <CircleDotIcon {...other} />;
        case "Complete":
            return <CheckCircle2Icon {...other} />;
        case "Archive":
            return <ArchiveIcon {...other} />;
    }
}
