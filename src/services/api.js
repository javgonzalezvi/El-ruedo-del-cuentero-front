/**
 * services/api.js
 *
 * Capa de comunicación centralizada con el backend Django.
 * - Adjunta automáticamente el token JWT en cada petición
 * - Renueva el access token si expira (usando refresh token)
 * - Redirige al login si el refresh también expiró
 */

// En desarrollo: http://127.0.0.1:8000/api
// En producción: la variable VITE_API_URL del archivo .env del front
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

// ── Helpers de localStorage ────────────────────────────────────────────────
export const getAccessToken  = () => localStorage.getItem("access");
export const getRefreshToken = () => localStorage.getItem("refresh");

export const guardarTokens = ({ access, refresh }) => {
  localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
};

export const borrarTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

// ── Renovar access token ───────────────────────────────────────────────────
async function renovarToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${BASE_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    borrarTokens();
    return null;
  }

  const data = await res.json();
  localStorage.setItem("access", data.access);
  return data.access;
}

// ── Fetch principal con manejo automático de JWT ───────────────────────────
export async function apiFetch(endpoint, options = {}) {
  let token = getAccessToken();

  const hacerPeticion = (tkn) => {
    const headers = {
      ...options.headers,
    };

    // Solo agregar Content-Type si no es FormData (archivos)
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (tkn) {
      headers["Authorization"] = `Bearer ${tkn}`;
    }

    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  };

  let res = await hacerPeticion(token);

  // Si el token expiró (401), intentar renovar y reintentar
  if (res.status === 401 && getRefreshToken()) {
    token = await renovarToken();
    if (token) {
      res = await hacerPeticion(token);
    }
  }

  return res;
}

// ── Endpoints de autenticación ─────────────────────────────────────────────
export const authAPI = {
  login: (correo, password) =>
    fetch(`${BASE_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password }),
    }),

  logout: (refresh) =>
    fetch(`${BASE_URL}/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAccessToken()}`,
      },
      body: JSON.stringify({ refresh }),
    }),

  registro: (datos) =>
    fetch(`${BASE_URL}/usuarios/registro/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    }),
};

// ── Endpoints de recursos ──────────────────────────────────────────────────
export const eventosAPI = {
  listar:  (params = "") => apiFetch(`/eventos/${params}`),
  detalle: (id)          => apiFetch(`/eventos/${id}/`),
  crear:   (datos)       => apiFetch("/eventos/", { method: "POST", body: JSON.stringify(datos) }),
  editar:  (id, datos)   => apiFetch(`/eventos/${id}/`, { method: "PATCH", body: JSON.stringify(datos) }),
  borrar:  (id)          => apiFetch(`/eventos/${id}/`, { method: "DELETE" }),
};

export const noticiasAPI = {
  listar:  (params = "") => apiFetch(`/noticias/${params}`),
  detalle: (slug)        => apiFetch(`/noticias/${slug}/`),
  crear:   (datos)       => apiFetch("/noticias/", { method: "POST", body: JSON.stringify(datos) }),
  editar:  (slug, datos) => apiFetch(`/noticias/${slug}/`, { method: "PATCH", body: JSON.stringify(datos) }),
  borrar:  (slug)        => apiFetch(`/noticias/${slug}/`, { method: "DELETE" }),
};

export const entrevistasAPI = {
  listar:  (params = "") => apiFetch(`/entrevistas/${params}`),
  detalle: (slug)        => apiFetch(`/entrevistas/${slug}/`),
  crear:   (formData)    => apiFetch("/entrevistas/", { method: "POST", body: formData }),
  editar:  (slug, datos) => apiFetch(`/entrevistas/${slug}/`, { method: "PATCH", body: datos }),
  borrar:  (slug)        => apiFetch(`/entrevistas/${slug}/`, { method: "DELETE" }),
};

export const usuarioAPI = {
  perfil:          ()      => apiFetch("/usuarios/perfil/"),
  actualizarPerfil:(datos) => apiFetch("/usuarios/perfil/", { method: "PATCH", body: JSON.stringify(datos) }),
  misEventos:      ()      => apiFetch("/usuarios/mis-eventos/"),
  guardarEvento:   (id)    => apiFetch("/usuarios/mis-eventos/", { method: "POST", body: JSON.stringify({ evento_id: id }) }),
  quitarEvento:    (id)    => apiFetch(`/usuarios/mis-eventos/${id}/`, { method: "DELETE" }),
};


// ── Normalizadores: API (snake_case) → Frontend (camelCase) ───────────────
// Traducen los campos del backend al formato que esperan los componentes.

export function normalizarNoticia(n) {
  return {
    ...n,
    // Fechas → objeto Date
    fechaPublicacion: n.fecha_publicacion ? new Date(n.fecha_publicacion) : new Date(),
    // Imagen
    imagenPortada: n.imagen_portada_final || n.imagen_portada_url || n.imagen_portada || "",
    // Categoría y color
    categoria:      n.categoria      ?? "",
    categoriaColor: n.categoria_color ?? "#C8572A",
    // Tiempo de lectura
    tiempoLectura: n.tiempo_lectura ?? 5,
    // Autor — normalizar a la forma que espera TarjetaNoticia/ArticuloVisor
    autor: n.autor ? {
      nombre: n.autor.nombre_completo ?? `${n.autor.nombres ?? ""} ${n.autor.apellidos ?? ""}`.trim(),
      avatar: n.autor.avatar ?? "",
      rol:    n.autor.rol    ?? "",
    } : { nombre: "Equipo Ruedo", avatar: "", rol: "" },
    // Bloques de contenido (ArticuloVisor usa noticia.contenido)
    contenido: n.bloques ?? [],
  };
}

export function normalizarEntrevista(e) {
  return {
    ...e,
    // Fecha → objeto Date
    fecha: e.fecha_publicacion ? new Date(e.fecha_publicacion) : new Date(),
    // Imagen y audio
    imagen:        e.imagen_final  || e.imagen_url  || e.imagen  || "",
    audio:         e.audio_final   || e.audio_url   || "",
    // Categoría y color
    categoriaColor: e.categoria_color ?? "#C8572A",
  };
}

export function normalizarEvento(ev) {
  return {
    ...ev,
    fecha:     new Date(ev.fecha),
    imagen:    ev.imagen_final || ev.imagen_url || ev.imagen || null,
    categoria: ev.categoria?.nombre ?? ev.categoria ?? "",
    color:     ev.categoria?.color  ?? "#C8572A",
  };
}