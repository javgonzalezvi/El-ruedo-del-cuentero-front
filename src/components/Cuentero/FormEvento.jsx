/**
 * FormEvento.jsx
 * Formulario para crear y editar eventos.
 * Llama a POST /api/eventos/ o PATCH /api/eventos/<id>/
 */

import { useState, useEffect } from "react";
import { eventosAPI, apiFetch } from "../../services/api";
import styles from "./Formcuentero.module.css";

const CAMPOS_VACIOS = {
  titulo:        "",
  descripcion:   "",
  categoria_id:  "",
  imagen_url:    "",
  fecha:         "",
  hora:          "",
  lugar:         "",
  detalle_lugar: "",
  ciudad:        "Bogotá",
  abierto:       true,
  destacado:     false,
  gratuito:      true,
  precio:        "",
};

export default function FormEvento() {
  const [form,       setForm]       = useState(CAMPOS_VACIOS);
  const [categorias, setCategorias] = useState([]);
  const [cargando,   setCargando]   = useState(false);
  const [exito,      setExito]      = useState("");
  const [error,      setError]      = useState("");

  // Cargar categorías disponibles
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setExito("");
    setCargando(true);

    // Combinar fecha y hora en un solo datetime ISO
    const payload = {
      ...form,
      fecha: form.fecha && form.hora ? `${form.fecha}T${form.hora}:00` : form.fecha,
      precio: form.gratuito ? null : (form.precio || null),
    };
    delete payload.hora;

    try {
      const res = await eventosAPI.crear(payload);
      if (!res.ok) {
        const err = await res.json();
        const campo   = Object.keys(err)[0];
        const mensaje = Array.isArray(err[campo]) ? err[campo][0] : err[campo];
        throw new Error(`${campo}: ${mensaje}`);
      }
      setExito("¡Evento creado exitosamente!");
      setForm(CAMPOS_VACIOS);
      setTimeout(() => setExito(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.formTitulo}>Crear evento</h3>

      {exito && <div className={styles.exito}>{exito}</div>}
      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* Título */}
      <div className={styles.campo}>
        <label className={styles.label}>Título *</label>
        <input name="titulo" className={styles.input} value={form.titulo}
          onChange={handleChange} placeholder="Nombre del evento" required />
      </div>

      {/* Descripción */}
      <div className={styles.campo}>
        <label className={styles.label}>Descripción *</label>
        <textarea name="descripcion" className={styles.textarea} value={form.descripcion}
          onChange={handleChange} placeholder="Describe el evento..." rows={4} required />
      </div>

      {/* Categoría */}
      <div className={styles.fila}>
        <div className={styles.campo}>
          <label className={styles.label}>Categoría *</label>
          <select name="categoria_id" className={styles.select} value={form.categoria_id}
            onChange={handleChange} required>
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

      {/* Fecha y hora */}
      <div className={styles.fila}>
        <div className={styles.campo}>
          <label className={styles.label}>Fecha *</label>
          <input name="fecha" type="date" className={styles.input} value={form.fecha}
            onChange={handleChange} required />
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Hora *</label>
          <input name="hora" type="time" className={styles.input} value={form.hora}
            onChange={handleChange} required />
        </div>
      </div>

      {/* Lugar */}
      <div className={styles.campo}>
        <label className={styles.label}>Lugar *</label>
        <input name="lugar" className={styles.input} value={form.lugar}
          onChange={handleChange} placeholder="Teatro, sala, parque..." required />
      </div>
      <div className={styles.campo}>
        <label className={styles.label}>Dirección / detalle</label>
        <input name="detalle_lugar" className={styles.input} value={form.detalle_lugar}
          onChange={handleChange} placeholder="Calle 123 # 45-67" />
      </div>

      {/* Imagen URL */}
      <div className={styles.campo}>
        <label className={styles.label}>URL de imagen</label>
        <input name="imagen_url" type="url" className={styles.input} value={form.imagen_url}
          onChange={handleChange} placeholder="https://..." />
      </div>

      {/* Checkboxes */}
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

      {/* Precio (si no es gratuito) */}
      {!form.gratuito && (
        <div className={styles.campo}>
          <label className={styles.label}>Precio (COP)</label>
          <input name="precio" type="number" min="0" className={styles.input}
            value={form.precio} onChange={handleChange} placeholder="15000" />
        </div>
      )}

      <button type="submit" className={styles.btnSubmit} disabled={cargando}>
        {cargando ? "Creando evento…" : "Crear evento"}
      </button>
    </form>
  );
}