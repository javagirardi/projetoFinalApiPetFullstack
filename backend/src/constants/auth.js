import "dotenv/config";

// Mesmo segredo para gerar (login) e validar (validateJwtHandler) o token
export const JWT_SECRET = process.env.JWT_SECRET || "senai2026";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

export const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
