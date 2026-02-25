import styles from "./Event.module.css";

export default function Event({ evento, seleccionado, onClick }) {
    const activo = seleccionado?.id === evento.id;

    return (
        <article
            className={`${styles.tarjeta} ${activo ? styles.activo : ""}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
            aria-pressed={activo}
        >
            {/* Imagen */}
            <div className={styles.imagenWrap}>
                <img src={evento.imagen} alt={evento.titulo} className={styles.imagen} />
                <div className={styles.imagenOverlay} />
            </div>

            {/* Contenido */}
            <div className={styles.contenido}>
                <span
                    className={styles.badge}
                    style={{ color: evento.categoriaColor, borderColor: evento.categoriaColor + "55", background: evento.categoriaColor + "18" }}
                >
                    {evento.categoria}
                </span>

                <h3 className={styles.titulo}>{evento.titulo}</h3>

                <div className={styles.fecha}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <rect x="1" y="2" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                        <path d="M1 5h10M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    {evento.fecha.toLocaleDateString("es-CO", {
                        day: "2-digit", month: "short", year: "numeric",
                    })}
                </div>
            </div>
        </article>
    );
}
