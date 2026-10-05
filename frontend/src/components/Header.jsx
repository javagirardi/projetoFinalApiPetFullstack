import { NavLink } from 'react-router-dom'

// Menu do site.
// TODO: mudar o menu conforme quem está logado:
//   visitante -> Home, Pets, Entrar
//   lar       -> Home, Pets, Minhas adoções, nome, Sair
//   equipe    -> Pets, Painel admin, nome, Sair
export default function Header() {
  return (
    <header>
      <nav>
        <NavLink to="/">🐾 Lab365PetAmigo</NavLink>
        {' | '}
        <NavLink to="/" end>Home</NavLink>
        {' | '}
        <NavLink to="/pets">Pets</NavLink>
        {' | '}
        <NavLink to="/login">Entrar</NavLink>
      </nav>
      <hr />
    </header>
  )
}
