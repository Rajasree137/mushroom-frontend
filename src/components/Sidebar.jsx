import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanSearch,
  TrendingUp,
  Bell,
  Settings,
  Sprout,
  Cpu,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/contamination', label: 'Contamination', icon: ScanSearch },
  { path: '/yield', label: 'Yield', icon: TrendingUp },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ mobileOpen = false, onClose }) {
  return (
    <aside
      className={`w-64 shrink-0 bg-[#12100d] border-r border-white/5 flex flex-col justify-between p-4 z-30 transition-transform ${
        mobileOpen
          ? 'fixed inset-y-0 left-0 translate-x-0 shadow-2xl bg-[#12100d]'
          : 'hidden md:flex'
      }`}
    >
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-3 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#7ee8b8]/15 border border-[#7ee8b8]/30 flex items-center justify-center text-[#7ee8b8]">
            <Sprout size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#f2ede2]">
              Smart Mushroom
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-[#7a7263] font-semibold">
              Cultivation OS
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#7ee8b8]/15 text-[#7ee8b8] border border-[#7ee8b8]/30 shadow-sm'
                      : 'text-[#a9a396] hover:bg-white/5 hover:text-[#f2ede2]'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Branding */}
      <div className="pt-4 border-t border-white/5 px-3 space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#f2ede2]">
          <Cpu size={14} className="text-[#7ee8b8]" />
          Smart Mushroom System
        </div>
        <div className="text-[10px] text-[#7a7263] font-mono">
          IoT + AI Cultivation
        </div>
      </div>
    </aside>
  );
}
