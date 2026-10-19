import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROTAS } from "@lab365/contracts";
import { api } from "../services/api.js";
import PetPhoto from "../components/PetPhoto.jsx";
import Icon from "../components/Icon.jsx";
import PageIntro from "../components/PageIntro.jsx";
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
  const indicadores = [
    { label: "Pets cadastrados", valor: pets.length, icone: "paw", tom: "lilas" },
    { label: "Disponíveis", valor: pets.filter((p) => p.situacao === "DISPONIVEL").length, icone: "heart", tom: "menta" },
    { label: "Em processo ou reservados", valor: pets.filter((p) => ["EM_PROCESSO", "RESERVADO"].includes(p.situacao)).length, icone: "clock", tom: "azul" },
    { label: "Arquivados", valor: pets.filter((p) => p.situacao === "ARQUIVADO").length, icone: "archive", tom: "areia" },
  ];
  return <section className="pagina-pets"><PageIntro categoria="ÁREA DA EQUIPE" titulo="Pets cadastrados" descricao="Cada cuidado é um passo mais perto de um novo lar."><Link className="btn-link" to={ROTAS.NOVO_PET}><Icon name="plus" size={19} /> Cadastrar novo pet</Link></PageIntro>
    <div className="indicadores" aria-label="Resumo dos pets">{indicadores.map((item) => <div className="indicador" key={item.label}><span className={`indicador-icone tom-${item.tom}`}><Icon name={item.icone} size={23} /></span><div><strong>{item.valor}</strong><span>{item.label}</span></div></div>)}</div>
    {mensagem && <p role="status" className="mensagem-sucesso">{mensagem}</p>}
    <div className="controles"><label className="campo-grupo busca-flex">Buscar por nome ou raça<span className="busca-com-icone"><Icon name="search" size={19} /><input className="campo-busca" placeholder="Quem você está procurando?" value={busca} onChange={(e) => setBusca(e.target.value)} /></span></label>
      <label className="campo-grupo">Tipo<select className="campo-input" value={tipo} onChange={(e) => setTipo(e.target.value)}><option value="">Todos os tipos</option>{tipos.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}</select></label>
      <label className="campo-grupo">Situação<select className="campo-input" value={situacao} onChange={(e) => setSituacao(e.target.value)}><option value="ATIVOS">Ativos</option><option value="TODOS">Todos</option>{Object.entries(labelsSituacao).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    </div>
    <div className="grade-cabecalho"><h2>Nossos companheiros <span className="total-badge">{filtrados.length}</span></h2><p aria-live="polite">{filtrados.length} de {pets.length} pets · {situacao === "ATIVOS" ? "arquivados ocultos" : situacao === "TODOS" ? "todas as situações" : labelsSituacao[situacao]}</p></div>
    {!filtrados.length && <div className="estado-vazio"><Icon name="search" size={32} /><p>Nenhum pet encontrado para estes filtros.</p></div>}
    <div className="grade-pets">{filtrados.map((pet) => {
      const impedimento = pet.situacao === "ADOTADO" ? "Pets adotados não podem ser arquivados." : pet.pedidos_em_andamento > 0 ? "Há pedidos em andamento para este pet." : "";
      return <article className="card-pet" key={pet.id}><div className="pet-visual"><PetPhoto src={pet.foto_url} nome={pet.nome} /><span className="pet-especie"><Icon size={13} />{pet.tipo.nome}</span><span className={`selo situacao-${pet.situacao.toLowerCase()}`}>{labelsSituacao[pet.situacao]}</span></div><div className="card-corpo"><h3 className="card-nome">{pet.nome}</h3><p className="card-raca">{pet.raca.nome}</p><div className="card-info"><span><Icon name="clock" size={14} />{idade(pet.idade_meses)}</span><span><Icon name="size" size={14} />{labelsPorte[pet.porte]}</span></div><p className="card-pedidos"><Icon name="heart" size={16} />{pet.pedidos_em_andamento} pedido(s) em andamento</p>
        {pet.adotado_por && <p>Adotado por <Link to={`/admin/lares/${pet.adotado_por.id}`}>{pet.adotado_por.nome}</Link></p>}
        {pet.arquivado_em && <p className="arquivo-info">Arquivado em {data(pet.arquivado_em)}<br />{pet.motivo_arquivamento}</p>}
        <div className="acoes card-acoes"><Link className="btn-voltar btn-editar" to={`/admin/pets/${pet.id}`}><Icon name="edit" size={16} /> Editar</Link>{pet.arquivado_em ? <button className="btn-voltar" disabled={ocupado !== null} onClick={() => executar(pet, "restaurar")}>{ocupado === pet.id ? "Restaurando…" : "Restaurar"}</button> : <button className="btn-voltar" disabled={Boolean(impedimento) || ocupado !== null} title={impedimento || undefined} onClick={() => { setArquivar(pet.id); setMotivo(""); setErroAcao({}); }}><Icon name="archive" size={16} /> Arquivar</button>}</div>
        {impedimento && <p className="ajuda">{impedimento}</p>}
        {arquivar === pet.id && <form className="arquivar-form" onSubmit={(e) => { e.preventDefault(); executar(pet, "arquivar"); }}><label className="campo-grupo" htmlFor={`motivo-${pet.id}`}>Motivo do arquivamento<textarea id={`motivo-${pet.id}`} className="campo-textarea" value={motivo} onChange={(e) => setMotivo(e.target.value)} maxLength={255} required /></label><div className="acoes"><button className="btn-voltar" disabled={ocupado !== null}>{ocupado === pet.id ? "Arquivando…" : "Confirmar arquivamento"}</button><button className="btn-voltar" type="button" disabled={ocupado !== null} onClick={() => setArquivar(null)}>Cancelar</button></div></form>}
        {erroAcao.id === pet.id && <p role="alert" className="mensagem-erro">{erroAcao.texto}</p>}
      </div></article>;
    })}</div>
  </section>;
}
