"use client";

import { FormEvent, useState } from "react";
import styles from "@/ui/styles/forms.module.css";
import { Key, KeyRound, Mail, SquareAsterisk } from "lucide-react";
import Link from "next/link";
// import OtpInput from "../OtpInput";
import OtpInput from "react-otp-input";
import { ResetPasswordPage } from "../page";
import { Button } from "@/ui/components";

type InputError = "white-space" | "invalid-code" | null;

export default function VerifyCodeForm({
    code,
    navigatePage,
    email,
}: {
    code: string;
    navigatePage: (newPage: ResetPasswordPage) => void;
    email: string;
}) {
    console.log(code);
    const [otp, setOtp] = useState("");
    const onChange = (value: string) => setOtp(value);

    const [error, setError] = useState<InputError>(null);

    const submitCode = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (/\s/g.test(otp) || otp.length < 6) {
            setError("white-space");
            return;
        } else if (otp !== code) {
            setError("invalid-code");
            return;
        }
        navigatePage("new-password");
    };

    return (
        <form
            className="flex flex-col justify-center items-center w-[32rem]"
            action=""
            onSubmit={submitCode}
        >
            <SquareAsterisk size={36} strokeWidth={1.75} />
            <h1 className="text-3xl mt-4">Verify Code</h1>
            <span className="m-10 flex flex-col">
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
                    {/* <OtpInput value={otp} valueLength={6} onChange={onChange} /> */}
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

            {/* TODO: RESEND EMAIL WITH NEW CODE */}

            <Link href={"/auth/login"}>
                <Button type="button" variant={"ghost"}>
                    Back to Login
                </Button>
            </Link>
        </form>
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
