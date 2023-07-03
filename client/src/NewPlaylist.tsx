import { useRef, useState } from "react";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";
import Select from "react-select";
import Toggle from "react-toggle";
import { Triangle } from "react-loader-spinner";
import clsx from "clsx";
import { multiSelectStylesConfig } from "./utils/selectStylesConfig";
import { toast } from "react-hot-toast";
import { truncate } from "./utils/helpers";
import useTracks from "./hooks/useTracks";

type Track = {
  name: string;
  artists: string[];
  releaseDate: string;
  duration: number;
};

function NewPlaylist() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlistGenres, setPlaylistGenres] = useState<Set<string>>(new Set());
  const titleRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState("");
  const tagsRef = useRef<HTMLInputElement>(null);
  const [isPublic, setIsPublic] = useState(false);
  const { fetchedTracks, isLoading, isRefetching, error } = useTracks();

  const handleCreatePlaylist = async () => {
    const userDataString = localStorage.getItem("user");

    if (!userDataString) {
      return;
    }

    if (!titleRef.current || !tagsRef.current) {
      return;
    }

    const userDataJSON = JSON.parse(userDataString);
    const { _id: userId } = userDataJSON;
    const title = titleRef.current.value;
    const tags = tagsRef.current.value;

    if (!title || !description || !tracks.length || !tags) {
      toast.error("Compila tutti i campi");
      return;
    }

    const tagsArray = tags.split(" ");

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/playlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        title,
        description,
        tags: tagsArray,
        tracks,
        isPublic,
        genres: Array.from(playlistGenres),
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Playlist creata con successo");
    titleRef.current.value = "";
    setDescription("");
    tagsRef.current.value = "";
    setIsPublic(false);
  };

  return (
    <CenteredContainer className="flex-col gap-2">
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

      {!error && (
        <h1 className="text-emerald-600 text-lg font-normal md:text-xl lg:text-3xl md:font-bold lg:fot-bold border-b border-b-emerald-600 mb-4">
          Crea una nuova playlist
        </h1>
      )}

      {!error && (
        <>
          {isLoading || isRefetching ? (
            <Triangle
              height="40"
              width="40"
              color="#059669"
              ariaLabel="triangle-loading"
              visible={true}
            />
          ) : (
            <Select
              isMulti
              isSearchable
              options={(fetchedTracks || []).map(t => ({
                value: `${t.name}$$${t.artists
                  .map(a => `${a.name}-${a.id}`)
                  .join(", ")}$$${t.album.release_date}$$${t.duration_ms}`,
                label: truncate(
                  `${t.name} - ${t.artists.map(a => a.name).join(", ")}`,
                  50
                ),
              }))}
              placeholder="Seleziona le canzoni"
              className="outline-none"
              styles={multiSelectStylesConfig}
              onChange={selected => {
                setTracks(() =>
                  selected.map(s => {
                    const tokens = (s as { value: string }).value.split("$$");
                    const name = tokens[0];
                    const artistsData = tokens[1].split(", ");
                    const artistsNames = artistsData.map(a => a.split("-")[0]);
                    const artistsIds = artistsData.map(a => a.split("-")[1]);
                    const releaseDate = tokens[2];
                    const duration = parseInt(tokens[3]);

                    Promise.all(
                      artistsIds.map(async id => {
                        const response = await fetch(
                          `${import.meta.env.VITE_SPOTIFY_BASE_URL}/artists/${id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "access_token"
                              )}`,
                            },
                          }
                        );
                        const data = await response.json();

                        if (!response.ok) {
                          toast.error(data.message);
                          return;
                        }

                        return data.genres;
                      })
                    ).then(data => {
                      setPlaylistGenres(() => {
                        const flattenedData = data.flat();

                        flattenedData.forEach(g => {
                          playlistGenres.add(g);
                        });

                        return playlistGenres;
                      });
                    });

                    return {
                      name,
                      artists: artistsNames,
                      releaseDate,
                      duration,
                    };
                  })
                );
              }}
            />
          )}
          <Input
            size="sm"
            placeholder="Nome playlist"
            type="text"
            ref={titleRef}
          />
          <textarea
            className="outline-none focus:border-emerald-600 font-normal border md:font-bold lg:font-bold -56 h-40 rounded-xl bg-gray-800 text-white text-sm p-2 resize-none md:border-2 lg:border-2 border-gray-500 placeholder:text-gray-500"
            placeholder="Descrizione playlist"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <p className="font-normal justify-start flex text-xs">
            Inserisci uno o più tag descrittivi, separati da spazi
          </p>
          <Input
            size="sm"
            placeholder="Tag playlist"
            type="text"
            ref={tagsRef}
          />
          <div className="flex justify-between w-56 items-center">
            <label
              htmlFor="toggle"
              className="font-normal text-xs"
            >
              Playlist pubblica
            </label>
            <Toggle
              id="toggle"
              disabled={isLoading}
              icons={false}
              onChange={e => {
                setIsPublic(e.target.checked);
              }}
            />
          </div>

          <Button
            type="button"
            text="Crea playlist"
            size="md"
            disabled={isLoading}
            onClick={handleCreatePlaylist}
            className={clsx(
              {
                "cursor-not-allowed": isLoading,
                "bg-emerald-800": isLoading,
              },
              "mt-2"
            )}
          />
        </>
      )}
    </CenteredContainer>
  );
}

export default NewPlaylist;
