import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Paginaregistro.module.css";

export default function Paginaregistro({ onNavigate }) {
  const { registro } = useAuth();

  const [form, setForm] = useState({
    nombres:   "",
    apellidos: "",
    correo:    "",
    ciudad:    "",
    password:  "",
    password2: "",
  });
  const [error,    setError]    = useState("");
  const [cargando, setCargando] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);
    try {
      await registro(form);
      onNavigate("calendario");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className={styles.root}>
      {/* Panel lateral */}
      <div className={styles.lateral}>
        <div className={styles.lateralContenido}>
          <div className={styles.ornamento}>❧</div>
          <h1 className={styles.lateralTitulo}>El Ruedo<br />del Cuentero</h1>
          <p className={styles.lateralSub}>Narración Oral · Bogotá</p>
          <div className={styles.lateralSeparador} />
          <p className={styles.lateralCita}>
            "Únete a la comunidad<br />de narradores orales."
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className={styles.formularioWrap}>
        <form className={styles.formulario} onSubmit={handleSubmit} noValidate>

          <h2 className={styles.titulo}>Crear cuenta</h2>
          <p className={styles.subtitulo}>Únete a la comunidad del Ruedo</p>

          {error && (
            <div className={styles.errorBanner} role="alert">{error}</div>
          )}

          <div className={styles.fila}>
            <div className={styles.campo}>
              <label className={styles.label} htmlFor="nombres">Nombres</label>
              <input
                id="nombres" name="nombres" type="text"
                className={styles.input}
                value={form.nombres} onChange={handleChange}
                placeholder="Juan" required
              />
            </div>
            <div className={styles.campo}>
              <label className={styles.label} htmlFor="apellidos">Apellidos</label>
              <input
                id="apellidos" name="apellidos" type="text"
                className={styles.input}
                value={form.apellidos} onChange={handleChange}
                placeholder="García" required
              />
            </div>
          </div>

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="correo">Correo electrónico</label>
            <input
              id="correo" name="correo" type="email"
              className={styles.input}
              value={form.correo} onChange={handleChange}
              placeholder="tu@correo.com" required
              autoComplete="email"
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="ciudad">Ciudad <span className={styles.opcional}>(opcional)</span></label>
            <input
              id="ciudad" name="ciudad" type="text"
              className={styles.input}
              value={form.ciudad} onChange={handleChange}
              placeholder="Bogotá"
            />
          </div>

          <div className={styles.fila}>
            <div className={styles.campo}>
              <label className={styles.label} htmlFor="password">Contraseña</label>
              <input
                id="password" name="password" type="password"
                className={styles.input}
                value={form.password} onChange={handleChange}
                placeholder="Mínimo 8 caracteres" required
                autoComplete="new-password"
              />
            </div>
            <div className={styles.campo}>
              <label className={styles.label} htmlFor="password2">Confirmar</label>
              <input
                id="password2" name="password2" type="password"
                className={styles.input}
                value={form.password2} onChange={handleChange}
                placeholder="Repite la contraseña" required
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={cargando}>
            {cargando ? "Creando cuenta…" : "Crear cuenta"}
          </button>

          <p className={styles.linkLogin}>
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => onNavigate("login")}
            >
              Inicia sesión
            </button>
          </p>

        </form>
      </div>
    </div>
  );
}