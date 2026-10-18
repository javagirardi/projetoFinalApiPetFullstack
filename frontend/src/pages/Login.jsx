import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { contextoAutenticacao, navegacaoAposLogin, ROTAS } from "@lab365/contracts";
import { useAuth } from "../auth/AuthContext.jsx";
import AuthShell from "../components/AuthShell.jsx";
import Icon from "../components/Icon.jsx";

export default function Login() {
  const { usuario, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const contexto = contextoAutenticacao(location.state, location.search);
  const [email, setEmail] = useState(location.state?.email || "");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  if (usuario) { const destino = navegacaoAposLogin(usuario.role, contexto); return <Navigate to={destino.to} state={destino.state} replace />; }
  async function handleSubmit(event) {
    event.preventDefault();
    setErro(""); setErros({}); setEnviando(true);
    try {
      const conta = await login(email.trim(), senha);
      const destino = navegacaoAposLogin(conta.role, contexto);
      navigate(destino.to, { replace: true, state: destino.state });
    } catch (error) { setErro(error.message); setErros(error.erros || {}); }
    finally { setEnviando(false); }
  }
  const params = new URLSearchParams();
  if (contexto.redirectTo) params.set("retorno", contexto.redirectTo);
  if (contexto.petId) params.set("petId", contexto.petId);
  const cadastro = params.size ? `${ROTAS.CADASTRO}?${params}` : ROTAS.CADASTRO;
  return <AuthShell>
    <div className="login-header"><span className="login-icone"><Icon size={28} /></span><span className="sobretitulo">BEM-VINDO DE VOLTA</span><h1 className="login-titulo">Entre na sua conta<span>.</span></h1><p className="login-subtitulo">Seu próximo capítulo de carinho começa aqui.</p></div>
    {location.state?.mensagem && <p className="mensagem-sucesso" role="status">{location.state.mensagem}</p>}
    <form onSubmit={handleSubmit} className="login-form">
      <div className="campo-grupo"><label htmlFor="email" className="campo-label">E-mail</label><input id="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="campo-input" required maxLength={254} aria-invalid={Boolean(erros.email)} aria-describedby={erros.email ? "erro-email" : undefined} />{erros.email && <span id="erro-email" className="erro-campo">{erros.email}</span>}</div>
      <div className="campo-grupo"><label htmlFor="senha" className="campo-label">Senha</label><input id="senha" type="password" autoComplete="current-password" value={senha} onChange={(event) => setSenha(event.target.value)} className="campo-input" required aria-invalid={Boolean(erros.senha)} aria-describedby={erros.senha ? "erro-senha" : undefined} />{erros.senha && <span id="erro-senha" className="erro-campo">{erros.senha}</span>}</div>
      {erro && <p className="mensagem-erro" role="alert">{erro}</p>}
      <button type="submit" className="btn-primario" disabled={enviando}>{enviando ? "Entrando..." : <>Entrar <Icon name="arrow" size={18} /></>}</button>
    </form>
    <p className="login-dica">Ainda não tem uma conta?<br /><Link to={cadastro} state={contexto}>Não sou cadastrado <Icon name="arrow" size={15} /></Link></p>
  </AuthShell>;
}
