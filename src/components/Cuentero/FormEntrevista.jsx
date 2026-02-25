/**
 * FormEntrevista.jsx
 * Formulario para subir entrevistas de audio.
 * Llama a POST /api/entrevistas/ con multipart/form-data
 */

import { useState } from "react";
import { apiFetch } from "../../services/api";
import styles from "./FormCuentero.module.css";

const CATEGORIAS = ["MAESTROS", "VOCES NUEVAS", "INTERNACIONAL", "EXPERIMENTALES"];

function slugify(str) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function FormEntrevista() {
  const [form, setForm] = useState({
    titulo:            "",
    entrevistado:      "",
    rol:               "",
    resumen:           "",
    descripcion_larga: "",
    categoria:         "MAESTROS",
    categoria_color:   "#C8572A",
    imagen_url:        "",
    audio_url:         "",
    duracion:          "",
    publicada:         false,
    destacada:         false,
    fecha_publicacion: "",
  });
  const [archivoAudio,  setArchivoAudio]  = useState(null);
  const [cargando,      setCargando]      = useState(false);
  const [exito,         setExito]         = useState("");
  const [error,         setError]         = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setExito("");
    setCargando(true);

    try {
      const slug = slugify(form.titulo) + "-" + Date.now();

      // Usar FormData para poder enviar archivo de audio si se seleccionó
      const fd = new FormData();
      Object.entries({ ...form, slug }).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) fd.append(k, v);
      });
      if (archivoAudio) fd.append("audio_archivo", archivoAudio);

      const res = await apiFetch("/entrevistas/", { method: "POST", body: fd });

      if (!res.ok) {
        const err = await res.json();
        const campo   = Object.keys(err)[0];
        const mensaje = Array.isArray(err[campo]) ? err[campo][0] : err[campo];
        throw new Error(`${campo}: ${mensaje}`);
      }

      setExito("¡Entrevista subida exitosamente!");
      setForm({
        titulo: "", entrevistado: "", rol: "", resumen: "", descripcion_larga: "",
        categoria: "MAESTROS", categoria_color: "#C8572A", imagen_url: "",
        audio_url: "", duracion: "", publicada: false, destacada: false, fecha_publicacion: "",
      });
      setArchivoAudio(null);
      setTimeout(() => setExito(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.formTitulo}>Subir entrevista</h3>

      {exito && <div className={styles.exito}>{exito}</div>}
      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* Título */}
      <div className={styles.campo}>
        <label className={styles.label}>Título de la entrevista *</label>
        <input name="titulo" className={styles.input} value={form.titulo}
          onChange={handleChange} placeholder="Título del episodio" required />
      </div>

      {/* Entrevistado y rol */}
      <div className={styles.fila}>
        <div className={styles.campo}>
          <label className={styles.label}>Entrevistado *</label>
          <input name="entrevistado" className={styles.input} value={form.entrevistado}
            onChange={handleChange} placeholder="Nombre completo" required />
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Rol / descripción</label>
          <input name="rol" className={styles.input} value={form.rol}
            onChange={handleChange} placeholder="Narrador oral, Bogotá" />
        </div>
      </div>

      {/* Resumen */}
      <div className={styles.campo}>
        <label className={styles.label}>Resumen *</label>
        <textarea name="resumen" className={styles.textarea} value={form.resumen}
          onChange={handleChange} placeholder="Breve descripción del episodio..." rows={2} required />
      </div>

      {/* Descripción larga */}
      <div className={styles.campo}>
        <label className={styles.label}>Descripción completa</label>
        <textarea name="descripcion_larga" className={styles.textarea} value={form.descripcion_larga}
          onChange={handleChange} placeholder="Descripción extensa de la entrevista..." rows={4} />
      </div>

      {/* Categoría, color y duración */}
      <div className={styles.fila}>
        <div className={styles.campo}>
          <label className={styles.label}>Categoría</label>
          <select name="categoria" className={styles.select} value={form.categoria} onChange={handleChange}>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Color</label>
          <div className={styles.colorWrap}>
            <input type="color" name="categoria_color" value={form.categoria_color}
              onChange={handleChange} className={styles.colorPicker} />
            <span className={styles.colorHex}>{form.categoria_color}</span>
          </div>
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Duración (MM:SS)</label>
          <input name="duracion" className={styles.input} value={form.duracion}
            onChange={handleChange} placeholder="38:24" />
        </div>
      </div>

      {/* Imagen URL */}
      <div className={styles.campo}>
        <label className={styles.label}>URL imagen del episodio</label>
        <input name="imagen_url" type="url" className={styles.input} value={form.imagen_url}
          onChange={handleChange} placeholder="https://..." />
      </div>

      {/* Audio — archivo o URL */}
      <div className={styles.audioSeccion}>
        <h4 className={styles.bloquesTitulo}>Archivo de audio</h4>
        <p className={styles.audioHint}>Sube un archivo MP3/WAV o proporciona una URL externa.</p>

        <div className={styles.campo}>
          <label className={styles.label}>Subir archivo</label>
          <input type="file" accept="audio/*" className={styles.inputFile}
            onChange={e => setArchivoAudio(e.target.files[0] || null)} />
          {archivoAudio && (
            <span className={styles.archivoNombre}>📎 {archivoAudio.name}</span>
          )}
        </div>

        <div className={styles.separadorO}>— o —</div>

        <div className={styles.campo}>
          <label className={styles.label}>URL externa (SoundCloud, Spotify…)</label>
          <input name="audio_url" type="url" className={styles.input} value={form.audio_url}
            onChange={handleChange} placeholder="https://soundcloud.com/..." />
        </div>
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
          Episodio destacado
        </label>
      </div>

      <button type="submit" className={styles.btnSubmit} disabled={cargando}>
        {cargando ? "Subiendo entrevista…" : "Subir entrevista"}
      </button>
    </form>
  );
}