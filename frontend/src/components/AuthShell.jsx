import Header from "./Header.jsx";
import Icon from "./Icon.jsx";

export default function AuthShell({ children }) {
  return <div className="auth-pagina"><Header /><main className="auth-layout">
    <section className="auth-apresentacao" aria-label="Adoção responsável">
      <span className="sobretitulo"><Icon name="heart" size={16} /> UM LAR MUDA TUDO</span>
      <h2>Pequenos encontros.<br /><span>Grandes histórias.</span></h2>
      <p>Um novo começo para eles.<br />Muito mais amor para você.</p>
      <div className="auth-fotos"><img className="auth-foto-principal" src="/images/pets/rex.webp" alt="Cachorro com uma flor na boca" /><img className="auth-foto-menor" src="/images/pets/mimi.webp" alt="Gato de olhos verdes" /><span className="auth-foto-selo"><span><Icon name="heart" size={19} /></span>O melhor lugar é perto de você.</span></div>
      <p className="auth-rodape"><Icon name="shield" size={17} /> Cuidado e responsabilidade em cada etapa.</p>
    </section>
    <section className="login-container"><div className="login-card">{children}</div><p className="login-nota">Cada história começa com um encontro.</p></section>
  </main></div>;
}
