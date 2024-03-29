"use client";

// Source: https://dominicarrojado.com/posts/how-to-create-your-own-otp-input-in-react-and-typescript-with-tests-part-1/
import styles from "@/ui/styles/forms.module.css";
import { useMemo } from "react";

export type Props = {
    value: string;
    valueLength: number;
    onChange: (value: string) => void;
};

export default function OtpInput({ value, valueLength, onChange }: Props) {
    const valueItems = useMemo(() => {
        const valueArray = value.split("");
        const items: Array<string> = [];

        for (let i = 0; i < valueLength; i++) {
            const char = valueArray[i];
            if (new RegExp(/^\d+$/).test(char)) {
                items.push(char);
            } else {
                items.push("");
            }
        }

        return items;
    }, [value, valueLength]);

    const inputOnChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        idx: number,
    ) => {
        const target = e.target;
        let targetValue = target.value.trim();
        const isTargetValueDigit = new RegExp(/^\d+$/).test(targetValue);

        if (!isTargetValueDigit && targetValue !== "") {
            return;
        }

        targetValue = isTargetValueDigit ? targetValue : " ";

        const targetValueLength = targetValue.length;

        if (targetValueLength === 1) {
            const newValue =
                value.substring(0, idx) +
                targetValue +
                value.substring(idx + 1);

            onChange(newValue);

            if (!isTargetValueDigit) {
                return;
            }

            focusToNextInput(target);
        } else if (targetValueLength === valueLength) {
            onChange(targetValue);

            target.blur();
        }
    };

    const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { key } = e;

        const target = e.target as HTMLInputElement;

        if (key === "ArrowRight" || key === "ArrowDown") {
            e.preventDefault();
            return focusToNextInput(target);
        }

        if (key === "ArrowLeft" || key === "ArrowUp") {
            e.preventDefault();
            return focusToPrevInput(target);
        }

        const targetValue = target.value;

        // keep the selection range position
        // if the same digit was typed
        target.setSelectionRange(0, targetValue.length);

        if (e.key !== "Backspace" || target.value !== "") {
            return;
        }

        focusToPrevInput(target);
    };

    const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const { target } = e;

        target.setSelectionRange(0, target.value.length);
    };

    const focusToNextInput = (target: HTMLElement) => {
        const nextElementSibling =
            target.nextElementSibling as HTMLInputElement | null;

        if (nextElementSibling) {
            nextElementSibling.focus();
        }
    };
    const focusToPrevInput = (target: HTMLElement) => {
        const previousElementSibling =
            target.previousElementSibling as HTMLInputElement | null;

        if (previousElementSibling) {
            previousElementSibling.focus();
        }
    };

    return (
        <div className={styles["otp-group"]}>
            {valueItems.map((digit, idx) => (
                <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d{1}"
                    maxLength={valueLength}
                    className={styles["otp-input"]}
                    value={digit}
                    onChange={(e) => inputOnChange(e, idx)}
                    onKeyDown={inputOnKeyDown}
                    onFocus={inputOnFocus}
                />
            ))}
        </div>
    );
}
