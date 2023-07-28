import {
    Button,
    ButtonProps,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Separator,
    Tabs,
    TabsContent,
} from "@/ui/components";
import { cn } from "@/ui/utils";
import { ArrowDownToLineIcon, UserIcon } from "lucide-react";
import { useState } from "react";

interface PerferencesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PerferencesDialog({
    open,
    onOpenChange,
}: PerferencesDialogProps) {
    const [currTab, setCurrTab] = useState("profile");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Perferences</DialogTitle>
                </DialogHeader>
                <div className="flex">
                    <PerferencesNav currTab={currTab} setCurrTab={setCurrTab} />
                    <Separator orientation="vertical" />
                    <Tabs className="ml-5" value={currTab}>
                        <TabsContent value="profile">Profile</TabsContent>
                        <TabsContent value="save">Save</TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface PerferencesNavProps {
    currTab: string;
    setCurrTab: (currTab: string) => void;
}

function PerferencesNav({ currTab, setCurrTab }: PerferencesNavProps) {
    return (
        <div className="flex flex-col min-w-[10rem] gap-1 mr-3">
            <PerferencesNavItem
                currTab={currTab}
                setCurrTab={setCurrTab}
                value="profile"
            >
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
            </PerferencesNavItem>
            <PerferencesNavItem
                currTab={currTab}
                setCurrTab={setCurrTab}
                value="save"
            >
                <ArrowDownToLineIcon className="mr-2 h-4 w-4" />
                Save
            </PerferencesNavItem>
        </div>
    );
}

interface PerferencesNavItemProsp extends ButtonProps {
    currTab: string;
    setCurrTab: (currTab: string) => void;
    value: string;
}

function PerferencesNavItem(props: PerferencesNavItemProsp) {
    const { className, children, value, currTab, setCurrTab, ...other } = props;

    return (
        <Button
            variant="ghost"
            className={cn(
                "justify-start",
                { "bg-muted": currTab === value },
                className,
            )}
            onClick={() => setCurrTab(value)}
            {...other}
        >
            {children}
        </Button>
    );
}
