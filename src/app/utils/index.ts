export function includeCaseInsensitive(arr: string[] | undefined, s: string) {
    if (!arr) return false;
    for (const item of arr) {
        if (item.toLocaleLowerCase() === s.toLocaleLowerCase()) {
            return true;
        }
    }
    return false;
}
