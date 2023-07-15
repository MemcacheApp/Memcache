export const hostname = (url: string) => {
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
        url = `https://${url}`;
    }

    try {
        return new URL(url).hostname;
    } catch (e) {
        return "";
    }
};
