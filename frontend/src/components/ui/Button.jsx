export default function Button({
  children,
  variant = 'primary',
  size    = 'md',
  type    = 'button',
  disabled,
  onClick,
  className = '',
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium ' +
    'rounded-md transition-colors focus:outline-none focus:ring-2 ' +
    'focus:ring-offset-2 focus:ring-primary disabled:opacity-50 ' +
    'disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
  };

  const variants = {
    primary:
      'bg-primary text-primary-fg hover:bg-primary-hover active:bg-primary',
    secondary:
      'bg-surface text-ink-soft border border-line-strong hover:bg-surface-hover',
    ghost:
      'text-ink-muted hover:bg-surface-active hover:text-ink',
    danger:
      'bg-surface text-danger-strong border border-danger-line hover:bg-danger-soft',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}