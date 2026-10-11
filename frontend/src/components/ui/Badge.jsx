export default function Badge({ children, variant = 'neutral' }) {
  const variants = {
    neutral: 'bg-surface-active text-ink-soft',
    success: 'bg-success-soft text-success-strong border border-success-line',
    warning: 'bg-warning-soft text-warning-strong border border-warning-line',
    danger:  'bg-danger-soft text-danger-strong border border-danger-line',
    info:    'bg-info-soft text-info-strong border border-info-line',
    primary:'bg-primary-soft text-primary-strong border border-primary-line',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}