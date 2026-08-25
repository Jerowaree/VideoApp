"use client";

type RegistrationModalProps = {
  onClose: () => void;
};

export default function RegistrationModal({ onClose }: RegistrationModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="registration-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="Cerrar aviso" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
        <span className="modal-brand-mark" aria-hidden="true">✦</span>
        <h2 id="registration-title">Qué gusto encontrarte</h2>
        <p className="registration-message">
          Gracias por llegar hasta aquí. Por ahora el registro es solo con invitación. Pídele a tu asistente de reclutamiento tu enlace personal. Te esperamos.
        </p>
        <button className="modal-confirm" type="button" onClick={onClose}>✓ Entendido</button>
        <p className="modal-footer">♡ Te esperamos</p>
      </section>
    </div>
  );
}
