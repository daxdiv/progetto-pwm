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

/**
 * Hook che restituisce le tracce ottenute da Spotify, per semplificarne la gestione ne vengono restituite solo 50
 * e solo dal mercato italiano
 */
export default function useTracks(inputValue: string) {
  const {
    data: fetchedTracks,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery<TrackResponse[], SpotifyApiError>({
    queryKey: ["fetch-tracks", inputValue],
    queryFn: async () => {
      await delay();

      if (!inputValue) {
        return [];
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_SPOTIFY_BASE_URL
        }/search?q=${inputValue}&type=track&market=IT&limit=50&offset=0`,
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

  return { fetchedTracks, isLoading, isRefetching, error, refetch };
}
