// Estrutura de menu lateral e Outlet do template oficial; sessão implementada no módulo 2.
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import styles from "./AdminLayout.module.css";
const MENU = [
  { to: "/admin/pets", rotulo: "Pets" },
];
export default function AdminLayout() {
  const { usuario, logout } = useAuth(), navigate = useNavigate();
  return <div className={styles.layout}>
    <aside className={styles.menu}><p><strong>🐾 Lab365PetAmigo</strong><br />Painel administrativo</p><p>Olá, {usuario.nome}</p>
      <nav aria-label="Painel administrativo"><ul>{MENU.map((item) => <li key={item.to}><NavLink to={item.to}>{item.rotulo}</NavLink></li>)}</ul></nav>
      <button className="btn-logout" onClick={() => { logout(); navigate("/login"); }}>Sair</button>
    </aside>
    <main className={styles.conteudo}><Outlet /></main>
  </div>;
}
