import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ROLE, ROTAS } from "@lab365/contracts";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import RotaProtegida from "./auth/RotaProtegida.jsx";
import Header from "./components/Header.jsx";
import AdminLayout from "./components/AdminLayout/AdminLayout.jsx";
import Login from "./pages/Auth/Login/Login.jsx";
import PaginaNaoEncontrada from "./pages/PaginaNaoEncontrada.jsx";
import Cadastro from "./pages/Auth/Cadastro/Cadastro.jsx";
import MinhasAdocoes from "./pages/Site/MinhasAdocoes/MinhasAdocoes.jsx";
import PetList from "./pages/Admin/Pets/PetsAdmin/PetsAdmin.jsx";
import PetForm from "./pages/Admin/Pets/PetForm/PetForm.jsx";

function Layout() { return <><Header /><main className="conteudo-principal"><Outlet /></main></>; }
function Home() {
  const { usuario } = useAuth();
  const destino = !usuario ? ROTAS.LOGIN : usuario.role === ROLE.EQUIPE ? ROTAS.ADMIN_PETS : ROTAS.MINHAS_ADOCOES;
  return <Navigate to={destino} replace />;
}
export default function App() {
  return <BrowserRouter><AuthProvider><Routes>
    <Route path={ROTAS.LOGIN} element={<Login />} />
    <Route element={<Layout />}>
      <Route path={ROTAS.HOME} element={<Home />} />
      <Route path={ROTAS.CADASTRO} element={<Cadastro />} />
      <Route element={<RotaProtegida role={ROLE.LAR} />}>
        <Route path={ROTAS.MINHAS_ADOCOES} element={<MinhasAdocoes />} />
        {/* Entrada prevista em 2.1, direcionada à tela disponível nesta entrega. */}
        <Route path={ROTAS.PETS} element={<Navigate to={ROTAS.MINHAS_ADOCOES} replace />} />
      </Route>
      <Route path="*" element={<PaginaNaoEncontrada />} />
    </Route>
    <Route element={<RotaProtegida role={ROLE.EQUIPE} />}>
      <Route path={ROTAS.PROCESSOS} element={<Navigate to={ROTAS.ADMIN_PETS} replace />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="pets" replace />} />
        <Route path="pets" element={<PetList />} />
        <Route path="pets/novo" element={<PetForm key="novo" />} />
        <Route path="pets/:id" element={<PetForm />} />
        <Route path="pets/:id/editar" element={<PetForm />} />
      </Route>
    </Route>
  </Routes></AuthProvider></BrowserRouter>;
}
