"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="dashboard-page">
      <section className="task-detail-shell">
        <div className="task-detail-loading">
          <strong>No pudimos cargar el dashboard</strong>
          <span>{error.message}</span>
          <button type="button" className="task-detail-primary" onClick={reset}>
            Reintentar
          </button>
        </div>
      </section>
    </main>
  );
}
