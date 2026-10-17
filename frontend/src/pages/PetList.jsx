import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROTAS } from "@lab365/contracts";
import { api } from "../services/api.js";
import PetPhoto from "../components/PetPhoto.jsx";
import { data, idade, labelsPorte, labelsSituacao } from "../utils/format.js";

export default function PetList() {
  const [pets, setPets] = useState([]), [carregando, setCarregando] = useState(true), [erro, setErro] = useState("");
  const [busca, setBusca] = useState(""), [tipo, setTipo] = useState(""), [situacao, setSituacao] = useState("ATIVOS");
  const [arquivar, setArquivar] = useState(null), [motivo, setMotivo] = useState(""), [erroAcao, setErroAcao] = useState({}), [ocupado, setOcupado] = useState(null);
  const [mensagem, setMensagem] = useState(useLocation().state?.mensagem || ""), [tentativa, setTentativa] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true); setErro("");
    api("/pets", { signal: controller.signal }).then(setPets).catch((e) => { if (e.name !== "AbortError") setErro(e.message); }).finally(() => { if (!controller.signal.aborted) setCarregando(false); });
    return () => controller.abort();
  }, [tentativa]);
  async function executar(pet, acao) {
    setOcupado(pet.id); setErroAcao({}); setMensagem("");
    try {
      const novo = await api(`/pets/${pet.id}/${acao}`, { method: "PATCH", ...(acao === "arquivar" ? { body: { motivo } } : {}) });
      setPets((atuais) => atuais.map((item) => item.id === novo.id ? novo : item));
      setArquivar(null); setMotivo(""); setMensagem(acao === "arquivar" ? "Pet arquivado com sucesso." : "Pet restaurado com sucesso.");
    } catch (error) { setErroAcao({ id: pet.id, texto: error.erros?.motivo || error.message }); }
    finally { setOcupado(null); }
  }
  if (carregando) return <p className="carregando" role="status">Carregando pets…</p>;
  if (erro) return <div role="alert"><p className="mensagem-erro">{erro}</p><button className="btn-voltar" onClick={() => setTentativa((n) => n + 1)}>Tentar novamente</button></div>;
  const tipos = [...new Map(pets.map((p) => [p.tipo.id, p.tipo])).values()];
  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  const filtrados = pets.filter((p) => (!termo || `${p.nome} ${p.raca.nome}`.toLocaleLowerCase("pt-BR").includes(termo)) && (!tipo || p.tipo.id === Number(tipo)) && (situacao === "TODOS" || (situacao === "ATIVOS" ? p.situacao !== "ARQUIVADO" : p.situacao === situacao)));
  return <section><div className="form-cabecalho"><div><h1 className="pagina-titulo">Pets cadastrados</h1><p>{pets.length} cadastrados · {pets.filter((p) => p.situacao === "ARQUIVADO").length} arquivados</p></div><Link className="btn-link" to={ROTAS.NOVO_PET}>Cadastrar novo pet</Link></div>
    {mensagem && <p role="status" className="mensagem-sucesso">{mensagem}</p>}
    <div className="controles"><label className="campo-grupo busca-flex">Buscar por nome ou raça<input className="campo-busca" value={busca} onChange={(e) => setBusca(e.target.value)} /></label>
      <label className="campo-grupo">Tipo<select className="campo-input" value={tipo} onChange={(e) => setTipo(e.target.value)}><option value="">Todos os tipos</option>{tipos.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}</select></label>
      <label className="campo-grupo">Situação<select className="campo-input" value={situacao} onChange={(e) => setSituacao(e.target.value)}><option value="ATIVOS">Ativos</option><option value="TODOS">Todos</option>{Object.entries(labelsSituacao).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    </div>
    {!filtrados.length && <p className="sem-resultados">Nenhum pet encontrado para estes filtros.</p>}
    <div className="grade-pets">{filtrados.map((pet) => {
      const impedimento = pet.situacao === "ADOTADO" ? "Pets adotados não podem ser arquivados." : pet.pedidos_em_andamento > 0 ? "Há pedidos em andamento para este pet." : "";
      return <article className="card-pet" key={pet.id}><PetPhoto src={pet.foto_url} nome={pet.nome} /><div className="card-corpo"><span className={`selo situacao-${pet.situacao.toLowerCase()}`}>{labelsSituacao[pet.situacao]}</span><h2 className="card-nome">{pet.nome}</h2><p>{pet.raca.nome} · {idade(pet.idade_meses)} · {labelsPorte[pet.porte]}</p><p>{pet.pedidos_em_andamento} pedido(s) em andamento</p>
        {pet.adotado_por && <p>Adotado por <Link to={`/admin/lares/${pet.adotado_por.id}`}>{pet.adotado_por.nome}</Link></p>}
        {pet.arquivado_em && <p className="arquivo-info">Arquivado em {data(pet.arquivado_em)}<br />{pet.motivo_arquivamento}</p>}
        <div className="acoes"><Link className="btn-voltar" to={`/admin/pets/${pet.id}`}>Editar</Link>{pet.arquivado_em ? <button className="btn-voltar" disabled={ocupado !== null} onClick={() => executar(pet, "restaurar")}>{ocupado === pet.id ? "Restaurando…" : "Restaurar"}</button> : <button className="btn-voltar" disabled={Boolean(impedimento) || ocupado !== null} title={impedimento || undefined} onClick={() => { setArquivar(pet.id); setMotivo(""); setErroAcao({}); }}>Arquivar</button>}</div>
        {impedimento && <p className="ajuda">{impedimento}</p>}
        {arquivar === pet.id && <form className="arquivar-form" onSubmit={(e) => { e.preventDefault(); executar(pet, "arquivar"); }}><label className="campo-grupo" htmlFor={`motivo-${pet.id}`}>Motivo do arquivamento<textarea id={`motivo-${pet.id}`} className="campo-textarea" value={motivo} onChange={(e) => setMotivo(e.target.value)} maxLength={255} required /></label><div className="acoes"><button className="btn-voltar" disabled={ocupado !== null}>{ocupado === pet.id ? "Arquivando…" : "Confirmar arquivamento"}</button><button className="btn-voltar" type="button" disabled={ocupado !== null} onClick={() => setArquivar(null)}>Cancelar</button></div></form>}
        {erroAcao.id === pet.id && <p role="alert" className="mensagem-erro">{erroAcao.texto}</p>}
      </div></article>;
    })}</div>
  </section>;
}
