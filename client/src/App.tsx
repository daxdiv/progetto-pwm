import "./styles/globals.css";

import { Route, Routes } from "react-router-dom";

import SignIn from "./SignIn";
import SignUp from "./SignUp";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<SignIn />}
        />
        <Route
          path="/sign-up"
          element={<SignUp />}
        />
      </Routes>
    </>
  );
}

export default App;
