import { Link } from "react-router-dom";
import { ROTAS } from "@lab365/contracts";

export default function PaginaNaoEncontrada() {
  return <section className="pagina-formulario"><h1 className="pagina-titulo">Página não encontrada</h1><p>O endereço solicitado não está disponível nesta aplicação.</p><Link to={ROTAS.HOME}>Voltar ao início</Link></section>;
}
