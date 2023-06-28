import "./styles/globals.css";

import { Route, Routes } from "react-router-dom";

import BrowsePlaylists from "./BrowsePlaylists";
import EditPlaylist from "./EditPlaylist";
import Navbar from "./components/Navbar";
import NewPlaylist from "./NewPlaylist";
import Profile from "./Profile";
import Protected from "./Protected";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Toaster } from "react-hot-toast";

function App() {
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
          element={<SignUp />}
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
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
          element={<BrowsePlaylists />}
        />
      </Routes>
    </>
  );
}

export default App;
