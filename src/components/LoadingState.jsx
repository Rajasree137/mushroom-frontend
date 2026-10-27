import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-[#161411] border border-white/10 text-center">
      <Loader2 size={28} className="text-[#7ee8b8] animate-spin mb-3" />
      <p className="text-sm font-medium text-[#f2ede2]">{message}</p>
      <p className="text-xs text-[#7a7263] mt-1">Communicating with IoT Flask backend...</p>
    </div>
  );
}
