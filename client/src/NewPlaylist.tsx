import "react-toggle/style.css";

import Select, { StylesConfig } from "react-select";
import { useRef, useState } from "react";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";
import Toggle from "react-toggle";
import { Triangle } from "react-loader-spinner";
import clsx from "clsx";
import { delay } from "./utils/delay";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";

type Artist = {
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
  artists: string[];
  releaseDate: string;
  duration: number;
};
type Error = { status: number; message: string };

const selectStyles: StylesConfig = {
  control: provided => ({
    ...provided,
    borderWidth: "2px",
    backgroundColor: "#374151",
    // borderColor: "#6b7280",
    borderColor: "#6b7280",
    outline: "none",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 400,
    minHeight: "1.5rem",
    cursor: "pointer",
  }),
  option: provided => ({
    ...provided,
    backgroundColor: "#374151",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 400,
    "&:hover": {
      backgroundColor: "#4B5563",
      cursor: "pointer",
    },
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: "#059669",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 400,
  }),
  singleValue: provided => ({
    ...provided,
    backgroundColor: "#6b7280",
    fontSize: "0.75rem",
    fontWeight: 400,
  }),
  placeholder: provided => ({
    ...provided,
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 400,
  }),
  multiValue: provided => ({
    ...provided,
    backgroundColor: "#6b7280",
    color: "red",
    fontSize: "0.75rem",
    fontWeight: 400,
  }),
};

function NewPlaylist() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState("");
  const tagsRef = useRef<HTMLInputElement>(null);
  const [isPublic, setIsPublic] = useState(false);
  const { data, isLoading, error } = useQuery<TrackResponse[], Error>({
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
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onError: error => {
      toast.error(error.message);
    },
  });

  const handleCreatePlaylist = async () => {
    const userDataString = localStorage.getItem("user");

    if (!userDataString) {
      return;
    }

    const userDataJSON = JSON.parse(userDataString);
    const { _id: userId } = userDataJSON;
    const title = titleRef.current?.value;
    const tags = tagsRef.current?.value;

    if (!title || !description || !tracks || !tags) {
      toast.error("Compila tutti i campi");
      return;
    }

    const tagsArray = tags.replace(" ", "").split(",");

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
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Playlist creata con successo");
  };

  return (
    <CenteredContainer className="mb-2 flex-col gap-2">
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
              options={(data || []).map(t => ({
                value: `${t.name}$$${t.artists.map(a => a.name).join(", ")}$$${
                  t.album.release_date
                }$$${t.duration_ms}`,
                label: `${t.name} - ${t.artists.map(a => a.name).join(", ")}`,
              }))}
              placeholder="Seleziona le canzoni"
              className="outline-none"
              styles={selectStyles}
              onChange={selected => {
                setTracks(() =>
                  selected.map(s => {
                    const tokens = (s as { value: string }).value.split("$$");
                    const name = tokens[0];
                    const artists = tokens[1].split(", ");
                    const releaseDate = tokens[2];
                    const duration = parseInt(tokens[3]);

                    return { name, artists, releaseDate, duration } as Track;
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
            className="outline-none focus:border-emerald-600 w-56 h-40 rounded-xl bg-gray-700 text-white text-sm p-2 resize-none border-2 border-gray-500 placeholder:text-gray-500"
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