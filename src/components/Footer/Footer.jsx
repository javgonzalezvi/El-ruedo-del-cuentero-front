import styles from "./Footer.module.css";

const REDES = [
    {
        nombre: "Facebook",
        href: "#",
        icono: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
        ),
    },

    {
        nombre: "Instagram",
        href: "#",
        icono: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
        ),
    },
    
    {
        nombre: "YouTube",
        href: "#",
        icono: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
            </svg>
        ),
    },

    {
        nombre: "TikTok",
        href: "#",
        icono: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34v-7a8.16 8.16 0 004.77 1.52V6.38a4.85 4.85 0 01-1-.31z"/>
        </svg>
        ),
    },
];

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>

            {/* Logo */}
            <div className={styles.logo}>
                <div className={styles.logoIcono}>
                    <svg width="20" height="20" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                        <circle cx="14" cy="14" r="13" stroke="#F5E6C8" strokeWidth="1.5"/>
                        <path d="M8 14 Q14 6 20 14 Q14 22 8 14Z" fill="#C8572A"/>
                        <circle cx="14" cy="14" r="3" fill="#F5E6C8"/>
                    </svg>
                </div>
                <div>
                    <span className={styles.logoNombre}>El Ruedo del Cuentero</span>
                    <span className={styles.logoSub}>Narración Oral Colombiana</span>
                </div>
            </div>

            {/* Copyright */}
            <p className={styles.copyright}>
                © 2024 El Ruedo del Cuentero · Todos los derechos reservados
            </p>

            {/* Redes sociales */}
                <nav className={styles.redes} aria-label="Redes sociales">
                    {REDES.map((red) => (
                    <a
                        key={red.nombre}
                        href={red.href}
                        className={styles.redLink}
                        aria-label={red.nombre}
                        title={red.nombre}
                    >
                        {red.icono}
                    </a>
                    ))}
                </nav>

            </div>
        </footer>
    );
}