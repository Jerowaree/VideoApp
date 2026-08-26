import Image from "next/image";
import Link from "next/link";
import type { Task } from "@/lib/tasks";
import { getTaskIconSymbol } from "@/lib/tasks";

type TaskDetailViewProps = {
  task: Task;
};

export default function TaskDetailView({ task }: TaskDetailViewProps) {
  return (
    <section className="task-detail-shell">
      <Link className="task-detail-back" href="/dashboard">
        ← Volver a tareas
      </Link>

      <div className="task-detail-hero">
        <span className={`task-icon task-icon-${task.tone}`} aria-hidden="true">
          {getTaskIconSymbol(task.category)}
        </span>
        <div className="task-detail-hero-copy">
          <p className="eyebrow">{task.category}</p>
          <h1>{task.title}</h1>
          <p>{task.summary}</p>
        </div>
        <div className="task-detail-meta">
          <span>
            <b>Recompensa</b>
            {task.reward}
          </span>
          <span>
            <b>Tiempo estimado</b>
            {task.time}
          </span>
          <span>
            <b>Estado</b>
            {task.status}
          </span>
        </div>
      </div>

      <div className="task-detail-grid">
        <article className="task-detail-card">
          <h2>Detalle</h2>
          <p>{task.details}</p>
          <div className="task-detail-actions">
            <button type="button" className="task-detail-primary">
              Iniciar tarea
            </button>
            <button type="button" className="task-detail-secondary">
              Guardar para después
            </button>
          </div>
        </article>

        <aside className="task-detail-card task-detail-preview">
          <div className="task-detail-image-wrap">
            <Image
              src={task.image}
              alt={task.title}
              fill
              sizes="(max-width: 768px) 100vw, 360px"
              className="task-detail-image"
            />
          </div>
          <div>
            <h2>Cómo completarla</h2>
            <ol className="task-detail-steps">
              {task.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
