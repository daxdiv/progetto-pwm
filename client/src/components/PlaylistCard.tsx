import { formatDate, formatDuration } from "../utils/helpers";

import { BiSolidLock } from "react-icons/bi";
import { FaFileImport } from "react-icons/fa";
import clsx from "clsx";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
type Props = {
  playlist: Playlist;
  owned?: boolean;
  saveable?: boolean;
  extended?: boolean;
};

const PlaylistCard: React.FC<Props> = ({
  playlist,
  owned = false,
  saveable = false,
  extended = false,
}) => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSavePlaylist = async (playlistId: string) => {
    if (!auth) {
      toast.error("Devi aver fatto l'accesso per salvare una playlist");
      return;
    }

    const { _id: userId } = auth;

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

  return (
    <div
      className={clsx(
        {
          "cursor-pointer": owned,
          "hover:scale-[1.015]": owned,
          "transition-transform": owned,
        },
        `relative flex flex-col border-2 border-gray-500 p-2 rounded-xl bg-gray-800 font-normal md:font-bold lg:font-bold text-xs md:text-sm lg:text-sm w-auto md:w-60 lg:w-60`
      )}
      key={playlist.id}
      onClick={() => {
        if (!owned) return;

        navigate(`/playlist/${playlist.id}`);
      }}
    >
      {!playlist.isPublic && (
        <div className="absolute top-1 right-1 flex flex-row gap-2">
          <BiSolidLock
            className="text-emerald-600"
            alt="Playlist privata"
          />
        </div>
      )}
      <div className="flex gap-2">
        <p className="text-md text-emerald-600 flex justify-center items-center">
          Titolo: <span className="text-white">{playlist.title}</span>
        </p>
      </div>

      {saveable && (
        <div className="absolute top-2 right-2 flex flex-row gap-2">
          <FaFileImport
            className="text-emerald-600 cursor-pointer active:text-emerald-500 hover:text-emerald-500"
            alt="Salva playlist"
            onClick={() => handleSavePlaylist(playlist.id)}
          />
        </div>
      )}

      <div className="flex gap-2">
        <p className="text-md text-emerald-600">
          Tracce: <span className="text-white">{playlist.tracks.length}</span>
        </p>
      </div>

      <div className="flex flex-row gap-2 mt-1 font-normal">
        {playlist.genres.slice(0, 5).map((genre, index) => (
          <span
            key={`${genre}-${index}`}
            className="truncate text-xs text-white bg-gray-700 rounded-md px-2 py-1"
          >
            {genre}
          </span>
        ))}

        {playlist.genres.length - 5 >= 1 && (
          <span className="flex justify-center items-center text-xs text-gray-500">
            +{playlist.genres.length - 5} altri
          </span>
        )}
      </div>

      <div className="flex flex-row gap-2 mt-2 font-normal">
        {playlist.tags.slice(0, 5).map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="truncate text-sm text-white bg-gray-700 rounded-md px-2 py-1"
          >
            <span className="text-emerald-600">#</span>
            {tag}
          </span>
        ))}

        {playlist.tags.length - 5 >= 1 && (
          <span className="flex justify-center items-center text-xs text-gray-500">
            +{playlist.tags.length - 5} altri
          </span>
        )}
      </div>

      {extended && (
        <>
          <div className="mt-3">
            <div>
              <ul className="font-normal text-[.6rem]">
                {playlist.tracks.map((track, index) => (
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
            <span className="text-emerald-600">{formatDuration(playlist.duration)}</span>
          </div>
        </>
      )}

      <div className="absolute font-normal md:font-bold lg:font-bold bottom-1 right-1 flex flex-row gap-2 text-xs text-gray-500">
        {formatDate(new Date(playlist.createdAt))}
      </div>
    </div>
  );
};

export default PlaylistCard;
