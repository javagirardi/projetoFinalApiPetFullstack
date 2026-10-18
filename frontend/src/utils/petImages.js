// Fotos já referenciadas no projeto local anterior, preservadas em public/images.
const arquivos = {
  "photo-1548199973-03cce0bbc87b": "amora", "photo-1505628346881-b72b27e84530": "bento",
  "photo-1552053831-71594a27632d": "rex", "photo-1477884213360-7e9d7dcc1e48": "mel",
  "photo-1568393691622-c7ba131d63b4": "zeus", "photo-1605568427561-40dd23c2acea": "pandora",
  "photo-1530281700549-e82e7bf110d6": "nico", "photo-1574158622682-e40e69881006": "mimi",
};
export function resolverFotoPet(src) {
  try {
    const url = new URL(src);
    const arquivo = url.hostname === "images.unsplash.com" && arquivos[url.pathname.slice(1)];
    return arquivo ? `/images/pets/${arquivo}.webp` : src;
  } catch { return src; }
}
