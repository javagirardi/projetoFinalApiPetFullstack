import { Navigate, Outlet, useLocation } from "react-router-dom";
import { destinoAposLogin, ROTAS } from "@lab365/contracts";
import { useAuth } from "./AuthContext.jsx";
export default function RotaProtegida({ role }) {
  const { usuario } = useAuth();
  const location = useLocation();
  if (!usuario) return <Navigate to={ROTAS.LOGIN} replace state={{ ...location.state, redirectTo: `${location.pathname}${location.search}${location.hash}` }} />;
  if (usuario.role !== role) return <Navigate to={destinoAposLogin(usuario.role)} replace />;
  return <Outlet />;
}
