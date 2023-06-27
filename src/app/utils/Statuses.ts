export enum StatusEnum {
    Inbox = 0,
    Underway = 1,
    Complete = 2,
    Archive = 3,
}

export const StatusNames = {
    [StatusEnum.Inbox]: "Inbox",
    [StatusEnum.Underway]: "In Progress",
    [StatusEnum.Complete]: "Complete",
    [StatusEnum.Archive]: "Archive",
};
