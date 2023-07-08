import "./styles/globals.css";
import "react-toggle/style.css";

import { Route, Routes } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import BrowsePlaylists from "./BrowsePlaylists";
import EditPlaylist from "./EditPlaylist";
import Navbar from "./components/Navbar";
import NewPlaylist from "./NewPlaylist";
import Profile from "./Profile";
import Protected from "./Protected";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { delay } from "./utils/helpers";
import { useQuery } from "react-query";

const FIVE_MINUTES_MS = 1000 * 60 * 5;
const refetchInterval = 1000 * 60 * 60 - FIVE_MINUTES_MS; // 55 minuti, per essere sicuri il token non scada

function App() {
  useQuery({
    queryKey: "get-access-token",
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/access-token`
      );
      const data = await response.json();

      return data;
    },
    refetchInterval,
    refetchOnWindowFocus: false,
    onError: () => {
      toast.error("Errore durante il refresh del token");
    },
    onSuccess: data => {
      localStorage.setItem("access_token", data.access_token);
    },
  });
  const { data, isLoading: isLoadingGenres } = useQuery<
    { genres: string[] },
    SpotifyApiError
  >({
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
      const data = await response.json();

      return await data;
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            backgroundColor: "#1f2937",
            color: "#fff",
          },
        }}
      />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<SignIn />}
        />
        <Route
          path="/sign-up"
          element={
            <SignUp
              genres={data?.genres ?? []}
              isLoadingGenres={isLoadingGenres}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile
                genres={data?.genres ?? []}
                isLoadingGenres={isLoadingGenres}
              />
            </Protected>
          }
        />
        <Route
          path="/playlist/new"
          element={
            <Protected>
              <NewPlaylist />
            </Protected>
          }
        />
        <Route
          path="/playlist/:id"
          element={
            <Protected>
              <EditPlaylist />
            </Protected>
          }
        />
        <Route
          path="/playlist/browse"
          element={
            <Protected>
              <BrowsePlaylists />
            </Protected>
          }
        />
      </Routes>
    </>
  );
}

export default App;
