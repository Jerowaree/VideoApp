export type TaskTone = "blue" | "coral" | "mint";

export type Task = {
  slug: string;
  title: string;
  category: string;
  reward: string;
  time: string;
  tone: TaskTone;
  status: string;
  action: string;
  image: string;
  summary: string;
  details: string;
  steps: string[];
};

export type TaskSection = "home" | "tasks" | "withdrawals";

export const tasks: Task[] = [
  {
    slug: "descubre-la-app-nubi",
    title: "Descubre la app Nubi",
    category: "Apps",
    reward: "S/ 2.50",
    time: "3 min",
    tone: "blue",
    status: "Disponible",
    action: "Comentar en el producto",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    summary: "Explora la app y comparte una opinión breve sobre la experiencia.",
    details:
      "Abre la app, revisa su navegación principal y deja un comentario corto con lo que más te llamó la atención. Esta tarea está pensada para completarse rápido desde el celular.",
    steps: [
      "Abre la aplicación desde tu dispositivo.",
      "Navega por la pantalla principal durante unos segundos.",
      "Comparte una opinión breve sobre lo que viste.",
    ],
  },
  {
    slug: "video-habitos-que-suman",
    title: "Video: hábitos que suman",
    category: "Videos",
    reward: "S/ 1.80",
    time: "2 min",
    tone: "coral",
    status: "Disponible",
    action: "Seguir la cuenta",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
    summary: "Mira el video y sigue la cuenta para activar la recompensa.",
    details:
      "Reproduce el contenido completo y verifica la cuenta indicada. Es una tarea corta, ideal para resolverla sin salir del flujo principal.",
    steps: [
      "Reproduce el video completo.",
      "Sigue la cuenta indicada en la tarea.",
      "Regresa al panel para continuar.",
    ],
  },
  {
    slug: "encuesta-sobre-entretenimiento",
    title: "Encuesta sobre entretenimiento",
    category: "Encuestas",
    reward: "S/ 3.20",
    time: "5 min",
    tone: "mint",
    status: "Disponible",
    action: "Responder encuesta",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    summary: "Completa una encuesta breve sobre tus hábitos de entretenimiento.",
    details:
      "Responde unas pocas preguntas sobre tus preferencias. La recompensa se habilita cuando envías todas las respuestas.",
    steps: [
      "Lee cada pregunta con calma.",
      "Responde según tu experiencia real.",
      "Envía la encuesta para completar la tarea.",
    ],
  },
  {
    slug: "opiniones-sobre-musica",
    title: "Opiniones sobre música",
    category: "Encuestas",
    reward: "S/ 1.20",
    time: "2 min",
    tone: "blue",
    status: "Nueva",
    action: "Seguir la cuenta",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    summary: "Explora la propuesta musical y deja una valoración rápida.",
    details:
      "Revisa el contenido propuesto y completa la interacción solicitada. La tarea está diseñada para ser simple y directa.",
    steps: [
      "Abre el contenido musical.",
      "Interactúa con la cuenta o publicación indicada.",
      "Confirma la tarea desde el panel.",
    ],
  },
  {
    slug: "aprende-sobre-finanzas",
    title: "Aprende sobre finanzas",
    category: "Videos",
    reward: "S/ 2.10",
    time: "4 min",
    tone: "coral",
    status: "Disponible",
    action: "Comentar en el producto",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    summary: "Revisa el video y comenta una idea útil sobre el tema.",
    details:
      "Mira el contenido hasta el final y deja un comentario breve. La tarea combina visualización y participación sencilla.",
    steps: [
      "Reproduce el video completo.",
      "Identifica la idea principal.",
      "Escribe un comentario breve y útil.",
    ],
  },
  {
    slug: "prueba-el-buscador-vela",
    title: "Prueba el buscador Vela",
    category: "Apps",
    reward: "S/ 4.00",
    time: "6 min",
    tone: "mint",
    status: "Nueva",
    action: "Probar y opinar",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    summary: "Usa la app y comparte tu opinión sobre la experiencia.",
    details:
      "Instala o abre la app, navega algunos minutos y deja una opinión sobre su funcionamiento. Es la tarea con mayor recompensa de esta lista.",
    steps: [
      "Abre la app desde el enlace indicado.",
      "Prueba la búsqueda o función principal.",
      "Deja una opinión corta sobre la experiencia.",
    ],
  },
];

export function getTaskBySlug(slug: string) {
  return tasks.find((task) => task.slug === slug);
}

export function getTaskIconSymbol(category: Task["category"]) {
  if (category === "Apps") return "⌘";
  if (category === "Videos") return "▶";
  return "◌";
}
