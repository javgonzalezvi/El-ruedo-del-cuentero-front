import { useState, useEffect } from "react";
import { noticiasAPI, normalizarNoticia } from "../../services/api";
import Navbar        from "../Navbar/Navbar";
import Footer        from "../Footer/Footer";
import PanelNoticias from "./PanelNoticias";
import ArticuloVisor from "./ArticuloVisor";
import styles from "./PaginaNoticias.module.css";

export default function PaginaNoticias({ onNavigate, paginaActual }) {
  const [noticias,            setNoticias]            = useState([]);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);
  const [cargando,            setCargando]            = useState(true);
  const [error,               setError]               = useState("");

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      try {
        const res   = await noticiasAPI.listar();
        const data  = await res.json();
        const lista = (data.results ?? data).map(normalizarNoticia);
        setNoticias(lista);
        if (lista.length > 0) setNoticiaSeleccionada(lista[0]);
      } catch {
        setError("No se pudieron cargar las noticias.");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  async function seleccionarNoticia(noticia) {
    setNoticiaSeleccionada(noticia);
    try {
      const res  = await noticiasAPI.detalle(noticia.slug);
      const data = await res.json();
      setNoticiaSeleccionada(normalizarNoticia(data));
    } catch {}
  }

  return (
    <div className={styles.root}>
      <Navbar onNavigate={onNavigate} paginaActual={paginaActual} />
      <div className={styles.layout}>
        {cargando ? (
          <div className={styles.estado}>Cargando noticias…</div>
        ) : error ? (
          <div className={styles.estado}>{error}</div>
        ) : noticias.length === 0 ? (
          <div className={styles.estado}>No hay noticias publicadas aún.</div>
        ) : (
          <>
            <PanelNoticias
              noticias={noticias}
              noticiaSeleccionada={noticiaSeleccionada}
              setNoticiaSeleccionada={seleccionarNoticia}
            />
            <ArticuloVisor noticia={noticiaSeleccionada} />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}