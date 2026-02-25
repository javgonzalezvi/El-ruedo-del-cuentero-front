import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
    { label: "Calendario",  pagina: "calendario"  },
    { label: "Noticias",    pagina: "noticias"    },
    { label: "Entrevistas", pagina: "entrevistas" },
    { label: "Acerca de…",  pagina: "acerca"      },
];

const MENU_PERFIL_AUTH = [
    { label: "Mi cuenta",   pagina: "mi-cuenta"   },
    { label: "Mis eventos", pagina: "mis-eventos" },
    { label: "─────────",  pagina: null, separador: true },
    { label: "Cerrar sesión", pagina: "__logout__" },
];

const MENU_PERFIL_ANON = [
    { label: "Iniciar sesión", pagina: "login"    },
    { label: "Registrarse",    pagina: "registro" },
];

export default function Navbar({ onNavigate, paginaActual }) {
    const { usuario, estaLogueado, logout } = useAuth();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickFuera(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setMenuAbierto(false);
            }
        }
        document.addEventListener("mousedown", handleClickFuera);
        return () => document.removeEventListener("mousedown", handleClickFuera);
    }, []);

    async function navegar(e, pagina) {
        e.preventDefault();
        setMenuAbierto(false);
        if (!pagina || pagina === "─────────") return;
        if (pagina === "__logout__") {
            await logout();
            onNavigate("calendario");
            return;
        }
        if (onNavigate) onNavigate(pagina);
    }

    const menuItems = estaLogueado ? MENU_PERFIL_AUTH : MENU_PERFIL_ANON;

    return (
        <header className={styles.navbar}>
            {/* Logo */}
            <div className={styles.logo} onClick={(e) => navegar(e, "calendario")} style={{ cursor: "pointer" }}>
                <div className={styles.logoIcono}>
                    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                        <circle cx="14" cy="14" r="13" stroke="#F5E6C8" strokeWidth="2"/>
                        <path d="M8 14 Q14 6 20 14 Q14 22 8 14Z" fill="#C8572A"/>
                        <circle cx="14" cy="14" r="3" fill="#F5E6C8"/>
                    </svg>
                </div>
                <div>
                    <span className={styles.logoNombre}>El Ruedo del Cuentero</span>
                    <span className={styles.logoSub}>Narración Oral</span>
                </div>
            </div>

            {/* Links de navegación */}
            <nav className={styles.navLinks} aria-label="Navegación principal">
                {NAV_LINKS.map(({ label, pagina }) => (
                <a key={label} href="#"
                    onClick={(e) => navegar(e, pagina)}
                    className={`${styles.navLink} ${paginaActual === pagina ? styles.navLinkActivo : ""}`}
                    aria-current={paginaActual === pagina ? "page" : undefined}>
                    {label}
                </a>
                ))}
            </nav>

            {/* Perfil / Auth */}
            <div className={styles.perfilWrapper} ref={dropdownRef}>
                <button
                className={styles.perfilBtn}
                onClick={() => setMenuAbierto(v => !v)}
                aria-expanded={menuAbierto}
                aria-label="Menú de perfil"
                >
                    <div className={styles.avatar}>
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="7" r="4" fill="#F5E6C8"/>
                            <path d="M2 19c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#F5E6C8" strokeWidth="2" fill="none"/>
                        </svg>
                    </div>
                    <div className={styles.perfilInfo}>
                        <span className={styles.perfilNombre}>
                            {estaLogueado ? usuario?.nombres : "Mi Perfil"}
                        </span>
                        <span className={styles.perfilRol}>
                            {estaLogueado ? usuario?.rol : "Invitado"}
                        </span>
                    </div>
                    <svg className={`${styles.chevron} ${menuAbierto ? styles.chevronOpen : ""}`}
                        width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 5l4 4 4-4" stroke="#C8A882" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </button>

                {menuAbierto && (
                <div className={styles.dropdown} role="menu">
                    {menuItems.map(({ label, pagina, separador }) =>
                    separador ? (
                        <div key={label} className={styles.dropdownSeparador} />
                    ) : (
                        <a key={label} href="#"
                            onClick={(e) => navegar(e, pagina)}
                            className={`${styles.dropdownItem} ${pagina === "__logout__" ? styles.dropdownLogout : ""}`}
                            role="menuitem">
                            {label}
                        </a>
                    )
                    )}
                </div>
                )}
            </div>
        </header>
    );
}
