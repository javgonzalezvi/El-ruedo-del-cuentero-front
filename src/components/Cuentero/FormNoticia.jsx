/**
 * FormNoticia.jsx
 * Formulario para crear noticias con bloques de contenido.
 * Llama a POST /api/noticias/ y luego POST /api/noticias/<slug>/bloques/
 */

import { useState } from "react";
import { noticiasAPI, apiFetch } from "../../services/api";
import styles from "./Formcuentero.module.css";

const CATEGORIAS = ["CRÓNICA", "GUÍA", "EVENTO", "REPORTAJE"];

const BLOQUE_VACIO = { tipo: "parrafo", texto: "", autor: "", src: "", pie: "" };

function slugify(str) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function FormNoticia() {
  const [form, setForm] = useState({
    titulo:            "",
    resumen:           "",
    categoria:         "CRÓNICA",
    categoria_color:   "#C8572A",
    imagen_portada_url:"",
    tiempo_lectura:    5,
    publicada:         false,
    destacada:         false,
    fecha_publicacion: "",
  });
  const [bloques,  setBloques]  = useState([{ ...BLOQUE_VACIO }]);
  const [cargando, setCargando] = useState(false);
  const [exito,    setExito]    = useState("");
  const [error,    setError]    = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function agregarBloque(tipo) {
    setBloques(b => [...b, { ...BLOQUE_VACIO, tipo }]);
  }

  function actualizarBloque(idx, campo, valor) {
    setBloques(b => b.map((bl, i) => i === idx ? { ...bl, [campo]: valor } : bl));
  }

  function eliminarBloque(idx) {
    setBloques(b => b.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setExito("");
    setCargando(true);

    const slug = slugify(form.titulo) + "-" + Date.now();

    try {
      // 1. Crear la noticia
      const payload = { ...form, slug };
      const res = await noticiasAPI.crear(payload);
      if (!res.ok) {
        const err = await res.json();
        const campo   = Object.keys(err)[0];
        const mensaje = Array.isArray(err[campo]) ? err[campo][0] : err[campo];
        throw new Error(`${campo}: ${mensaje}`);
      }
      const noticia = await res.json();

      // 2. Crear los bloques en orden
      for (let i = 0; i < bloques.length; i++) {
        const bl = bloques[i];
        if (!bl.texto && !bl.src) continue; // saltar bloques vacíos
        await apiFetch(`/noticias/${noticia.slug}/bloques/`, {
          method: "POST",
          body: JSON.stringify({ ...bl, orden: i }),
        });
      }

      setExito("¡Noticia creada exitosamente!");
      setForm({ titulo: "", resumen: "", categoria: "CRÓNICA", categoria_color: "#C8572A",
        imagen_portada_url: "", tiempo_lectura: 5, publicada: false, destacada: false, fecha_publicacion: "" });
      setBloques([{ ...BLOQUE_VACIO }]);
      setTimeout(() => setExito(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.formTitulo}>Crear noticia</h3>

      {exito && <div className={styles.exito}>{exito}</div>}
      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* Título */}
      <div className={styles.campo}>
        <label className={styles.label}>Título *</label>
        <input name="titulo" className={styles.input} value={form.titulo}
          onChange={handleChange} placeholder="Título del artículo" required />
      </div>

      {/* Resumen */}
      <div className={styles.campo}>
        <label className={styles.label}>Resumen *</label>
        <textarea name="resumen" className={styles.textarea} value={form.resumen}
          onChange={handleChange} placeholder="Breve descripción del artículo..." rows={3} required />
      </div>

      {/* Categoría y color */}
      <div className={styles.fila}>
        <div className={styles.campo}>
          <label className={styles.label}>Categoría</label>
          <select name="categoria" className={styles.select} value={form.categoria} onChange={handleChange}>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Color de categoría</label>
          <div className={styles.colorWrap}>
            <input type="color" name="categoria_color" value={form.categoria_color}
              onChange={handleChange} className={styles.colorPicker} />
            <span className={styles.colorHex}>{form.categoria_color}</span>
          </div>
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Tiempo lectura (min)</label>
          <input name="tiempo_lectura" type="number" min="1" max="60" className={styles.input}
            value={form.tiempo_lectura} onChange={handleChange} />
        </div>
      </div>

      {/* Imagen portada */}
      <div className={styles.campo}>
        <label className={styles.label}>URL imagen portada</label>
        <input name="imagen_portada_url" type="url" className={styles.input}
          value={form.imagen_portada_url} onChange={handleChange} placeholder="https://..." />
      </div>

      {/* Fecha publicación */}
      <div className={styles.campo}>
        <label className={styles.label}>Fecha de publicación</label>
        <input name="fecha_publicacion" type="date" className={styles.input}
          value={form.fecha_publicacion} onChange={handleChange} />
      </div>

      {/* Checkboxes */}
      <div className={styles.checks}>
        <label className={styles.checkLabel}>
          <input type="checkbox" name="publicada" checked={form.publicada} onChange={handleChange} />
          Publicar inmediatamente
        </label>
        <label className={styles.checkLabel}>
          <input type="checkbox" name="destacada" checked={form.destacada} onChange={handleChange} />
          Noticia destacada
        </label>
      </div>

      {/* ── Bloques de contenido ── */}
      <div className={styles.bloquesSeccion}>
        <h4 className={styles.bloquesTitulo}>Contenido del artículo</h4>

        {bloques.map((bl, idx) => (
          <div key={idx} className={styles.bloque}>
            <div className={styles.bloqueCabecera}>
              <span className={styles.bloqueTipo}>{bl.tipo}</span>
              <button type="button" className={styles.btnEliminarBloque}
                onClick={() => eliminarBloque(idx)}>✕</button>
            </div>

            {bl.tipo === "parrafo" && (
              <textarea className={styles.textarea} value={bl.texto} rows={4}
                onChange={e => actualizarBloque(idx, "texto", e.target.value)}
                placeholder="Escribe el párrafo aquí..." />
            )}
            {bl.tipo === "subtitulo" && (
              <input className={styles.input} value={bl.texto}
                onChange={e => actualizarBloque(idx, "texto", e.target.value)}
                placeholder="Subtítulo de sección" />
            )}
            {bl.tipo === "cita" && (
              <>
                <textarea className={styles.textarea} value={bl.texto} rows={3}
                  onChange={e => actualizarBloque(idx, "texto", e.target.value)}
                  placeholder="Texto de la cita..." />
                <input className={styles.input} value={bl.autor} style={{ marginTop: 8 }}
                  onChange={e => actualizarBloque(idx, "autor", e.target.value)}
                  placeholder="Autor de la cita" />
              </>
            )}
            {bl.tipo === "imagen" && (
              <>
                <input className={styles.input} value={bl.src} type="url"
                  onChange={e => actualizarBloque(idx, "src", e.target.value)}
                  placeholder="URL de la imagen" />
                <input className={styles.input} value={bl.pie} style={{ marginTop: 8 }}
                  onChange={e => actualizarBloque(idx, "pie", e.target.value)}
                  placeholder="Pie de foto (opcional)" />
              </>
            )}
          </div>
        ))}

        {/* Botones para agregar bloques */}
        <div className={styles.agregarBloques}>
          <span className={styles.agregarLabel}>Agregar bloque:</span>
          {["parrafo", "subtitulo", "cita", "imagen"].map(tipo => (
            <button key={tipo} type="button" className={styles.btnBloque}
              onClick={() => agregarBloque(tipo)}>
              + {tipo}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className={styles.btnSubmit} disabled={cargando}>
        {cargando ? "Creando noticia…" : "Crear noticia"}
      </button>
    </form>
  );
}