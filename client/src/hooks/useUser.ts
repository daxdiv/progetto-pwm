import { useQuery, type UseQueryOptions } from "react-query";

type UserData = {
  id: string;
  username: string;
  email: string;
  description: string;
  preferredGenres?: string[];
  savedPlaylists?: string[];
};

export default function useUser(
  userId: string,
  options?: UseQueryOptions<unknown, Error, UserData>
) {
  const { isLoading, isRefetching } = useQuery({
    queryKey: ["fetch-user-data"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`);

      return (await response.json()) as UserData;
    },
    ...options,
  });

  return {
    isLoading,
    isRefetching,
  };
}
