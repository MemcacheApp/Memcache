import {
    Archive,
    CheckCircle2,
    CircleDot,
    Inbox,
    LucideIcon,
} from "lucide-react";

export enum StatusEnum {
    Inbox = 0,
    Underway = 1,
    Complete = 2,
    Archive = 3,
}

export const StatusNames: Record<StatusEnum, string> = {
    [StatusEnum.Inbox]: "Inbox",
    [StatusEnum.Underway]: "Underway",
    [StatusEnum.Complete]: "Complete",
    [StatusEnum.Archive]: "Archive",
};

export const StatusIcons: Record<StatusEnum | string, LucideIcon> = {
    [StatusEnum.Inbox]: Inbox,
    [StatusEnum.Underway]: CircleDot,
    [StatusEnum.Complete]: CheckCircle2,
    [StatusEnum.Archive]: Archive,
};
