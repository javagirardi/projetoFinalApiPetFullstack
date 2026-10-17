import { createContext, useContext, useEffect, useState } from "react";
import { sessaoStore } from "./session.js";
import { api } from "../services/api.js";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(() => sessaoStore.ler());
  useEffect(() => {
    const atualizar = () => setSessao(sessaoStore.ler());
    const unsubscribe = sessaoStore.subscribe(atualizar);
    atualizar();
    return unsubscribe;
  }, []);
  async function login(email, senha) {
    const resposta = await api("/auth/login", { method: "POST", body: { email, senha } });
    sessaoStore.salvar(resposta);
    return sessaoStore.ler().usuario;
  }
  return <AuthContext.Provider value={{ sessao, usuario: sessao?.usuario, login, logout: () => sessaoStore.limpar() }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return auth;
}
