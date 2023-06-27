import { useEffect, useRef, useState } from "react";

import { BiSolidLock } from "react-icons/bi";
import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import { FaTrashAlt } from "react-icons/fa";
import Input from "./components/ui/Input";
import { Triangle } from "react-loader-spinner";
import { delay } from "./utils/delay";
import { formatDate } from "./utils/formatDate";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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

function Profile() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [preferredGenres, setPreferredGenres] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState("");
  const { data, isLoading, error } = useQuery<Playlist[], SpotifyApiError>({
    queryKey: ["fetch-user-playlists"],
    queryFn: async () => {
      await delay();

      const userDataString = localStorage.getItem("user");

      if (!userDataString) {
        return;
      }

      const userDataJSON = JSON.parse(userDataString);
      const userId = userDataJSON._id;

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/${userId}/playlists`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return await response.json();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: data => {
      console.log(data);
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    const userDataString = localStorage.getItem("user");

    if (!userDataString) {
      return;
    }

    const userDataJSON = JSON.parse(userDataString);
    const { username, email, password, preferredGenres, description } = userDataJSON;

    if (!preferredGenres) {
      return;
    }

    usernameRef.current!.value = username;
    emailRef.current!.value = email;
    passwordRef.current!.value = password;
    setPreferredGenres(new Set(preferredGenres));
    setDescription(description);
  }, []);

  const handleUpdateProfile = async () => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !email || !password || !description) {
      toast.error("Compila tutti i campi");
      return;
    }

    // Fonte: https://www.w3resource.com/javascript/form/email-validation.php
    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailRegex.test(email)) {
      toast.error("Email non valida");
      return;
    }

    const userDataString = localStorage.getItem("user");

    if (!userDataString) {
      navigate("/?error=Devi prima effettuare il login");
      return;
    }

    const userDataJSON = JSON.parse(userDataString);
    const userId = userDataJSON._id;

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        preferredGenres: Array.from(preferredGenres),
        description,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    toast.success("Profilo aggiornato correttamente");
  };
  const handleDeleteProfile = async () => {
    const userDataString = localStorage.getItem("user");

    if (!userDataString) {
      navigate("/?error=Devi prima effettuare il login");
      return;
    }

    const userDataJSON = JSON.parse(userDataString);
    const userId = userDataJSON._id;

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    localStorage.removeItem("user");
    navigate("/?success=Profilo eliminato correttamente");
  };

  return (
    <>
      <CenteredContainer
        className="pt-20 flex-col gap-2"
        minHeight="parent"
      >
        <h1 className="text-emerald-600 text-3xl border-b border-b-emerald-600 mb-4">
          Il tuo Profilo
        </h1>
        <Input
          variant="neutral"
          size="sm"
          placeholder="Nuovo username"
          type="text"
          ref={usernameRef}
        />
        <Input
          variant="neutral"
          size="sm"
          placeholder="Nuova email"
          type="email"
          ref={emailRef}
        />
        <Input
          variant="neutral"
          size="sm"
          placeholder="Nuova password"
          type="password"
          ref={passwordRef}
        />

        {preferredGenres.size !== 0 && (
          <>
            <p className="text-sm font-normal">Modifica generi musicali preferiti:</p>

            <ul className="grid grid-cols-2 font-normal text-xs gap-2">
              {Array.from(preferredGenres).map(genre => (
                <li
                  key={`selected-${genre}`}
                  className="text-white bg-gray-700 w-full rounded-xl px-2 py-1 flex items-center justify-between gap-1"
                >
                  <span>{genre}</span>
                  <FaTrashAlt
                    className="text-red-500 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      setPreferredGenres(prevGenres => {
                        const newGenres = new Set(prevGenres);
                        newGenres.delete(genre);

                        return newGenres;
                      });
                    }}
                  />
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="font-normal justify-start flex text-xs">Dicci qualcosa di te*</p>
        <textarea
          className="w-1/2 h-40 rounded-xl bg-gray-700 text-white text-sm p-2 resize-none border-2 border-gray-500"
          placeholder="Descrizione"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            text="Aggiorna profilo"
            size="sm"
            onClick={handleUpdateProfile}
          />
          <Button
            type="button"
            text="Elimina profilo"
            size="sm"
            variant="danger"
            onClick={handleDeleteProfile}
          />
        </div>

        <p className="text-xs font-normal">Campo opzionale*</p>

        <h1 className="text-emerald-600 text-3xl mt-5 border-b border-b-emerald-600 mb-4">
          Le tue Playlist
        </h1>

        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <Triangle
              height="40"
              width="40"
              color="#059669"
              ariaLabel="triangle-loading"
              visible={true}
            />
          </div>
        )}

        {!error &&
          !isLoading &&
          data?.map(playlist => (
            <>
              <div
                className="relative flex flex-col border-2 border-gray-500 p-2 rounded-xl bg-gray-800 w-1/2 cursor-pointer hover:scale-[1.015] transition-transform"
                key={playlist.id}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
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

                <div className="flex gap-2">
                  <p className="text-md text-emerald-600">
                    Numero di tracce:{" "}
                    <span className="text-white">{playlist.tracksCount}</span>
                  </p>
                </div>

                <div className="flex flex-row gap-2 mt-1 font-normal">
                  {playlist.genres.slice(0, 5).map((genre, index) => (
                    <span
                      key={`${genre}-${index}`}
                      className="text-xs text-white bg-gray-700 rounded-md px-2 py-1"
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
                      className="text-sm text-white bg-gray-700 rounded-md px-2 py-1"
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

                <div className="absolute bottom-1 right-1 flex flex-row gap-2 text-xs text-gray-500">
                  Creata il: {formatDate(new Date(playlist.createdAt))}
                </div>
              </div>
            </>
          ))}
      </CenteredContainer>
    </>
  );
}

export default Profile;
