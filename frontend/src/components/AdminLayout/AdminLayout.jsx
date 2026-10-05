import { Link, NavLink, Outlet } from 'react-router-dom'
import styles from './AdminLayout.module.css'

const MENU = [
  { to: '/admin/processos', rotulo: '📋 Processos' },
  { to: '/admin/pets', rotulo: '🐾 Pets' },
  { to: '/admin/lares', rotulo: '🏠 Lares adotivos' },
]

// Layout do painel administrativo: menu lateral + a tela da rota filha (<Outlet />).
// TODO: só deixar entrar a equipe da ONG (role "admin"); os demais vão para o login.
export default function AdminLayout() {
  return (
    <div className={styles.layout}>
      <aside>
        <p><strong>🐾 Lab365PetAmigo</strong><br />Painel administrativo</p>
        {/* TODO: mostrar "Olá, <nome>" de quem está logado */}
        <nav>
          <ul>
            {MENU.map((item) => (
              <li key={item.to}><NavLink to={item.to}>{item.rotulo}</NavLink></li>
            ))}
          </ul>
        </nav>
        <hr />
        <p><Link to="/pets">🌐 Ver site</Link></p>
        {/* TODO: encerrar a sessão e voltar para o login */}
        <button>🚪 Sair</button>
      </aside>
      <section className={styles.conteudo}>
        <Outlet />
      </section>
    </div>
  )
}
