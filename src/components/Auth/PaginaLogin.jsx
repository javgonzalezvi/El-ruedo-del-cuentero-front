/**
 * components/Auth/PaginaLogin.jsx
 */

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./PaginaLogin.module.css";

export default function PaginaLogin({ onNavigate }) {
  const { login } = useAuth();

  const [correo,   setCorreo]   = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await login(correo, password);
      onNavigate("calendario"); // redirigir tras login exitoso
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className={styles.root}>
      {/* Panel decorativo izquierdo */}
      <div className={styles.lateral}>
        <div className={styles.lateralContenido}>
          <div className={styles.ornamento}>❧</div>
          <h1 className={styles.lateralTitulo}>El Ruedo<br />del Cuentero</h1>
          <p className={styles.lateralSub}>Narración Oral · Bogotá</p>
          <div className={styles.lateralSeparador} />
          <p className={styles.lateralCita}>
            "Toda historia necesita<br />una voz que la despierte."
          </p>
        </div>
      </div>

      {/* Formulario derecho */}
      <div className={styles.formularioWrap}>
        <form className={styles.formulario} onSubmit={handleSubmit} noValidate>

          <h2 className={styles.titulo}>Bienvenido de vuelta</h2>
          <p className={styles.subtitulo}>Ingresa a tu cuenta para continuar</p>

          {error && (
            <div className={styles.errorBanner} role="alert">
              {error}
            </div>
          )}

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              className={styles.input}
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={cargando}
          >
            {cargando ? "Ingresando…" : "Ingresar"}
          </button>

          <p className={styles.linkRegistro}>
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => onNavigate("registro")}
            >
              Regístrate aquí
            </button>
          </p>

        </form>
      </div>
    </div>
  );
}