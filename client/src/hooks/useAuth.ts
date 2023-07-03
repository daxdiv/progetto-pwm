import { useNavigate } from "react-router-dom";

type Auth = {
  _id: string;
  username: string;
  email: string;
  password: string;
  preferredGenres: string[];
  description: string;
  savedPlaylists: string[];
};

/**
 * Hook che restituisce i dati dell'utente loggato, se non loggato reindirizza alla pagina di login
 */
export default function useAuth() {
  const navigate = useNavigate();
  const userDataString = localStorage.getItem("user");

  if (!userDataString) {
    navigate("/?error=Devi prima effettuare il login");
    return;
  }

  return JSON.parse(userDataString) as Auth;
}
