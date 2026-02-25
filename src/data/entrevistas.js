/**
 * data/entrevistas.js
 * En producción: GET /api/entrevistas/
 */
export const ENTREVISTAS = [
  {
    id: 1,
    titulo: "Hernán Vargas: 'El cuentero necesita silencio para existir'",
    entrevistado: "Hernán Vargas",
    rol: "Cuentero y gestor cultural, Bogotá",
    categoria: "MAESTROS",
    categoriaColor: "#C8572A",
    resumen: "El cuentero bogotano con 30 años de oficio habla sobre el silencio, la plaza pública y el futuro de la narración oral en Colombia.",
    imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    duracion: "38:24",
    fecha: new Date(2024, 9, 12),
    audioSrc: null, // En producción: URL del archivo de audio
    descripcionLarga: "Hernán Vargas lleva tres décadas parado en plazas, teatros y salones escolares construyendo mundos con la voz. En esta conversación reflexiona sobre el oficio del cuentero, la relación con el público y por qué la narración oral nunca podrá reemplazarse por pantallas.",
  },
  {
    id: 2,
    titulo: "Manuela Posada: 'Recuperar los cuentos de mujeres es un acto político'",
    entrevistado: "Manuela Posada",
    rol: "Narradora oral, Cali",
    categoria: "VOCES NUEVAS",
    categoriaColor: "#7A3E8C",
    resumen: "La narradora caleña habla sobre el repertorio femenino en la tradición oral y su espectáculo 'Las que no callan'.",
    imagen: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
    duracion: "44:07",
    fecha: new Date(2024, 9, 5),
    audioSrc: null,
    descripcionLarga: "Manuela Posada comenzó narrando cuentos infantiles en bibliotecas públicas de Cali. Hoy lleva su trabajo a festivales en diez países. En esta entrevista habla del canon oral androcéntrico, de las mujeres invisibilizadas en los cuentos tradicionales y de cómo recuperarlas.",
  },
  {
    id: 3,
    titulo: "Eduardo Pimentel: 'Argentina tiene una de las escuelas de narración más sólidas del mundo'",
    entrevistado: "Eduardo Pimentel",
    rol: "Narrador oral, Buenos Aires",
    categoria: "INTERNACIONAL",
    categoriaColor: "#2A6C8E",
    resumen: "El maestro argentino, de visita en Colombia por primera vez en 15 años, reflexiona sobre la tradición rioplatense y sus diferencias con la narración colombiana.",
    imagen: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
    duracion: "51:33",
    fecha: new Date(2024, 9, 19),
    audioSrc: null,
    descripcionLarga: "Eduardo Pimentel es una leyenda viva de la narración oral en el Río de la Plata. A sus 68 años sigue girando por Latinoamérica con la misma energía de sus primeros años. Esta entrevista fue grabada en Bogotá, horas antes de su presentación en el Festival Iberoamericano.",
  },
  {
    id: 4,
    titulo: "Colectivo Bocas del Diablo: 'La cuentería también puede ser multimedia'",
    entrevistado: "Bocas del Diablo",
    rol: "Colectivo de narración experimental, Medellín",
    categoria: "EXPERIMENTALES",
    categoriaColor: "#3A7D44",
    resumen: "Los cuatro integrantes del colectivo más disruptivo de la escena explican cómo mezclan narración oral, música en vivo y video en sus puestas en escena.",
    imagen: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&q=80",
    duracion: "29:15",
    fecha: new Date(2024, 8, 28),
    audioSrc: null,
    descripcionLarga: "Nacidos en Medellín en 2019, los integrantes de Bocas del Diablo vienen del teatro, la música electrónica, las artes visuales y la literatura. Su trabajo rompe con la imagen del cuentero solitario frente a un público y propone experiencias inmersivas donde la voz es uno más de los elementos.",
  },
];

export const CATEGORIAS_ENTREVISTAS = ["Todas", "MAESTROS", "VOCES NUEVAS", "INTERNACIONAL", "EXPERIMENTALES"];
