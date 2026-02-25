import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usuarioAPI } from "../../services/api";
import styles from "./PanelDetailed.module.css";

/* ── Íconos SVG ── */
function IconoCalendario() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M2 7h14M6 1v3M12 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconoLugar() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2C6.24 2 4 4.24 4 7c0 4 5 9 5 9s5-5 5-9c0-2.76-2.24-5-5-5Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

function IconoCompartir() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="13" cy="3" r="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <circle cx="13" cy="13" r="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <circle cx="3" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M5 7l6-3M5 9l6 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function EstadoVacio() {
  return (
    <div className={styles.vacio}>
      <span aria-hidden="true">📖</span>
      <p className={styles.vacioTexto}>
        Selecciona un evento del calendario o de la lista para ver su información detallada.
      </p>
    </div>
  );
}

export default function PanelDetalle({ evento, onNavigate }) {
  const { estaLogueado } = useAuth();

  const [guardado,   setGuardado]   = useState(false);
  const [idRelacion, setIdRelacion] = useState(null);
  const [cargando,   setCargando]   = useState(false);
  const [mensaje,    setMensaje]    = useState("");

  // Al cambiar de evento, verificar si ya está guardado
  useEffect(() => {
    if (!estaLogueado || !evento) {
      setGuardado(false);
      setIdRelacion(null);
      return;
    }
    async function verificar() {
      try {
        const res  = await usuarioAPI.misEventos();
        const data = await res.json();
        const lista = data.results ?? data;
        const encontrado = lista.find(item => item.evento?.id === evento.id);
        if (encontrado) {
          setGuardado(true);
          setIdRelacion(encontrado.id);
        } else {
          setGuardado(false);
          setIdRelacion(null);
        }
      } catch {}
    }
    verificar();
  }, [evento?.id, estaLogueado]);

  async function toggleGuardar() {
    if (!estaLogueado) {
      if (onNavigate) onNavigate("login");
      return;
    }

    setCargando(true);
    setMensaje("");

    try {
      if (guardado) {
        // Quitar evento guardado
        await usuarioAPI.quitarEvento(idRelacion);
        setGuardado(false);
        setIdRelacion(null);
        setMensaje("Evento eliminado de tu lista.");
      } else {
        // Guardar evento
        const res  = await usuarioAPI.guardarEvento(evento.id);
        const data = await res.json();
        setGuardado(true);
        setIdRelacion(data.id);
        setMensaje("¡Evento guardado en Mis Eventos!");
      }
      setTimeout(() => setMensaje(""), 2500);
    } catch {
      setMensaje("Ocurrió un error, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  function compartir() {
    const texto = `${evento.titulo} — ${evento.lugar}`;
    if (navigator.share) {
      navigator.share({ title: evento.titulo, text: texto });
    } else {
      navigator.clipboard.writeText(texto);
      setMensaje("Enlace copiado al portapapeles.");
      setTimeout(() => setMensaje(""), 2000);
    }
  }

  if (!evento) return (
    <aside className={styles.panel}><EstadoVacio /></aside>
  );

  const fechaFormateada = evento.fecha instanceof Date && !isNaN(evento.fecha)
    ? evento.fecha.toLocaleDateString("es-CO", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  return (
    <aside className={styles.panel}>
      {/* Imagen */}
      <div className={styles.imagenWrap}>
        {evento.imagen
          ? <img src={evento.imagen} alt={evento.titulo} className={styles.imagen} />
          : <div className={styles.imagenFallback}>📅</div>
        }
        <div className={styles.imagenOverlay} />
        <div className={styles.badges}>
          {evento.destacado && (
            <span className={`${styles.badge} ${styles.badgeDestacado}`}>★ Destacado</span>
          )}
          <span className={`${styles.badge} ${evento.abierto ? styles.badgeAbierto : styles.badgeCerrado}`}>
            {evento.abierto ? "Abierto" : "Cerrado"}
          </span>
        </div>
      </div>

      {/* Título */}
      <h2 className={styles.titulo}>{evento.titulo}</h2>

      {/* Fecha */}
      <div className={styles.infoItem}>
        <div className={styles.infoIcono}><IconoCalendario /></div>
        <div>
          <p className={styles.infoLabel}>{fechaFormateada}</p>
          <p className={styles.infoSub}>{evento.hora ?? ""}</p>
        </div>
      </div>

      {/* Lugar */}
      <div className={styles.infoItem}>
        <div className={styles.infoIcono}><IconoLugar /></div>
        <div>
          <p className={styles.infoLabel}>{evento.lugar}</p>
          <p className={styles.infoSub}>{evento.detalle_lugar ?? evento.detalleLugar ?? ""}</p>
        </div>
      </div>

      {/* Descripción */}
      <div className={styles.descripcionWrap}>
        <h3 className={styles.descripcionTitulo}>Sobre este evento</h3>
        <p className={styles.descripcion}>{evento.descripcion}</p>
      </div>

      {/* Mensaje de confirmación */}
      {mensaje && (
        <div className={styles.mensajeConfirm}>{mensaje}</div>
      )}

      {/* Acciones */}
      <div className={styles.acciones}>
        <button
          className={`${styles.btnPrimario} ${guardado ? styles.btnGuardado : ""}`}
          onClick={toggleGuardar}
          disabled={cargando}
        >
          {cargando
            ? "…"
            : guardado
              ? "✓ Guardado en Mis Eventos"
              : estaLogueado
                ? "Guardar en Mis Eventos"
                : "Iniciar sesión para guardar"
          }
        </button>
        <button className={styles.btnSecundario} onClick={compartir}>
          <IconoCompartir />
          Compartir evento
        </button>
      </div>
    </aside>
  );
}