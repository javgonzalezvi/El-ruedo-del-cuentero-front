import styles from "./TarjetaEntrevista.module.css";

/**
 * TarjetaEntrevista.jsx
 *
 * Card individual en el panel izquierdo de la sección Entrevistas.
 * Muestra imagen del entrevistado, duración del audio, categoría,
 * título, nombre + rol del entrevistado y fecha de publicación.
 *
 * Props:
 *   entrevista   — objeto del array ENTREVISTAS
 *   seleccionada — entrevista actualmente activa (para resaltar)
 *   onClick      — callback al seleccionar la tarjeta
 */

export default function TarjetaEntrevista({ entrevista, seleccionada, onClick }) {
    const activa = seleccionada?.id === entrevista.id;

    const fecha = entrevista.fecha.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (
        <article
            className={`${styles.tarjeta} ${activa ? styles.activa : ""}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
            aria-pressed={activa}
            aria-label={`Entrevista: ${entrevista.titulo}`}
        >
            {/* ── Imagen con overlays ── */}
            <div className={styles.imagenWrap}>
                <img
                    src={entrevista.imagen}
                    alt={entrevista.entrevistado}
                    className={styles.imagen}
                />

                {/* Degradado oscuro inferior */}
                <div className={styles.overlay} />

                {/* Chip de duración — esquina inferior derecha */}
                <span className={styles.duracion}>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.3" fill="none"/>
                        <path d="M6 3v3l2 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    {entrevista.duracion}
                </span>

                {/* Indicador de reproducción cuando está activa */}
                {activa && (
                <div className={styles.reproduciendo} aria-label="Reproduciendo">
                    <span className={styles.onda} />
                    <span className={styles.onda} />
                    <span className={styles.onda} />
                </div>
                )}
            </div>

            {/* ── Contenido textual ── */}
            <div className={styles.contenido}>

                {/* Badge de categoría con color dinámico */}
                <span
                    className={styles.cat}
                    style={{
                        color:       entrevista.categoriaColor,
                        background:  entrevista.categoriaColor + "18",
                        borderColor: entrevista.categoriaColor + "44",
                    }}
                >
                {entrevista.categoria}
                </span>

                {/* Título */}
                <h3 className={styles.titulo}>{entrevista.titulo}</h3>

                {/* Separador con avatar + nombre + rol */}
                <div className={styles.autorFila}>
                    <img
                        src={entrevista.imagen}
                        alt={entrevista.entrevistado}
                        className={styles.autorAvatar}
                    />
                    <div className={styles.autorTexto}>
                        <span className={styles.autorNombre}>{entrevista.entrevistado}</span>
                        <span className={styles.autorRol}>{entrevista.rol}</span>
                    </div>
                </div>

                {/* Fecha de publicación */}
                <p className={styles.fecha}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <rect x="1" y="2" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                        <path d="M1 5h10M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    {fecha}
                </p>
            </div>
        </article>
    );
}