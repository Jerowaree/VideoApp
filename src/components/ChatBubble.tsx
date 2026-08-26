"use client";

import { useEffect, useState } from "react";

const messages = [
  "¿Necesitas ayuda?",
  "Estamos aquí para ayudarte",
  "Soporte disponible 24/7",
];

export default function ChatBubble() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(
      () => setMessageIndex((current) => (current + 1) % messages.length),
      4500,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={`chat-widget ${open ? "is-open" : ""}`}>
      {open && (
        <div className="chat-message" role="status">
          {messages[messageIndex]}
        </div>
      )}
      <button
        className="chat-button"
        type="button"
        aria-label="Abrir ayuda"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="chat-pulse" aria-hidden="true" />
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8 8 0 0 1-3-.6L4 20l1.6-4A7.4 7.4 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7Z" />
          <path d="M9 12h.01M12 12h.01M15 12h.01" />
        </svg>
      </button>
    </div>
  );
}
