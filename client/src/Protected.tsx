import { Navigate } from "react-router-dom";

function Protected({ children }: { children: React.ReactNode }) {
  const isSignedIn = localStorage.getItem("user");

  if (!isSignedIn) {
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
