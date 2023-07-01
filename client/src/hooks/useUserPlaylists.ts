import { delay } from "../utils/helpers";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";

type Track = {
  name: string;
  artists: string[];
  duration: number;
};
type Playlist = {
  id: string;
  title: string;
  genres: string[];
  tags: string[];
  tracks: Track[];
  duration: number;
  isPublic: boolean;
  createdAt: string;
};

export default function useUserPlaylists(userId: string) {
  const {
    data: playlists,
    isLoading,
    isRefetching,
    error,
  } = useQuery<Playlist[], SpotifyApiError>({
    queryKey: ["fetch-user-playlists"],
    queryFn: async () => {
      await delay();

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/${userId}/playlists`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return await response.json();
    },
    refetchOnWindowFocus: false,
    onError: error => {
      toast.error(error.message);
    },
  });

  return { playlists, isLoading, isRefetching, error };
}