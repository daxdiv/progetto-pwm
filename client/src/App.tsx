import "./styles/globals.css";

import { Route, Routes } from "react-router-dom";

import Dashboard from "./Dashboard";
import Protected from "./Protected";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster />
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
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
      </Routes>
    </>
  );
}

export default App;
