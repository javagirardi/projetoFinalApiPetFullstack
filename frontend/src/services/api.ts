import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
});

// Passagem automática do token direto no headers das requisições
api.interceptors.request.use((config) => {
  const dadosLogin = localStorage.getItem("@dadoslogin");
  if (dadosLogin) {
    const dados = JSON.parse(dadosLogin);
    config.headers.Authorization = `Bearer ${dados.token}`;
  }
  return config;
});

export default api;
