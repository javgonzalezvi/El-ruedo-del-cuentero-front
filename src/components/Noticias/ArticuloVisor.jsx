import styles from "./ArticuloVisor.module.css";

/* ── Renderizador de bloques de contenido ── */
function BloqueContenido({ bloque }) {
  switch (bloque.tipo) {
    case "parrafo":
      return <p className={styles.parrafo}>{bloque.texto}</p>;

    case "subtitulo":
      return <h2 className={styles.subtitulo}>{bloque.texto}</h2>;

    case "imagen":
      return (
        <figure className={styles.figura}>
          <img src={bloque.src} alt={bloque.pie} className={styles.figuraImg} />
          {bloque.pie && (
            <figcaption className={styles.figuraPie}>{bloque.pie}</figcaption>
          )}
        </figure>
      );

    case "cita":
      return (
        <blockquote className={styles.cita}>
          <p className={styles.citaTexto}>"{bloque.texto}"</p>
          {bloque.autor && (
            <cite className={styles.citaAutor}>— {bloque.autor}</cite>
          )}
        </blockquote>
      );

    default:
      return null;
  }
}

/* ── Estado vacío ── */
function EstadoVacio() {
  return (
    <div className={styles.vacio}>
      <span className={styles.vacioIcono} aria-hidden="true">📰</span>
      <p className={styles.vacioTexto}>
        Selecciona un artículo de la lista para comenzar a leer.
      </p>
    </div>
  );
}

/* ── Componente principal ── */
export default function ArticuloVisor({ noticia }) {
  if (!noticia) return (
    <main className={styles.visor}>
      <EstadoVacio />
    </main>
  );

  const fechaFormateada = noticia.fechaPublicacion.toLocaleDateString("es-CO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main className={styles.visor} key={noticia.id}>
      <article className={styles.articulo}>

        {/* ── Imagen de portada ── */}
        <div className={styles.portadaWrap}>
          <img
            src={noticia.imagenPortada}
            alt={noticia.titulo}
            className={styles.portada}
          />
          <div className={styles.portadaOverlay} />
          {/* Categoría sobre la imagen */}
          <span
            className={styles.categoriaBadge}
            style={{ background: noticia.categoriaColor }}
          >
            {noticia.categoria}
          </span>
        </div>

        {/* ── Cabecera del artículo ── */}
        <div className={styles.cabecera}>
          <h1 className={styles.titulo}>{noticia.titulo}</h1>
          <p className={styles.resumen}>{noticia.resumen}</p>

          {/* Info del autor */}
          <div className={styles.autorBloque}>
            <img
              src={noticia.autor.avatar}
              alt={noticia.autor.nombre}
              className={styles.autorAvatar}
            />
            <div className={styles.autorInfo}>
              <span className={styles.autorNombre}>{noticia.autor.nombre}</span>
              <span className={styles.autorRol}>{noticia.autor.rol}</span>
              <span className={styles.autorMeta}>
                {fechaFormateada} · {noticia.tiempoLectura} minutos de lectura
              </span>
            </div>
          </div>

          {/* Separador decorativo */}
          <div className={styles.separador} aria-hidden="true">
            <span className={styles.separadorLinea} />
            <span className={styles.separadorOrnamento}>✦</span>
            <span className={styles.separadorLinea} />
          </div>
        </div>

        {/* ── Cuerpo del artículo (bloques de contenido) ── */}
        <div className={styles.cuerpo}>
          {noticia.contenido.map((bloque, i) => (
            <BloqueContenido key={i} bloque={bloque} />
          ))}
        </div>

        {/* ── Pie del artículo ── */}
        <footer className={styles.piePagina}>
          <div className={styles.separador} aria-hidden="true">
            <span className={styles.separadorLinea} />
            <span className={styles.separadorOrnamento}>✦</span>
            <span className={styles.separadorLinea} />
          </div>
          <p className={styles.pieTexto}>
            Publicado en <strong>El Ruedo del Cuentero</strong> el {fechaFormateada}.
          </p>

          {/* Compartir */}
          <div className={styles.compartir}>
            <span className={styles.compartirLabel}>Compartir:</span>
            {["Facebook", "Twitter / X", "WhatsApp"].map((red) => (
              <button key={red} className={styles.compartirBtn}>
                {red}
              </button>
            ))}
          </div>
        </footer>

      </article>
    </main>
  );
}