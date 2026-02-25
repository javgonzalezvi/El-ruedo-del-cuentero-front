import { useState } from "react";
import Event from "./Event";
import styles from "./Leftbar.module.css";

export default function Leftbar({ eventos, eventoSeleccionado, setEventoSeleccionado }) {
    const [busqueda, setBusqueda] = useState("");

    const filtrados = eventos
        .filter((e) =>
            e.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
            e.categoria.toLowerCase().includes(busqueda.toLowerCase())
        )
        .sort((a, b) => a.fecha - b.fecha);

    return (
        <aside className={styles.panel}>
            <h2 className={styles.titulo}>Próximos Eventos</h2>

            {/* ── Buscador ── */}
            <div className={styles.buscadorWrap}>
                <svg className={styles.buscadorIcono} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                    type="search"
                    placeholder="Buscar eventos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className={styles.buscador}
                    aria-label="Buscar eventos"
                />
            </div>

            {/* ── Lista de eventos ── */}
            <div className={styles.lista}>
                {filtrados.length === 0 ? (
                <p className={styles.sinResultados}>No se encontraron eventos.</p>
                ) : (
                    filtrados.map((ev) => (
                        <Event
                            key={ev.id}
                            evento={ev}
                            seleccionado={eventoSeleccionado}
                            onClick={() => setEventoSeleccionado(ev)}
                        />
                    ))
                )}
            </div>
        </aside>
    );
}
