import React from 'react';
import { Bell, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export default function AlertCard({ alert }) {
  if (!alert) return null;

  const severity = (alert.severity || 'INFO').toString().toUpperCase();
  const message = alert.message || alert.text || 'System Event Recorded';
  const timestamp = alert.timestamp || alert.time || 'Just now';

  let borderColor = 'border-white/10 bg-[#161411]';
  let badgeColor = 'bg-[#7ee8b8]/15 text-[#7ee8b8] border-[#7ee8b8]/30';
  let Icon = Info;
  let iconColor = 'text-[#7ee8b8]';

  if (severity === 'CRITICAL' || severity === 'HIGH') {
    borderColor = 'border-[#e0714a]/30 bg-[#e0714a]/5';
    badgeColor = 'bg-[#e0714a]/15 text-[#e0714a] border-[#e0714a]/30';
    Icon = AlertOctagon;
    iconColor = 'text-[#e0714a]';
  } else if (severity === 'WARNING' || severity === 'MEDIUM') {
    borderColor = 'border-[#f2a65a]/30 bg-[#f2a65a]/5';
    badgeColor = 'bg-[#f2a65a]/15 text-[#f2a65a] border-[#f2a65a]/30';
    Icon = AlertTriangle;
    iconColor = 'text-[#f2a65a]';
  }

  return (
    <div className={`p-4 rounded-2xl border ${borderColor} flex items-start gap-3 transition-all`}>
      <div className="p-2 rounded-xl bg-white/5 shrink-0 mt-0.5">
        <Icon size={16} className={iconColor} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
            {severity}
          </span>
          <span className="text-[11px] font-mono text-[#7a7263]">{timestamp}</span>
        </div>

        <p className="text-sm font-medium text-[#f2ede2] leading-snug">{message}</p>
      </div>
    </div>
  );
}
