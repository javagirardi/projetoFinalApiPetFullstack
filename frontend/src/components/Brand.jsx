import { Link } from "react-router-dom";
import { ROTAS } from "@lab365/contracts";
import Icon from "./Icon.jsx";

export default function Brand() {
  return <Link className="marca" to={ROTAS.HOME} aria-label="Lab365PetAmigo — início"><span className="marca-simbolo"><Icon size={25} /></span><span className="marca-nome"><span>Lab365</span>PetAmigo<span className="marca-ponto">.</span></span></Link>;
}
