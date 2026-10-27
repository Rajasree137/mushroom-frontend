import React from 'react';

export default function RadialGauge({
  title,
  value,
  unit = '',
  min = 0,
  max = 100,
  targetMin = null,
  targetMax = null,
  icon: Icon,
  color = '#10b981',
  statusText = 'Normal',
  description,
}) {
  const isOffline = value === null || value === undefined;
  const numVal = isOffline ? min : Number(value);

  // Normalize percentage for arc (clamped 0 to 1)
  const clampedVal = Math.min(Math.max(numVal, min), max);
  const percentage = (clampedVal - min) / (max - min);

  // SVG Gauge Geometry (240 degree arc)
  const radius = 68;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - percentage * arcLength;

  return (
    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#181613] to-[#12110e] p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-white/20 shadow-lg group">
      {/* Title & Status */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center border"
              style={{ backgroundColor: `${color}15`, borderColor: `${color}30`, color: color }}
            >
              <Icon size={15} />
            </div>
          )}
          <span className="text-xs font-semibold uppercase tracking-wider text-[#a9a396]">
            {title}
          </span>
        </div>

        <span
          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
          style={{ backgroundColor: `${color}15`, borderColor: `${color}30`, color: color }}
        >
          {isOffline ? 'OFFLINE' : statusText}
        </span>
      </div>

      {/* Radial SVG Dial */}
      <div className="relative w-44 h-40 flex items-center justify-center mt-2">
        <svg className="w-full h-full transform rotate-[150deg]" viewBox="0 0 170 170">
          {/* Background Track Arc */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="transparent"
            stroke="#26221d"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Target Zone Arc (if applicable) */}
          {targetMin !== null && targetMax !== null && (
            <circle
              cx="85"
              cy="85"
              r={radius}
              fill="transparent"
              stroke="#ffffff15"
              strokeWidth={strokeWidth + 2}
              strokeDasharray={`${arcLength * ((targetMax - targetMin) / (max - min))} ${circumference}`}
              strokeDashoffset={-arcLength * ((targetMin - min) / (max - min))}
              strokeLinecap="butt"
            />
          )}

          {/* Active Colored Value Arc */}
          {!isOffline && (
            <circle
              cx="85"
              cy="85"
              r={radius}
              fill="transparent"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 6px ${color}80)`,
              }}
            />
          )}
        </svg>

        {/* Center Value Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-3">
          <span className="text-3xl font-extrabold font-mono tracking-tight text-[#f2ede2]">
            {isOffline ? '--' : value}
          </span>
          <span className="text-xs font-medium text-[#7a7263] uppercase tracking-wider mt-0.5">
            {unit}
          </span>
        </div>
      </div>

      {/* Target range & info footer */}
      {description && (
        <div className="w-full pt-3 mt-1 border-t border-white/5 text-[11px] text-[#7a7263]">
          {description}
        </div>
      )}
    </div>
  );
}
