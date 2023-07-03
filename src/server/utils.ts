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

export { ensureError };
