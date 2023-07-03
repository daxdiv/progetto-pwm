import { useEffect, useRef, useState } from "react";

import AsyncSelect from "react-select/async";
import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";
import Select from "react-select";
import { Triangle } from "react-loader-spinner";
import clsx from "clsx";
import debounce from "debounce";
import { delay } from "./utils/helpers";
import { multiSelectStylesConfig } from "./utils/selectStylesConfig";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

type Response = { genres: string[] };
type SelectOption = { value: string; label: string };

function SignUp() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [artists, setArtists] = useState<SelectOption[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<Set<string>>(new Set());
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { data: genresData, isLoading: isLoadingGenres } = useQuery<
    Response,
    SpotifyApiError
  >({
    queryKey: ["fetch-genres"],
    queryFn: async () => {
      await delay();

      const response = await fetch(
        `${import.meta.env.VITE_SPOTIFY_BASE_URL}/recommendations/available-genre-seeds`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      return await response.json();
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const handleFetchArtists = async (inputValue: string) => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SPOTIFY_BASE_URL
        }/search?q=${inputValue}&type=artist&market=IT&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return [];
      }

      setArtists(
        data.artists.items.map((artist: { name: string; id: string }) => ({
          value: artist.name,
          label: artist.name,
        }))
      );
    } catch (_error) {
      toast.error("Errore durante la ricerca degli artisti");
    }
  };
  const handleSignUp = async () => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !email || !password) {
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

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        preferredGenres: Array.from(selectedGenres),
        preferredArtists: Array.from(selectedArtists),
        description,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    navigate("/?success=Utente registrato correttamente");
  };
  const loadOptionsCb = (inputValue: string, cb: (options: SelectOption[]) => void) => {
    handleFetchArtists(inputValue);
    cb(artists);
  };

  const debounced = debounce(loadOptionsCb, 500);

  useEffect(() => {
    console.log(selectedArtists);
  }, [selectedArtists]);

  return (
    <>
      <CenteredContainer className="flex-col gap-2">
        <Input
          size="sm"
          placeholder="Username"
          type="text"
          ref={usernameRef}
        />
        <Input
          size="sm"
          placeholder="Email"
          type="email"
          ref={emailRef}
        />
        <Input
          size="sm"
          placeholder="Password"
          type="password"
          ref={passwordRef}
        />
        {isLoadingGenres ? (
          <Triangle
            height="40"
            width="40"
            color="#059669"
            ariaLabel="triangle-loading"
            visible={true}
          />
        ) : (
          <>
            <p className="text-xs font-normal">Seleziona i tuoi artisti preferiti</p>
            <div className="flex gap-3">
              <AsyncSelect
                isMulti
                loadOptions={debounced}
                className="text-xs w-56"
                styles={multiSelectStylesConfig}
                placeholder="Cerca i tuoi artisti preferiti"
                noOptionsMessage={() => "Nessun artista trovato"}
                loadingMessage={() => "Caricamento..."}
                onChange={selected => {
                  setSelectedArtists(
                    new Set(
                      selected?.map(s => (s as { value: string; label: string }).value)
                    )
                  );
                }}
              />
            </div>

            <p className="text-xs font-normal">Seleziona i generi musicali preferiti:*</p>
            <Select
              isMulti
              styles={multiSelectStylesConfig}
              placeholder="Seleziona i generi musicali"
              className="text-xs"
              options={(genresData?.genres || []).map(g => ({
                value: g,
                label: g.charAt(0).toUpperCase() + g.slice(1),
              }))}
              onChange={genres => {
                setSelectedGenres(
                  new Set(genres?.map(g => (g as { value: string; label: string }).value))
                );
              }}
            />
          </>
        )}

        <p className="font-normal justify-start flex text-xs">Qualcosa di te*</p>
        <textarea
          className="w-1/2 h-40 rounded-xl bg-gray-800 font-normal md:font-bold lg:font-bold border md:border-2 lg:border-2 border-gray-500 text-white text-sm p-2 resize-none"
          placeholder="Descrizione"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <Button
          type="button"
          text="Registrati"
          onClick={handleSignUp}
          disabled={isLoadingGenres}
          className={clsx(
            {
              "cursor-not-allowed": isLoadingGenres,
              "bg-emerald-800": isLoadingGenres,
            },
            "mt-2"
          )}
        />

        <p className="text-sm mt-3 font-normal md:font-bold lg:font-bold">
          Hai già un account?{" "}
          <a
            href="/"
            className="text-emerald-600 hover:underline"
          >
            Accedi
          </a>
        </p>
        <p className="text-xs font-normal">Campo opzionale*</p>
      </CenteredContainer>
    </>
  );
}

export default SignUp;
