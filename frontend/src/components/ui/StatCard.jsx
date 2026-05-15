export default function StatCard({ label, value, hint, icon: Icon, trend }) {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-5 shadow-subtle">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        {Icon && (
          <div className="w-8 h-8 bg-navy-50 rounded flex items-center justify-center">
            <Icon size={16} className="text-navy-700" />
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold text-slate-900 tabular-nums">
        {value}
      </p>
      {hint && (
        <p className={`text-xs mt-1 ${
          trend === 'danger'  ? 'text-red-600'
          : trend === 'success' ? 'text-emerald-600'
          : 'text-slate-500'
        }`}>
          {hint}
        </p>
      )}
    </div>
  );
}