import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROTAS, STATUS_ATIVOS } from "@lab365/contracts";
import { api } from "../services/api.js";
import PetPhoto from "../components/PetPhoto.jsx";
import { data, idade, labelsStatus } from "../utils/format.js";

const etapas = ["ANALISE", "ENTREVISTA", "APROVADA", "CONCLUIDA"];
const proximos = { ANALISE: "A equipe vai analisar seu pedido e entrar em contato.", ENTREVISTA: "Combine os detalhes da entrevista com a equipe.", APROVADA: "Seu lar foi aprovado! Combine a entrega do pet com a equipe." };
const experiencias = { PRIMEIRO: "Será o primeiro pet", JA_TEVE: "Já teve pets", TEM_OUTROS: "Tem outros pets hoje" };
const tempos = { ATE_4H: "Até 4 horas", DE_4_A_8H: "De 4 a 8 horas", MAIS_8H: "Mais de 8 horas" };

export default function MinhasAdocoes() {
  const [pedidos, setPedidos] = useState([]), [carregando, setCarregando] = useState(true), [erro, setErro] = useState(""), [tentativa, setTentativa] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setCarregando(true); setErro("");
    api("/minhas-adocoes", { signal: controller.signal }).then(setPedidos).catch((error) => { if (error.name !== "AbortError") setErro(error.message); }).finally(() => { if (!controller.signal.aborted) setCarregando(false); });
    return () => controller.abort();
  }, [tentativa]);
  if (carregando) return <p className="carregando" role="status">Carregando suas adoções…</p>;
  if (erro) return <div role="alert"><p className="mensagem-erro">{erro}</p><button className="btn-voltar" onClick={() => setTentativa((n) => n + 1)}>Tentar novamente</button></div>;
  const grupos = [
    { titulo: "Em andamento", tipo: "ativos", itens: pedidos.filter((p) => STATUS_ATIVOS.includes(p.status)) },
    { titulo: "Pets adotados", tipo: "adotados", itens: pedidos.filter((p) => p.status === "CONCLUIDA") },
    { titulo: "Pedidos encerrados", tipo: "encerrados", itens: pedidos.filter((p) => ["RECUSADA", "CANCELADA"].includes(p.status)) },
  ];
  const whatsapp = (import.meta.env.VITE_ONG_WHATSAPP || "").replace(/\D/g, "");
  const contatoConfigurado = /^55[1-9]\d{9,10}$/.test(whatsapp);
  return <section><h1 className="pagina-titulo">Minhas adoções</h1><p className="intro">Acompanhe cada etapa da chegada do seu novo amigo.</p>
    {!pedidos.length ? <div className="estado-vazio"><p>Você ainda não enviou pedidos de adoção.</p><Link className="btn-link" to={ROTAS.PETS}>Conhecer pets disponíveis</Link></div> : grupos.map(({ titulo, tipo, itens }) => <section className="grupo-adocoes" key={tipo}><h2>{titulo} <span className="total-badge">{itens.length}</span></h2>
      {!itens.length && <p className="ajuda">Nenhum pedido neste grupo.</p>}
      <div className="grade-pets">{itens.map((pedido) => {
        const pet = pedido.pet, historico = pedido.historico || [], ultima = historico.at(-1);
        const conclusao = historico.filter((h) => h.status === "CONCLUIDA").at(-1);
        const atual = etapas.indexOf(pedido.status);
        return <article className="card-pet" key={pedido.id}><PetPhoto src={pet.foto_url} nome={pet.nome} /><div className="card-corpo"><h3 className="card-nome">{pet.nome}</h3><p>{pet.raca.nome} · {idade(pet.idade_meses)}</p><p>Pedido #{pedido.id} · {data(pedido.criado_em)}</p><span className="selo">{labelsStatus[pedido.status]}</span>
          {tipo === "ativos" && <>
            <ol className="etapas" aria-label="Etapas da adoção">{etapas.map((etapa, i) => <li key={etapa} className={i < atual ? "feita" : i === atual ? "atual" : ""} aria-current={i === atual ? "step" : undefined}>{labelsStatus[etapa]}</li>)}</ol>
            <p className="proximo-passo">{proximos[pedido.status]}</p>
            <details><summary>Respostas do pedido</summary><dl><dt>Motivo da adoção</dt><dd>{pedido.motivo}</dd><dt>Experiência com pets</dt><dd>{experiencias[pedido.experiencia]}</dd><dt>Tempo sozinho por dia</dt><dd>{tempos[pedido.tempo_sozinho]}</dd></dl></details>
            <details><summary>Histórico do pedido</summary><ol className="historico">{historico.map((h) => <li key={h.id}><strong>{labelsStatus[h.status]}</strong> · <time dateTime={h.criado_em}>{data(h.criado_em)}</time><p>{h.observacao || "Sem observação adicional."}</p></li>)}</ol></details>
            <Link to={`/pets/${pet.id}`}>Ver página do pet</Link>
            {contatoConfigurado ? <a className="btn-whatsapp" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Olá! Gostaria de falar sobre o pedido #${pedido.id}, do pet ${pet.nome}.`)}`} target="_blank" rel="noreferrer">Falar com a equipe pelo WhatsApp</a> : <p className="ajuda">Contato por WhatsApp ainda não configurado.</p>}
            <p className="ajuda">Para desistir de um pedido, fale com a equipe.</p>
          </>}
          {tipo === "adotados" && <p>Data da adoção: <strong>{data(conclusao?.criado_em)}</strong></p>}
          {tipo === "encerrados" && <><p>Encerrado em {data(ultima?.criado_em)}</p><p><strong>Motivo:</strong> {ultima?.observacao || "Motivo não informado pela equipe."}</p></>}
        </div></article>;
      })}</div>
    </section>)}
  </section>;
}
