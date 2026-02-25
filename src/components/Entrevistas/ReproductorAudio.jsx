import { useState, useRef, useEffect } from "react";
import styles from "./ReproductorAudio.module.css";

function formatTiempo(seg) {
  const m = Math.floor(seg / 60).toString().padStart(2, "0");
  const s = Math.floor(seg % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ReproductorAudio({ entrevista }) {
  const [reproduciendo, setReproduciendo] = useState(false);
  const [progreso, setProgreso] = useState(0);        // 0-1
  const [tiempoActual, setTiempoActual] = useState(0);
  const [volumen, setVolumen] = useState(0.8);
  const [silenciado, setSilenciado] = useState(false);
  const audioRef = useRef(null);
  const barraRef = useRef(null);

  // Duración simulada desde string "MM:SS"
  const [m, s] = entrevista.duracion.split(":").map(Number);
  const duracionTotal = m * 60 + s;

  useEffect(() => {
    setReproduciendo(false);
    setProgreso(0);
    setTiempoActual(0);
  }, [entrevista.id]);

  // Simulación de progreso (sin audio real)
  useEffect(() => {
    if (!reproduciendo) return;
    const intervalo = setInterval(() => {
      setTiempoActual((t) => {
        const nuevo = t + 1;
        if (nuevo >= duracionTotal) { setReproduciendo(false); return duracionTotal; }
        setProgreso(nuevo / duracionTotal);
        return nuevo;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [reproduciendo, duracionTotal]);

  function togglePlay() { setReproduciendo((v) => !v); }

  function saltar(segundos) {
    setTiempoActual((t) => {
      const nuevo = Math.max(0, Math.min(duracionTotal, t + segundos));
      setProgreso(nuevo / duracionTotal);
      return nuevo;
    });
  }

  function clicBarra(e) {
    const rect = barraRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const nuevo = Math.max(0, Math.min(1, ratio));
    setProgreso(nuevo);
    setTiempoActual(Math.floor(nuevo * duracionTotal));
  }

  return (
    <div className={styles.reproductor}>
      {/* Barra de progreso */}
      <div className={styles.barraWrap} ref={barraRef} onClick={clicBarra} role="slider"
        aria-label="Progreso del audio" aria-valuenow={Math.round(progreso * 100)}>
        <div className={styles.barra}>
          <div className={styles.barraRelleno} style={{ width: `${progreso * 100}%` }} />
          <div className={styles.barraCursor} style={{ left: `${progreso * 100}%` }} />
        </div>
      </div>

      {/* Tiempos */}
      <div className={styles.tiempos}>
        <span>{formatTiempo(tiempoActual)}</span>
        <span>{entrevista.duracion}</span>
      </div>

      {/* Controles */}
      <div className={styles.controles}>
        {/* Retroceder 15s */}
        <button className={styles.btnControl} onClick={() => saltar(-15)} title="Retroceder 15s">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="currentColor"/>
            <text x="8.5" y="15" fontSize="5.5" fill="white" fontFamily="sans-serif" fontWeight="bold">15</text>
          </svg>
        </button>

        {/* Play / Pause */}
        <button className={styles.btnPlay} onClick={togglePlay} aria-label={reproduciendo ? "Pausar" : "Reproducir"}>
          {reproduciendo ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Adelantar 15s */}
        <button className={styles.btnControl} onClick={() => saltar(15)} title="Adelantar 15s">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" fill="currentColor"/>
            <text x="8.5" y="15" fontSize="5.5" fill="white" fontFamily="sans-serif" fontWeight="bold">15</text>
          </svg>
        </button>

        {/* Volumen */}
        <div className={styles.volumenWrap}>
          <button className={styles.btnControl} onClick={() => setSilenciado(v => !v)} title="Silenciar">
            {silenciado || volumen === 0 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
            )}
          </button>
          <input type="range" min="0" max="1" step="0.05"
            value={silenciado ? 0 : volumen}
            onChange={(e) => { setVolumen(+e.target.value); setSilenciado(false); }}
            className={styles.sliderVolumen}
            aria-label="Volumen"
          />
        </div>
      </div>

      {/* Nota: sin audio real */}
      <p className={styles.nota}>
        ▸ Reproducción simulada — integrar URL de audio en producción
      </p>
    </div>
  );
}
