import "./styles/globals.css";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";
import Select from "./components/ui/Select";
import { Triangle } from "react-loader-spinner";
import { delay } from "./utils/delay";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useRef } from "react";

type Error = { status: number; message: string };
type Response = { genres: string[] };

function SignUp() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const genreRef = useRef<HTMLSelectElement>(null);
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
          <Select
            size="sm"
            placeholder="Seleziona i generi musicali"
            className="text-xs"
            data={data?.genres || []}
            ref={genreRef}
          />
        )}

        <Button
          type="button"
          text="Registrati"
          className="mt-2"
          onClick={handleSignUp}
          // className={clsx({ "cursor-not-allowed": isLoading })}
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
      </CenteredContainer>
    </>
  );
}

export default SignUp;
