import { useState } from "react";
import { MESES, DIAS_SEMANA, obtenerDiasDelMes } from "../../data/eventos";
import styles from "./Calendar.module.css";

const VISTAS = ["Mes", "Semana", "Día"];

export default function Calendar({ eventos, eventoSeleccionado, setEventoSeleccionado }) {
    const hoy = new Date();
    const [mesActual, setMesActual] = useState(hoy.getMonth());
    const [anioActual, setAnioActual] = useState(hoy.getFullYear());
    const [vista, setVista] = useState("Mes");

    const { primerDia, totalDias } = obtenerDiasDelMes(anioActual, mesActual);

    function anteriorMes() {
        if (mesActual === 0) { setMesActual(11); setAnioActual((a) => a - 1); }
        else setMesActual((m) => m - 1);
    }

    function siguienteMes() {
        if (mesActual === 11) { setMesActual(0); setAnioActual((a) => a + 1); }
        else setMesActual((m) => m + 1);
    }

    function eventosDelDia(dia) {
        return eventos.filter(
            (ev) =>
                ev.fecha.getDate() === dia &&
                ev.fecha.getMonth() === mesActual &&
                ev.fecha.getFullYear() === anioActual
            );
    }

    const esHoy = (dia) =>
        dia === hoy.getDate() &&
        mesActual === hoy.getMonth() &&
        anioActual === hoy.getFullYear();

    /* Construir celdas: nulls para los días vacíos al inicio */
    const celdas = [
        ...Array(primerDia).fill(null),
        ...Array.from({ length: totalDias }, (_, i) => i + 1),
    ];

    return (
        <section className={styles.panel}>
            {/* ── Cabecera ── */}
            <div className={styles.cabecera}>
                <h2 className={styles.mesTitulo}>
                    {MESES[mesActual]} {anioActual}
                </h2>

                <div className={styles.navMes}>
                    <button onClick={anteriorMes} className={styles.btnNav} aria-label="Mes anterior">‹</button>
                    <button onClick={siguienteMes} className={styles.btnNav} aria-label="Mes siguiente">›</button>
                </div>

                <div className={styles.vistaSelector} role="group" aria-label="Tipo de vista">
                    {VISTAS.map((v) => (
                        <button
                            key={v}
                            onClick={() => setVista(v)}
                            className={`${styles.btnVista} ${vista === v ? styles.btnVistaActivo : ""}`}
                            aria-pressed={vista === v}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Días de la semana ── */}
            <div className={styles.grid7}>
                {DIAS_SEMANA.map((d) => (
                    <div key={d} className={styles.diaSemana}>{d}</div>
                ))}
            </div>

            {/* ── Celdas del mes ── */}
            <div className={styles.grid7}>
                {celdas.map((dia, idx) => {
                    const evs = dia ? eventosDelDia(dia) : [];
                    return (
                        <div
                            key={idx}
                            className={`${styles.celda} ${dia && esHoy(dia) ? styles.celdaHoy : ""}`}
                        >
                            {dia && (
                                <>
                                    <span className={`${styles.numDia} ${esHoy(dia) ? styles.numDiaHoy : ""}`}>
                                        {dia}
                                    </span>
                                    <div className={styles.chipsWrap}>
                                        {evs.map((ev) => (
                                            <button
                                                key={ev.id}
                                                onClick={() => setEventoSeleccionado(ev)}
                                                className={styles.chip}
                                                style={{
                                                    background: ev.categoriaColor,
                                                    boxShadow: eventoSeleccionado?.id === ev.id
                                                    ? `0 0 0 2px var(--color-ink), 0 0 0 4px ${ev.categoriaColor}`
                                                    : "none",
                                                }}
                                                title={ev.titulo}
                                                aria-label={`Evento: ${ev.titulo}`}
                                            >
                                                {ev.titulo.slice(0, 13)}…
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
