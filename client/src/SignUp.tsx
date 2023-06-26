import "./styles/globals.css";

import { useRef, useState } from "react";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import { FaTrashAlt } from "react-icons/fa";
import Input from "./components/ui/Input";
import Select from "./components/ui/Select";
import { Triangle } from "react-loader-spinner";
import clsx from "clsx";
import { delay } from "./utils/delay";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

type Error = { status: number; message: string };
type Response = { genres: string[] };

function SignUp() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { data, isLoading } = useQuery<Response, Error>({
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

  return (
    <>
      <CenteredContainer className="mb-2 flex-col gap-2">
        <Input
          variant="neutral"
          size="sm"
          placeholder="Username"
          type="text"
          ref={usernameRef}
        />
        <Input
          variant="neutral"
          size="sm"
          placeholder="Email"
          type="email"
          ref={emailRef}
        />
        <Input
          variant="neutral"
          size="sm"
          placeholder="Password"
          type="password"
          ref={passwordRef}
        />
        {isLoading ? (
          <Triangle
            height="40"
            width="40"
            color="#059669"
            ariaLabel="triangle-loading"
            visible={true}
          />
        ) : (
          <>
            <p className="text-xs font-normal">Seleziona i generi musicali preferiti:</p>
            <Select
              size="sm"
              placeholder="Seleziona i generi musicali"
              className="text-xs"
              data={data?.genres || []}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const genre = e.target.value;

                setSelectedGenres(prevGenres => new Set(prevGenres.add(genre)));
              }}
            />
          </>
        )}

        {selectedGenres.size !== 0 && (
          <>
            <p className="text-xs font-normal">Generi musicali selezionati:</p>

            <ul className="grid grid-cols-2 font-normal text-xs gap-2">
              {Array.from(selectedGenres).map(genre => (
                <li
                  key={`selected-${genre}`}
                  className="text-white bg-gray-700 w-full rounded-xl px-2 py-1 flex items-center justify-between gap-1"
                >
                  <span>{genre}</span>
                  <FaTrashAlt
                    className="text-red-500 font-bold cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      setSelectedGenres(prevGenres => {
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

        {/** create a textarea for a description */}
        <p className="font-normal justify-start flex text-xs">Dicci qualcosa di te*</p>
        <textarea
          className="w-1/2 h-40 rounded-xl bg-gray-700 text-white text-sm p-2 resize-none"
          placeholder="Descrizione"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <Button
          type="button"
          text="Registrati"
          onClick={handleSignUp}
          disabled={isLoading}
          className={clsx(
            {
              "cursor-not-allowed": isLoading,
              "bg-emerald-800": isLoading,
            },
            "mt-2"
          )}
        />

        <p className="text-sm mt-3">
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
