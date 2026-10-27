import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Backend Unavailable',
  message = 'Unable to connect to Flask REST server. Ensure server is running at VITE_API_URL.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[#e0714a]/10 border border-[#e0714a]/30 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#e0714a]/20 flex items-center justify-center mb-3 text-[#e0714a]">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-base font-bold text-[#f2ede2]">{title}</h3>
      <p className="text-xs text-[#a9a396] mt-1.5 max-w-md leading-relaxed">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-xl bg-[#e0714a]/20 hover:bg-[#e0714a]/30 text-[#e0714a] border border-[#e0714a]/40 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <RefreshCw size={14} /> Retry Connection
        </button>
      )}
    </div>
  );
}
