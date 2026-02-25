import { EQUIPO, MISION } from "../../data/acercaDe";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import styles from "./PaginaAcercaDe.module.css";

function TarjetaMiembro({ miembro }) {
  return (
    <div className={styles.tarjeta}>
      <div className={styles.avatarWrap}>
        <img src={miembro.imagen} alt={miembro.nombre} className={styles.avatar} />
        <div className={styles.avatarRing} />
      </div>
      <h3 className={styles.nombre}>{miembro.nombre}</h3>
      <span className={styles.rol}>{miembro.rol}</span>
      <p className={styles.bio}>{miembro.bio}</p>
      <div className={styles.redes}>
        <a href={miembro.redes.instagram} className={styles.redBtn} title="Instagram">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="5"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </a>
        <a href={miembro.redes.linkedin} className={styles.redBtn} title="LinkedIn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function PaginaAcercaDe({ onNavigate }) {
  return (
    <div className={styles.root}>
      <Navbar onNavigate={onNavigate} paginaActual="acerca" />

      <main className={styles.main}>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroOrnamento} aria-hidden="true">✦</div>
          <h1 className={styles.heroTitulo}>Acerca de El Ruedo</h1>
          <div className={styles.heroSeparador} aria-hidden="true" />
          <p className={styles.heroMision}>{MISION}</p>
        </section>

        {/* ── Equipo ── */}
        <section className={styles.equipo}>
          <h2 className={styles.equipoTitulo}>Nuestro Equipo</h2>
          <div className={styles.grid}>
            {EQUIPO.map(m => <TarjetaMiembro key={m.id} miembro={m} />)}
          </div>
        </section>

        {/* ── Pie informativo ── */}
        <section className={styles.pie}>
          <p className={styles.pieTexto}>
            ¿Quieres colaborar con nosotros? Escríbenos a{" "}
            <a href="mailto:hola@elruedo.co" className={styles.pieLink}>hola@elruedo.co</a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
