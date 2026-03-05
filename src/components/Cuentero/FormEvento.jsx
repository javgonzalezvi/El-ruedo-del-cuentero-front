import { useState, useEffect } from "react";
import { eventosAPI, apiFetch } from "../../services/api";
import styles from "./FormCuentero.module.css";

const CAMPOS_VACIOS = {
  titulo:        "",
  descripcion:   "",
  categoria_id:  "",
  imagen_url:    "",
  video_url:     "",
  fecha:         "",
  hora:          "",
  lugar:         "",
  detalle_lugar: "",
  ciudad:        "Bogotá",
  recurrencia:   "ninguna",
  abierto:       true,
  destacado:     false,
  gratuito:      true,
  precio:        "",
};

// Genera fechas recurrentes a partir de una fecha base
function generarFechasRecurrentes(fechaBase, horaBase, recurrencia, cantidad) {
  if (!fechaBase || recurrencia === "ninguna") return [];
  const fechas = [];
  const base = new Date(`${fechaBase}T${horaBase || "00:00"}:00`);
  for (let i = 1; i <= cantidad; i++) {
    const d = new Date(base);
    if (recurrencia === "semanal")  d.setDate(d.getDate() + 7 * i);
    if (recurrencia === "mensual")  d.setMonth(d.getMonth() + i);
    fechas.push({
      fecha: d.toISOString().slice(0, 16),
      nota:  `${recurrencia === "semanal" ? "Semana" : "Mes"} ${i + 1}`,
    });
  }
  return fechas;
}

export default function FormEvento() {
  const [modo,       setModo]       = useState("rapido");
  const [form,       setForm]       = useState(CAMPOS_VACIOS);
  const [categorias, setCategorias] = useState([]);
  const [mediaTab,   setMediaTab]   = useState("imagen");
  const [archivo,    setArchivo]    = useState(null);

  // Fechas adicionales — lista de { fecha: "YYYY-MM-DDTHH:MM", nota: "" }
  const [fechasExtra,    setFechasExtra]    = useState([]);
  const [repeticiones,   setRepeticiones]   = useState(3);

  const [cargando, setCargando] = useState(false);
  const [exito,    setExito]    = useState("");
  const [error,    setError]    = useState("");

  useEffect(() => {
    apiFetch("/eventos/categorias/")
      .then(r => r.json())
      .then(data => setCategorias(data.results || data))
      .catch(() => {});
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  // Al cambiar recurrencia generar fechas automáticamente
  function handleRecurrencia(valor) {
    setForm(f => ({ ...f, recurrencia: valor }));
    if (valor !== "ninguna" && form.fecha) {
      setFechasExtra(generarFechasRecurrentes(form.fecha, form.hora, valor, repeticiones));
    } else if (valor === "ninguna") {
      setFechasExtra([]);
    }
  }

  function regenerarFechas() {
    if (form.recurrencia !== "ninguna" && form.fecha) {
      setFechasExtra(generarFechasRecurrentes(form.fecha, form.hora, form.recurrencia, repeticiones));
    }
  }

  function agregarFechaManual() {
    setFechasExtra(f => [...f, { fecha: "", nota: "" }]);
  }

  function actualizarFechaExtra(idx, campo, valor) {
    setFechasExtra(f => f.map((fe, i) => i === idx ? { ...fe, [campo]: valor } : fe));
  }

  function eliminarFechaExtra(idx) {
    setFechasExtra(f => f.filter((_, i) => i !== idx));
  }

  function resetForm() {
    setForm(CAMPOS_VACIOS);
    setArchivo(null);
    setFechasExtra([]);
    setMediaTab("imagen");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setExito("");

    // Validación manual según el modo
    if (!form.titulo.trim())  return setError("El título es obligatorio.");
    if (!form.fecha)          return setError("La fecha es obligatoria.");
    if (!form.lugar.trim())   return setError("El lugar es obligatorio.");
    if (modo === "completo" && !form.descripcion.trim())
      return setError("La descripción es obligatoria en el modo completo.");

    setCargando(true);
    try {
      const fechaCompleta = form.fecha && form.hora
        ? `${form.fecha}T${form.hora}:00`
        : `${form.fecha}T00:00:00`;

      const fechasValidas = fechasExtra
        .filter(f => f.fecha)
        .map(f => ({ fecha: f.fecha.length === 16 ? `${f.fecha}:00` : f.fecha, nota: f.nota }));

      let res;
      if (archivo) {
        const fd = new FormData();
        const datos = {
          ...form, fecha: fechaCompleta,
          precio: form.gratuito ? "" : (form.precio || ""),
          fechas_adicionales: JSON.stringify(fechasValidas),
        };
        delete datos.hora;
        Object.entries(datos).forEach(([k, v]) => { if (v !== null && v !== "") fd.append(k, v); });
        fd.append("imagen", archivo);
        res = await apiFetch("/eventos/", { method: "POST", body: fd });
      } else {
        const payload = {
          ...form, fecha: fechaCompleta,
          precio: form.gratuito ? null : (form.precio || null),
          fechas_adicionales: fechasValidas,
        };
        delete payload.hora;
        res = await eventosAPI.crear(payload);
      }

      if (!res.ok) {
        const err = await res.json();
        const campo   = Object.keys(err)[0];
        const mensaje = Array.isArray(err[campo]) ? err[campo][0] : err[campo];
        throw new Error(`${campo}: ${mensaje}`);
      }

      setExito("¡Evento creado exitosamente!");
      resetForm();
      setTimeout(() => setExito(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  // ── Sección de fechas compartida entre modos ──
  const SeccionFechas = (
    <>
      {/* Fecha principal */}
      <div className={styles.fila}>
        <div className={styles.campo}>
          <label className={styles.label}>Fecha *</label>
          <input name="fecha" type="date" className={styles.input}
            value={form.fecha} onChange={e => { handleChange(e); }}
            onBlur={regenerarFechas} />
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Hora</label>
          <input name="hora" type="time" className={styles.input}
            value={form.hora} onChange={handleChange} />
        </div>
      </div>

      {/* Recurrencia */}
      <div className={styles.campo}>
        <label className={styles.label}>Recurrencia</label>
        <div className={styles.mediaToggle}>
          {[
            { key: "ninguna", label: "📅 Una vez"  },
            { key: "semanal", label: "🔁 Semanal"  },
            { key: "mensual", label: "📆 Mensual"  },
            { key: "manual",  label: "✏️ Fechas libres" },
          ].map(t => (
            <button key={t.key} type="button"
              className={`${styles.mediaBtn} ${form.recurrencia === t.key || (t.key === "manual" && form.recurrencia === "ninguna" && fechasExtra.length > 0) ? styles.mediaBtnActivo : ""}`}
              onClick={() => {
                if (t.key === "manual") {
                  setForm(f => ({ ...f, recurrencia: "ninguna" }));
                  if (fechasExtra.length === 0) agregarFechaManual();
                } else {
                  handleRecurrencia(t.key);
                }
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Repeticiones para semanal/mensual */}
      {(form.recurrencia === "semanal" || form.recurrencia === "mensual") && (
        <div className={styles.fila}>
          <div className={styles.campo}>
            <label className={styles.label}>Número de repeticiones</label>
            <input type="number" min="1" max="52" className={styles.input}
              value={repeticiones}
              onChange={e => setRepeticiones(Number(e.target.value))}
              onBlur={regenerarFechas} />
          </div>
          <div className={styles.campo} style={{ justifyContent: "flex-end" }}>
            <button type="button" className={styles.btnBloque} onClick={regenerarFechas}
              style={{ marginTop: "auto" }}>
              ↻ Regenerar fechas
            </button>
          </div>
        </div>
      )}

      {/* Lista de fechas adicionales */}
      {fechasExtra.length > 0 && (
        <div className={styles.bloquesSeccion}>
          <h4 className={styles.bloquesTitulo}>
            Fechas adicionales ({fechasExtra.length})
          </h4>
          {fechasExtra.map((fe, idx) => (
            <div key={idx} className={styles.bloque}>
              <div className={styles.bloqueCabecera}>
                <span className={styles.bloqueTipo}>Fecha {idx + 2}</span>
                <button type="button" className={styles.btnEliminarBloque}
                  onClick={() => eliminarFechaExtra(idx)}>✕</button>
              </div>
              <div className={styles.fila}>
                <input type="datetime-local" className={styles.input}
                  value={fe.fecha}
                  onChange={e => actualizarFechaExtra(idx, "fecha", e.target.value)} />
                <input type="text" className={styles.input}
                  value={fe.nota} placeholder="Nota opcional (ej: Sesión 2)"
                  onChange={e => actualizarFechaExtra(idx, "nota", e.target.value)} />
              </div>
            </div>
          ))}
          <button type="button" className={styles.btnBloque} onClick={agregarFechaManual}>
            + Agregar otra fecha
          </button>
        </div>
      )}

      {/* Botón para agregar fecha manual cuando recurrencia es "ninguna" */}
      {form.recurrencia === "ninguna" && fechasExtra.length === 0 && (
        <button type="button" className={styles.btnBloque} onClick={agregarFechaManual}>
          + Agregar fecha adicional
        </button>
      )}
    </>
  );

  // ── Sección multimedia compartida ──
  const SeccionMedia = (
    <div className={styles.campo}>
      <label className={styles.label}>Contenido multimedia</label>
      <div className={styles.mediaToggle}>
        {[
          { key: "imagen",  label: "🔗 URL imagen"    },
          { key: "video",   label: "🎥 URL video"     },
          { key: "archivo", label: "📁 Subir archivo" },
        ].map(t => (
          <button key={t.key} type="button"
            className={`${styles.mediaBtn} ${mediaTab === t.key ? styles.mediaBtnActivo : ""}`}
            onClick={() => setMediaTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      {mediaTab === "imagen" && (
        <input name="imagen_url" type="url" className={styles.input}
          value={form.imagen_url} onChange={handleChange}
          placeholder="https://..." style={{ marginTop: 8 }} />
      )}
      {mediaTab === "video" && (
        <input name="video_url" type="url" className={styles.input}
          value={form.video_url} onChange={handleChange}
          placeholder="https://youtube.com/..." style={{ marginTop: 8 }} />
      )}
      {mediaTab === "archivo" && (
        <div style={{ marginTop: 8 }}>
          <input type="file" accept="image/*,video/*" className={styles.inputFile}
            onChange={e => setArchivo(e.target.files[0] || null)} />
          {archivo && <span className={styles.archivoNombre}>📎 {archivo.name}</span>}
        </div>
      )}
    </div>
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>

      {/* Toggle modo */}
      <div className={styles.modoToggle}>
        <button type="button"
          className={`${styles.modoBtn} ${modo === "rapido" ? styles.modoBtnActivo : ""}`}
          onClick={() => setModo("rapido")}>
          ⚡ Publicación rápida
        </button>
        <button type="button"
          className={`${styles.modoBtn} ${modo === "completo" ? styles.modoBtnActivo : ""}`}
          onClick={() => setModo("completo")}>
          📋 Evento completo
        </button>
      </div>

      <h3 className={styles.formTitulo}>
        {modo === "rapido" ? "Publicación rápida" : "Crear evento completo"}
      </h3>

      {exito && <div className={styles.exito}>{exito}</div>}
      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* Título — ambos modos */}
      <div className={styles.campo}>
        <label className={styles.label}>Título *</label>
        <input name="titulo" className={styles.input} value={form.titulo}
          onChange={handleChange} placeholder="Nombre del evento" />
      </div>

      {/* ══ MODO RÁPIDO ══ */}
      {modo === "rapido" && (
        <>
          {SeccionMedia}
          {SeccionFechas}
          <div className={styles.campo}>
            <label className={styles.label}>Lugar *</label>
            <input name="lugar" className={styles.input} value={form.lugar}
              onChange={handleChange} placeholder="Teatro, sala, parque..." />
          </div>
        </>
      )}

      {/* ══ MODO COMPLETO ══ */}
      {modo === "completo" && (
        <>
          <div className={styles.campo}>
            <label className={styles.label}>Descripción *</label>
            <textarea name="descripcion" className={styles.textarea}
              value={form.descripcion} onChange={handleChange}
              placeholder="Describe el evento..." rows={4} />
          </div>
          <div className={styles.fila}>
            <div className={styles.campo}>
              <label className={styles.label}>Categoría</label>
              <select name="categoria_id" className={styles.select}
                value={form.categoria_id} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className={styles.campo}>
              <label className={styles.label}>Ciudad</label>
              <input name="ciudad" className={styles.input} value={form.ciudad}
                onChange={handleChange} placeholder="Bogotá" />
            </div>
          </div>
          {SeccionFechas}
          <div className={styles.campo}>
            <label className={styles.label}>Lugar *</label>
            <input name="lugar" className={styles.input} value={form.lugar}
              onChange={handleChange} placeholder="Teatro, sala, parque..." />
          </div>
          <div className={styles.campo}>
            <label className={styles.label}>Dirección / detalle</label>
            <input name="detalle_lugar" className={styles.input} value={form.detalle_lugar}
              onChange={handleChange} placeholder="Calle 123 # 45-67" />
          </div>
          {SeccionMedia}
          <div className={styles.checks}>
            {[
              { name: "abierto",   label: "Inscripciones abiertas" },
              { name: "destacado", label: "Evento destacado"        },
              { name: "gratuito",  label: "Entrada gratuita"        },
            ].map(({ name, label }) => (
              <label key={name} className={styles.checkLabel}>
                <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} />
                {label}
              </label>
            ))}
          </div>
          {!form.gratuito && (
            <div className={styles.campo}>
              <label className={styles.label}>Precio (COP)</label>
              <input name="precio" type="number" min="0" className={styles.input}
                value={form.precio} onChange={handleChange} placeholder="15000" />
            </div>
          )}
        </>
      )}

      <button type="submit" className={styles.btnSubmit} disabled={cargando}>
        {cargando ? "Creando evento…" : "Crear evento"}
      </button>
    </form>
  );
}