import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolverFotoPet } from "../src/utils/petImages.js";

test("fotografias do projeto anterior possuem cópias WebP disponíveis na entrega", async () => {
  const fotos = ["1548199973-03cce0bbc87b", "1505628346881-b72b27e84530", "1552053831-71594a27632d", "1477884213360-7e9d7dcc1e48", "1568393691622-c7ba131d63b4", "1605568427561-40dd23c2acea", "1530281700549-e82e7bf110d6", "1574158622682-e40e69881006"];
  for (const id of fotos) {
    const arquivo = resolverFotoPet(`https://images.unsplash.com/photo-${id}?w=400`);
    assert.ok(arquivo.startsWith("/images/pets/"));
    const bytes = await readFile(new URL(`../public${arquivo}`, import.meta.url));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  }
});

test("fotos novas e registros sem foto não recebem imagens de outro pet", () => {
  for (const src of [null, undefined, "", "https://example.com/meu-pet.jpg", "https://images.unsplash.com/photo-outro-pet", "https://images.unsplash.com.example.com/photo-1552053831-71594a27632d"]) {
    assert.equal(resolverFotoPet(src), src);
  }
});
