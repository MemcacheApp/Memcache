import {
    Button,
    ButtonProps,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    Separator,
    Tabs,
    TabsContent,
} from "@/ui/components";
import { cn } from "@/ui/utils";
import { ArrowDownToLineIcon, UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";

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
                    <Tabs className="ml-5 grow" value={currTab}>
                        <TabsContent tabIndex={-1} value="profile">
                            <Profile />
                        </TabsContent>
                        <TabsContent tabIndex={-1} value="save">
                            Save
                        </TabsContent>
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

function Profile() {
    const ctx = trpc.useContext();

    const getUserInfoQuery = trpc.user.getUserInfo.useQuery();
    const updateUserProfileMutation = trpc.user.updateProfile.useMutation({
        onSuccess: () => ctx.user.getUserInfo.invalidate(),
    });

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const updateEmail = useRef(false);
    const updateFirstName = useRef(false);
    const updateLastName = useRef(false);

    useEffect(() => {
        if (getUserInfoQuery.data) {
            const data = getUserInfoQuery.data;
            setEmail(data.email);
            setFirstName(data.firstName);
            setLastName(data.lastName);
        }
    }, [getUserInfoQuery.data]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateUserProfileMutation.mutate({
            email: updateEmail.current ? email : undefined,
            firstName: updateFirstName.current ? firstName : undefined,
            lastName: updateLastName ? lastName : undefined,
        });
    };

    return (
        <form action="" className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
                <Label htmlFor="update-email">Email</Label>
                <Input
                    id="update-email"
                    value={email}
                    onChange={(e) => {
                        updateEmail.current = true;
                        setEmail(e.target.value);
                    }}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="update-firstname">First Name</Label>
                <Input
                    id="update-firstname"
                    value={firstName}
                    onChange={(e) => {
                        updateFirstName.current = true;
                        setFirstName(e.target.value);
                    }}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="update-lastname">Last Name</Label>
                <Input
                    id="update-lastname"
                    value={lastName}
                    onChange={(e) => {
                        updateLastName.current = true;
                        setLastName(e.target.value);
                    }}
                />
            </div>
            <Button
                type="submit"
                className="self-end"
                disabled={updateUserProfileMutation.isLoading}
            >
                Save
            </Button>
        </form>
    );
}
