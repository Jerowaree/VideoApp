"use client";

type AccountNotFoundModalProps = {
  onClose: () => void;
};

export default function AccountNotFoundModal({
  onClose,
}: AccountNotFoundModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="account-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-not-found-title"
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
        <span className="account-modal-mark" aria-hidden="true">
          ?
        </span>
        <h2 id="account-not-found-title">La cuenta no existe</h2>
        <p className="account-modal-message">
          No encontramos una cuenta asociada a estos datos. Revisa tu número y
          contraseña, o regístrate para comenzar.
        </p>
        <div className="account-modal-actions">
          <button
            className="account-modal-secondary"
            type="button"
            onClick={onClose}
          >
            Volver a intentar
          </button>
          <button
            className="account-modal-primary"
            type="button"
            onClick={onClose}
          >
            Registrarse
          </button>
        </div>
      </section>
    </div>
  );
}
