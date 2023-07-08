import { useRef, useState } from "react";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";
import SelectArtists from "./components/SelectArtists";
import SelectGenres from "./components/SelectGenres";
import clsx from "clsx";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Props = {
  genres: string[];
  isLoadingGenres: boolean;
};

function SignUp({ genres, isLoadingGenres }: Props) {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [selectedArtists, setSelectedArtists] = useState<Set<string>>(new Set());
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

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

        <SelectArtists setSelectedArtists={setSelectedArtists} />
        <SelectGenres
          data={genres}
          preferredGenres={new Set()}
          setPreferredGenres={setSelectedGenres}
          isLoading={isLoadingGenres}
        />

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
