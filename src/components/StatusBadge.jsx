import React from 'react';

export default function StatusBadge({ status, label, className = '' }) {
  const val = (status || label || '').toString().toUpperCase();

  let colorClasses = 'bg-[#7ee8b8]/15 text-[#7ee8b8] border-[#7ee8b8]/30';

  if (val === 'CONTAMINATED' || val === 'CRITICAL' || val === 'ERROR' || val === 'POOR') {
    colorClasses = 'bg-[#e0714a]/15 text-[#e0714a] border-[#e0714a]/30';
  } else if (val === 'WARNING' || val === 'MEDIUM') {
    colorClasses = 'bg-[#f2a65a]/15 text-[#f2a65a] border-[#f2a65a]/30';
  } else if (val === 'OFFLINE' || val === 'UNKNOWN') {
    colorClasses = 'bg-[#78716c]/15 text-[#a9a396] border-[#78716c]/30';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase border ${colorClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label || status || 'NORMAL'}
    </span>
  );
}
