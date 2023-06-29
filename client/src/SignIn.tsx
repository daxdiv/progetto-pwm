import "./styles/globals.css";

import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";
import { Triangle } from "react-loader-spinner";
import { delay } from "./utils/helpers";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";

const ONE_HOUR_MS = 1000 * 60 * 60;

function SignIn() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useQuery({
    queryKey: "get-access-token",
    queryFn: async () => {
      await delay();

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
  const navigate = useNavigate();

  const serverError = data && data.error;

  const handleSignIn = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
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
      toast.error(data.error);
      return;
    }

    // per semplicità, salvo l'utente in localStorage, ma in un'applicazione
    // reale sarebbe meglio usare un sistema di autenticazione basato su token
    localStorage.setItem("user", JSON.stringify(data));
    navigate("/profile");
  };

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

  if (!serverError && data) {
    localStorage.setItem("access_token", data.access_token);
  }

  return (
    <>
      <CenteredContainer className="flex-col gap-2">
        {isLoading ? (
          <Triangle
            height="80"
            width="80"
            color="#059669"
            ariaLabel="triangle-loading"
            visible={true}
          />
        ) : (
          <>
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
          </>
        )}
      </CenteredContainer>
    </>
  );
}

export default SignIn;
