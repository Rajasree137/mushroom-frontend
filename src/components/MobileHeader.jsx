import React from 'react';
import { Menu, Sprout } from 'lucide-react';

export default function MobileHeader({ onToggleMenu }) {
  return (
    <header className="md:hidden sticky top-0 z-20 bg-[#12100d] border-b border-white/5 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#7ee8b8]/15 border border-[#7ee8b8]/30 flex items-center justify-center text-[#7ee8b8]">
          <Sprout size={16} />
        </div>
        <span className="text-sm font-bold tracking-tight text-[#f2ede2]">
          Smart Mushroom
        </span>
      </div>

      <button
        onClick={onToggleMenu}
        className="p-2 rounded-lg bg-white/5 text-[#a9a396] hover:text-[#f2ede2]"
        aria-label="Toggle Navigation Menu"
      >
        <Menu size={18} />
      </button>
    </header>
  );
}
