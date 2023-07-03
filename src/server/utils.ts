// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

function ensureError(error: unknown): Error;

function ensureError<E extends Error>(
    error: unknown,
    errorType?: Constructor<E>
): E;

function ensureError<E extends Error>(
    error: unknown,
    errorType?: Constructor<E>
) {
    if (errorType) {
        if (error instanceof errorType) {
            return error;
        } else {
            throw error;
        }
    } else {
        if (error instanceof Error) {
            return error;
        }
    }

    const msg = JSON.stringify(error) || "[Unknown error]";
    return new Error(msg);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createError<K extends keyof any>(msgs: Record<K, string>) {
    const _err = class extends Error {
        kind: K;
        constructor(kind: K, msg?: string, options?: ErrorOptions) {
            super(msg || msgs[kind], options);
            Object.setPrototypeOf(this, _err.prototype);
            this.kind = kind;
        }
    };
    return _err;
}

export { ensureError, createError };
