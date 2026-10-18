import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";

for (const pasta of ["backend", "frontend"]) {
  const destino = fileURLToPath(new URL(`../${pasta}/.env`, import.meta.url));
  if (existsSync(destino)) { console.log(`${pasta}/.env já existe e foi preservado.`); continue; }
  let conteudo = readFileSync(new URL(`../${pasta}/.env.example`, import.meta.url), "utf8");
  if (pasta === "backend") {
    conteudo = conteudo.replace(/^JWT_SECRET=$/m, `JWT_SECRET=${randomBytes(48).toString("hex")}`)
      .replace(/^ADMIN_PASSWORD=$/m, `ADMIN_PASSWORD=${randomBytes(18).toString("base64url")}`);
  }
  writeFileSync(destino, conteudo, { flag: "wx" });
  console.log(`${pasta}/.env criado. Revise os valores locais antes de executar os serviços.`);
}
