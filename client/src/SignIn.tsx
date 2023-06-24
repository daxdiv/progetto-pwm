import "./styles/globals.css";

import { useRef, useState } from "react";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";

const ONE_HOUR_MS = 1000 * 60 * 60;

function App() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { data } = useQuery({
    queryKey: "get-access-token",
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/access-token`
      );
      const data = await response.json();

      return data;
    },
    refetchInterval: ONE_HOUR_MS,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const [searchParams] = useSearchParams();

  const serverError = data && data.error;

  const handleSignIn = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      setError("Compila tutti i campi");
      return;
    }

    // Fonte: https://www.w3resource.com/javascript/form/email-validation.php
    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailRegex.test(email)) {
      setError("Email non valida");
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    // per semplicità, salvo l'utente in localStorage, ma in un'applicazione
    // reale sarebbe meglio usare un sistema di autenticazione basato su token
    localStorage.setItem("user", JSON.stringify(data));
  };

  if (!serverError && data) {
    localStorage.setItem("access_token", data.access_token);
  }

  return (
    <>
      <CenteredContainer className="mb-2 flex-col gap-2">
        {serverError && (
          <p className="text-red-500 bg-red-200 px-4 rounded-xl py-1 text-sm mb-1">
            Errore server: {data.error}
          </p>
        )}
        {error && (
          <p className="text-red-500 bg-red-200 px-4 rounded-xl py-1 text-sm mb-1">
            {error}
          </p>
        )}
        {searchParams.get("success") && (
          <p className="text-green-500 bg-green-200 px-4 rounded-xl py-1 text-sm mb-1">
            {searchParams.get("success")}
          </p>
        )}
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
        <Button
          type="button"
          text="Login"
          className="mt-2"
          onClick={handleSignIn}
          // className={clsx({ "cursor-not-allowed": isLoading })}
        />

        <p className="text-sm mt-3">
          Non hai un account?{" "}
          <a
            href="/sign-up"
            className="text-emerald-600 hover:underline"
          >
            Registrati
          </a>
        </p>
      </CenteredContainer>
    </>
  );
}

export default App;
