"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Button } from "@/ui/components";
import { SquareAsterisk } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import OtpInput from "react-otp-input";

type InputError = "white-space" | "invalid-code" | null;

export default function VerificationCodePage() {
    const { push } = useRouter();
    const searchParams = useSearchParams();

    const [otp, setOtp] = useState("");
    const [error, setError] = useState<InputError>(null);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const email = searchParams.get("email")!;
    if (!email) {
        push("/auth/reset-password");
    }

    const verifyResetCodeQuery = trpc.user.verifyResetCode.useQuery(
        {
            email,
            code: otp,
        },
        { refetchOnWindowFocus: false, enabled: false },
    );

    useEffect(() => {
        if (verifyResetCodeQuery.data) {
            setError(null);
            push(
                `/auth/reset-password/new-password?email=${email}&code=${otp}`,
            );
        } else if (verifyResetCodeQuery.data === false) {
            setError("invalid-code");
        }
    }, [verifyResetCodeQuery.data]);

    const sendResetEmailMutation = trpc.user.sendResetEmail.useMutation();
    const resendEmail = () => {
        sendResetEmailMutation.mutate({ email });
    };

    const submitCode = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (/\s/g.test(otp) || otp.length < 6) {
            setError("white-space");
        } else {
            verifyResetCodeQuery.refetch();
        }
    };

    return (
        <div className="flex justify-center h-screen items-center">
            <form
                className="flex flex-col justify-center items-center w-[32rem]"
                action=""
                onSubmit={submitCode}
            >
                <SquareAsterisk size={36} strokeWidth={1.75} />
                <h1 className="mt-4 text-3xl">Verify Code</h1>
                <span className="flex flex-col m-10">
                    Please enter the login verification code sent to <br></br>
                    <span className="self-center">
                        <strong>{email}</strong>
                    </span>
                </span>
                <div className="flex flex-col w-full px-10">
                    <div className="self-center pb-2">
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderInput={(props) => <input {...props} />}
                            inputStyle={inputStyle}
                            inputType="tel"
                        />
                    </div>
                    {error === "white-space" ? (
                        <span className="text-sm text-red-600/60">
                            {"Please enter a 6-digit code"}
                        </span>
                    ) : error === "invalid-code" ? (
                        <span className="text-sm text-red-600/60">
                            {"Incorrect code"}
                        </span>
                    ) : (
                        ""
                    )}

                    <Button type="submit" className="mt-5 mb-5">
                        Verify
                    </Button>
                </div>
                <span className="mb-4 text-sm">
                    Didn&apos;t receive the email?{" "}
                    <button
                        type="button"
                        onClick={resendEmail}
                        className="text-blue-600/60"
                    >
                        Click to resend
                    </button>
                </span>

                <Link href={"/auth/login"}>
                    <Button type="button" variant={"ghost"}>
                        Back to Login
                    </Button>
                </Link>
            </form>
        </div>
    );
}

const inputStyle = {
    // width: "3rem !important",
    // height: "3rem",
    margin: "0 0.5rem",
    fontSize: "2rem",
    borderRadius: "4px",
    border: "1px solid rgba(0, 0, 0, 0.3)",
};
