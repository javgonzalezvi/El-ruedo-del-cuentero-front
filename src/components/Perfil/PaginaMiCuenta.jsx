import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usuarioAPI } from "../../services/api";
import Navbar       from "../Navbar/Navbar";
import Footer       from "../Footer/Footer";
import FormEvento   from "../Cuentero/FormEvento";
import FormNoticia  from "../Cuentero/FormNoticia";
import FormEntrevista from "../Cuentero/FormEntrevista";
import styles from "./PaginaMiCuenta.module.css";

const TIPOS_EVENTO = [
  { id: "CUENTO",   label: "Noches de cuento",    icono: "📖" },
  { id: "FESTIVAL", label: "Festivales",           icono: "🎪" },
  { id: "TALLER",   label: "Talleres y formación", icono: "🎓" },
  { id: "RUEDO",    label: "Ruedos abiertos",      icono: "🔥" },
  { id: "INFANTIL", label: "Narración infantil",   icono: "🧒" },
  { id: "MUSICA",   label: "Narración con música", icono: "🎵" },
];

// Pestañas del panel Cuentero
const TABS_CUENTERO = [
  { key: "evento",      label: "Evento",      icono: "📅" },
  { key: "noticia",     label: "Noticia",     icono: "📰" },
  { key: "entrevista",  label: "Entrevista",  icono: "🎙️" },
];

export default function PaginaMiCuenta({ onNavigate, paginaActual }) {
  const { usuario, setUsuario, esCuentero } = useAuth();

  // Pestaña principal: "perfil" | "panel"
  const [pestana,    setPestana]    = useState("perfil");
  // Sub-pestaña del panel cuentero
  const [subTab,     setSubTab]     = useState("evento");

  const [editando,   setEditando]   = useState(false);
  const [form,       setForm]       = useState({});
  const [guardado,   setGuardado]   = useState(false);
  const [error,      setError]      = useState("");
  const [cargando,   setCargando]   = useState(false);

  function iniciarEdicion() {
    setForm({
      nombres:   usuario.nombres   || "",
      apellidos: usuario.apellidos || "",
      telefono:  usuario.telefono  || "",
      ciudad:    usuario.ciudad    || "",
      gustos:    usuario.gustos    || [],
    });
    setEditando(true);
    setError("");
  }

  function cancelar() { setEditando(false); setError(""); }

  function toggleGusto(id) {
    setForm(f => ({
      ...f,
      gustos: f.gustos.includes(id)
        ? f.gustos.filter(g => g !== id)
        : [...f.gustos, id],
    }));
  }

  async function guardar() {
    setCargando(true); setError("");
    try {
      const res = await usuarioAPI.actualizarPerfil(form);
      if (!res.ok) {
        const err   = await res.json();
        const campo = Object.keys(err)[0];
        throw new Error(Array.isArray(err[campo]) ? err[campo][0] : err[campo]);
      }
      setUsuario(await res.json());
      setEditando(false);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  if (!usuario) return null;

  const gustos     = editando ? form.gustos : (usuario.gustos || []);
  const miembroFmt = usuario.fecha_union
    ? new Date(usuario.fecha_union).toLocaleDateString("es-CO", { year: "numeric", month: "long" })
    : "—";

  return (
    <div className={styles.root}>
      <Navbar onNavigate={onNavigate} paginaActual={paginaActual} />

      <main className={styles.main}>
        <div className={styles.contenedor}>

          {/* ── Header ── */}
          <div className={styles.perfilHeader}>
            <div className={styles.avatarWrap}>
              {usuario.avatar ? (
                <img src={usuario.avatar} alt={usuario.nombres} className={styles.avatar} />
              ) : (
                <div className={styles.avatarFallback}>
                  {usuario.nombres?.[0]}{usuario.apellidos?.[0]}
                </div>
              )}
            </div>
            <div>
              <h1 className={styles.nombreCompleto}>
                {usuario.nombres} {usuario.apellidos}
              </h1>
              <p className={styles.metaPerfil}>
                {usuario.rol} · Miembro desde {miembroFmt}
              </p>
            </div>
          </div>

          {/* ── Pestañas principales ── */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${pestana === "perfil" ? styles.tabActivo : ""}`}
              onClick={() => setPestana("perfil")}
            >
              👤 Mi perfil
            </button>
            {esCuentero && (
              <button
                className={`${styles.tab} ${pestana === "panel" ? styles.tabActivo : ""}`}
                onClick={() => setPestana("panel")}
              >
                🎙️ Panel Cuentero
              </button>
            )}
          </div>

          {/* ══ Pestaña: PERFIL ══ */}
          {pestana === "perfil" && (
            <>
              {guardado && <div className={styles.toast}>✓ Perfil guardado correctamente</div>}
              {error    && <div className={styles.toastError}>{error}</div>}

              <div className={styles.tabHeaderRow}>
                {!editando && (
                  <button className={styles.btnEditar} onClick={iniciarEdicion}>
                    Editar perfil
                  </button>
                )}
              </div>

              <div className={styles.grid}>
                {/* Información personal */}
                <section className={styles.seccion}>
                  <h2 className={styles.seccionTitulo}>Información personal</h2>
                  <div className={styles.camposGrid}>
                    {[
                      { label: "Nombres",           key: "nombres",   readonly: false },
                      { label: "Apellidos",          key: "apellidos", readonly: false },
                      { label: "Correo electrónico", key: "correo",    readonly: true  },
                      { label: "Teléfono",           key: "telefono",  readonly: false },
                      { label: "Ciudad",             key: "ciudad",    readonly: false },
                    ].map(({ label, key, readonly }) => (
                      <div key={key} className={styles.campo}>
                        <label className={styles.campoLabel}>{label}</label>
                        {editando && !readonly ? (
                          <input className={styles.campoInput}
                            value={form[key] || ""}
                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                        ) : (
                          <p className={styles.campoValor}>{usuario[key] || "—"}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Preferencias */}
                <section className={styles.seccion}>
                  <h2 className={styles.seccionTitulo}>Mis preferencias</h2>
                  <p className={styles.seccionSub}>
                    Tipos de eventos que más te interesan.
                  </p>
                  <div className={styles.gustosGrid}>
                    {TIPOS_EVENTO.map(tipo => {
                      const activo = gustos.includes(tipo.id);
                      return (
                        <button key={tipo.id}
                          className={`${styles.gustoBtn} ${activo ? styles.gustoBtnActivo : ""}`}
                          onClick={() => editando && toggleGusto(tipo.id)}
                          style={{ cursor: editando ? "pointer" : "default" }}
                        >
                          <span className={styles.gustoIcono}>{tipo.icono}</span>
                          <span className={styles.gustoLabel}>{tipo.label}</span>
                          {activo && <span className={styles.gustoCheck}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  {!editando && (
                    <p className={styles.gustosHint}>
                      Haz clic en "Editar perfil" para modificar tus preferencias.
                    </p>
                  )}
                </section>
              </div>

              {editando && (
                <div className={styles.accionesEdicion}>
                  <button className={styles.btnCancelar} onClick={cancelar} disabled={cargando}>
                    Cancelar
                  </button>
                  <button className={styles.btnGuardar} onClick={guardar} disabled={cargando}>
                    {cargando ? "Guardando…" : "Guardar cambios"}
                  </button>
                </div>
              )}
            </>
          )}

          {/* ══ Pestaña: PANEL CUENTERO ══ */}
          {pestana === "panel" && esCuentero && (
            <div className={styles.panelCuentero}>

              {/* Sub-pestañas */}
              <div className={styles.subTabs}>
                {TABS_CUENTERO.map(t => (
                  <button key={t.key}
                    className={`${styles.subTab} ${subTab === t.key ? styles.subTabActivo : ""}`}
                    onClick={() => setSubTab(t.key)}
                  >
                    {t.icono} {t.label}
                  </button>
                ))}
              </div>

              {/* Formularios */}
              <div className={styles.panelFormWrap}>
                {subTab === "evento"     && <FormEvento />}
                {subTab === "noticia"    && <FormNoticia />}
                {subTab === "entrevista" && <FormEntrevista />}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}