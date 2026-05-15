export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex items-end justify-between mb-6 pb-4 border-b border-slate-200">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {description && (
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}