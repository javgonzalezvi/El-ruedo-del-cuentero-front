/**
 * context/AuthContext.jsx
 *
 * Contexto global de autenticación.
 * Provee a toda la app: usuario, token, login, logout, registro.
 *
 * Uso en cualquier componente:
 *   const { usuario, login, logout, cargando } = useAuth();
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI, guardarTokens, borrarTokens, getAccessToken, getRefreshToken, usuarioAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario]   = useState(null);   // datos del usuario autenticado
  const [cargando, setCargando] = useState(true);   // true mientras verifica sesión al cargar

  // ── Cargar perfil desde el token guardado al iniciar la app ──
  useEffect(() => {
    async function verificarSesion() {
      const token = getAccessToken();
      if (!token) {
        setCargando(false);
        return;
      }
      try {
        const res = await usuarioAPI.perfil();
        if (res.ok) {
          const data = await res.json();
          setUsuario(data);
        } else {
          borrarTokens();
        }
      } catch {
        borrarTokens();
      } finally {
        setCargando(false);
      }
    }
    verificarSesion();
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────
  const login = useCallback(async (correo, password) => {
    const res = await authAPI.login(correo, password);

    if (!res.ok) {
      const err = await res.json();
      // Django devuelve detail o non_field_errors
      const mensaje = err.detail || err.non_field_errors?.[0] || "Credenciales incorrectas.";
      throw new Error(mensaje);
    }

    const tokens = await res.json();
    guardarTokens(tokens);

    // Cargar datos del usuario
    const perfilRes = await usuarioAPI.perfil();
    const perfil    = await perfilRes.json();
    setUsuario(perfil);

    return perfil;
  }, []);

  // ── Registro ───────────────────────────────────────────────────────────
  const registro = useCallback(async (datos) => {
    const res = await authAPI.registro(datos);

    if (!res.ok) {
      const err = await res.json();
      // Devolver el primer error de validación que encuentre
      const campo  = Object.keys(err)[0];
      const mensaje = Array.isArray(err[campo]) ? err[campo][0] : err[campo];
      throw new Error(mensaje);
    }

    // Después del registro, hacer login automático
    await login(datos.correo, datos.password);
  }, [login]);

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    try {
      if (refresh) await authAPI.logout(refresh);
    } catch {
      // Si falla el logout en el server, igual limpiamos localmente
    } finally {
      borrarTokens();
      setUsuario(null);
    }
  }, []);

  // ── Helpers de rol ─────────────────────────────────────────────────────
  const esCuentero  = usuario?.es_cuentero  ?? false;
  const estaLogueado = !!usuario;

  return (
    <AuthContext.Provider value={{
      usuario,
      cargando,
      estaLogueado,
      esCuentero,
      login,
      logout,
      registro,
      setUsuario,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para consumir el contexto fácilmente
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}