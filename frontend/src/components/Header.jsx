// Menu do template oficial, adaptado para a sessão e os perfis do requisito 2.1.
import { NavLink, useNavigate } from "react-router-dom";
import { ROLE, ROTAS } from "@lab365/contracts";
import { useAuth } from "../auth/AuthContext.jsx";
import Brand from "./Brand.jsx";
import Icon from "./Icon.jsx";

export default function Header() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  return <header className="menu">
    <Brand />
    <nav className="menu-nav" aria-label="Navegação principal">
      {usuario?.role === ROLE.LAR && <NavLink className="menu-link" to={ROTAS.MINHAS_ADOCOES}>Minhas adoções</NavLink>}
      {usuario?.role === ROLE.EQUIPE && <NavLink className="menu-link" to={ROTAS.ADMIN_PETS}>Pets</NavLink>}
      {!usuario && <><NavLink className="menu-link" to={ROTAS.LOGIN}>Entrar</NavLink><NavLink className="menu-link menu-cadastro" to={ROTAS.CADASTRO}>Criar conta <Icon name="arrow" size={16} /></NavLink></>}
    </nav>
    {usuario && <div className="menu-usuario"><span className="avatar" aria-hidden="true">{usuario.nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("")}</span><span className="usuario-nome">{usuario.nome}<small>{usuario.role === ROLE.EQUIPE ? "Equipe PetAmigo" : "Meu lar adotivo"}</small></span><button className="btn-logout" onClick={() => { logout(); navigate(ROTAS.LOGIN); }}><Icon name="logout" size={17} /> Sair</button></div>}
  </header>;
}
