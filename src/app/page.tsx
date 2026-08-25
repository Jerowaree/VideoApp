"use client";

import { useEffect, useRef, useState } from "react";
import { ValidationError } from "yup";
import RegistrationView from "@/components/RegistrationView";
import ChatBubble from "@/components/ChatBubble";
import HoneypotField from "@/components/HoneypotField";
import { loginSchema, type LoginFormValues } from "@/lib/validation/login-schema";

const peruvianNames = [
  "María Quiroga",
  "José Quispe",
  "Andrea Choquehuanta",
  "Luis Flores",
  "Rosa Vargas",
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
const countries = [
  { name: "Perú", flag: "🇵🇪", code: "+51" },
  { name: "Argentina", flag: "🇦🇷", code: "+54" },
  { name: "Bolivia", flag: "🇧🇴", code: "+591" },
  { name: "Chile", flag: "🇨🇱", code: "+56" },
  { name: "Colombia", flag: "🇨🇴", code: "+57" },
  { name: "Ecuador", flag: "🇪🇨", code: "+593" },
  { name: "Paraguay", flag: "🇵🇾", code: "+595" },
  { name: "Uruguay", flag: "🇺🇾", code: "+598" },
  { name: "Venezuela", flag: "🇻🇪", code: "+58" },
];

type Country = (typeof countries)[number];

function CountryFlag({ country }: { country: Country }) {
  const flagShapes: Record<string, React.ReactNode> = {
    "🇵🇪": <><rect width="8" height="16" fill="#d91023" /><rect x="8" width="8" height="16" fill="#fff" /><rect x="16" width="8" height="16" fill="#d91023" /></>,
    "🇦🇷": <><rect width="24" height="16" fill="#74acdf" /><rect y="5.33" width="24" height="5.34" fill="#fff" /><circle cx="12" cy="8" r="1.5" fill="#f6b40e" /></>,
    "🇧🇴": <><rect width="24" height="5.33" fill="#d52b1e" /><rect y="5.33" width="24" height="5.34" fill="#f9e300" /><rect y="10.67" width="24" height="5.33" fill="#007934" /></>,
    "🇨🇱": <><rect width="24" height="16" fill="#fff" /><rect y="8" width="24" height="8" fill="#d52b1e" /><rect width="10" height="8" fill="#0039a6" /><path d="m5 1.5.7 2.1H8L6.15 4.9l.7 2.1L5 5.7 3.15 7l.7-2.1L2 3.6h2.3z" fill="#fff" /></>,
    "🇨🇴": <><rect width="24" height="8" fill="#fcd116" /><rect y="8" width="24" height="4" fill="#003893" /><rect y="12" width="24" height="4" fill="#ce1126" /></>,
    "🇪🇨": <><rect width="24" height="8" fill="#ffdd00" /><rect y="8" width="24" height="4" fill="#034ea2" /><rect y="12" width="24" height="4" fill="#ed1c24" /><circle cx="12" cy="8" r="2" fill="#9b6b43" /></>,
    "🇵🇾": <><rect width="24" height="5.33" fill="#d52b1e" /><rect y="5.33" width="24" height="5.34" fill="#fff" /><rect y="10.67" width="24" height="5.33" fill="#0038a8" /><circle cx="12" cy="8" r="1.5" fill="#d52b1e" /></>,
    "🇺🇾": <><rect width="24" height="16" fill="#fff" /><path d="M0 2h24v2H0zm0 4h24v2H0zm0 4h24v2H0zm0 4h24v2H0z" fill="#75aadb" /><rect width="10" height="8" fill="#fff" /><circle cx="5" cy="4" r="2" fill="#fcd116" /></>,
    "🇻🇪": <><rect width="24" height="5.33" fill="#fcd116" /><rect y="5.33" width="24" height="5.34" fill="#003893" /><rect y="10.67" width="24" height="5.33" fill="#ce1126" /><path d="M7 8.2a1 1 0 0 0 1.5 0 1 1 0 0 0 1.5 0 1 1 0 0 0 1.5 0 1 1 0 0 0 1.5 0" fill="none" stroke="#fff" strokeWidth=".8" /></>,
  };

  return <svg className="flag-svg" viewBox="0 0 24 16" role="img" aria-label={`Bandera de ${country.name}`}>{flagShapes[country.flag]}</svg>;
}

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
              <div className={`earning-row row-${index}`} key={`${nameIndex}-${index}`}>
                <span className="earning-person">
                  <span className="earning-icon">{index === 0 ? "✺" : "•"}</span>
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
  const [country, setCountry] = useState(countries[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [formValues, setFormValues] = useState<LoginFormValues>({ phone: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});

  const validateField = async (field: keyof LoginFormValues) => {
    try {
      await loginSchema.validateAt(field, formValues);
      setErrors((current) => ({ ...current, [field]: undefined }));
    } catch (error) {
      if (error instanceof ValidationError) {
        setErrors((current) => ({ ...current, [field]: error.message }));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const honeypot = event.currentTarget.elements.namedItem("website") as HTMLInputElement | null;
    if (honeypot?.value.trim()) return;
    try {
      await loginSchema.validate(formValues, { abortEarly: false });
      setErrors({});
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
            <div className="country-code">
              <CountryFlag country={country} />
              <button className="country-trigger" type="button" aria-label="Elegir país" aria-expanded={countryOpen} onClick={() => setCountryOpen((open) => !open)}>
                <span className="country-code-value">{country.code}</span>
                <span className="country-chevron" aria-hidden="true">⌄</span>
              </button>
              {countryOpen && (
                <div className="country-menu" role="listbox" aria-label="Países disponibles">
                  {countries.map((option) => (
                    <button className="country-option" type="button" role="option" aria-selected={option.code === country.code} key={option.code} onClick={() => { setCountry(option); setCountryOpen(false); }}>
                      <CountryFlag country={option} />
                      <span>{option.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
              onChange={(event) => setFormValues((current) => ({ ...current, phone: event.target.value.replace(/\D/g, "") }))}
              onBlur={() => validateField("phone")}
            />
          </div>
          {errors.phone && <p className="field-error">{errors.phone}</p>}
          <label className="password-field">
            <span className="field-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg></span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingrese contraseña"
              aria-label="Contraseña"
              value={formValues.password}
              minLength={8}
              maxLength={32}
              aria-invalid={Boolean(errors.password)}
              onChange={(event) => setFormValues((current) => ({ ...current, password: event.target.value }))}
              onBlur={() => validateField("password")}
            />
            <button className="eye-button" type="button" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>
              <svg viewBox="0 0 24 24"><path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" /><circle cx="12" cy="12" r="2.3" /></svg>
            </button>
          </label>
          {errors.password && <p className="field-error">{errors.password}</p>}
          <div className="form-links">
            <a href="#forgot-password">¿Olvidaste tu clave?</a>
            <button className="register-link" type="button" onClick={() => setShowRegistration(true)}>Registrarse</button>
          </div>
          <button type="submit">Entrar y continuar tareas</button>
          <p className="secure-note">SSL seguro, tus datos siempre privados</p>
        </form>
      </section>

      <aside className="promo-banner">
        <span className="promo-icon-wrap"><span className="promo-icon">$</span><span className="check-mark">✓</span></span>
        <div>
          <strong>Regístrate y gana 6 PEN</strong>
          <span>Gratis, solo 30 s</span>
        </div>
      </aside>

      <div className="trust-grid" aria-label="Beneficios">
        <div><span className="trust-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.6-3 8.1-7 10-4-1.9-7-5.4-7-10V6z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></svg></span><strong>100% seguro</strong></div>
        <div><span className="trust-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m13 2-9 12h7l-1 8 9-12h-7z" /></svg></span><strong>Pago rápido</strong></div>
        <div><span className="trust-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 13a8 8 0 0 1 16 0" /><path d="M4 13v4a2 2 0 0 0 2 2h1v-6H4Zm16 0v4a2 2 0 0 1-2 2h-1v-6h3Z" /><path d="M15 19c-.7 1-1.7 1.5-3 1.5" /></svg></span><strong>Ayuda 24/7</strong></div>
      </div>

      <ChatBubble />
    </main>
  );
}
