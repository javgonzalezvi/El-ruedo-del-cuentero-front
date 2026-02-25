import { useState, useEffect } from "react";
import { usuarioAPI, normalizarEvento } from "../../services/api";
import Navbar      from "../Navbar/Navbar";
import Footer      from "../Footer/Footer";
import Calendar  from "../Calendar/Calendar";
import PanelDetailed from "../PanelDetailed/PanelDetailed";
import styles from "./PaginaMisEventos.module.css";

export default function PaginaMisEventos({ onNavigate, paginaActual }) {
  const [misEventos,         setMisEventos]         = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [cargando,           setCargando]           = useState(true);
  const [error,              setError]              = useState("");

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      try {
        const res  = await usuarioAPI.misEventos();
        const data = await res.json();
        // El endpoint devuelve [{id, evento: {...}, estado, fecha_alta}, ...]
        const lista = (data.results ?? data).map(item => ({
          ...normalizarEvento(item.evento),
          estadoGuardado: item.estado,
          idRelacion:     item.id,
        }));
        setMisEventos(lista);
        if (lista.length > 0) setEventoSeleccionado(lista[0]);
      } catch {
        setError("No se pudieron cargar tus eventos.");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  async function quitarEvento(idRelacion) {
    try {
      await usuarioAPI.quitarEvento(idRelacion);
      setMisEventos(prev => {
        const nuevos = prev.filter(e => e.idRelacion !== idRelacion);
        setEventoSeleccionado(nuevos[0] || null);
        return nuevos;
      });
    } catch {}
  }

  return (
    <div className={styles.root}>
      <Navbar onNavigate={onNavigate} paginaActual={paginaActual} />

      <div className={styles.layout}>

        {/* ── Panel izquierdo ── */}
        <aside className={styles.panel}>
          <div className={styles.panelCabecera}>
            <h2 className={styles.panelTitulo}>Mis Eventos</h2>
            <span className={styles.contador}>{misEventos.length} guardados</span>
          </div>

          <div className={styles.lista}>
            {cargando ? (
              <p className={styles.estado}>Cargando eventos…</p>
            ) : error ? (
              <p className={styles.estado}>{error}</p>
            ) : misEventos.length === 0 ? (
              <div className={styles.vacio}>
                <span style={{ fontSize: 40, opacity: 0.5 }}>📅</span>
                <p>Aún no tienes eventos guardados.</p>
              </div>
            ) : (
              misEventos.map(ev => {
                const activo = eventoSeleccionado?.id === ev.id;
                const fechaFmt = ev.fecha instanceof Date && !isNaN(ev.fecha)
                  ? ev.fecha.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
                  : "—";
                return (
                  <div key={ev.id}
                    className={`${styles.tarjeta} ${activo ? styles.tarjetaActiva : ""}`}
                    onClick={() => setEventoSeleccionado(ev)}
                    role="button" tabIndex={0}
                    onKeyDown={e => e.key === "Enter" && setEventoSeleccionado(ev)}
                  >
                    <div className={styles.tarjetaImg}>
                      {ev.imagen
                        ? <img src={ev.imagen} alt={ev.titulo} />
                        : <div className={styles.tarjetaImgFallback}>📅</div>
                      }
                    </div>
                    <div className={styles.tarjetaInfo}>
                      <span className={styles.tarjetaCat}
                        style={{ color: ev.color ?? "#C8572A" }}>
                        {ev.categoria}
                      </span>
                      <p className={styles.tarjetaTitulo}>{ev.titulo}</p>
                      <p className={styles.tarjetaFecha}>{fechaFmt}</p>
                    </div>
                    <div className={styles.tarjetaAcciones}>
                      <span className={styles.etiquetaGuardado}>✓ {ev.estadoGuardado}</span>
                      <button
                        className={styles.btnQuitar}
                        onClick={e => { e.stopPropagation(); quitarEvento(ev.idRelacion); }}
                        title="Quitar de mis eventos"
                      >✕</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Calendario ── */}
        <Calendar
          eventos={misEventos}
          eventoSeleccionado={eventoSeleccionado}
          setEventoSeleccionado={setEventoSeleccionado}
        />

        {/* ── Panel detalle ── */}
        <PanelDetailed evento={eventoSeleccionado} />
      </div>

      <Footer />
    </div>
  );
}