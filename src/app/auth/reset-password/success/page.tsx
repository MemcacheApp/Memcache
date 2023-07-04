import { Button } from "@/ui/components";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
    return (
        <div className="flex justify-center h-screen items-center">
            <div className="flex flex-col justify-center items-center w-[32rem]">
                <CheckCircle size={36} strokeWidth={1.75} />
                <h1 className="text-3xl mt-4">Password reset</h1>
                <span className="m-10 flex flex-col">
                    Your password has successfully been reset.
                </span>
                <Link href={"/auth/login"}>
                    <Button type="button" variant={"ghost"}>
                        Back to Login
                    </Button>
                </Link>
            </div>
        </div>
    );
}
