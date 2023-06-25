import { useEffect, useRef, useState } from "react";

import Button from "./ui/Button";
import CenteredContainer from "./ui/CenteredContainer";
import { FaTrashAlt } from "react-icons/fa";
import Input from "./ui/Input";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Profile() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [preferredGenres, setPreferredGenres] = useState<Set<string>>(new Set());

  useEffect(() => {
    const userDataString = localStorage.getItem("user");

    if (!userDataString) {
      return;
    }

    const userDataJSON = JSON.parse(userDataString);
    const preferredGenres = userDataJSON.preferredGenres;

    if (!preferredGenres) {
      return;
    }

    setPreferredGenres(new Set(preferredGenres));
  }, []);

  const handleUpdateProfile = async () => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !email || !password) {
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

    const userDataString = localStorage.getItem("user");

    if (!userDataString) {
      navigate("/?error=Devi prima effettuare il login");
      return;
    }

    const userDataJSON = JSON.parse(userDataString);
    const userId = userDataJSON._id;

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        preferredGenres: Array.from(preferredGenres),
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    toast.success("Profilo aggiornato correttamente");
  };
  const handleDeleteProfile = async () => {
    const userDataString = localStorage.getItem("user");

    if (!userDataString) {
      navigate("/?error=Devi prima effettuare il login");
      return;
    }

    const userDataJSON = JSON.parse(userDataString);
    const userId = userDataJSON._id;

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    localStorage.removeItem("user");
    navigate("/?success=Profilo eliminato correttamente");
  };

  return (
    <>
      <CenteredContainer className="mb-2 flex-col gap-2">
        <Input
          variant="neutral"
          size="sm"
          placeholder="Nuovo username"
          type="text"
          ref={usernameRef}
        />
        <Input
          variant="neutral"
          size="sm"
          placeholder="Nuova email"
          type="email"
          ref={emailRef}
        />
        <Input
          variant="neutral"
          size="sm"
          placeholder="Nuova password"
          type="password"
          ref={passwordRef}
        />

        {preferredGenres.size !== 0 && (
          <>
            <p className="text-sm font-normal">Modifica generi musicali preferiti:</p>

            <ul className="grid grid-cols-2 font-normal text-xs gap-2">
              {Array.from(preferredGenres).map(genre => (
                <li
                  key={`selected-${genre}`}
                  className="text-white bg-gray-700 w-full rounded-xl px-2 py-1 flex items-center justify-between gap-1"
                >
                  <span>{genre}</span>
                  <FaTrashAlt
                    className="text-red-500 font-bold cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      setPreferredGenres(prevGenres => {
                        const newGenres = new Set(prevGenres);
                        newGenres.delete(genre);

                        return newGenres;
                      });
                    }}
                  />
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            text="Aggiorna profilo"
            size="sm"
            onClick={handleUpdateProfile}
          />
          <Button
            type="button"
            text="Elimina profilo"
            size="sm"
            variant="danger"
            onClick={handleDeleteProfile}
          />
        </div>
      </CenteredContainer>
    </>
  );
}

export default Profile;
