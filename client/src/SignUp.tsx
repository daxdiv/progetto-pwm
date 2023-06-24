import "./styles/globals.css";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";
import { useRef } from "react";

function App() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  //const handleSignUp = async () => {}
  return (
    <>
      <CenteredContainer className="mb-2 flex-col gap-2">
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
          //onClick={handleSignUp}
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
