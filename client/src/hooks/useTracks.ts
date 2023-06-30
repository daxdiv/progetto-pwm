import { delay } from "../utils/helpers";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";

type Artist = {
  id: string;
  name: string;
};
type TrackResponse = {
  name: string;
  artists: Artist[];
  album: {
    release_date: string;
  };
  duration_ms: number;
};

export default function useTracks() {
  const {
    data: fetchedTracks,
    isLoading,
    isRefetching,
    error,
  } = useQuery<TrackResponse[], SpotifyApiError>({
    queryKey: ["fetch-tracks"],
    queryFn: async () => {
      await delay();

      const response = await fetch(
        `${
          import.meta.env.VITE_SPOTIFY_BASE_URL
        }/search?q=track&type=track&market=IT&limit=50&offset=0`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const data = await response.json();

      return data.tracks.items;
    },
    refetchOnWindowFocus: false,
    onError: error => {
      toast.error(error.message);
    },
  });

  return { fetchedTracks, isLoading, isRefetching, error };
}
