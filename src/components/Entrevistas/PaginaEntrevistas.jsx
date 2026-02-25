import { useState, useEffect } from "react";
import { entrevistasAPI, normalizarEntrevista } from "../../services/api";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import TarjetaEntrevista from "./TarjetaEntrevista";
import EntrevistaVisor from "./EntrevistaVisor";
import styles from "./PaginaEntrevistas.module.css";

function PanelEntrevistas({ entrevistas, seleccionada, setSeleccionada }) {
  const [busqueda, setBusqueda] = useState("");
  const [cat,      setCat]      = useState("Todas");

  const categorias = ["Todas", ...new Set(entrevistas.map(e => e.categoria).filter(Boolean))];

  const filtradas = entrevistas.filter(e => {
    const b = e.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
              e.entrevistado.toLowerCase().includes(busqueda.toLowerCase());
    const c = cat === "Todas" || e.categoria === cat;
    return b && c;
  });

  return (
    <aside className={styles.panel}>
      <h2 className={styles.panelTitulo}>Entrevistas</h2>
      <div className={styles.buscadorWrap}>
        <svg className={styles.buscadorIco} width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input type="search" placeholder="Buscar entrevistas..." value={busqueda}
          onChange={e => setBusqueda(e.target.value)} className={styles.buscador} />
      </div>
      <div className={styles.filtros}>
        {categorias.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`${styles.filtro} ${cat === c ? styles.filtroActivo : ""}`}>
            {c}
          </button>
        ))}
      </div>
      <div className={styles.lista}>
        {filtradas.length === 0
          ? <p className={styles.sinRes}>No se encontraron entrevistas.</p>
          : filtradas.map(e => (
              <TarjetaEntrevista key={e.id} entrevista={e}
                seleccionada={seleccionada} onClick={() => setSeleccionada(e)} />
            ))
        }
      </div>
    </aside>
  );
}

export default function PaginaEntrevistas({ onNavigate, paginaActual }) {
  const [entrevistas,  setEntrevistas]  = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [cargando,     setCargando]     = useState(true);
  const [error,        setError]        = useState("");

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      try {
        const res   = await entrevistasAPI.listar();
        const data  = await res.json();
        const lista = (data.results ?? data).map(normalizarEntrevista);
        setEntrevistas(lista);
        if (lista.length > 0) setSeleccionada(lista[0]);
      } catch {
        setError("No se pudieron cargar las entrevistas.");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  async function seleccionarEntrevista(entrevista) {
    setSeleccionada(entrevista);
    try {
      const res  = await entrevistasAPI.detalle(entrevista.slug);
      const data = await res.json();
      setSeleccionada(normalizarEntrevista(data));
    } catch {}
  }

  return (
    <div className={styles.root}>
      <Navbar onNavigate={onNavigate} paginaActual={paginaActual} />
      <div className={styles.layout}>
        {cargando ? (
          <div className={styles.estado}>Cargando entrevistas…</div>
        ) : error ? (
          <div className={styles.estado}>{error}</div>
        ) : entrevistas.length === 0 ? (
          <div className={styles.estado}>No hay entrevistas publicadas aún.</div>
        ) : (
          <>
            <PanelEntrevistas
              entrevistas={entrevistas}
              seleccionada={seleccionada}
              setSeleccionada={seleccionarEntrevista}
            />
            <EntrevistaVisor entrevista={seleccionada} />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}