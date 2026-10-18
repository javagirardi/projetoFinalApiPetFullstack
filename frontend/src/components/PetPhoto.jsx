import { useEffect, useState } from "react";
export default function PetPhoto({ src, nome, className = "card-imagem" }) {
  const [erro, setErro] = useState(false);
  useEffect(() => setErro(false), [src]);
  return src && !erro ? <img className={className} src={src} alt={nome} onError={() => setErro(true)} />
    : <div className={`${className} foto-vazia`} role="img" aria-label={`Sem foto de ${nome}`}><span aria-hidden="true">🐾</span><small>Foto indisponível</small></div>;
}
