import "dotenv/config";

export function carregarConfiguracao(env = process.env) {
  const porta = Number(env.PORT || env.PORTA || 8888);
  const dbPorta = Number(env.DB_PORT || 5432);
  if (!Number.isInteger(porta) || porta < 1 || porta > 65535) throw new Error("PORTA inválida.");
  if (!Number.isInteger(dbPorta) || dbPorta < 1 || dbPorta > 65535) throw new Error("DB_PORT inválida.");
  const authSecret = env.JWT_SECRET || env.AUTH_SECRET;
  const username = env.DB_USERNAME || env.DB_USER;
  if (!authSecret || authSecret.length < 32) throw new Error("Configure JWT_SECRET ou AUTH_SECRET com pelo menos 32 caracteres no backend/.env.");
  if (!env.DB_NAME || !username || !env.DB_PASSWORD) throw new Error("Configure DB_NAME, DB_USERNAME (ou DB_USER) e DB_PASSWORD no backend/.env.");
  return {
    porta,
    frontendOrigin: env.FRONTEND_ORIGIN || "http://localhost:5173",
    authSecret,
    authExpiresIn: env.JWT_EXPIRES_IN || env.AUTH_EXPIRES_IN || "8h",
    database: {
      host: env.DB_HOST || "localhost", port: dbPorta, username,
      password: env.DB_PASSWORD, database: env.DB_NAME, logging: (env.DB_LOGGING || env.DB_LOG) === "true",
    },
  };
}
