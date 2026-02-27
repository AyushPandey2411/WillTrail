export default function LoadingSpinner({ size = 'md', label }) {
  const s = { sm:'w-6 h-6 border-2', md:'w-10 h-10 border-3', lg:'w-16 h-16 border-4' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${s[size] || s.md} rounded-full border-navy-600 border-t-teal animate-spin`} />
      {label && <p className="text-navy-400 text-sm animate-pulse">{label}</p>}
    </div>
  );
}

export function FullPageSpinner({ label = 'Loading...' }) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}
