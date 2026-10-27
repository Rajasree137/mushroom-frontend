import React from 'react';
import { Wind, Droplets, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function GrowChamberVisualizer({
  temp,
  hum,
  airQuality,
  fanStatus,
  humidifierStatus,
  controlMode = 'AUTO',
}) {
  const isFanOn = Boolean(fanStatus);
  const isHumidifierOn = Boolean(humidifierStatus);
  const isAirPoor = String(airQuality).toUpperCase() === 'POOR' || airQuality === 1;
  const isHumLow = hum !== null && hum !== undefined && hum < 75;

  // Determine overall chamber health state
  let chamberStatus = 'Optimal Environment';
  let chamberBadgeColor = 'bg-[#10b981]/20 text-[#34d399] border-[#10b981]/40';
  let chamberGlow = 'shadow-[0_0_50px_rgba(16,185,129,0.15)] border-[#10b981]/30';

  if (isAirPoor && isHumLow) {
    chamberStatus = 'Active Regulation (Air & Humidity)';
    chamberBadgeColor = 'bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/40';
    chamberGlow = 'shadow-[0_0_50px_rgba(245,158,11,0.2)] border-[#f59e0b]/30';
  } else if (isAirPoor) {
    chamberStatus = 'Exhaust Active (Venting High CO2/Gas)';
    chamberBadgeColor = 'bg-[#ef4444]/20 text-[#f87171] border-[#ef4444]/40';
    chamberGlow = 'shadow-[0_0_50px_rgba(239,68,68,0.2)] border-[#ef4444]/30';
  } else if (isHumLow) {
    chamberStatus = 'Humidifier Active (Misting Substrate)';
    chamberBadgeColor = 'bg-[#06b6d4]/20 text-[#22d3ee] border-[#06b6d4]/40';
    chamberGlow = 'shadow-[0_0_50px_rgba(6,182,212,0.2)] border-[#06b6d4]/30';
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br from-[#181613] via-[#12110e] to-[#0a0908] p-6 lg:p-8 transition-all duration-500 ${chamberGlow}`}
    >
      {/* Background ambient mesh grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#26221d_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#24c48e]/20 to-[#10b981]/5 border border-[#24c48e]/30 flex items-center justify-center text-[#24c48e] shadow-inner">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#f2ede2] tracking-tight">
                Grow Chamber Digital Twin
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#a9a396] border border-white/10">
                Mode: {controlMode}
              </span>
            </div>
            <p className="text-xs text-[#7a7263]">
              Real-time biological incubation environment simulation & actuator feedback
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${chamberBadgeColor}`}>
          {isAirPoor || isHumLow ? (
            <AlertTriangle size={14} className="animate-bounce" />
          ) : (
            <ShieldCheck size={14} />
          )}
          <span>{chamberStatus}</span>
        </div>
      </div>

      {/* Main Chamber Visual Display */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 items-center">
        {/* Left Actuator: Exhaust Fan (GPIO 26) */}
        <div
          className={`rounded-2xl border p-5 transition-all duration-300 ${
            isFanOn
              ? 'bg-[#10b981]/10 border-[#10b981]/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
              : 'bg-white/5 border-white/5'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-mono tracking-wider text-[#a9a396]">
              Relay 1 • GPIO 26
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono ${
                isFanOn
                  ? 'bg-[#10b981]/20 text-[#34d399] border-[#10b981]/30'
                  : 'bg-white/5 text-[#7a7263] border-white/5'
              }`}
            >
              {isFanOn ? 'SPINNING • ON' : 'STANDBY • OFF'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Spinning Propeller Fan Graphic */}
            <div className="relative w-16 h-16 shrink-0 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
              <Wind
                size={32}
                className={`transition-all ${
                  isFanOn
                    ? 'text-[#34d399] animate-[spin_1.2s_linear_infinite]'
                    : 'text-[#7a7263]'
                }`}
              />
              {isFanOn && (
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(52,211,153,0.3)_0%,transparent_70%)]" />
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#f2ede2]">Exhaust Fan</h4>
              <p className="text-[11px] text-[#7a7263] mt-0.5 leading-tight">
                Air Quality trigger: {isAirPoor ? 'POOR (Triggered)' : 'OK (Safe)'}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-[#a9a396]">
                <span className={`w-2 h-2 rounded-full ${isFanOn ? 'bg-[#34d399] animate-ping' : 'bg-[#7a7263]'}`} />
                <span>{isFanOn ? 'Venting Chamber Air' : 'Relay Idle'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Substrate & Microclimate Biome */}
        <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#1c1914] to-[#14120e] p-6 flex flex-col items-center justify-center text-center min-h-[190px] overflow-hidden group">
          {/* Animated mist overlay when humidifier is active */}
          {isHumidifierOn && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#06b6d4]/10 via-[#06b6d4]/5 to-transparent animate-pulse pointer-events-none" />
          )}

          {/* Mushroom Silhouette / Bag Graphic */}
          <div className="relative mb-3">
            <svg
              className="w-20 h-20 transition-transform duration-500 group-hover:scale-105"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Mushroom Cap */}
              <path
                d="M12 36C12 21.6406 20.9543 10 32 10C43.0457 10 52 21.6406 52 36C52 37.1046 51.1046 38 50 38H14C12.8954 38 12 37.1046 12 36Z"
                fill="url(#cap-gradient)"
                stroke="#7ee8b8"
                strokeWidth="1.5"
              />
              {/* Stem */}
              <path
                d="M26 38V50C26 52.2091 27.7909 54 30 54H34C36.2091 54 38 50 38 50V38H26Z"
                fill="#2b2620"
                stroke="#7a7263"
                strokeWidth="1.5"
              />
              {/* Spores / Spots */}
              <circle cx="24" cy="22" r="3" fill="#7ee8b8" fillOpacity="0.6" />
              <circle cx="36" cy="18" r="2.5" fill="#7ee8b8" fillOpacity="0.6" />
              <circle cx="42" cy="28" r="3.5" fill="#7ee8b8" fillOpacity="0.6" />
              <defs>
                <linearGradient id="cap-gradient" x1="12" y1="10" x2="52" y2="38" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3d352c" />
                  <stop offset="1" stopColor="#1e1a15" />
                </linearGradient>
              </defs>
            </svg>

            {/* Mist particles when humidifier is on */}
            {isHumidifierOn && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-ping" />
                <span className="w-1 h-1 rounded-full bg-[#06b6d4] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
              </div>
            )}
          </div>

          <h4 className="text-sm font-bold text-[#f2ede2]">Pleurotus Ostreatus Substrate</h4>
          <p className="text-[11px] text-[#a9a396] font-mono mt-0.5">
            Target: 22-26°C • 75-90% RH
          </p>

          <div className="mt-3 flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded-lg bg-black/40 border border-white/5 text-[#f2ede2]">
              {temp !== null ? `${temp}°C` : '--°C'}
            </span>
            <span className="text-[#7a7263]">•</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-black/40 border border-white/5 text-[#f2ede2]">
              {hum !== null ? `${hum}%` : '--%'}
            </span>
          </div>
        </div>

        {/* Right Actuator: Humidifier (GPIO 27) */}
        <div
          className={`rounded-2xl border p-5 transition-all duration-300 ${
            isHumidifierOn
              ? 'bg-[#06b6d4]/10 border-[#06b6d4]/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
              : 'bg-white/5 border-white/5'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-mono tracking-wider text-[#a9a396]">
              Relay 2 • GPIO 27
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono ${
                isHumidifierOn
                  ? 'bg-[#06b6d4]/20 text-[#22d3ee] border-[#06b6d4]/30'
                  : 'bg-white/5 text-[#7a7263] border-white/5'
              }`}
            >
              {isHumidifierOn ? 'MISTING • ON' : 'STANDBY • OFF'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Ultrasonic Mist Graphic */}
            <div className="relative w-16 h-16 shrink-0 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
              <Droplets
                size={32}
                className={`transition-all ${
                  isHumidifierOn
                    ? 'text-[#22d3ee] animate-bounce'
                    : 'text-[#7a7263]'
                }`}
              />
              {isHumidifierOn && (
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(34,211,238,0.3)_0%,transparent_70%)] animate-pulse" />
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#f2ede2]">Mist Humidifier</h4>
              <p className="text-[11px] text-[#7a7263] mt-0.5 leading-tight">
                Threshold: &lt; 75.0% {isHumLow ? '(Substrate Dry)' : '(Optimal)'}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-[#a9a396]">
                <span className={`w-2 h-2 rounded-full ${isHumidifierOn ? 'bg-[#22d3ee] animate-ping' : 'bg-[#7a7263]'}`} />
                <span>{isHumidifierOn ? 'Ultrasonic Vapor Flowing' : 'Relay Idle'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
