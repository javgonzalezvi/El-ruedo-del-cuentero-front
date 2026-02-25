import ReproductorAudio from "./ReproductorAudio";
import styles from "./EntrevistaVisor.module.css";

function EstadoVacio() {
  return (
    <div className={styles.vacio}>
      <span aria-hidden="true" className={styles.vacioIcono}>🎙️</span>
      <p className={styles.vacioTexto}>Selecciona una entrevista para escucharla.</p>
    </div>
  );
}

export default function EntrevistaVisor({ entrevista }) {
  if (!entrevista) {
    return <main className={styles.visor}><EstadoVacio /></main>;
  }

  const fecha = entrevista.fecha.toLocaleDateString("es-CO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main className={styles.visor} key={entrevista.id}>
      <div className={styles.contenedor}>

        {/* Imagen principal */}
        <div className={styles.imagenWrap}>
          <img src={entrevista.imagen} alt={entrevista.entrevistado} className={styles.imagen} />
          <div className={styles.imagenOverlay} />
          <span className={styles.catBadge} style={{ background: entrevista.categoriaColor }}>
            {entrevista.categoria}
          </span>
        </div>

        {/* Encabezado */}
        <div className={styles.encabezado}>
          <h1 className={styles.titulo}>{entrevista.titulo}</h1>

          {/* Datos del creador — fuente menor al título */}
          <div className={styles.creadorBloque}>
            <img
              src={entrevista.imagen}
              alt={entrevista.entrevistado}
              className={styles.creadorAvatar}
            />
            <div className={styles.creadorInfo}>
              <span className={styles.creadorNombre}>{entrevista.entrevistado}</span>
              <span className={styles.creadorRol}>{entrevista.rol}</span>
              <span className={styles.creadorMeta}>
                Publicada el {fecha} · {entrevista.duracion} min
              </span>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <p className={styles.descripcion}>{entrevista.descripcionLarga}</p>

        {/* Reproductor envuelto con padding propio */}
        <div className={styles.reproductorWrap}>
          <ReproductorAudio entrevista={entrevista} />
        </div>

        {/* Extracto */}
        <div className={styles.resumenWrap}>
          <h2 className={styles.resumenTitulo}>Sobre esta entrevista</h2>
          <p className={styles.resumenTexto}>{entrevista.resumen}</p>
        </div>

      </div>
    </main>
  );
}