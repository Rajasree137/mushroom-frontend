import React from 'react';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-white/5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#f2ede2]">{title}</h1>
        {subtitle && <p className="text-xs text-[#7a7263] mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
