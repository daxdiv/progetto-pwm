import { delay } from "../utils/helpers";
import { toast } from "react-hot-toast";
import useAuth from "./useAuth";
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
  tracksCount: number;
  duration: number;
  isPublic: boolean;
  createdAt: string;
};

/**
 * Hook che restituisce le playlist pubbliche, create da altri utenti
 */
export default function usePublicPlaylists() {
  const auth = useAuth();
  const {
    data: playlists,
    isLoading,
    isRefetching,
    error,
  } = useQuery<Playlist[], Error>({
    queryKey: "fetch-public-playlists",
    queryFn: async () => {
      await delay();

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/playlist/${auth?._id || ""}`
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      return data;
    },
    refetchOnWindowFocus: false,
  });

  return { playlists, isLoading, isRefetching, error };
}
