import { trpc } from "./trpc";

export const usePreferences = () => {
    const getPreferencesQuery = trpc.user.getPerferences.useQuery();
    return getPreferencesQuery.data;
};
