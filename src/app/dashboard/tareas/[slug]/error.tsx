"use client";

export default function TaskError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="task-detail-page">
      <section className="task-detail-shell">
        <div className="task-detail-loading">
          <strong>No pudimos abrir la tarea</strong>
          <span>{error.message}</span>
          <button type="button" className="task-detail-primary" onClick={reset}>
            Reintentar
          </button>
        </div>
      </section>
    </main>
  );
}
