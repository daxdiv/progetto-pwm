import "react-toggle/style.css";

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";
import Select from "react-select";
import Toggle from "react-toggle";
import { Triangle } from "react-loader-spinner";
import clsx from "clsx";
import { delay } from "./utils/delay";
import selectStylesConfig from "./utils/selectStylesConfig";
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
type Track = {
  name: string;
  artists?: string[];
  releaseDate: string;
  duration: number;
};

function EditPlaylist() {
  const [oldTracks, setOldTracks] = useState<Track[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlistGenres, setPlaylistGenres] = useState<Set<string>>(new Set());
  const titleRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState("");
  const tagsRef = useRef<HTMLInputElement>(null);
  const [isPublic, setIsPublic] = useState(false);
  const { data, isLoading, error } = useQuery<TrackResponse[], SpotifyApiError>({
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
    refetchOnMount: false,
    refetchOnReconnect: false,
    onError: error => {
      toast.error(error.message);
    },
  });
  const { id: playlistId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userDataString = localStorage.getItem("user");

    if (!userDataString) {
      return;
    }
    if (!playlistId) {
      return;
    }

    const userDataJSON = JSON.parse(userDataString);

    const fetchPlaylistData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/playlist/${playlistId}/${userDataJSON._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      if (response.status === 403) {
        navigate("/profile");
        return;
      }

      const { title, description, tags, isPublic, tracks } = data;

      if (!titleRef.current || !tagsRef.current) {
        return;
      }

      titleRef.current.value = title;
      setDescription(description);
      tagsRef.current.value = tags.join(", ");
      setIsPublic(isPublic);
      setOldTracks(
        tracks.map((t: Track) => ({
          name: t.name,
        }))
      );
    };

    fetchPlaylistData();
  }, [navigate, playlistId]);

  const handleUpdatePlaylist = async () => {
    const userDataString = localStorage.getItem("user");

    if (!userDataString) {
      return;
    }

    const userDataJSON = JSON.parse(userDataString);
    const title = titleRef.current?.value;
    const tags = tagsRef.current?.value.split(",").map(t => t.trim());

    if (!title || !tags || (!tracks && !oldTracks)) {
      toast.error("Compila tutti i campi");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/playlist/${playlistId}/${userDataJSON._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          title,
          description,
          tags,
          isPublic,
          tracks: [...oldTracks, ...tracks],
        }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    navigate("/profile");
  };
  const handleDeletePlaylist = async () => {
    if (!playlistId) {
      toast.error("ID della playlist non trovato");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/playlist/${playlistId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    navigate("/profile");
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

      {oldTracks.length > 0 && (
        <div className="flex items-start gap-2">
          <p className="font-normal text-xs">Canzoni già presenti in playlist:</p>
          <p className="font-normal text-xs">{oldTracks.length}</p>
        </div>
      )}

      {oldTracks.map((t, i) => (
        <div
          key={`${t.name}-${i}`}
          className="flex items-center gap-2"
        >
          <p className="font-normal text-xs">{t.name}</p>
          <p
            className="text-red-500 text-xs underline cursor-pointer"
            onClick={() => {
              setOldTracks(tracks => tracks.filter((_, index) => index !== i));
            }}
          >
            Elimina
          </p>
        </div>
      ))}
      {!error && (
        <>
          {isLoading ? (
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
              options={(data || [])
                .filter(t => {
                  const isInPlaylist = oldTracks.some(
                    ot =>
                      ot.name === t.name &&
                      // check if artists are the same
                      (ot.artists?.every(a => t.artists.some(ta => ta.name === a)) ??
                        true)
                  );

                  return !isInPlaylist;
                })
                .map(t => ({
                  value: `${t.name}$$${t.artists
                    .map(a => `${a.name}-${a.id}`)
                    .join(", ")}$$${t.album.release_date}$$${t.duration_ms}`,
                  label: `${t.name} - ${t.artists.map(a => a.name).join(", ")}`,
                }))}
              placeholder="Seleziona nuove canzoni"
              className="outline-none"
              styles={selectStylesConfig}
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
            variant="neutral"
            size="sm"
            placeholder="Nome playlist"
            type="text"
            ref={titleRef}
          />
          <textarea
            className="outline-none focus:border-emerald-600 w-56 h-40 rounded-xl bg-gray-800 text-white text-sm p-2 resize-none border-2 border-gray-500 placeholder:text-gray-500"
            placeholder="Descrizione playlist"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <p className="font-normal justify-start flex text-xs">
            Inserisci uno o più tag descrittivi, separati da virgola
          </p>
          <Input
            variant="neutral"
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
              checked={isPublic}
              icons={false}
              onChange={e => {
                setIsPublic(e.target.checked);
              }}
            />
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              text="Aggiorna playlist"
              size="sm"
              onClick={handleUpdatePlaylist}
              disabled={isLoading}
              className={clsx({
                "cursor-not-allowed": isLoading,
                "bg-emerald-800": isLoading,
              })}
            />
            <Button
              type="button"
              text="Elimina playlist"
              size="sm"
              variant="danger"
              onClick={handleDeletePlaylist}
              disabled={isLoading}
              className={clsx({
                "cursor-not-allowed": isLoading,
                "bg-red-800": isLoading,
              })}
            />
          </div>
        </>
      )}
    </CenteredContainer>
  );
}

export default EditPlaylist;
