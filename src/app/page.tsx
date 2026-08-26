"use client";

import { useEffect, useRef, useState } from "react";
import { ValidationError } from "yup";
import AccountNotFoundModal from "@/components/AccountNotFoundModal";
import SuccessModal from "@/components/SuccessModal";
import RegistrationView from "@/components/RegistrationView";
import RegistrationModal from "@/components/RegistrationModal";
import ChatBubble from "@/components/ChatBubble";
import HoneypotField from "@/components/HoneypotField";
import LoadingSpinner from "@/components/LoadingSpinner";
import CountrySelector, {
  countries,
  type Country,
} from "@/components/CountrySelector";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validation/login-schema";
import { getMyProfile, signInWithPhone } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";

const peruvianNames = [
  "María Quiroga",
  "José Quispe",
  "Andrea Choquehuanta",
  "Luis Flores",
  "Romina Dávila",
  "Carlos Melendrez",
  "Daniela Rojas",
  "Miguel Castillo",
  "Lucía Chira",
  "Renato Lizano",
  "Alexandra Chávez",
  "Jorge Ocampo",
  "Camila Navarro",
  "Alonso Cárdenas",
  "Sofía Herrera",
  "Diego Morales",
  "Patricia León",
  "Rodrigo Siancas",
  "Carmen Huamán",
  "Sebastián Cabrera",
  "Alejandra Cervantes",
  "Martín Aguilar",
  "Gabriela Ibañez",
  "Fernando Peña",
];

const earnings = ["180 PEN", "420 PEN", "750 PEN", "260 PEN"];
function ActivityFeed() {
  const [activeNames, setActiveNames] = useState([0, 1, 2, 3]);
  const nextRow = useRef(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveNames((current) => {
        const next = [...current];
        const rowToUpdate = nextRow.current;
        next[rowToUpdate] = (next[rowToUpdate] + 4) % peruvianNames.length;
        return next;
      });
      nextRow.current = (nextRow.current + 1) % 4;
    }, 900);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="activity" aria-labelledby="activity-title">
      <div className="activity-heading">
        <div className="live-dot" />
        <h2 id="activity-title">Personas que ya están ganando</h2>
      </div>
      <div className="activity-card">
        <div className="activity-card-heading">
          <h3>Ganancias recientes</h3>
          <span className="live-pill">Actividad reciente</span>
        </div>
        <div className="name-stack" aria-live="polite">
          {activeNames.map((nameIndex, index) => {
            return (
              <div
                className={`earning-row row-${index}`}
                key={`${nameIndex}-${index}`}
              >
                <span className="earning-person">
                  <span className="earning-icon">
                    {index === 0 ? "✺" : "•"}
                  </span>
                  <strong>{peruvianNames[nameIndex]}</strong>
                  {index < 2 && <span className="earning-action">Retiro</span>}
                </span>
                <strong className="earning-amount">{earnings[index]}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const router = useRouter();
  const [country, setCountry] = useState<Country>(countries[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showAccountNotFound, setShowAccountNotFound] = useState(false);
  const [showPendingAccount, setShowPendingAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [showRecoveryNotice, setShowRecoveryNotice] = useState(false);
  const recoveryTimer = useRef<number | null>(null);
  const [formValues, setFormValues] = useState<LoginFormValues>({
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormValues, string>>
  >({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const honeypot = event.currentTarget.elements.namedItem(
      "website",
    ) as HTMLInputElement | null;
    if (honeypot?.value.trim()) return;
    setAuthError("");
    setAuthSuccess("");
    try {
      await loginSchema.validate(formValues, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      try {
        const { data, error } = await signInWithPhone(
          formValues.phone,
          formValues.password,
          country.code,
        );
        if (error) {
          const invalidCredentials =
            error.status === 400 ||
            error.message.toLowerCase().includes("invalid login");
          if (invalidCredentials) setShowAccountNotFound(true);
          else if (error.status === 422)
            setAuthError(
              "El acceso con número de celular no está habilitado en este momento. Contacta al administrador.",
            );
          else
            setAuthError(
              "No pudimos conectar con el servicio. Inténtalo nuevamente.",
            );
        } else {
          const profile = data.user ? await getMyProfile() : null;
          if (profile?.error)
            setAuthError(
              "No pudimos verificar el estado de tu cuenta. Inténtalo nuevamente.",
            );
          else if (profile?.data && !profile.data.is_active)
            setShowPendingAccount(true);
          else
            setAuthSuccess("Inicio de sesión exitoso. Bienvenido nuevamente.");
        }
      } catch {
        setAuthError(
          "No pudimos iniciar sesión. Inténtalo nuevamente en unos segundos.",
        );
      } finally {
        setIsSubmitting(false);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const nextErrors: Partial<Record<keyof LoginFormValues, string>> = {};
        error.inner.forEach((item) => {
          if (item.path && !nextErrors[item.path as keyof LoginFormValues]) {
            nextErrors[item.path as keyof LoginFormValues] = item.message;
          }
        });
        setErrors(nextErrors);
      }
    }
  };

  const handleRecoveryClick = () => {
    setShowRecoveryNotice(true);
    if (recoveryTimer.current) window.clearTimeout(recoveryTimer.current);
    recoveryTimer.current = window.setTimeout(() => {
      setShowRecoveryNotice(false);
      recoveryTimer.current = null;
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (recoveryTimer.current) window.clearTimeout(recoveryTimer.current);
    };
  }, []);

  if (showRegistration) {
    return <RegistrationView onBack={() => setShowRegistration(false)} />;
  }

  return (
    <main className="page-shell">
      <ActivityFeed />

      <section className="welcome" aria-labelledby="welcome-title">
        <p className="eyebrow">Tu próximo ingreso empieza aquí</p>
        <h1 id="welcome-title">¡Bienvenido de nuevo!</h1>
        <p className="welcome-copy">Continúa ganando dinero hoy</p>

        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <HoneypotField />
          <div className="phone-row">
            <CountrySelector value={country} onChange={setCountry} />
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ingresa tu celular"
              aria-label="Celular"
              value={formValues.phone}
              minLength={7}
              maxLength={15}
              aria-invalid={Boolean(errors.phone)}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  phone: event.target.value.replace(/\D/g, ""),
                }))
              }
            />
          </div>
          {errors.phone && <p className="field-error">{errors.phone}</p>}
          <label className="password-field">
            <span className="field-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingrese contraseña"
              aria-label="Contraseña"
              value={formValues.password}
              minLength={8}
              maxLength={32}
              aria-invalid={Boolean(errors.password)}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
            />
            <button
              className="eye-button"
              type="button"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              <svg viewBox="0 0 24 24">
                <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" />
                <circle cx="12" cy="12" r="2.3" />
              </svg>
            </button>
          </label>
          {errors.password && <p className="field-error">{errors.password}</p>}
          {authError && (
            <p className="auth-error" role="alert">
              {authError}
            </p>
          )}
          <div className="form-links">
            <span className="recovery-link-wrap">
              <button
                className="recovery-trigger"
                type="button"
                onClick={handleRecoveryClick}
              >
                ¿Olvidaste tu clave?
              </button>
              {showRecoveryNotice && (
                <span className="recovery-badge" role="status">
                  Recuperación disponible pronto
                </span>
              )}
            </span>
            <button
              className="register-link"
              type="button"
              onClick={() => setShowRegistration(true)}
            >
              Registrarse
            </button>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoadingSpinner label="Verificando..." />
            ) : (
              "Entrar y continuar tareas"
            )}
          </button>
          <p className="secure-note">SSL seguro, tus datos siempre privados</p>
        </form>
      </section>

      <aside className="promo-banner">
        <span className="promo-icon-wrap">
          <span className="promo-icon">$</span>
          <span className="check-mark">✓</span>
        </span>
        <div>
          <strong>Regístrate, completa tu perfil y gana 6 PEN</strong>
          <span>Gratis, en menos de un minuto</span>
        </div>
      </aside>

      <div className="trust-grid" aria-label="Beneficios">
        <div>
          <span className="trust-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 3 19 6v5c0 4.6-3 8.1-7 10-4-1.9-7-5.4-7-10V6z" />
              <path d="m8.5 12 2.2 2.2 4.8-5" />
            </svg>
          </span>
          <strong>100% seguro</strong>
        </div>
        <div>
          <span className="trust-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m13 2-9 12h7l-1 8 9-12h-7z" />
            </svg>
          </span>
          <strong>Pago rápido</strong>
        </div>
        <div>
          <span className="trust-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 13a8 8 0 0 1 16 0" />
              <path d="M4 13v4a2 2 0 0 0 2 2h1v-6H4Zm16 0v4a2 2 0 0 1-2 2h-1v-6h3Z" />
              <path d="M15 19c-.7 1-1.7 1.5-3 1.5" />
            </svg>
          </span>
          <strong>Ayuda 24/7</strong>
        </div>
      </div>

      <ChatBubble />
      {showAccountNotFound && (
        <AccountNotFoundModal onClose={() => setShowAccountNotFound(false)} />
      )}
      {showPendingAccount && (
        <RegistrationModal onClose={() => setShowPendingAccount(false)} />
      )}
      {authSuccess && (
        <SuccessModal
          message={authSuccess}
          onClose={() => setAuthSuccess("")}
          onContinue={() => router.push("/dashboard")}
        />
      )}
    </main>
  );
}
