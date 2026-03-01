/**
 * PaginaAcercaDe.jsx
 * Layout: panel izquierdo (creador) + contenido central (misión + galería)
 */

import { CREADOR, MISION, IMAGENES_PROYECTO } from "../../data/acercaDe";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import styles from "./PaginaAcercaDe.module.css";

/* ── Íconos de redes ── */
function IconoInstagram() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function IconoFacebook() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  );
}

/* ── Panel izquierdo: el creador ── */
function PanelCreador() {
  return (
    <aside className={styles.panel}>
      <div className={styles.panelContenido}>

        {/* Foto */}
        <div className={styles.fotoWrap}>
          <img
            src={CREADOR.imagen}
            alt={CREADOR.nombre}
            className={styles.foto}
            onError={e => { e.target.style.display = "none"; }}
          />
          <div className={styles.fotoRing} />
        </div>

        {/* Nombre y rol */}
        <h2 className={styles.nombre}>{CREADOR.nombre}</h2>
        <p className={styles.rol}>{CREADOR.rol}</p>

        <div className={styles.separador} />

        {/* Biografía */}
        {CREADOR.bio && (
          <p className={styles.bio}>{CREADOR.bio}</p>
        )}

        {/* Redes sociales */}
        <div className={styles.redes}>
          {CREADOR.redes.instagram && (
            <a href={CREADOR.redes.instagram} className={styles.redBtn}
              target="_blank" rel="noopener noreferrer" title="Instagram">
              <IconoInstagram />
              <span>Instagram</span>
            </a>
          )}
          {CREADOR.redes.facebook && (
            <a href={CREADOR.redes.facebook} className={styles.redBtn}
              target="_blank" rel="noopener noreferrer" title="Facebook">
              <IconoFacebook />
              <span>Facebook</span>
            </a>
          )}
        </div>

      </div>
    </aside>
  );
}

/* ── Contenido central ── */
function Contenido() {
  return (
    <main className={styles.contenido}>

      {/* Cabecera */}
      <div className={styles.cabecera}>
        <div className={styles.ornamento} aria-hidden="true">❧</div>
        <h1 className={styles.titulo}>Acerca de El Ruedo</h1>
        <div className={styles.separadorTitulo} />
        <p className={styles.mision}>{MISION}</p>
      </div>

      {/* Galería de imágenes del proyecto */}
      {IMAGENES_PROYECTO.length > 0 && (
        <section className={styles.galeria}>
          <h2 className={styles.galeriaTitulo}>El proyecto</h2>
          <div className={styles.galeriaGrid}>
            {IMAGENES_PROYECTO.map((img, i) => (
              <div key={i} className={styles.galeriaItem}>
                <img src={img.src} alt={img.alt} className={styles.galeriaImg} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contacto */}
      <div className={styles.contacto}>
        <p className={styles.contactoTexto}>
          ¿Quieres colaborar o tienes alguna pregunta?{" "}
          <a href="https://www.instagram.com/eltigrenanez/"
            className={styles.contactoLink}
            target="_blank" rel="noopener noreferrer">
            Escríbenos en Instagram
          </a>
        </p>
      </div>

    </main>
  );
}

export default function PaginaAcercaDe({ onNavigate, paginaActual }) {
  return (
    <div className={styles.root}>
      <Navbar onNavigate={onNavigate} paginaActual={paginaActual} />
      <div className={styles.layout}>
        <PanelCreador />
        <Contenido />
      </div>
      <Footer />
    </div>
  );
}