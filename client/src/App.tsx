import "./styles/globals.css";

import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import PlaylistForm from "./PlaylistForm";
import Profile from "./Profile";
import Protected from "./Protected";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster />
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
              <PlaylistForm />
            </Protected>
          }
        />
      </Routes>
    </>
  );
}

export default App;
