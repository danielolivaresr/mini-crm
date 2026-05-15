export default function Input({
  label,
  error,
  className = '',
  ...rest
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        className={
          'w-full px-3 py-2 text-sm bg-white ' +
          'border border-slate-300 rounded-md ' +
          'placeholder:text-slate-400 ' +
          'focus:outline-none focus:ring-2 focus:ring-navy-500/30 ' +
          'focus:border-navy-500 ' +
          'disabled:bg-slate-50 disabled:text-slate-500 ' +
          (error ? ' border-red-300 focus:border-red-500 focus:ring-red-500/30 ' : ' ') +
          className
        }
        {...rest}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}