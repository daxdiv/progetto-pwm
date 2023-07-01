import { useQuery, type UseQueryOptions } from "react-query";
import { useNavigate } from "react-router-dom";

type UserData = {
  id: string;
  username: string;
  email: string;
  description: string;
  preferredGenres?: string[];
  preferredArtists?: string[];
  savedPlaylists?: string[];
};

export default function useUser(
  userId: string,
  options?: UseQueryOptions<UserData, Error, UserData>
) {
  const navigate = useNavigate();
  const { isLoading, isRefetching } = useQuery({
    queryKey: ["fetch-user-data"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`);

      if (response.status === 404) navigate("/error?=Nessun utente trovato");

      return (await response.json()) as UserData;
    },
    ...options,
  });

  return {
    isLoading,
    isRefetching,
  };
}
