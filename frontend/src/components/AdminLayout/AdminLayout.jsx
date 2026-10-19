// Layout da equipe com navegação restrita às funcionalidades entregues.
import { Outlet } from "react-router-dom";
import Header from "../Header.jsx";
import Icon from "../Icon.jsx";
import styles from "./AdminLayout.module.css";
export default function AdminLayout() {
  return <div className={styles.layout}>
    <Header />
    <main className={styles.conteudo}><Outlet /></main>
    <footer className="rodape"><Icon name="heart" size={15} /> Lab365PetAmigo · Cuidado que aproxima.</footer>
  </div>;
}
