import "./styles/globals.css";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";

function App() {
  return (
    <>
      <CenteredContainer className="mb-2 flex-col gap-2">
        <Input
          variant="neutral"
          size="sm"
          placeholder="Nome utente"
        />
        <Input
          variant="neutral"
          size="sm"
          placeholder="Email"
          type="email"
        />
        <Input
          variant="neutral"
          size="sm"
          placeholder="Password"
          type="password"
        />
        <Button
          type="submit"
          text="Login"
          className="mt-2"
          // className={clsx({ "cursor-not-allowed": isLoading })}
        />
      </CenteredContainer>
    </>
  );
}

export default App;
