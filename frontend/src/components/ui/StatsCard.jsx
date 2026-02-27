import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatsCard({ icon: Icon, label, value, suffix = '', trend, trendLabel, color = 'teal' }) {
  const colors = {
    teal:    'bg-teal/10 text-teal',
    emerald: 'bg-emerald/10 text-emerald-light',
    amber:   'bg-amber/10 text-amber-light',
    crimson: 'bg-crimson/10 text-crimson-light',
  };

  return (
    <div className="card p-5 hover:border-navy-500 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color] || colors.teal}`}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-medium ${
            trend > 0 ? 'text-emerald-light' : trend < 0 ? 'text-crimson-light' : 'text-navy-400'
          }`}>
            {trend > 0 ? <TrendingUp size={12}/> : trend < 0 ? <TrendingDown size={12}/> : <Minus size={12}/>}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="stat-number mb-1">{value}{suffix}</p>
      <p className="text-navy-400 text-sm">{label}</p>
      {trendLabel && <p className="text-navy-500 text-xs mt-1">{trendLabel}</p>}
    </div>
  );
}
