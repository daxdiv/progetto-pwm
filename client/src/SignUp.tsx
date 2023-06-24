import "./styles/globals.css";

import { useRef, useState } from "react";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function App() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !email || !password) {
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
      setError(data.message);
      return;
    }

    navigate("/?success=Utente registrato correttamente");
  };

  if (error) toast.error(error);

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

export default App;
