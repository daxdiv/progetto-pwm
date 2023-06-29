import CenteredContainer from "./components/ui/CenteredContainer";
import { FaFileImport } from "react-icons/fa";
import { Triangle } from "react-loader-spinner";
import { delay } from "./utils/delay";
import { formatDate } from "./utils/formatDate";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";

type Playlist = {
  id: string;
  title: string;
  genres: string[];
  tags: string[];
  tracksCount: number;
  duration: number;
  isPublic: boolean;
  createdAt: string;
};

function BrowsePlaylists() {
  const {
    data: playlists,
    isLoading,
    error,
  } = useQuery<Playlist[], Error>({
    queryKey: "fetch-public-playlists",
    queryFn: async () => {
      const userDataString = localStorage.getItem("user");

      if (!userDataString) {
        toast.error("Utente non trovato");
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
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const handleSavePlaylist = async (playlistId: string) => {
    const userDataString = localStorage.getItem("user");

    if (!userDataString) {
      toast.error("Utente non trovato");
      return;
    }

    const userDataJSON = JSON.parse(userDataString);
    const userId = userDataJSON._id;

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/user/save-playlist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          playlistId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);
  };

  if (error) {
    toast.error(error.message);
  }

  return (
    <>
      <CenteredContainer className="flex-col gap-2">
        {isLoading && (
          <Triangle
            height="80"
            width="80"
            color="#059669"
            ariaLabel="triangle-loading"
            visible={true}
          />
        )}

        {error && (
          <>
            <p className="text-red-500">{error.message}</p>
            <a
              href="/"
              className="text-emerald-600 hover:underline"
            >
              Torna alla home
            </a>
          </>
        )}
        {!isLoading && (!playlists || !playlists.length) && (
          <>
            <p className="text-gray-500 text-xl">Nessuna playlist trovata</p>
            <a
              href="/"
              className="text-emerald-600 hover:underline text-sm"
            >
              Torna alla home
            </a>
          </>
        )}

        {!error &&
          playlists &&
          playlists.map(p => (
            <>
              <div
                className="relative flex flex-col border-2 border-gray-500 p-2 rounded-xl bg-gray-800 w-1/2"
                key={p.id}
              >
                <div className="flex gap-2">
                  <p className="text-md text-emerald-600 flex justify-center items-center">
                    Titolo: <span className="text-white">{p.title}</span>
                  </p>
                </div>

                <div className="absolute top-2 right-2 flex flex-row gap-2">
                  <FaFileImport
                    className="text-emerald-600 cursor-pointer active:text-emerald-500 hover:text-emerald-500"
                    alt="Salva playlist"
                    onClick={() => handleSavePlaylist(p.id)}
                  />
                </div>

                <div className="flex gap-2">
                  <p className="text-md text-emerald-600">
                    Numero di tracce: <span className="text-white">{p.tracksCount}</span>
                  </p>
                </div>
                <div className="flex flex-row gap-2 mt-1 font-normal">
                  {p.genres.slice(0, 5).map((genre, index) => (
                    <span
                      key={`${genre}-${index}`}
                      className="text-xs text-white bg-gray-700 rounded-md px-2 py-1"
                    >
                      {genre}
                    </span>
                  ))}

                  {p.genres.length - 5 >= 1 && (
                    <span className="flex justify-center items-center text-xs text-gray-500">
                      +{p.genres.length - 5} altri
                    </span>
                  )}
                </div>
                <div className="flex flex-row gap-2 mt-2 font-normal">
                  {p.tags.slice(0, 5).map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="text-sm text-white bg-gray-700 rounded-md px-2 py-1"
                    >
                      <span className="text-emerald-600">#</span>
                      {tag}
                    </span>
                  ))}

                  {p.tags.length - 5 >= 1 && (
                    <span className="flex justify-center items-center text-xs text-gray-500">
                      +{p.tags.length - 5} altri
                    </span>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 flex flex-row gap-2 text-xs text-gray-500">
                  Creata il: {formatDate(new Date(p.createdAt))}
                </div>
              </div>
            </>
          ))}
      </CenteredContainer>
    </>
  );
}

export default BrowsePlaylists;
