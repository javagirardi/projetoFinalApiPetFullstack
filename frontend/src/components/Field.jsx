export default function Field({ name, label, erros = {}, children, ...props }) {
  const erro = erros[name];
  const inputProps = { id: name, name, className: "campo-input", "aria-invalid": Boolean(erro), "aria-describedby": erro ? `${name}-erro` : undefined, ...props };
  return <div className="campo-grupo"><label className="campo-label" htmlFor={name}>{label}</label>
    {typeof children === "function" ? children(inputProps) : <input {...inputProps} />}
    {erro && <span className="erro-campo" id={`${name}-erro`}>{erro}</span>}
  </div>;
}
