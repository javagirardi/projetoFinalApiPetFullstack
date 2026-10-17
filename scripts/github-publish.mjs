import { spawnSync } from "node:child_process";

const conta = "javagirardi";
const principal = `${conta}/projetoFinalApiPetFullstack`;
const branch = "feature/modulos-2-e-3";

// A credencial fica somente na memória deste processo e nunca é impressa.
const credencial = spawnSync("git", ["-c", "credential.helper=manager", "credential", "fill"], {
  input: `protocol=https\nhost=github.com\nusername=${conta}\n\n`, encoding: "utf8",
  env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "Never" },
});
if (credencial.status !== 0) throw new Error("Não foi possível obter a autenticação de javagirardi no Git Credential Manager.");
const campos = Object.fromEntries(credencial.stdout.trim().split(/\r?\n/).map((linha) => {
  const i = linha.indexOf("="); return [linha.slice(0, i), linha.slice(i + 1)];
}));
if (!campos.password) throw new Error("Autenticação indisponível.");

async function api(caminho, method = "GET", body) {
  const res = await fetch(`https://api.github.com${caminho}`, {
    method, headers: { Authorization: `Bearer ${campos.password}`, Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json", "User-Agent": "Lab365PetAmigo-publicacao" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = res.status === 204 ? null : await res.json();
  return { status: res.status, data };
}
const usuario = await api("/user");
if (usuario.status !== 200 || usuario.data.login.toLowerCase() !== conta) throw new Error("A conta autenticada não é javagirardi. Nenhuma publicação executada.");
console.log(JSON.stringify({ conta: usuario.data.login }));
const modo = process.argv[2] || "inspect";
if (!["inspect", "create", "pr", "status"].includes(modo)) throw new Error("Modo inválido. Use inspect, create, pr ou status.");

async function resumo(repo) {
  const r = await api(`/repos/${repo}`);
  const dados = r.status === 200 ? { url: r.data.html_url, privado: r.data.private, branch: r.data.default_branch,
    tamanho: r.data.size, permissoes: r.data.permissions, arquivado: r.data.archived } : { mensagem: r.data.message };
  console.log(JSON.stringify({ repositorio: repo, status: r.status, ...dados }));
  return r;
}

if (modo === "inspect") {
  await resumo(principal);
} else if (modo === "create") {
  for (const [repo, rota, nome] of [[principal, "/user/repos", "projetoFinalApiPetFullstack"]]) {
    const atual = await resumo(repo);
    if (atual.status === 200) { console.log(JSON.stringify({ repositorio: repo, acao: "preservado: já existe" })); continue; }
    if (atual.status !== 404) { console.log(JSON.stringify({ repositorio: repo, acao: "não criado: consulta indisponível" })); continue; }
    const criado = await api(rota, "POST", { name: nome, description: "Lab365PetAmigo — projeto final Fullstack, módulos 2 e 3. Trabalho individual de Javan Girardi.", private: false, auto_init: false });
    console.log(JSON.stringify({ repositorio: repo, status: criado.status,
      ...(criado.status === 201 ? { criado: true, url: criado.data.html_url } : { criado: false, mensagem: criado.data.message }) }));
  }
} else if (modo === "pr") {
  const existentes = await api(`/repos/${principal}/pulls?state=open&head=${encodeURIComponent(`${conta}:${branch}`)}&base=develop`);
  if (existentes.status !== 200) throw new Error("Não foi possível conferir os Pull Requests existentes.");
  if (existentes.data.length) {
    console.log(JSON.stringify({ pr: existentes.data[0].html_url, numero: existentes.data[0].number, existente: true }));
  } else {
    const criado = await api(`/repos/${principal}/pulls`, "POST", {
      title: "Consolidar implementação individual dos módulos 2 e 3",
      head: branch, base: "develop", draft: true,
      body: "Implementa os requisitos 2.1–2.3 e 3.1–3.4 do Lab365PetAmigo: login e sessão por perfil, cadastro de lar com ViaCEP, acompanhamento de adoções e gestão de pets com cadastro, edição parcial, arquivamento e restauração. A aplicação contém somente as telas do escopo individual autorizado.\n\nA base preserva o commit oficial 67e6190. Este PR consolida o trabalho local existente; não representa desenvolvimento retroativo em branches individuais por requisito.\n\nValidação local: 34 testes aprovados e build de produção aprovado. Arquivos .env, dependências, builds e pastas antigas excluídos.\n\nPermanece em rascunho para conferência independente dos requisitos e dos limites de navegação. O contato WhatsApp autorizado está configurado; o termo demonstrativo foi autorizado pelo usuário. O quadro Trello ainda aguarda conexão, portanto não há link de cartão nem merge declarado concluído.\n\nDepois da revisão, integrar em develop por este PR e abrir o PR final de develop para main."
    });
    if (criado.status !== 201) throw new Error(`Não foi possível criar o PR (${criado.status}): ${criado.data.message}`);
    console.log(JSON.stringify({ pr: criado.data.html_url, numero: criado.data.number, rascunho: criado.data.draft }));
  }
} else {
  await resumo(principal);
  const branches = await api(`/repos/${principal}/branches`);
  console.log(JSON.stringify({ branches: branches.status === 200 ? branches.data.map(({ name, commit }) => ({ nome: name, commit: commit.sha })) : branches.status }));
  const prs = await api(`/repos/${principal}/pulls?state=open`);
  console.log(JSON.stringify({ prs: prs.status === 200 ? prs.data.map(({ number, html_url, draft, base, head }) => ({ numero: number, url: html_url, rascunho: draft, base: base.ref, head: head.ref })) : prs.status }));
  const execucoes = await api(`/repos/${principal}/actions/runs?per_page=5`);
  console.log(JSON.stringify({ ci: execucoes.status === 200 ? execucoes.data.workflow_runs.map(({ html_url, status, conclusion, head_sha }) => ({ url: html_url, status, resultado: conclusion, commit: head_sha })) : execucoes.status }));
}
