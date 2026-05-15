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
    'focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50 ' +
    'disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
  };

  const variants = {
    primary:
      'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-900',
    secondary:
      'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
    ghost:
      'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    danger:
      'bg-white text-red-700 border border-red-200 hover:bg-red-50',
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