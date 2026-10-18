import { criarClienteApi } from "./client.js";
import { sessaoStore } from "../auth/session.js";
export const api = criarClienteApi({ baseUrl: import.meta.env.VITE_URL_API || import.meta.env.VITE_API_URL || "/api", sessaoStore });
