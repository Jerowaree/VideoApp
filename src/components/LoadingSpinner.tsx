type LoadingSpinnerProps = {
  label?: string;
};

export default function LoadingSpinner({
  label = "Cargando",
}: LoadingSpinnerProps) {
  return (
    <span className="loading-content">
      <span className="loading-spinner" aria-hidden="true" />
      {label}
    </span>
  );
}
