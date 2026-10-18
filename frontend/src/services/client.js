export class ApiError extends Error {
  constructor(status, mensagem, erros = {}) { super(mensagem); this.status = status; this.erros = erros; }
}

export function criarClienteApi({ baseUrl = "/api", fetchFn = globalThis.fetch, sessaoStore }) {
  return async function api(path, { body, headers, ...options } = {}) {
    if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) throw new Error("Use uma rota relativa da API.");
    const sessao = sessaoStore.ler();
    const requestHeaders = new Headers(headers);
    if (body !== undefined) requestHeaders.set("Content-Type", "application/json");
    if (sessao) requestHeaders.set("Authorization", `Bearer ${sessao.token}`);
    let response;
    try {
      response = await fetchFn(`${baseUrl.replace(/\/$/, "")}${path}`, { ...options, headers: requestHeaders, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
    } catch (error) {
      if (error.name === "AbortError") throw error;
      throw new ApiError(0, "Não foi possível conectar ao servidor.");
    }
    if (response.status === 204) return null;
    let dados;
    try { dados = await response.json(); } catch { dados = null; }
    if (!response.ok) {
      // Uma resposta atrasada de uma sessão anterior não deve encerrar um login novo.
      if (response.status === 401 && sessao && sessaoStore.ler()?.token === sessao.token) sessaoStore.limpar();
      throw new ApiError(response.status, dados?.error || dados?.erro || "Não foi possível concluir a solicitação.", dados?.campos || dados?.erros || {});
    }
    return dados;
  };
}
