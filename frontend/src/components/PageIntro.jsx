import Icon from "./Icon.jsx";

export default function PageIntro({ categoria, titulo, descricao, children }) {
  return <div className="pagina-intro"><div><span className="sobretitulo"><Icon size={16} /> {categoria}</span><h1 className="pagina-titulo">{titulo}</h1><p className="intro">{descricao}</p></div>{children}<Icon size={140} className="intro-patinha" /></div>;
}
