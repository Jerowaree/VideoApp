const stats = [
  { icon: "users", value: "50,000+", label: "Usuarios" },
  { icon: "shield", value: "2,000,000", label: "Pagado" },
  { icon: "card", value: "100 PEN", label: "Retiro mín." },
  { icon: "star", value: "4.9/5", label: "Calificación" },
];

function StatIcon({ type }: { type: string }) {
  if (type === "users") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3" /><path d="M3 20c.4-3.2 2.3-5 6-5s5.6 1.8 6 5M15 5.5a3 3 0 0 1 0 5.8M17 15c2.4.5 3.7 2.1 4 5" /></svg>;
  if (type === "shield") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.6-3 8.1-7 10-4-1.9-7-5.4-7-10V6z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></svg>;
  if (type === "card") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z" /></svg>;
}

export default function TrustStats() {
  return (
    <section className="trust-stats" aria-label="Cifras de la plataforma">
      {stats.map((stat) => (
        <div className="trust-stat" key={stat.label}>
          <span className="trust-stat-icon"><StatIcon type={stat.icon} /></span>
          <strong>{stat.value}</strong>
          <small>{stat.label}</small>
        </div>
      ))}
    </section>
  );
}
