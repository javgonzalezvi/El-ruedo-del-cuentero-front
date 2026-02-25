/**
 * data/usuario.js
 * En producción: GET /api/usuario/perfil/ (token auth)
 */
export const USUARIO_MOCK = {
  nombres: "Carlos Andrés",
  apellidos: "Mendoza Ruiz",
  correo: "carlos.mendoza@email.com",
  telefono: "+57 310 456 7890",
  ciudad: "Bogotá, Colombia",
  miembroDesde: new Date(2023, 2, 15),
  avatar: "https://i.pravatar.cc/150?img=68",
  gustos: ["CUENTO", "FESTIVAL", "TALLER"],
};

export const TIPOS_EVENTO = [
  { id: "CUENTO",   label: "Noches de cuento",     icono: "📖" },
  { id: "FESTIVAL", label: "Festivales",            icono: "🎪" },
  { id: "TALLER",   label: "Talleres y formación",  icono: "🎓" },
  { id: "RUEDO",    label: "Ruedos abiertos",       icono: "🔥" },
  { id: "INFANTIL", label: "Narración infantil",    icono: "🧒" },
  { id: "MUSICA",   label: "Narración con música",  icono: "🎵" },
];
