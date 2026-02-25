/**
 * data/noticias.js
 *
 * Datos simulados de noticias y artículos.
 * En producción vendrán de la API Django:
 *   GET /api/noticias/
 *   GET /api/noticias/:slug/
 *
 * Estructura espejo del modelo Django `Noticia` + `BloqueContenido`.
 */

/**
 * Cada artículo tiene un array `contenido` de bloques.
 * Tipos de bloque:
 *   { tipo: "parrafo",  texto: "..." }
 *   { tipo: "imagen",   src: "...", pie: "..." }
 *   { tipo: "subtitulo", texto: "..." }
 *   { tipo: "cita",     texto: "...", autor: "..." }
 */
export const NOTICIAS = [
    {
        id: 1,
        slug: "renacimiento-cuenteria-colombia",
        titulo: "El renacimiento de la cuentería en Colombia: voces que resisten",
        categoria: "CRÓNICA",
        categoriaColor: "#C8572A",
        resumen: "Un recorrido por los nuevos espacios donde la narración oral vuelve a congregar multitudes en ciudades y pueblos colombianos.",
        imagenPortada: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=80",
        autor: {
            nombre: "Valentina Ríos Cardona",
            rol: "Periodista cultural",
            avatar: "https://i.pravatar.cc/80?img=47",
        },
        fechaPublicacion: new Date(2024, 9, 10),
        tiempoLectura: 8,
        contenido: [
            {
                tipo: "parrafo",
                texto: "Hay algo ancestral en el acto de reunirse alrededor de una voz. Antes de la escritura, antes de los libros, antes del cine y las pantallas, existía el cuentero: esa figura que tomaba la palabra y construía mundos con ella. En Colombia, esa tradición nunca murió del todo, pero durante décadas pareció replegarse hacia los márgenes, hacia los festivales de nicho, hacia los salones escolares un poco olvidados.",
            },
            {
                tipo: "parrafo",
                texto: "Hoy, sin embargo, algo está cambiando. En Bogotá, en Medellín, en Manizales y hasta en municipios como Ciénaga y Mompox, los ruedos de cuenteros vuelven a llenarse. Jóvenes que descubrieron la narración oral en YouTube se mezclan con maestros de setenta años que aprendieron de sus abuelos. La mezcla es explosiva.",
            },
            {
                tipo: "subtitulo",
                texto: "La plaza como escenario",
            },
            {
                tipo: "parrafo",
                texto: "El fenómeno no es espontáneo. Detrás de cada ruedo hay organizadores, gestores culturales, alcaldías que por fin ven en la tradición oral un patrimonio digno de financiación. El Festival Iberoamericano de Cuentería, que lleva más de dos décadas convocando narradores de toda América Latina, ha servido de catalizador. Pero lo nuevo está ocurriendo fuera de los teatros.",
            },
            {
                tipo: "imagen",
                src: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=900&q=80",
                pie: "Taller de narración oral en la Casa de la Cultura de Medellín. Foto: Archivo Festival.",
            },
            {
                tipo: "parrafo",
                texto: "\"La plaza pública es el origen de todo esto\", dice Hernán Vargas, cuentero bogotano con treinta años de oficio. \"El teatro es bonito, pero la plaza te pone a prueba. Ahí no hay butacas que te atrapen: el público puede irse en cualquier momento. Eso te obliga a ser honesto.\" Vargas lleva cuatro años organizando ruedos mensuales en el Parque de los Periodistas, y la convocatoria no para de crecer.",
            },
            {
                tipo: "cita",
                texto: "La voz humana es la tecnología más poderosa que existe. Puede hacer llorar, reír, temblar. Y no necesita batería.",
                autor: "Hernán Vargas, cuentero",
            },
            {
                tipo: "subtitulo",
                texto: "Las nuevas generaciones y el dilema digital",
            },
            {
                tipo: "parrafo",
                texto: "Paradójicamente, las redes sociales han sido aliadas inesperadas. Cuenteros como Manuela Posada o el colectivo 'Voces del Pacífico' han encontrado en Instagram y TikTok una forma de mostrar fragmentos de su trabajo, generar expectativa y llenar los espacios presenciales. \"Primero te ven en el teléfono, luego vienen a verte en persona\", explica Posada. \"Es al revés de lo que muchos creen.\"",
            },
            {
                tipo: "imagen",
                src: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900&q=80",
                pie: "Festival de la Palabra Viva, Parque Simón Bolívar, Bogotá. Más de 3.000 asistentes en su última edición.",
            },
            {
                tipo: "parrafo",
                texto: "El reto, dicen los veteranos, es mantener la profundidad cuando todo empuja hacia la inmediatez. Un cuento bien narrado puede durar cuarenta minutos. En un mundo de reels de treinta segundos, eso parece una eternidad. Y, sin embargo, la gente escucha. Eso, quizá, es la señal más esperanzadora de todas.",
            },
        ],
    },

    {
        id: 2,
        slug: "tecnicas-narrador-oral",
        titulo: "Siete técnicas que todo narrador oral debería dominar",
        categoria: "GUÍA",
        categoriaColor: "#2A6C8E",
        resumen: "Desde el manejo de la voz hasta el uso del silencio como herramienta dramática: una guía práctica para quienes quieren iniciarse en el arte de contar.",
        imagenPortada: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&q=80",
        autor: {
            nombre: "Jorge Esteban Palacios",
            rol: "Maestro de narración oral",
            avatar: "https://i.pravatar.cc/80?img=12",
        },
        fechaPublicacion: new Date(2024, 9, 3),
        tiempoLectura: 6,
        contenido: [
            {
                tipo: "parrafo",
                texto: "Contar historias es una habilidad tan antigua como el lenguaje, pero eso no significa que sea fácil. El narrador oral trabaja con un instrumento único e irrepetible: su propio cuerpo. La voz, la postura, la mirada, el ritmo de la respiración: todo comunica. Aquí van siete técnicas fundamentales que he enseñado durante veinte años en talleres de narración.",
            },
            {
                tipo: "subtitulo",
                texto: "1. El silencio también habla",
            },
            {
                tipo: "parrafo",
                texto: "Los narradores novatos tienen miedo al silencio y lo llenan con muletillas. Aprende a abrazar la pausa. Un segundo de silencio antes del clímax de una historia vale más que diez adjetivos. Practica haciendo pausas deliberadas en momentos clave y observa cómo el público se inclina hacia adelante.",
            },
            {
                tipo: "subtitulo",
                texto: "2. La variación de velocidad",
            },
            {
                tipo: "parrafo",
                texto: "Una historia narrada a ritmo uniforme adormece. Acelera en las persecuciones, desacelera en los momentos de reflexión o tristeza. El contraste de velocidades es lo que le da vida al relato. Grábate narrando y escucha: probablemente vayas más parejo de lo que crees.",
            },
            {
                tipo: "imagen",
                src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80",
                pie: "Taller de voz y cuerpo en el Festival Iberoamericano de Cuentería, Bogotá.",
            },
            {
                tipo: "subtitulo",
                texto: "3. Los personajes hablan diferente",
            },
            {
                tipo: "parrafo",
                texto: "No tienes que hacer voces exageradas, pero cada personaje debe tener al menos un rasgo vocal distintivo: un poco más agudo, un poco más lento, una tendencia a susurrar o a declamar. Eso ayuda al oyente a seguir quién habla sin necesidad de aclaraciones constantes.",
            },
            {
                tipo: "cita",
                texto: "No cuentes lo que pasó. Haz que pase de nuevo, aquí, ahora, frente a nosotros.",
                autor: "Jorge Esteban Palacios",
            },
            {
                tipo: "subtitulo",
                texto: "4. La mirada como anzuelo",
            },
            {
                tipo: "parrafo",
                texto: "Mira a las personas, no al aire. Establece contacto visual real con distintas partes del público. Cuando miras a alguien a los ojos mientras narras, esa persona siente que la historia le pertenece. Es un truco poderoso y completamente gratuito.",
            },
            {
                tipo: "subtitulo",
                texto: "5. El cuerpo ocupa el espacio",
            },
            {
                tipo: "parrafo",
                texto: "Un narrador que habla siempre desde el mismo punto del escenario se vuelve invisible. Muévete con intención: acércate al público en los momentos de intimidad, retrocede cuando el personaje huye, usa los distintos planos del espacio para distinguir lugares y tiempos en la historia.",
            },
            {
                tipo: "subtitulo",
                texto: "6. La repetición como recurso poético",
            },
            {
                tipo: "parrafo",
                texto: "En la tradición oral, la repetición no es un error: es un patrón que hipnotiza. Los cuentos populares repiten estructuras ('fue el primero, fue el segundo, fue el tercero…') porque eso permite al oyente anticipar y participar mentalmente. No le temas a repetir frases o estructuras clave.",
            },
            {
                tipo: "subtitulo",
                texto: "7. El final es el principio",
            },
            {
                tipo: "parrafo",
                texto: "Diseña tu final antes de empezar a narrar. El cierre de un cuento debe sentirse inevitable, como si toda la historia hubiera estado construyendo exactamente hacia ese momento. Si tu final sorprende pero también satisface, habrás logrado algo difícil y hermoso.",
            },
        ],
    },

    {
        id: 3,
        slug: "festival-iberoamericano-2024",
        titulo: "Festival Iberoamericano de Cuentería 2024: lo que no puedes perderte",
        categoria: "EVENTO",
        categoriaColor: "#7A3E8C",
        resumen: "Agenda completa, narradores invitados y los eventos gratuitos del festival más importante de narración oral en América Latina.",
        imagenPortada: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&q=80",
        autor: {
            nombre: "Camila Suárez Montoya",
            rol: "Editora de cultura",
            avatar: "https://i.pravatar.cc/80?img=23",
        },
        fechaPublicacion: new Date(2024, 9, 18),
        tiempoLectura: 5,
        contenido: [
            {
                tipo: "parrafo",
                texto: "El Festival Iberoamericano de Cuentería regresa este noviembre a Bogotá con una edición especial que celebra sus 25 años de historia. Diez días, más de ochenta narradores de dieciséis países, y una propuesta que mezcla los formatos clásicos con experimentos sonoros y multimediales.",
            },
            {
                tipo: "subtitulo",
                texto: "Los nombres que no te puedes perder",
            },
            {
                tipo: "parrafo",
                texto: "Entre los invitados internacionales destacan la narradora cubana Lidia Machado, el maestro argentino Eduardo Pimentel —que visita Colombia por primera vez en quince años— y el colectivo brasileño 'Contadores de Minutos', famosos por sus narraciones site-specific en espacios urbanos no convencionales.",
            },
            {
                tipo: "imagen",
                src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80",
                pie: "Edición anterior del festival en el Teatro Jorge Eliécer Gaitán. Foto: Diego Martínez.",
            },
            {
                tipo: "parrafo",
                texto: "Por el lado colombiano, el cartel incluye a Hernán Vargas, Marina Ospina y al joven colectivo 'Bocas del Diablo', que en los últimos dos años se ha convertido en una de las propuestas más audaces de la escena local, mezclando cuentería con música en vivo y proyecciones visuales.",
            },
            {
                tipo: "cita",
                texto: "Veinticinco años después, el festival sigue siendo el lugar donde Colombia recuerda que tiene una de las tradiciones orales más ricas del planeta.",
                autor: "Luz Marina Giraldo, directora del festival",
            },
            {
                tipo: "subtitulo",
                texto: "Eventos gratuitos y espacios abiertos",
            },
            {
                tipo: "parrafo",
                texto: "Una de las apuestas más importantes de esta edición es la descentralización. Además de las funciones en teatros, el festival llevará ruedos gratuitos a seis localidades de Bogotá: Kennedy, Usme, Suba, Bosa, Ciudad Bolívar y Usaquén. Cada ruedo contará con narradores locales y al menos un invitado internacional.",
            },
            {
                tipo: "imagen",
                src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80",
                pie: "Ruedo abierto en el Parque de los Periodistas durante el festival 2023.",
            },
            {
                tipo: "parrafo",
                texto: "Las entradas para los eventos de sala ya están disponibles en la página oficial del festival. Los ruedos en espacios públicos son de entrada libre. El programa completo se publicará la primera semana de octubre.",
            },
        ],
    },

    {
        id: 4,
        slug: "mujeres-narradoras-latinoamerica",
        titulo: "Las voces que llenan el ruedo: mujeres narradoras en Latinoamérica",
        categoria: "REPORTAJE",
        categoriaColor: "#3A7D44",
        resumen: "Un retrato de las narradoras que están transformando la cuentería latinoamericana, rompiendo estereotipos y creando nuevos repertorios.",
        imagenPortada: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
        autor: {
            nombre: "Isabela Moreno Vega",
            rol: "Periodista y narradora",
            avatar: "https://i.pravatar.cc/80?img=35",
        },
        fechaPublicacion: new Date(2024, 8, 25),
        tiempoLectura: 10,
        contenido: [
            {
                tipo: "parrafo",
                texto: "Durante décadas, la imagen del cuentero fue casi exclusivamente masculina. El viejo sabio de la plaza, el juglar errante, el contador de historias que recorría pueblos: figuras que el imaginario colectivo asoció casi siempre con un hombre. Hoy esa imagen está siendo reescrita, y son las mujeres quienes están liderando algunos de los movimientos más interesantes de la narración oral en América Latina.",
            },
            {
                tipo: "parrafo",
                texto: "No es un fenómeno nuevo, pero sí uno que está ganando visibilidad. Desde México hasta Argentina, narradoras que llevan años construyendo su oficio en silencio empiezan a ocupar los escenarios centrales, a dirigir festivales, a publicar investigaciones sobre tradición oral.",
            },
            {
                tipo: "subtitulo",
                texto: "Repertorios que rompen el molde",
            },
            {
                tipo: "parrafo",
                texto: "Una de las transformaciones más significativas tiene que ver con los repertorios. Muchas narradoras han optado por recuperar cuentos tradicionales protagonizados por mujeres que no son ni víctimas ni princesas en espera, sino personajes complejos, contradictorios, poderosos. \"El canon oral también estaba sesgado\", dice Manuela Posada, narradora de Cali. \"Los cuentos que llegaron a nosotros pasaron por el filtro de quienes los escribieron, que casi siempre eran hombres. Recuperar las otras versiones es un acto político y artístico al mismo tiempo.\"",
            },
            {
                tipo: "imagen",
                src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80",
                pie: "Manuela Posada durante su espectáculo 'Las que no callan', Teatro Experimental de Cali.",
            },
            {
                tipo: "cita",
                texto: "Los cuentos que llegaron a nosotros pasaron por el filtro de quienes los escribieron. Recuperar las otras versiones es un acto político y artístico.",
                autor: "Manuela Posada, narradora",
            },
            {
                tipo: "parrafo",
                texto: "En Argentina, el colectivo 'Hilanderas' lleva ocho años tejiendo una red de narradoras que se reúnen mensualmente para compartir historias y crear material nuevo. Su archivo de cuentos de tradición oral femenina latinoamericana es ya una referencia para investigadores de varias universidades.",
            },
            {
                tipo: "subtitulo",
                texto: "El cuerpo como territorio narrativo",
            },
            {
                tipo: "parrafo",
                texto: "Otra característica de muchas de estas narradoras es la relación con el cuerpo. Frente a una tradición que privilegiaba la voz y relegaba el gesto, varias de ellas han desarrollado lenguajes corporales propios, influenciados por la danza, el teatro físico y las prácticas rituales indígenas y afrodescendientes.",
            },
            {
                tipo: "imagen",
                src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
                pie: "Taller de narración y movimiento en el marco del Festival de la Palabra, Manizales.",
            },
            {
                tipo: "parrafo",
                texto: "\"Mi cuerpo también cuenta\", dice la narradora venezolana Adriana Bermúdez, radicada en Bogotá. \"Cada gesto tiene un significado. No es decoración: es parte del texto.\" Su espectáculo 'Tierra en los pies', que mezcla narración oral con movimiento y música en vivo, ha recorrido once países en los últimos tres años.",
            },
        ],
    },
];
