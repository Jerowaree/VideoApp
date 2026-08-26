"use client";

import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

type SuccessModalProps = {
  message: string;
  onClose: () => void;
  onContinue: () => void;
};

export default function SuccessModal({
  message,
  onClose,
  onContinue,
}: SuccessModalProps) {
  const isRedirecting = true;

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      onContinue();
    }, 1200);

    return () => window.clearTimeout(redirectTimer);
  }, [onContinue]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Cerrar aviso"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        <span className="success-modal-mark" aria-hidden="true">
          ✓
        </span>
        <p className="success-modal-kicker">Acceso confirmado</p>
        <h2 id="success-modal-title">¡Bienvenido de vuelta!</h2>
        <p className="success-modal-message">{message}</p>
        <button
          className="modal-confirm"
          type="button"
          disabled={isRedirecting}
          onClick={onContinue}
        >
          {isRedirecting ? <LoadingSpinner label="Cargando..." /> : "Continuar"}
        </button>
      </section>
    </div>
  );
}