"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMyProfile, signOut } from "@/lib/supabase/auth";
import {
  clearCachedProfileName,
  readCachedProfileName,
  writeCachedProfileName,
} from "@/lib/profile-cache";
import LoadingSpinner from "@/components/LoadingSpinner";
import { tasks } from "@/lib/tasks";
import { usePathname } from "next/navigation";
import TaskCard from "@/components/TaskCard";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(
    pathname.startsWith("/dashboard/tareas/") ? "tasks" : "home",
  );
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [openingTask, setOpeningTask] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    const hydrateProfile = async () => {
      const cachedName = readCachedProfileName();
      if (cachedName) {
        if (isCurrent) {
          setUserName(cachedName);
          setIsProfileLoading(false);
        }
        return;
      }

      try {
        const { data } = await getMyProfile();
        if (isCurrent) {
          const nextName = data?.name?.trim() || "Usuario";
          setUserName(nextName);
          writeCachedProfileName(nextName);
        }
      } catch {
        if (isCurrent) {
          setUserName("Usuario");
          writeCachedProfileName("Usuario");
        }
      } finally {
        if (isCurrent) setIsProfileLoading(false);
      }
    };

    void hydrateProfile();
    return () => {
      isCurrent = false;
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await signOut();
    if (!error) {
      clearCachedProfileName();
      router.push("/");
    }
    setIsLoggingOut(false);
  };

  const nameParts = (userName ?? "Usuario").split(/\s+/);
  const firstName = nameParts[0];
  const remainingName = nameParts.slice(1).join(" ");
  const openTask = (slug: string) => {
    setSelectedTask(slug);
    setOpeningTask(slug);
    setActiveModule("tasks");
    window.requestAnimationFrame(() => {
      router.push(`/dashboard/tareas/${slug}`);
    });
  };

  return (
    <main className="dashboard-page">
      {openingTask && (
        <div className="task-transition-loader" role="status" aria-live="polite">
          <div className="task-transition-loader-card">
            <div className="task-loading-badges" aria-hidden="true">
              <span className="task-loading-badge task-loading-badge-blue">
                ✦
              </span>
              <span className="task-loading-badge task-loading-badge-coral">
                ⌛
              </span>
              <span className="task-loading-badge task-loading-badge-mint">
                ✓
              </span>
            </div>
            <LoadingSpinner label="Abriendo detalle..." />
            <strong>
              {tasks.find((task) => task.slug === openingTask)?.title ||
                "Cargando tarea"}
            </strong>
            <span>Preparando tu vista de tarea</span>
          </div>
        </div>
      )}
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <span className="dashboard-brand-mark">✦</span>
          <span>Gana Fácil</span>
        </div>
        <nav className="dashboard-nav" aria-label="Navegación principal">
          <button
            className={activeModule === "home" ? "dashboard-nav-active" : ""}
            type="button"
            onClick={() => setActiveModule("home")}
          >
            Inicio
          </button>
          <button
            className={activeModule === "tasks" ? "dashboard-nav-active" : ""}
            type="button"
            onClick={() => setActiveModule("tasks")}
          >
            Mis tareas
          </button>
          <button
            className={
              activeModule === "withdrawals" ? "dashboard-nav-active" : ""
            }
            type="button"
            onClick={() => setActiveModule("withdrawals")}
          >
            Retiros
          </button>
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
              <TaskCard
                key={task.slug}
                task={task}
                selected={selectedTask === task.slug}
                onOpen={openTask}
              />
            ))}
          </div>
          {selectedTask && (
            <div className="task-open-notice" role="status">
              <span className="task-open-check" aria-hidden="true">✓</span>
              <span>
                <strong>Tarea seleccionada</strong>
                <small>
                  {tasks.find((task) => task.slug === selectedTask)?.title ||
                    selectedTask}
                </small>
              </span>
              <button type="button" onClick={() => setSelectedTask(null)}>
                Cerrar
              </button>
            </div>
          )}
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
        <nav className="dashboard-mobile-nav" aria-label="Navegación móvil">
          <button className={activeModule === "home" ? "dashboard-mobile-nav-active" : ""} type="button" onClick={() => setActiveModule("home")}>
            <span aria-hidden="true">⌂</span>
            Inicio
          </button>
          <button className={activeModule === "tasks" ? "dashboard-mobile-nav-active" : ""} type="button" onClick={() => setActiveModule("tasks")}>
            <span aria-hidden="true">☷</span>
            Tareas
          </button>
          <button className={activeModule === "withdrawals" ? "dashboard-mobile-nav-active" : ""} type="button" onClick={() => setActiveModule("withdrawals")}>
            <span aria-hidden="true">$</span>
            Retiros
          </button>
          <button type="button">
            <span aria-hidden="true">○</span>
            Perfil
          </button>
        </nav>
    </main>
  );
}
