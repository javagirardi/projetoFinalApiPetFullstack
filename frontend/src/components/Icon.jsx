const paths = {
  paw: <><ellipse cx="8" cy="7" rx="2" ry="3" transform="rotate(-25 8 7)"/><ellipse cx="16" cy="7" rx="2" ry="3" transform="rotate(25 16 7)"/><ellipse cx="3.5" cy="12" rx="1.8" ry="2.5" transform="rotate(-30 3.5 12)"/><ellipse cx="20.5" cy="12" rx="1.8" ry="2.5" transform="rotate(30 20.5 12)"/><path d="M12 12c-3.2 0-6.5 4-6.5 6.5 0 4 4.2 2 6.5 2s6.5 2 6.5-2C18.5 16 15.2 12 12 12Z"/></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
  back: <path d="M19 12H5m6-6-6 6 6 6"/>,
  logout: <><path d="M9 4H5v16h4m5-13 5 5-5 5m-5-5h10"/></>,
  edit: <><path d="m16 3 5 5-12 12-6 1 1-6L16 3Zm-3 3 5 5"/></>,
  archive: <><rect x="3" y="3" width="18" height="5" rx="1"/><path d="M5 8v13h14V8m-10 4h6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  shield: <><path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z"/><path d="m8 12 3 3 5-6"/></>,
  size: <><path d="M4 8V4h4m8 0h4v4m0 8v4h-4M8 20H4v-4M4 4l6 6m10-6-6 6m6 10-6-6M4 20l6-6"/></>,
};
export default function Icon({ name = "paw", size = 20, className = "" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" className={`icone ${className}`} aria-hidden="true" focusable="false" fill={name === "paw" ? "currentColor" : "none"} stroke={name === "paw" ? "none" : "currentColor"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.paw}</svg>;
}
