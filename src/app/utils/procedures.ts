import { trpc } from "./trpc";

export const usePreferences = () => {
    const getPreferencesQuery = trpc.user.getPreferences.useQuery();
    return getPreferencesQuery.data;
};
