"use client";

import { useState } from "react";
import { ValidationError } from "yup";
import RegistrationModal from "./RegistrationModal";
import ChatBubble from "./ChatBubble";
import TrustStats from "./TrustStats";
import HoneypotField from "./HoneypotField";
import LoadingSpinner from "./LoadingSpinner";
import CountrySelector, { countries, type Country } from "./CountrySelector";
import {
  registrationSchema,
  registrationStepOneSchema,
  type RegistrationValues,
} from "@/lib/validation/registration-schema";
import {
  normalizePhone,
  signUpWithPhone,
  upsertProfile,
} from "@/lib/supabase/auth";

type RegistrationViewProps = {
  onBack: () => void;
};

const initialValues: RegistrationValues = {
  name: "",
  phone: "",
  password: "",
  confirmation: "",
};

export default function RegistrationView({ onBack }: RegistrationViewProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegistrationValues, string>>
  >({});
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [country, setCountry] = useState<Country>(countries[0]);

  const updateValue = (field: keyof RegistrationValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = async (
    schema: typeof registrationSchema | typeof registrationStepOneSchema,
  ) => {
    const nextErrors: Partial<Record<keyof RegistrationValues, string>> = {};
    try {
      await schema.validate(values, { abortEarly: false });
    } catch (error) {
      if (error instanceof ValidationError) {
        error.inner.forEach((item) => {
          if (item.path && !nextErrors[item.path as keyof RegistrationValues]) {
            nextErrors[item.path as keyof RegistrationValues] = item.message;
          }
        });
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = async () => {
    if (await validate(registrationStepOneSchema)) setStep(2);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const honeypot = event.currentTarget.elements.namedItem(
      "website",
    ) as HTMLInputElement | null;
    if (honeypot?.value.trim()) return;
    setAuthError("");
    if (!(await validate(registrationSchema))) return;
    setIsSubmitting(true);
    try {
      const authorization = await fetch("/api/registration/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          countryCode: country.code,
        }),
      });
      if (!authorization.ok) {
        const response = await authorization.json().catch(() => null);
        if (authorization.status === 403) {
          setShowInvitationModal(true);
          return;
        }
        setAuthError(response?.error || "No pudimos verificar tu invitación.");
        return;
      }
      const { data, error } = await signUpWithPhone(
        values.name,
        values.phone,
        values.password,
        country.code,
      );
      if (error) {
        if (error.message.toLowerCase().includes("already"))
          setAuthError("Este número ya tiene una cuenta registrada.");
        else if (error.status === 422)
          setAuthError(
            "El registro con número de celular no está habilitado en este momento. Contacta al administrador.",
          );
        else
          setAuthError(
            "No pudimos crear tu cuenta. Revisa tus datos e inténtalo nuevamente.",
          );
      } else {
        if (data.user && data.session) {
          const profile = await upsertProfile(
            data.user.id,
            values.name,
            normalizePhone(values.phone, country.code),
          );
          if (profile.error) throw profile.error;
        }
        setCompleted(true);
      }
    } catch {
      setAuthError(
        "No pudimos conectar con el servicio. Inténtalo nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="registration-page">
      <button className="back-link" type="button" onClick={onBack}>
        ← Volver al inicio de sesión
      </button>
      <section className="registration-card" aria-labelledby="register-heading">
        <span className="registration-mark" aria-hidden="true">
          ✦
        </span>
        <p className="eyebrow">Tu próximo ingreso empieza aquí</p>
        <h1 id="register-heading">Crea tu cuenta</h1>
        <p className="registration-intro">
          Regístrate para comenzar a ganar dinero con tus tareas.
        </p>
        <div className="registration-progress" aria-label={`Paso ${step} de 2`}>
          <div
            className="registration-progress-track"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={2}
            aria-valuenow={step}
            aria-valuetext={`Paso ${step} de 2`}
          >
            <span className={`registration-progress-fill step-${step}`} />
          </div>
          <div className="registration-progress-labels">
            <span className={step === 1 ? "active" : "complete"}>
              <b>1</b>
              <small>Datos personales</small>
            </span>
            <span className={step === 2 ? "active" : ""}>
              <b>2</b>
              <small>Tu contraseña</small>
            </span>
          </div>
        </div>
        <form className="registration-form" onSubmit={handleSubmit} noValidate>
          <HoneypotField />
          {step === 1 ? (
            <div className="registration-step" key="step-one">
              <label>
                Nombres
                <input
                  autoFocus
                  value={values.name}
                  onChange={(event) => updateValue("name", event.target.value)}
                  placeholder="Ingresa tus nombres"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <small>{errors.name}</small>}
              </label>
              <label>
                Número de celular
                <div className="registration-phone">
                  <CountrySelector
                    value={country}
                    onChange={setCountry}
                    ariaLabel="Elegir país del celular"
                  />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={values.phone}
                    onChange={(event) =>
                      updateValue(
                        "phone",
                        event.target.value.replace(/\D/g, ""),
                      )
                    }
                    placeholder="Ingresa tu celular"
                    aria-invalid={Boolean(errors.phone)}
                  />
                </div>
                {errors.phone && <small>{errors.phone}</small>}
              </label>
              <button
                className="registration-submit"
                type="button"
                onClick={handleNext}
              >
                Continuar
              </button>
            </div>
          ) : (
            <div className="registration-step" key="step-two">
              <label>
                Contraseña
                <input
                  autoFocus
                  type="password"
                  value={values.password}
                  onChange={(event) =>
                    updateValue("password", event.target.value)
                  }
                  placeholder="Mínimo 8 caracteres"
                  aria-invalid={Boolean(errors.password)}
                />
                {errors.password && <small>{errors.password}</small>}
              </label>
              <label>
                Confirmar contraseña
                <input
                  type="password"
                  value={values.confirmation}
                  onChange={(event) =>
                    updateValue("confirmation", event.target.value)
                  }
                  placeholder="Repite tu contraseña"
                  aria-invalid={Boolean(errors.confirmation)}
                />
                {errors.confirmation && <small>{errors.confirmation}</small>}
              </label>
              <div className="registration-actions">
                <button
                  className="step-back"
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  Atrás
                </button>
                <button
                  className="registration-submit"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <LoadingSpinner label="Creando..." />
                  ) : (
                    "Completar registro"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
        {authError && (
          <p className="auth-error" role="alert">
            {authError}
          </p>
        )}
        <p className="secure-note">SSL seguro, tus datos siempre privados</p>
      </section>
      <TrustStats />
      <ChatBubble />
      {completed && (
        <RegistrationModal
          title="Cuenta creada correctamente"
          message="Tu cuenta fue creada con éxito. Ya puedes comenzar a usar la plataforma."
          onClose={onBack}
        />
      )}
      {showInvitationModal && (
        <RegistrationModal onClose={() => setShowInvitationModal(false)} />
      )}
    </main>
  );
}
