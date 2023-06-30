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
  tracksCount: number;
  duration: number;
  isPublic: boolean;
  createdAt: string;
};

export default function usePublicPlaylists() {
  const {
    data: playlists,
    isLoading,
    isRefetching,
    error,
  } = useQuery<Playlist[], Error>({
    queryKey: "fetch-public-playlists",
    queryFn: async () => {
      const userDataString = localStorage.getItem("user");

      if (!userDataString) {
        toast.error("Accedi per salvare una playlist");
        return;
      }

      const userDataJSON = JSON.parse(userDataString);
      const userId = userDataJSON._id;

      await delay();

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/playlist/${userId}`
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
