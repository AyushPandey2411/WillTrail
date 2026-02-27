export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card p-12 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-navy-800 border-2 border-dashed border-navy-600
                        flex items-center justify-center mx-auto mb-4">
          <Icon size={28} className="text-navy-500" />
        </div>
      )}
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-navy-400 text-sm mb-6 max-w-xs mx-auto">{description}</p>}
      {action}
    </div>
  );
}
