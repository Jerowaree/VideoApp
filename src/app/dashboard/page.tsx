"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMyProfile, signOut } from "@/lib/supabase/auth";
import LoadingSpinner from "@/components/LoadingSpinner";

const tasks = [
  {
    title: "Descubre la app Nubi",
    category: "Apps",
    reward: "S/ 2.50",
    time: "3 min",
    tone: "blue",
    status: "Disponible",
  },
  {
    title: "Video: hábitos que suman",
    category: "Videos",
    reward: "S/ 1.80",
    time: "2 min",
    tone: "coral",
    status: "Disponible",
  },
  {
    title: "Encuesta sobre entretenimiento",
    category: "Encuestas",
    reward: "S/ 3.20",
    time: "5 min",
    tone: "mint",
    status: "Disponible",
  },
  {
    title: "Opiniones sobre música",
    category: "Encuestas",
    reward: "S/ 1.20",
    time: "2 min",
    tone: "blue",
    status: "Nueva",
  },
  {
    title: "Aprende sobre finanzas",
    category: "Videos",
    reward: "S/ 2.10",
    time: "4 min",
    tone: "coral",
    status: "Disponible",
  },
  {
    title: "Prueba el buscador Vela",
    category: "Apps",
    reward: "S/ 4.00",
    time: "6 min",
    tone: "mint",
    status: "Nueva",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    const loadProfile = async () => {
      try {
        const { data } = await getMyProfile();
        if (isCurrent) setUserName(data?.name?.trim() || "Usuario");
      } catch {
        if (isCurrent) setUserName("Usuario");
      } finally {
        if (isCurrent) setIsProfileLoading(false);
      }
    };

    void loadProfile();
    return () => {
      isCurrent = false;
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await signOut();
    if (!error) router.push("/");
    setIsLoggingOut(false);
  };

  const nameParts = (userName ?? "Usuario").split(/\s+/);
  const firstName = nameParts[0];
  const remainingName = nameParts.slice(1).join(" ");

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <span className="dashboard-brand-mark">✦</span>
          <span>Gana Fácil</span>
        </div>
        <nav className="dashboard-nav" aria-label="Navegación principal">
          <button className="dashboard-nav-active" type="button">
            Inicio
          </button>
          <button type="button">Mis tareas</button>
          <button type="button">Retiros</button>
        </nav>
        <button
          className="dashboard-logout"
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <span className="dashboard-avatar" aria-hidden="true">
            {isProfileLoading ? (
              <span className="dashboard-name-spinner" />
            ) : (
              userName?.charAt(0).toUpperCase()
            )}
          </span>
          <span>
            {isLoggingOut ? (
              <LoadingSpinner label="Saliendo..." />
            ) : (
              "Cerrar sesión"
            )}
          </span>
          {!isLoggingOut && (
            <span className="dashboard-logout-arrow" aria-hidden="true">
              ↗
            </span>
          )}
        </button>
      </header>

      <section className="dashboard-welcome">
        <div>
          <p className="eyebrow">Tu espacio de ganancias</p>
          <h1>
            Hola,{" "}
            {isProfileLoading ? (
              <span
                className="dashboard-name-loading"
                role="status"
                aria-label="Cargando nombre"
              >
                <span className="dashboard-name-spinner" />
              </span>
            ) : (
              <span
                className="dashboard-user-name"
                title={userName ?? "Usuario"}
              >
                <span>{firstName}</span>
                {remainingName && (
                  <span className="dashboard-user-name-rest">
                    {remainingName}
                  </span>
                )}
              </span>
            )}{" "}
          </h1>
          <p>Hay nuevas tareas esperándote hoy.</p>
        </div>
        <div className="dashboard-level">
          <span>Nivel actual</span>
          <strong>Explorador</strong>
          <div className="level-track">
            <span />
          </div>
          <small>320 / 500 puntos</small>
        </div>
      </section>

      <section className="dashboard-stats" aria-label="Resumen de ganancias">
        <article className="dashboard-stat dashboard-stat-primary">
          <span>Saldo disponible</span>
          <strong>S/ 24.80</strong>
          <small>+ S/ 8.40 esta semana</small>
        </article>
        <article className="dashboard-stat">
          <span>Tareas completadas</span>
          <strong>18</strong>
          <small>3 pendientes de pago</small>
        </article>
        <article className="dashboard-stat">
          <span>Racha activa</span>
          <strong>4 días</strong>
          <small>¡Sigue así!</small>
        </article>
      </section>

      <div className="dashboard-content-grid">
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <p className="eyebrow">Para ti</p>
              <h2>Tareas recomendadas</h2>
            </div>
            <button className="dashboard-link" type="button">
              Ver todas
            </button>
          </div>
          <div className="task-list" aria-label="Lista de tareas ficticias">
            {tasks.map((task) => (
              <article className="task-card" key={task.title}>
                <span
                  className={`task-icon task-icon-${task.tone}`}
                  aria-hidden="true"
                >
                  ✦
                </span>
                <div className="task-info">
                  <span>
                    {task.category} · {task.time} · <b>{task.status}</b>
                  </span>
                  <h3>{task.title}</h3>
                </div>
                <strong className="task-reward">{task.reward}</strong>
                <button
                  className="task-button"
                  type="button"
                  aria-label={`Empezar ${task.title}`}
                >
                  Empezar <span aria-hidden="true">→</span>
                </button>
              </article>
            ))}
          </div>
        </section>
        <aside className="dashboard-activity-panel">
          <div className="dashboard-section-heading">
            <div>
              <p className="eyebrow">En movimiento</p>
              <h2>Tu actividad</h2>
            </div>
            <span
              className="dashboard-live-dot"
              aria-label="Actividad en vivo"
            />
          </div>
          <div className="dashboard-activity-list">
            <div>
              <span className="activity-check">✓</span>
              <p>
                <strong>Video completado</strong>
                <small>Hace 12 min · + S/ 1.80</small>
              </p>
            </div>
            <div>
              <span className="activity-wallet">$</span>
              <p>
                <strong>Retiro procesado</strong>
                <small>Ayer · S/ 12.40 enviados</small>
              </p>
            </div>
            <div>
              <span className="activity-star">✦</span>
              <p>
                <strong>Nivel Explorador</strong>
                <small>Subiste de nivel esta semana</small>
              </p>
            </div>
          </div>
          <div className="dashboard-goal">
            <span>Meta semanal</span>
            <strong>
              S/ 18.40 <small>de S/ 25</small>
            </strong>
            <div>
              <span />
            </div>
            <p>Te faltan S/ 6.60 para lograrla</p>
          </div>
        </aside>
      </div>

      <section className="dashboard-payout">
        <div>
          <span className="dashboard-payout-icon">$</span>
          <div>
            <strong>Tu próximo retiro está cerca</strong>
            <span>Alcanza S/ 30 y solicita tu pago.</span>
          </div>
        </div>
        <button type="button" className="dashboard-payout-button">
          Ver retiros
        </button>
      </section>
    </main>
  );
}
