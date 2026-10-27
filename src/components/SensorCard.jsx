import React from 'react';
import { Activity } from 'lucide-react';

export default function SensorCard({
  title,
  value,
  unit = '',
  icon: Icon = Activity,
  status = 'normal',
  description,
}) {
  const isOffline = status === 'offline' || value === null || value === undefined;
  const isWarning = status === 'warning';
  const isError = status === 'error' || status === 'critical';

  let borderColor = 'border-white/10';
  let badgeColor = 'bg-[#7ee8b8]/15 text-[#7ee8b8] border-[#7ee8b8]/30';
  let iconColor = 'text-[#7ee8b8]';

  if (isOffline) {
    borderColor = 'border-white/5 opacity-70';
    badgeColor = 'bg-[#78716c]/15 text-[#78716c] border-[#78716c]/30';
    iconColor = 'text-[#78716c]';
  } else if (isError) {
    borderColor = 'border-[#e0714a]/40 bg-[#e0714a]/5';
    badgeColor = 'bg-[#e0714a]/15 text-[#e0714a] border-[#e0714a]/30';
    iconColor = 'text-[#e0714a]';
  } else if (isWarning) {
    borderColor = 'border-[#f2a65a]/40 bg-[#f2a65a]/5';
    badgeColor = 'bg-[#f2a65a]/15 text-[#f2a65a] border-[#f2a65a]/30';
    iconColor = 'text-[#f2a65a]';
  }

  const displayValue = isOffline ? '--' : value;

  return (
    <div className={`rounded-2xl border ${borderColor} bg-[#161411] p-5 transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
            <Icon size={16} className={iconColor} />
          </div>
          <span className="text-xs uppercase tracking-wider text-[#7a7263] font-semibold">
            {title}
          </span>
        </div>

        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
          {isOffline ? 'Offline' : isError ? 'Error' : isWarning ? 'Warning' : 'Normal'}
        </span>
      </div>

      <div className="flex items-baseline justify-between mb-1">
        <p className="text-3xl font-bold tracking-tight text-[#f2ede2] font-mono">
          {displayValue}
          {!isOffline && unit && <span className="text-base text-[#7a7263] font-sans ml-1">{unit}</span>}
        </p>
      </div>

      {description && <p className="text-xs text-[#7a7263] mt-2">{description}</p>}
    </div>
  );
}
