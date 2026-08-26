import LoadingSpinner from "@/components/LoadingSpinner";

export default function TaskDetailLoading() {
  return (
    <main className="task-detail-page">
      <section className="task-detail-shell">
        <div className="task-detail-loading">
          <div className="task-loading-badges" aria-hidden="true">
            <span className="task-loading-badge task-loading-badge-blue">✦</span>
            <span className="task-loading-badge task-loading-badge-coral">⌛</span>
            <span className="task-loading-badge task-loading-badge-mint">✓</span>
          </div>
          <LoadingSpinner label="Abriendo tarea..." />
          <strong>Cargando detalle</strong>
          <span>Preparando la información de la tarea</span>
        </div>
      </section>
    </main>
  );
}
