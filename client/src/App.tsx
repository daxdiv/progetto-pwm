import "./styles/globals.css";

import Button from "./components/ui/Button";
import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";
import { useQuery } from "react-query";

const ONE_HOUR_MS = 1000 * 60 * 60;

function App() {
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

  const error = data && data.error;

  if (!error && data) {
    localStorage.setItem("access_token", data.access_token);
  }

  return (
    <>
      <CenteredContainer className="mb-2 flex-col gap-2">
        {error && (
          <p className="text-red-500 bg-red-200 px-4 rounded-xl py-1 text-sm">
            {data.error}
          </p>
        )}
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
