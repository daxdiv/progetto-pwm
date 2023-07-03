import { Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";

/**
 * Componente che permette di proteggere un percorso, in modo da evitare accessi non autorizzati
 */
function Protected({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (!auth) {
    return (
      <Navigate
        to="/?error=Devi effettuare prima il login"
        replace
      />
    );
  }
  return children;
}
export default Protected;
