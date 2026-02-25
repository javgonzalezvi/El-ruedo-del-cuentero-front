import { useState } from "react";
import TarjetaNoticia from "./TarjetaNoticia";
import styles from "./PanelNoticias.module.css";

const CATEGORIAS = ["Todas", "CRÓNICA", "GUÍA", "EVENTO", "REPORTAJE"];

export default function PanelNoticias({ noticias, noticiaSeleccionada, setNoticiaSeleccionada }) {
    const [busqueda, setBusqueda] = useState("");
    const [categoriaActiva, setCategoriaActiva] = useState("Todas");

    const filtradas = noticias
        .filter((n) => {
            const coincideBusqueda =
                n.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                n.autor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                n.resumen.toLowerCase().includes(busqueda.toLowerCase());

            const coincideCategoria =
                categoriaActiva === "Todas" || n.categoria === categoriaActiva;

            return coincideBusqueda && coincideCategoria;
        })
        .sort((a, b) => b.fechaPublicacion - a.fechaPublicacion);

    return (
        <aside className={styles.panel}>
            <h2 className={styles.titulo}>Noticias</h2>

            {/* ── Buscador ── */}
            <div className={styles.buscadorWrap}>
                <svg className={styles.buscadorIcono} width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                    type="search"
                    placeholder="Buscar artículos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className={styles.buscador}
                    aria-label="Buscar artículos"
                />
            </div>

            {/* ── Filtros por categoría ── */}
            <div className={styles.filtros} role="group" aria-label="Filtrar por categoría">
                {CATEGORIAS.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategoriaActiva(cat)}
                        className={`${styles.filtroBadge} ${categoriaActiva === cat ? styles.filtroBadgeActivo : ""}`}
                        aria-pressed={categoriaActiva === cat}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ── Lista de artículos ── */}
            <div className={styles.lista}>
                {filtradas.length === 0 ? (
                <p className={styles.sinResultados}>No se encontraron artículos.</p>
                ) : (
                    filtradas.map((noticia) => (
                        <TarjetaNoticia
                            key={noticia.id}
                            noticia={noticia}
                            seleccionada={noticiaSeleccionada}
                            onClick={() => setNoticiaSeleccionada(noticia)}
                        />
                    ))
                )}
            </div>
        </aside>
    );
}
