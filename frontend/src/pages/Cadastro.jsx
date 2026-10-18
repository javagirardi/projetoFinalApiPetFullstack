import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MORADIA, ROTAS, UNIDADES_FEDERATIVAS, validarLar, contextoAutenticacao } from "@lab365/contracts";
import Field from "../components/Field.jsx";
import { api } from "../services/api.js";
import { mascaraCep, mascaraTelefone } from "../utils/format.js";

const inicial = { nome: "", email: "", telefone: "", cep: "", estado: "", rua: "", numero: "", bairro: "", cidade: "", moradia: "", moradores: "", outros_animais: "", senha: "", confirmacao: "", termo: false };
export default function Cadastro() {
  const [form, setForm] = useState(inicial), [erros, setErros] = useState({}), [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false), [cepEstado, setCepEstado] = useState("");
  const navigate = useNavigate(), location = useLocation();
  const contexto = contextoAutenticacao(location.state, location.search);
  const cepAtual = useRef(form.cep); cepAtual.current = form.cep;
  useEffect(() => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) { setCepEstado(""); return; }
    const controller = new AbortController();
    let ativo = true;
    const timer = setTimeout(async () => {
      setCepEstado("Consultando CEP…");
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: controller.signal });
        if (!response.ok) throw new Error();
        const dados = await response.json();
        if (!ativo || cepAtual.current.replace(/\D/g, "") !== cep) return;
        if (dados.erro) { setCepEstado("CEP não encontrado. Confira o número ou preencha o endereço manualmente."); return; }
        setForm((atual) => ({ ...atual, rua: dados.logradouro || "", bairro: dados.bairro || "", cidade: dados.localidade || "", estado: dados.uf || "" }));
        setCepEstado("Endereço preenchido. Confira os dados e informe o número.");
      } catch (error) { if (ativo && error.name !== "AbortError") setCepEstado("Não foi possível consultar o CEP. Preencha o endereço manualmente."); }
    }, 350);
    return () => { ativo = false; clearTimeout(timer); controller.abort(); };
  }, [form.cep]);
  function alterar(event) {
    const { name, value, type, checked } = event.target;
    const novo = name === "cep" ? mascaraCep(value) : name === "telefone" ? mascaraTelefone(value) : type === "checkbox" ? checked : value;
    setForm((atual) => ({ ...atual, [name]: novo }));
  }
  async function salvar(event) {
    event.preventDefault(); setErro("");
    const resultado = validarLar({ ...form, moradores: Number(form.moradores), outros_animais: form.outros_animais === "" ? null : form.outros_animais === "true" });
    if (form.senha !== form.confirmacao) resultado.erros.confirmacao = "As senhas devem ser iguais.";
    if (!form.termo) resultado.erros.termo = "É necessário aceitar o termo.";
    setErros(resultado.erros);
    if (Object.keys(resultado.erros).length) return;
    setEnviando(true);
    try {
      await api("/lares-adotivos", { method: "POST", body: resultado.dados });
      navigate(ROTAS.LOGIN, { replace: true, state: { ...contexto, email: resultado.dados.email, mensagem: "Cadastro realizado! Entre com seu e-mail e senha." } });
    } catch (error) { setErro(error.message); setErros(error.erros || {}); }
    finally { setEnviando(false); }
  }
  const campo = (name, label, props = {}) => <Field key={name} name={name} label={label} erros={erros} value={form[name]} onChange={alterar} {...props} />;
  const select = (name, label, options) => <Field key={name} name={name} label={label} erros={erros}>{(props) => <select {...props} value={form[name]} onChange={alterar} required><option value="">Selecione</option>{options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>}</Field>;
  return <section className="pagina-formulario"><h1 className="pagina-titulo">Cadastre seu lar</h1><p className="intro">Conte um pouco sobre quem vai receber o novo amigo.</p>
    <form className="formulario-pet" onSubmit={salvar} noValidate>
      {erro && <p role="alert" className="mensagem-erro">{erro}</p>}
      <fieldset disabled={enviando}><legend>Dados do lar</legend><div className="form-grade">
        {campo("nome", "Nome do lar *", { maxLength: 100, autoComplete: "name", required: true })}
        {campo("email", "E-mail *", { type: "email", autoComplete: "email", maxLength: 254, required: true })}
        {campo("telefone", "Telefone *", { type: "tel", autoComplete: "tel-national", placeholder: "(85) 99999-9999", required: true })}
      </div></fieldset>
      <fieldset disabled={enviando}><legend>Endereço</legend><div className="form-grade">
        {campo("cep", "CEP *", { inputMode: "numeric", autoComplete: "postal-code", placeholder: "00000-000", required: true })}
        {select("estado", "Estado *", UNIDADES_FEDERATIVAS.map((uf) => [uf, uf]))}
        {campo("rua", "Rua *", { maxLength: 150, autoComplete: "address-line1", required: true })}
        {campo("numero", "Número *", { maxLength: 30, required: true })}
        {campo("bairro", "Bairro *", { maxLength: 150, required: true })}
        {campo("cidade", "Cidade *", { maxLength: 100, autoComplete: "address-level2", required: true })}
      </div><p role="status" className="ajuda">{cepEstado}</p></fieldset>
      <fieldset disabled={enviando}><legend>Sobre o lar</legend><div className="form-grade">
        {select("moradia", "Tipo de moradia *", [[MORADIA.CASA, "Casa"], [MORADIA.CASA_QUINTAL, "Casa com quintal"], [MORADIA.APARTAMENTO, "Apartamento"]])}
        {campo("moradores", "Número de moradores *", { type: "number", min: 1, step: 1, required: true })}
        {select("outros_animais", "Já tem outros animais? *", [["false", "Não"], ["true", "Sim"]])}
      </div></fieldset>
      <fieldset disabled={enviando}><legend>Acesso</legend><div className="form-grade">
        {campo("senha", "Senha *", { type: "password", minLength: 6, autoComplete: "new-password", required: true })}
        {campo("confirmacao", "Confirme a senha *", { type: "password", autoComplete: "new-password", required: true })}
      </div><details className="termo"><summary>Termo de adoção responsável — modelo demonstrativo</summary><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p className="ajuda">Texto provisório para demonstração. Será substituído pelo termo da ONG.</p></details>
      <label className="checkbox"><input type="checkbox" name="termo" checked={form.termo} onChange={alterar} aria-describedby={erros.termo ? "termo-erro" : undefined} /> Li e aceito o termo de adoção responsável.</label>{erros.termo && <span id="termo-erro" className="erro-campo">{erros.termo}</span>}</fieldset>
      <button className="btn-primario" disabled={enviando}>{enviando ? "Cadastrando…" : "Criar cadastro"}</button>
      <Link to={ROTAS.LOGIN} state={contexto}>Já tenho cadastro</Link>
    </form>
  </section>;
}
