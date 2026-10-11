export default function Input({
  label,
  error,
  className = '',
  ...rest
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-ink-soft">
          {label}
        </label>
      )}
      <input
        className={
          'w-full px-3 py-2 text-sm bg-surface ' +
          'border border-line-strong rounded-md ' +
          'placeholder:text-ink-faint ' +
          'focus:outline-none focus:ring-2 focus:ring-primary/30 ' +
          'focus:border-primary ' +
          'disabled:bg-canvas disabled:text-ink-muted ' +
          (error ? ' border-danger-line focus:border-danger focus:ring-danger/30 ' : ' ') +
          className
        }
        {...rest}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}