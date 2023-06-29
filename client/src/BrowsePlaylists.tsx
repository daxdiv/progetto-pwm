import { delay, formatDate, formatDuration } from "./utils/helpers";

import { AiFillInfoCircle } from "react-icons/ai";
import CenteredContainer from "./components/ui/CenteredContainer";
import { FaFileImport } from "react-icons/fa";
import Input from "./components/ui/Input";
import Select from "react-select";
import Toggle from "react-toggle";
import { Triangle } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";
import { useState } from "react";

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
type FilterCriteria = "track-name" | "tags" | "artist";

function BrowsePlaylists() {
  const [sortDateAsc, setSortDateAsc] = useState(true);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>("track-name");
  const [searchValue, setSearchValue] = useState("");
  const {
    data: playlists,
    isLoading,
    error,
  } = useQuery<Playlist[], Error>({
    queryKey: "fetch-public-playlists",
    queryFn: async () => {
      const userDataString = localStorage.getItem("user");

      if (!userDataString) {
        toast(<p>Accedi per salvare una playlist</p>, {
          icon: <AiFillInfoCircle className="text-yellow-400 text-xl" />,
        });
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
      toast.error("Devi aver fatto l'accesso per salvare una playlist");
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
        {!error && !isLoading && (
          <h1 className="text-emerald-600 text-3xl border-b border-b-emerald-600 mb-2">
            Sfoglia playlist pubbliche
          </h1>
        )}

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

        {!error && playlists && playlists.length > 0 && (
          <>
            <div className="font-normal text-sm mb-2 flex gap-3">
              <div className="flex justify-center items-center">
                Più recenti
                <Toggle
                  className="ml-1"
                  defaultChecked={sortDateAsc}
                  icons={false}
                  onChange={() => setSortDateAsc(!sortDateAsc)}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-center items-center">
              <label
                htmlFor="filtro"
                className="text-xs font-normal"
              >
                Filtra per
              </label>
              <Select
                styles={{
                  control: provided => ({
                    ...provided,
                    outline: "none",
                    backgroundColor: "#1f2937",
                    borderWidth: "2px",
                    borderColor: "#6b7280",
                    color: "#fff",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#059669",
                    },
                  }),
                  option: provided => ({
                    ...provided,
                    backgroundColor: "#1f2937",
                    color: "#fff",
                    fontSize: "0.75rem",
                    "&:hover": {
                      backgroundColor: "#4B5563",
                      cursor: "pointer",
                    },
                  }),
                  menu: provided => ({
                    ...provided,
                    backgroundColor: "#1f2937",
                    color: "#fff",
                    fontSize: "0.75rem",
                  }),
                  singleValue: provided => ({
                    ...provided,
                    color: "#fff",
                    fontSize: "0.75rem",
                  }),
                }}
                className="w-56"
                placeholder="Ricerca per"
                id="filtro"
                defaultValue={{ value: "track-name", label: "Titolo canzone" }}
                options={[
                  { value: "track-name", label: "Titolo canzone" },
                  { value: "tags", label: "Tag" },
                  { value: "artist", label: "Cantante" },
                ]}
                onChange={e => {
                  if (!e) return;

                  setFilterCriteria(e.value as FilterCriteria);
                }}
              />
              <Input
                type="text"
                size="sm"
                placeholder="Cerca playlist"
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchValue(e.target.value)
                }
              />
            </div>
          </>
        )}

        {!error &&
          playlists &&
          playlists
            .sort((p1, p2) => {
              const date1 = new Date(p1.createdAt);
              const date2 = new Date(p2.createdAt);

              if (sortDateAsc) {
                return date1.getTime() - date2.getTime();
              } else {
                return date2.getTime() - date1.getTime();
              }
            })
            .filter(p => {
              if (!searchValue) return true;

              switch (filterCriteria) {
                case "track-name":
                  return p.tracks.some(t =>
                    t.name.toLowerCase().startsWith(searchValue.toLowerCase())
                  );
                case "tags":
                  return p.tags.some(t =>
                    t.toLowerCase().includes(searchValue.toLowerCase())
                  );
                case "artist":
                  return p.tracks.some(t =>
                    t.artists.some(a =>
                      a.toLowerCase().startsWith(searchValue.toLowerCase())
                    )
                  );
                default:
                  return true;
              }
            })
            .map(p => (
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

                <div className="mt-3">
                  <div>
                    <ul className="font-normal text-[.6rem]">
                      {p.tracks.map((track, index) => (
                        <li
                          key={`${track.name}-${index}`}
                          className="py-1"
                        >
                          {index + 1}. {track.name} --{" "}
                          <span className="text-emerald-600">
                            {formatDuration(track.duration)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  Durata totale:{" "}
                  <span className="text-emerald-600">{formatDuration(p.duration)}</span>
                </div>

                <div className="absolute bottom-1 right-1 flex flex-row gap-2 text-xs text-gray-500">
                  Creata il: {formatDate(new Date(p.createdAt))}
                </div>
              </div>
            ))}
      </CenteredContainer>
    </>
  );
}

export default BrowsePlaylists;
