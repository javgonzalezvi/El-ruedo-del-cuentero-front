import styles from "./TarjetaNoticia.module.css";

export default function TarjetaNoticia({ noticia, seleccionada, onClick }) {
  const activa = seleccionada?.id === noticia.id;

  const fechaFormateada = noticia.fechaPublicacion.toLocaleDateString("es-CO", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <article
      className={`${styles.tarjeta} ${activa ? styles.activa : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-pressed={activa}
    >
      {/* Imagen */}
      <div className={styles.imagenWrap}>
        <img src={noticia.imagenPortada} alt={noticia.titulo} className={styles.imagen} />
        <div className={styles.overlay} />
      </div>

      {/* Contenido */}
      <div className={styles.contenido}>
        <span
          className={styles.categoria}
          style={{
            color: noticia.categoriaColor,
            background: noticia.categoriaColor + "18",
            borderColor: noticia.categoriaColor + "55",
          }}
        >
          {noticia.categoria}
        </span>

        <h3 className={styles.titulo}>{noticia.titulo}</h3>
        <p className={styles.resumen}>{noticia.resumen}</p>

        {/* Meta */}
        <div className={styles.meta}>
          <img
            src={noticia.autor.avatar}
            alt={noticia.autor.nombre}
            className={styles.avatar}
          />
          <div className={styles.metaTexto}>
            <span className={styles.autorNombre}>{noticia.autor.nombre}</span>
            <span className={styles.metaInfo}>
              {fechaFormateada} · {noticia.tiempoLectura} min de lectura
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
