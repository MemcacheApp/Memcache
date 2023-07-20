export const includeCaseInsensitive = (
    arr: string[] | undefined,
    s: string,
) => {
    if (!arr) return false;
    for (const item of arr) {
        if (item.toLocaleLowerCase() === s.toLocaleLowerCase()) {
            return true;
        }
    }
    return false;
};

/**
 * Adds a new tag to the tags array if it doesn't already exist.
 * If it does exist, it removes it from the tags array.
 */
export const setTag = (oldTags: string[], newTag: string, index: number) => {
    if (includeCaseInsensitive(oldTags, newTag)) {
        if (index !== -1) {
            // Remove existing tag from oldTags
            const newTags = [...oldTags];
            newTags.splice(index, 1);
            return newTags;
        } else {
            return [...oldTags];
        }
    } else {
        if (index === -1) {
            // Add new tag to end of oldTags
            return [...oldTags, newTag];
        } else {
            // Add new tag to index of oldTags
            const newTags = [...oldTags];
            newTags[index] = newTag;
            return newTags;
        }
    }
};

export const removeTag = (tags: string[], index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    return newTags;
};
