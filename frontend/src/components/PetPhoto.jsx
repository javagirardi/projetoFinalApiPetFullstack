import { useEffect, useState } from "react";
import { resolverFotoPet } from "../utils/petImages.js";
import Icon from "./Icon.jsx";
export default function PetPhoto({ src, nome, className = "card-imagem", onUnavailable }) {
  const [erro, setErro] = useState(false);
  useEffect(() => setErro(false), [src]);
  return src && !erro ? <img className={className} src={resolverFotoPet(src)} alt={nome} loading="lazy" onError={() => { setErro(true); onUnavailable?.(); }} />
    : <div className={`${className} foto-vazia`} role="img" aria-label={`Sem foto de ${nome}`}><Icon size={44} /><small>Foto indisponível</small></div>;
}
