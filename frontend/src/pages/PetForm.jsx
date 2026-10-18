import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ROTAS, validarPet } from "@lab365/contracts";
import Field from "../components/Field.jsx";
import PageIntro from "../components/PageIntro.jsx";
import Icon from "../components/Icon.jsx";
import PetPhoto from "../components/PetPhoto.jsx";
import { api } from "../services/api.js";
const inicial = { nome: "", tipo_id: "", raca_id: "", cor_id: "", porte: "", sexo: "", idade_meses: "", foto_url: "", historia: "", comportamento: "", observacoes_extras: "" };
function payload(form) {
  return Object.fromEntries(Object.entries(form).map(([key, value]) => [key, ["tipo_id", "raca_id", "cor_id", "idade_meses"].includes(key) ? (value === "" ? null : Number(value)) : value === "" && !["nome", "porte"].includes(key) ? null : value]));
}
export default function PetForm() {
  const { id } = useParams(), navigate = useNavigate();
  const [form, setForm] = useState(inicial), [base, setBase] = useState(null), [catalogos, setCatalogos] = useState({ tipos: [], racas: [], cores: [] });
  const [carregando, setCarregando] = useState(true), [erro, setErro] = useState(""), [erros, setErros] = useState({}), [salvando, setSalvando] = useState(false), [fotoErro, setFotoErro] = useState(false), [tentativa, setTentativa] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setCarregando(true); setErro("");
    Promise.all([api("/tipos", { signal: controller.signal }), api("/racas", { signal: controller.signal }), api("/cores", { signal: controller.signal }), id ? api(`/admin/pets/${id}`, { signal: controller.signal }) : Promise.resolve(null)]).then(([tipos, racas, cores, pet]) => {
      setCatalogos({ tipos, racas, cores });
      const atual = pet ? { ...Object.fromEntries(Object.keys(inicial).map((k) => [k, pet[k] ?? ""])), tipo_id: String(pet.tipo.id), raca_id: String(pet.raca.id), cor_id: String(pet.cor.id) } : inicial;
      setForm(atual); setBase(payload(atual));
    }).catch((error) => {
      if (error.status === 404) navigate(ROTAS.ADMIN_PETS, { replace: true, state: { mensagem: "Pet não encontrado." } });
      else if (error.name !== "AbortError") setErro(error.message);
    }).finally(() => { if (!controller.signal.aborted) setCarregando(false); });
    return () => controller.abort();
  }, [id, tentativa, navigate]);
  useEffect(() => setFotoErro(false), [form.foto_url]);
  function alterar(e) { setForm((atual) => ({ ...atual, [e.target.name]: e.target.value })); }
  async function salvar(e) {
    e.preventDefault(); setErro("");
    const dados = payload(form);
    const body = id ? Object.fromEntries(Object.entries(dados).filter(([key, value]) => value !== base[key])) : dados;
    const resultado = validarPet(body, Boolean(id));
    setErros(resultado.erros); if (Object.keys(resultado.erros).length) return;
    setSalvando(true);
    try {
      await api(id ? `/pets/${id}` : "/pets", { method: id ? "PUT" : "POST", body: resultado.dados });
      navigate(ROTAS.ADMIN_PETS, { state: { mensagem: id ? "Pet atualizado com sucesso." : "Pet cadastrado com sucesso." } });
    } catch (error) { setErro(error.message); setErros(error.erros || {}); }
    finally { setSalvando(false); }
  }
  if (carregando) return <p className="carregando" role="status">Carregando formulário…</p>;
  if (!base) return <div role="alert"><p>{erro}</p><button className="btn-voltar" onClick={() => setTentativa((n) => n + 1)}>Tentar novamente</button></div>;
  const campo = (name, label, props = {}) => <Field key={name} name={name} label={label} erros={erros} value={form[name]} onChange={alterar} {...props} />;
  const select = (name, label, options, required = false) => <Field key={name} name={name} label={label} erros={erros}>{(props) => <select {...props} value={form[name]} onChange={alterar} required={required}><option value="">{required ? "Selecione" : "Não informado"}</option>{options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>}</Field>;
  return <section className="pagina-formulario"><PageIntro categoria="ÁREA DA EQUIPE" titulo={id ? "Editar pet" : "Cadastrar pet"} descricao={id ? "Cada detalhe ajuda a contar essa história." : "Uma nova história começa com o primeiro cuidado."}><Link className="btn-voltar" to={ROTAS.ADMIN_PETS}><Icon name="back" size={16} /> Voltar à listagem</Link></PageIntro>
    <form onSubmit={salvar} className="formulario-pet" noValidate>{erro && <p className="mensagem-erro" role="alert">{erro}</p>}{erros.formulario && <p className="mensagem-erro" role="alert">{erros.formulario}</p>}
      <fieldset disabled={salvando}><legend>Dados do pet</legend><div className="form-grade">
        {campo("nome", "Nome *", { maxLength: 100, required: true })}
        {select("tipo_id", "Tipo *", catalogos.tipos.map((t) => [t.id, t.nome]), true)}
        {select("raca_id", "Raça *", catalogos.racas.map((t) => [t.id, t.nome]), true)}
        {select("cor_id", "Cor *", catalogos.cores.map((t) => [t.id, t.nome]), true)}
        {select("porte", "Porte *", [["P", "Pequeno"], ["M", "Médio"], ["G", "Grande"]], true)}
        {select("sexo", "Sexo", [["M", "Macho"], ["F", "Fêmea"]])}
        {campo("idade_meses", "Idade em meses", { type: "number", min: 0, step: 1 })}
        {campo("foto_url", "Link da foto", { type: "url", maxLength: 255, placeholder: "https://…" })}
      </div></fieldset>
      <div className="preview-imagem"><PetPhoto src={/^https?:\/\//i.test(form.foto_url) ? form.foto_url : undefined} nome={form.nome || "pet"} className="preview-foto" onUnavailable={() => setFotoErro(true)} /><div><span className="sobretitulo">PRÉVIA DA FOTO</span><h2>{form.nome || "Um novo amigo"}</h2><p className="ajuda">Uma boa foto ajuda a mostrar toda a personalidade do pet.</p>{form.foto_url && (fotoErro || !/^https?:\/\//i.test(form.foto_url)) && <p role="status" className="erro-campo">Não foi possível carregar a foto. Confira o link informado.</p>}</div></div>
      <fieldset disabled={salvando}><legend>História e cuidados</legend>{[["historia", "História"], ["comportamento", "Comportamento"], ["observacoes_extras", "Observações extras: vacinas, castração e cuidados especiais"]].map(([name, label]) => <Field key={name} name={name} label={label} erros={erros}>{(props) => <textarea {...props} className="campo-textarea" value={form[name]} onChange={alterar} rows={3} />}</Field>)}</fieldset>
      <button className="btn-primario" disabled={salvando}>{salvando ? "Salvando…" : "Salvar pet"}</button>
    </form>
  </section>;
}
