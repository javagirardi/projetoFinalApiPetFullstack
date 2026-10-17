// Menu do template oficial, adaptado para a sessão e os perfis do requisito 2.1.
import { NavLink, useNavigate } from "react-router-dom";
import { ROLE, ROTAS } from "@lab365/contracts";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Header() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  return <header className="menu">
    <NavLink className="menu-logo" to={ROTAS.HOME}><span aria-hidden="true">🐾</span><span className="logo-texto">Lab365PetAmigo</span></NavLink>
    <nav className="menu-nav" aria-label="Navegação principal">
      {usuario?.role === ROLE.LAR && <NavLink className="menu-link" to={ROTAS.MINHAS_ADOCOES}>Minhas adoções</NavLink>}
      {usuario?.role === ROLE.EQUIPE && <NavLink className="menu-link" to={ROTAS.ADMIN_PETS}>Pets</NavLink>}
    </nav>
    <div className="menu-usuario">{usuario ? <><span>Olá, {usuario.nome}</span><button className="btn-logout" onClick={() => { logout(); navigate(ROTAS.LOGIN); }}>Sair</button></> : <NavLink className="menu-link" to={ROTAS.LOGIN}>Entrar</NavLink>}</div>
  </header>;
}
