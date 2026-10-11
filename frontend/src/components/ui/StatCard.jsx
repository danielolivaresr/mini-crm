export default function StatCard({ label, value, hint, icon: Icon, trend }) {
  return (
    <div className="bg-surface border border-line rounded-md p-5 shadow-subtle">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          {label}
        </p>
        {Icon && (
          <div className="w-8 h-8 bg-primary-soft rounded flex items-center justify-center">
            <Icon size={16} className="text-primary" />
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold text-ink tabular-nums">
        {value}
      </p>
      {hint && (
        <p className={`text-xs mt-1 ${
          trend === 'danger'  ? 'text-danger'
          : trend === 'success' ? 'text-success'
          : 'text-ink-muted'
        }`}>
          {hint}
        </p>
      )}
    </div>
  );
}