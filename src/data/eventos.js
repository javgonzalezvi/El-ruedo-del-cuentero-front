/**
 * datos/eventos.js
 *
 * Datos simulados del calendario.
 * En producción, estos vendrán de la API Django:
 *   GET /api/eventos/
 *   GET /api/eventos/:id/
 *
 * Estructura de cada evento = espejo del modelo Django `Evento`.
 */

export const EVENTOS = [
    {
        id: 1,
        titulo: "Noche de Cuentos Alrededor del Fuego",
        categoria: "CUENTO",
        categoriaColor: "#C8572A",
        fecha: new Date(2024, 9, 15),
        hora: "7:00 PM – 10:00 PM COT",
        lugar: "Plaza Central, Bogotá",
        detalleLugar: "Carrera 7 # 32-16, Piso 2",
        descripcion:
            "Una velada íntima donde los mejores cuenteros de la ciudad tejen historias al calor de antorchas y candelas. Un espacio para sentir la magia de la narración oral en su forma más pura.",
        imagen: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80",
        destacado: true,
        abierto: true,
    },
    {
        id: 2,
        titulo: "Taller de Narración Oral Ancestral",
        categoria: "TALLER",
        categoriaColor: "#2A6C8E",
        fecha: new Date(2024, 9, 22),
        hora: "10:00 AM – 1:00 PM COT",
        lugar: "Casa de la Cultura, Medellín",
        detalleLugar: "Calle 51 # 51-27",
        descripcion:
            "Aprende las técnicas de los narradores ancestrales andinos. El maestro Hernán Vargas compartirá los secretos de la voz, el cuerpo y el ritmo como herramientas del cuentero.",
        imagen: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=80",
        destacado: false,
        abierto: true,
    },
    {
        id: 3,
        titulo: "Festival de la Palabra Viva",
        categoria: "FESTIVAL",
        categoriaColor: "#7A3E8C",
        fecha: new Date(2024, 10, 5),
        hora: "9:00 AM – 8:00 PM COT",
        lugar: "Parque Simón Bolívar, Bogotá",
        detalleLugar: "Cra 60 con Calle 63",
        descripcion:
            "El festival más grande de narración oral del país reúne a más de 40 cuenteros de Latinoamérica en un día de historias, música y tradición. Entrada libre.",
        imagen: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80",
        destacado: false,
        abierto: true,
    },
    {
        id: 4,
        titulo: "Ruedo Abierto: Voces del Pacífico",
        categoria: "RUEDO",
        categoriaColor: "#3A7D44",
        fecha: new Date(2024, 9, 18),
        hora: "6:00 PM – 9:00 PM COT",
        lugar: "Teatro Libre, Cali",
        detalleLugar: "Calle 13 # 8-54",
        descripcion:
            "Un espacio abierto para que nuevos cuenteros compartan sus historias frente a un público cálido y receptivo. Esta edición celebra las tradiciones orales del Pacífico colombiano.",
        imagen: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80",
        destacado: false,
        abierto: false,
    },
];

/* Utilidades de calendario */
export const MESES = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

export const DIAS_SEMANA = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

export function obtenerDiasDelMes(anio, mes) {
    const primerDia = new Date(anio, mes, 1).getDay();
    const totalDias = new Date(anio, mes + 1, 0).getDate();
    return { primerDia, totalDias };
}
