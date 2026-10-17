import { normalizarSessao } from "@lab365/contracts";
export const SESSION_KEY = "@dadoslogin";
const LEGACY_KEY = "lab365petamigo.session.v1";

export function criarArmazenamentoSessao(storage) {
  const listeners = new Set();
  const avisar = () => { for (const listener of listeners) listener(); };
  return {
    ler() {
      try {
        return normalizarSessao(JSON.parse(storage.getItem(SESSION_KEY)));
      } catch { return null; }
    },
    salvar(sessao) {
      const normalizada = normalizarSessao(sessao);
      if (!normalizada) throw new Error("Resposta de autenticação inválida.");
      storage.setItem(SESSION_KEY, JSON.stringify({ ...normalizada.usuario, token: normalizada.token }));
      storage.removeItem(LEGACY_KEY);
      avisar();
    },
    limpar() { try { storage.removeItem(SESSION_KEY); storage.removeItem(LEGACY_KEY); } finally { avisar(); } },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    avisar,
  };
}

export const sessaoStore = criarArmazenamentoSessao({
  getItem: (key) => globalThis.localStorage.getItem(key),
  setItem: (key, value) => globalThis.localStorage.setItem(key, value),
  removeItem: (key) => globalThis.localStorage.removeItem(key),
});
if (typeof window !== "undefined") window.addEventListener("storage", (event) => {
  if (event.key === SESSION_KEY || event.key === null) sessaoStore.avisar();
});
