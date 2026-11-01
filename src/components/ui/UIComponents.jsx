// Status badge component
export function StatusBadge({ status }) {
  const map = {
    draft:      { cls: 'badge-draft',      dot: 'bg-slate-500', label: 'Draft' },
    scheduled:  { cls: 'badge-scheduled',  dot: 'bg-blue-400',  label: 'Scheduled' },
    processing: { cls: 'badge-processing', dot: 'bg-yellow-400 animate-pulse', label: 'Processing' },
    published:  { cls: 'badge-published',  dot: 'bg-emerald-400', label: 'Published' },
    failed:     { cls: 'badge-failed',     dot: 'bg-red-400',   label: 'Failed' },
    cancelled:  { cls: 'badge-cancelled',  dot: 'bg-slate-600', label: 'Cancelled' },
  };
  const { cls, dot, label } = map[status] || map.draft;
  return (
    <span className={cls}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

// Loading skeleton shimmer
export function Skeleton({ className = '' }) {
  return <div className={`shimmer rounded-lg ${className}`} />;
}

// Empty state
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-200 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}

// Confirmation dialog
export function ConfirmDialog({ open, title, description, onConfirm, onCancel, danger = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-sm p-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-6">{description}</p>
        <div className="flex gap-3 justify-end">
          <button id="confirm-cancel" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button
            id="confirm-ok"
            onClick={onConfirm}
            className={danger ? 'btn-danger text-sm' : 'btn-primary text-sm'}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// Stat card
export function StatCard({ title, value, icon: Icon, color = 'brand', trend }) {
  const colorMap = {
    brand: 'text-brand-400 bg-brand-500/10',
    green: 'text-emerald-400 bg-emerald-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    red: 'text-red-400 bg-red-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  };
  return (
    <div className="stat-card group hover:border-white/[0.12] transition-colors">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-display font-bold text-white">{value}</p>
        <p className="text-sm text-slate-500">{title}</p>
      </div>
    </div>
  );
}
