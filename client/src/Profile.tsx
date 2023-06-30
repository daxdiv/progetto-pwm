import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import { FaTrashAlt } from "react-icons/fa";
import Input from "./components/ui/Input";
import PlaylistCard from "./components/PlaylistCard";
import { Triangle } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import useAuth from "./hooks/useAuth";
import useUserPlaylists from "./hooks/useUserPlaylists";

function Profile() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [preferredGenres, setPreferredGenres] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState("");
  const [searchParams] = useSearchParams();
  const auth = useAuth();
  const { playlists, isLoading, isRefetching, error } = useUserPlaylists(auth?._id || "");

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success(searchParams.get("success"));
      searchParams.delete("success");
    }
    if (searchParams.get("error")) {
      toast.error(searchParams.get("error"));
      searchParams.delete("error");
    }
  }, [searchParams]);

  // TODO: gli input devono essere compilati con i dati dell'utente

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

    if (!auth) {
      navigate("/?error=Devi prima effettuare il login");
      return;
    }

    const { _id: userId } = auth;

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
    if (!auth) {
      navigate("/?error=Devi prima effettuare il login");
      return;
    }

    const { _id: userId } = auth;

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
      <CenteredContainer className="pt-20 flex-col gap-2">
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
            <p className="text-sm font-normal">Modifica generi musicali preferiti:*</p>

            <ul className="grid grid-cols-2 font-normal text-xs gap-2">
              {Array.from(preferredGenres).map(genre => (
                <li
                  key={`selected-${genre}`}
                  className="text-white bg-gray-800 w-full rounded-xl px-2 py-1 flex items-center justify-between gap-1"
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

        <p className="font-normal justify-start flex text-xs">Qualcosa di te*</p>
        <textarea
          className="w-1/2 h-40 rounded-xl bg-gray-800 text-white text-sm p-2 resize-none border-2 border-gray-500"
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

        {(isLoading || isRefetching) && (
          <div className="flex justify-center items-center">
            <Triangle
              height="40"
              width="40"
              color="#059669"
              ariaLabel="triangle-loading"
              visible={true}
            />
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center">
            <p className="text-red-500 text-lg">{error.message}</p>
          </div>
        )}

        {!isLoading && !isRefetching && playlists && playlists.length === 0 && (
          <div className="flex justify-center items-center">
            <p className="text-gray-500 text-md font-normal">
              Non hai ancora creato nessuna playlist
            </p>
          </div>
        )}

        {!error &&
          !isLoading &&
          !isRefetching &&
          playlists?.map(p => (
            <PlaylistCard
              playlist={p}
              owned
            />
          ))}
      </CenteredContainer>
    </>
  );
}

export default Profile;
