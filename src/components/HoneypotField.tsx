export default function HoneypotField() {
  return (
    <div className="honeypot-field" aria-hidden="true">
      <label htmlFor="website">Sitio web</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
