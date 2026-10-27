import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No Data Available',
  message = 'No entries or records recorded yet.',
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 rounded-2xl bg-[#161411] border border-white/10 text-center">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3 text-[#a9a396]">
        <Icon size={22} />
      </div>
      <h3 className="text-sm font-semibold text-[#f2ede2]">{title}</h3>
      <p className="text-xs text-[#7a7263] mt-1 max-w-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
