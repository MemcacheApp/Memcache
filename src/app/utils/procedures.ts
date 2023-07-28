import { trpc } from "./trpc";

export const usePerferences = () => {
    const getPerferencesQuery = trpc.user.getPerferences.useQuery();
    return getPerferencesQuery.data;
};
