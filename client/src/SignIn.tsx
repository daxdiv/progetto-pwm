import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";
import { toast } from "react-hot-toast";

function SignIn() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
      window.history.replaceState(null, "", window.location.pathname);
    }
    if (searchParams.get("error")) {
      toast.error(searchParams.get("error"));
      searchParams.delete("error");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [searchParams]);

  return (
    <>
      <CenteredContainer className="flex-col gap-2">
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

        <Button
          type="button"
          text="Login"
          className="mt-2"
          onClick={handleSignIn}
          // className={clsx({ "cursor-not-allowed": isLoading })}
        />
        <p className="font-normal md:font-bold lg:font-bold text-sm mt-3">
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

export default SignIn;
