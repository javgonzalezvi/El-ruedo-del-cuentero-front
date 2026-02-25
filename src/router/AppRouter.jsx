/**
 * AppRouter.jsx — Enrutador centralizado con autenticación.
 * El calendario ahora carga eventos desde la API en lugar de datos mock.
 */

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { eventosAPI, normalizarEvento } from "../services/api";

import PaginaNoticias    from "../components/Noticias/PaginaNoticias";
import PaginaEntrevistas from "../components/Entrevistas/PaginaEntrevistas";
import PaginaAcercaDe    from "../components/AcercaDe/PaginaAcercaDe";
import PaginaMiCuenta    from "../components/Perfil/PaginaMiCuenta";
import PaginaMisEventos  from "../components/Perfil/PaginaMisEventos";
import PaginaLogin       from "../components/Auth/PaginaLogin";
import PaginaRegistro    from "../components/Auth/PaginaRegistro";

import Navbar         from "../components/Navbar/Navbar";
import Footer         from "../components/Footer/Footer";
import Leftbar from "../components/Leftbar/Leftbar";
import Calendar     from "../components/Calendar/Calendar";
import PanelDetailed   from "../components/PanelDetailed/PanelDetailed";

import styles from "./AppRouter.module.css";

export default function AppRouter() {
  const { estaLogueado, cargando: cargandoAuth } = useAuth();

  const [pagina,     setPagina]     = useState("calendario");
  const [eventos,    setEventos]    = useState([]);
  const [eventoSel,  setEventoSel]  = useState(null);
  const [cargandoEv, setCargandoEv] = useState(true);

  // Cargar eventos desde la API al montar
  useEffect(() => {
    async function cargarEventos() {
      setCargandoEv(true);
      try {
        const res  = await eventosAPI.listar();
        const data = await res.json();
        // La API devuelve paginado {results: [...]} o lista directa
        const lista = data.results ?? data;

        // Normalizar: convertir fecha string ISO a objeto Date
        const normalizados = lista.map(normalizarEvento);

        setEventos(normalizados);
        if (normalizados.length > 0) setEventoSel(normalizados[0]);
      } catch (err) {
        console.error("Error cargando eventos:", err);
      } finally {
        setCargandoEv(false);
      }
    }
    cargarEventos();
  }, []);

  // Mientras verifica sesión
  if (cargandoAuth) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "var(--color-bg)",
        fontFamily: "var(--font-display)",
        color: "var(--color-ink-muted)", fontSize: "16px",
      }}>
        Cargando…
      </div>
    );
  }

  // ── Rutas de auth ──
  if (pagina === "login")    return <PaginaLogin    onNavigate={setPagina} />;
  if (pagina === "registro") return <PaginaRegistro onNavigate={setPagina} />;

  // ── Rutas privadas ──
  if (!estaLogueado && (pagina === "mi-cuenta" || pagina === "mis-eventos")) {
    return <PaginaLogin onNavigate={setPagina} />;
  }

  // ── Páginas con layout propio ──
  if (pagina === "noticias")
    return <PaginaNoticias    onNavigate={setPagina} paginaActual="noticias"    />;
  if (pagina === "entrevistas")
    return <PaginaEntrevistas onNavigate={setPagina} paginaActual="entrevistas" />;
  if (pagina === "acerca")
    return <PaginaAcercaDe    onNavigate={setPagina} paginaActual="acerca"      />;
  if (pagina === "mi-cuenta")
    return <PaginaMiCuenta    onNavigate={setPagina} paginaActual="mi-cuenta"   />;
  if (pagina === "mis-eventos")
    return <PaginaMisEventos  onNavigate={setPagina} paginaActual="mis-eventos" />;

  // ── Calendario (página por defecto) ──
  return (
    <div className={styles.root}>
      <Navbar onNavigate={setPagina} paginaActual="calendario" />
      <main className={styles.main}>
        {cargandoEv ? (
          <div style={{
            gridColumn: "1 / -1", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "var(--color-ink-muted)", fontSize: "15px", fontStyle: "italic",
          }}>
            Cargando eventos…
          </div>
        ) : (
          <>
            <Leftbar
              eventos={eventos}
              eventoSeleccionado={eventoSel}
              setEventoSeleccionado={setEventoSel}
            />
            <Calendar
              eventos={eventos}
              eventoSeleccionado={eventoSel}
              setEventoSeleccionado={setEventoSel}
            />
            <PanelDetailed evento={eventoSel} onNavigate={setPagina} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}