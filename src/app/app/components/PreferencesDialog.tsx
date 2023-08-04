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
    Switch,
    Tabs,
    TabsContent,
} from "@/ui/components";
import { cn } from "@/ui/utils";
import { ArrowDownToLineIcon, UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePreferences } from "../../utils/procedures";
import { trpc } from "../../utils/trpc";

interface PreferencesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PreferencesDialog({
    open,
    onOpenChange,
}: PreferencesDialogProps) {
    const [currTab, setCurrTab] = useState("profile");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex flex-col min-h-[30rem]">
                <DialogHeader>
                    <DialogTitle>Preferences</DialogTitle>
                </DialogHeader>
                <div className="flex grow">
                    <PreferencesNav currTab={currTab} setCurrTab={setCurrTab} />
                    <Separator className="h-auto" orientation="vertical" />
                    <Tabs className="ml-5 grow" value={currTab}>
                        <TabsContent tabIndex={-1} value="profile">
                            <Profile />
                        </TabsContent>
                        <TabsContent tabIndex={-1} value="save">
                            <Save />
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface PreferencesNavProps {
    currTab: string;
    setCurrTab: (currTab: string) => void;
}

function PreferencesNav({ currTab, setCurrTab }: PreferencesNavProps) {
    return (
        <div className="flex flex-col min-w-[10rem] gap-1 mr-3">
            <PreferencesNavItem
                currTab={currTab}
                setCurrTab={setCurrTab}
                value="profile"
            >
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
            </PreferencesNavItem>
            <PreferencesNavItem
                currTab={currTab}
                setCurrTab={setCurrTab}
                value="save"
            >
                <ArrowDownToLineIcon className="mr-2 h-4 w-4" />
                Save
            </PreferencesNavItem>
        </div>
    );
}

interface PreferencesNavItemProsp extends ButtonProps {
    currTab: string;
    setCurrTab: (currTab: string) => void;
    value: string;
}

function PreferencesNavItem(props: PreferencesNavItemProsp) {
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
    const [isPublic, setIsPublic] = useState(true);

    const updateEmail = useRef(false);
    const updateFirstName = useRef(false);
    const updateLastName = useRef(false);
    const updatePublicProfile = useRef(false);

    useEffect(() => {
        if (getUserInfoQuery.data) {
            const data = getUserInfoQuery.data;
            setEmail(data.email);
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setIsPublic(data.publicProfile);
        }
    }, [getUserInfoQuery.data]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateUserProfileMutation.mutate({
            email: updateEmail.current ? email : undefined,
            firstName: updateFirstName.current ? firstName : undefined,
            lastName: updateLastName.current ? lastName : undefined,
            publicProfile: updatePublicProfile.current ? isPublic : undefined,
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
            <div className="flex flex-col gap-2">
                <Label htmlFor="update-public-profile">Public Profile</Label>
                <Switch
                    id="update-public-profile"
                    checked={isPublic}
                    onCheckedChange={(checked) => {
                        updatePublicProfile.current = true;
                        setIsPublic(checked);
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

function Save() {
    const ctx = trpc.useContext();

    const updatePreferenceMutation = trpc.user.updatePreferences.useMutation({
        onSuccess: () => ctx.user.getPreferences.invalidate(),
    });
    const preferences = usePreferences();

    const [publicNewItem, setPublicNewItem] = useState(true);

    const updatePublicNewItem = useRef(false);

    useEffect(() => {
        if (preferences) {
            setPublicNewItem(preferences.publicNewItem);
        }
    }, [preferences]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updatePreferenceMutation.mutate({
            publicNewItem: updatePublicNewItem.current
                ? publicNewItem
                : undefined,
        });
    };

    return (
        <form action="" className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
                <Label htmlFor="update-public-profile">
                    Default Item Visibility
                </Label>
                <div className="flex justify-between gap-5">
                    <p className="text-sm text-foreground/60">
                        {publicNewItem
                            ? "Public: New saves will show on your profile by default"
                            : "Private: New saves will not show on your profile by default"}
                    </p>
                    <Switch
                        id="update-public-new-item"
                        checked={publicNewItem}
                        onCheckedChange={(checked) => {
                            updatePublicNewItem.current = true;
                            setPublicNewItem(checked);
                        }}
                    />
                </div>
            </div>
            <Button
                type="submit"
                className="self-end"
                disabled={updatePreferenceMutation.isLoading}
            >
                Save
            </Button>
        </form>
    );
}
