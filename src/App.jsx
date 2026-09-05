// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App
import React, { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
import {
  LayoutDashboard,
  Thermometer,
  Droplets,
  Wind,
  Camera,
  Sprout,
  TrendingUp,
  Bell,
  Settings,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const nav = [
  { key: "home", label: "Overview", icon: LayoutDashboard },
  { key: "contamination", label: "Contamination", icon: Camera },
  { key: "growth", label: "Growth phase", icon: Sprout },
  { key: "yield", label: "Yield", icon: TrendingUp },
  { key: "alerts", label: "Alerts", icon: Bell },
  { key: "settings", label: "Settings", icon: Settings },
];

const sensors = [
  {
    label: "Temperature",
    value: "24.6",
    unit: "°C",
    range: "22-26°C",
    icon: Thermometer,
    trend: [22, 23, 23.5, 24, 24.2, 24.6],
    color: "#7ee8b8",
  },
  {
    label: "Humidity",
    value: "81",
    unit: "%",
    range: "75-90%",
    icon: Droplets,
    trend: [74, 76, 78, 79, 80, 81],
    color: "#5fb8e0",
  },
  {
    label: "Air quality",
    value: "612",
    unit: "ppm",
    range: "<800 ppm",
    icon: Wind,
    trend: [520, 540, 580, 590, 605, 612],
    color: "#f2a65a",
  },
];

const predictions = [
  { batch: "Batch 3", time: "10:42 AM", result: "Contaminated", confidence: 92 },
  { batch: "Batch 1", time: "09:15 AM", result: "Healthy", confidence: 97 },
  { batch: "Batch 2", time: "08:03 AM", result: "Healthy", confidence: 95 },
];

const yieldData = [
  { day: "D1", predicted: 0.4, actual: 0.3 },
  { day: "D4", predicted: 1.1, actual: 1.0 },
  { day: "D7", predicted: 2.3, actual: 2.1 },
  { day: "D10", predicted: 3.6, actual: 3.4 },
  { day: "D13", predicted: 4.8, actual: null },
];

const alerts = [
  { text: "Contamination detected in Batch 3", time: "10:42 AM", severity: "high" },
  { text: "Humidity dropped below threshold, Room 2", time: "07:58 AM", severity: "medium" },
  { text: "Batch 1 entered fruiting phase", time: "Yesterday", severity: "low" },
];

const growthPhases = ["Spawning", "Colonization", "Pinning", "Fruiting", "Harvest"];
const currentPhaseIndex = 2;

function Sparkline({ data, color }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <div style={{ width: "100%", height: 32 }}>
      <ResponsiveContainer>
        <AreaChart data={points} margin={{ top: 2, bottom: 0, left: 0, right: 0 }}>
          <defs>
            <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#grad-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#181510] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#f2ede2] tracking-wide">{title}</h2>
        {subtitle && <span className="text-xs text-[#7a7263]">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("home");
  const [humidifier, setHumidifier] = useState(true);
  const [fan, setFan] = useState(false);
  const [liveSensors, setLiveSensors] = useState(sensors);
const [livePredictions, setLivePredictions] = useState(predictions);
const [liveYield, setLiveYield] = useState(yieldData);
const [liveAlerts, setLiveAlerts] = useState(alerts);
useEffect(() => {
    fetch(`${API_URL}/api/sensors`)
      .then((res) => res.json())
      .then((data) => {
        const merged = sensors.map((s) => {
          const match = data.find((a) => a.label === s.label);
          return match ? { ...s, value: match.value } : s;
        });
        setLiveSensors(merged);
      });

    fetch(`${API_URL}/api/predictions`).then((res) => res.json()).then(setLivePredictions);
    fetch(`${API_URL}/api/yield`).then((res) => res.json()).then(setLiveYield);
    fetch(`${API_URL}/api/alerts`).then((res) => res.json()).then(setLiveAlerts);
  }, []);
  return (
    <div className="min-h-screen w-full bg-[#0d0c0a] text-[#f2ede2] flex">
      <aside className="w-56 shrink-0 bg-[#12100d] border-r border-white/5 flex flex-col py-6 px-3">
        <div className="px-3 mb-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#7ee8b8]/15 flex items-center justify-center">
            <Sprout size={16} className="text-[#7ee8b8]" />
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight">Mycelia</p>
            <p className="text-[10px] text-[#7a7263] uppercase tracking-widest">
              Cultivation OS
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#7ee8b8]/10 text-[#7ee8b8]"
                    : "text-[#a9a396] hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pt-4 border-t border-white/5 text-xs text-[#7a7263]">
          Eshwar Growers
          <br />3 active batches
        </div>
      </aside>

      <main className="flex-1 p-8 space-y-6">
        <header className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#7a7263] mb-1">
              Live overview
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              All systems <span className="text-[#7ee8b8]">nominal</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#7a7263]">
            <Activity size={14} className="text-[#7ee8b8]" />
            Monday, August 10
          </div>
        </header>

        <section className="grid grid-cols-3 gap-4">
          {sensors.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-[#181510] p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon size={16} style={{ color: s.color }} />
                  <span className="text-[10px] text-[#7a7263] uppercase tracking-widest">
                    {s.label}
                  </span>
                </div>
                <p className="text-4xl font-semibold tracking-tight">
                  {s.value}
                  <span className="text-base text-[#7a7263] ml-1">{s.unit}</span>
                </p>
                <p className="text-xs text-[#7a7263] mt-1 mb-2">target {s.range}</p>
                <Sparkline data={s.trend} color={s.color} />
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <SectionCard title="Contamination detection" subtitle="Latest 3 predictions">
              <div className="space-y-2">
                {predictions.map((p, i) => {
                  const bad = p.result === "Contaminated";
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                        bad
                          ? "border-[#e0714a]/30 bg-[#e0714a]/5"
                          : "border-white/5 bg-white/[0.02]"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium">{p.batch}</p>
                        <p className="text-xs text-[#7a7263]">{p.time}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-sm font-medium"
                          style={{ color: bad ? "#e0714a" : "#7ee8b8" }}
                        >
                          {p.result}
                        </p>
                        <p className="text-xs text-[#7a7263]">{p.confidence}% confidence</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Growth phase" subtitle="Batch 1">
            <div className="space-y-3">
              {growthPhases.map((phase, i) => {
                const done = i < currentPhaseIndex;
                const isCurrent = i === currentPhaseIndex;
                return (
                  <div key={phase} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        background: done
                          ? "#7ee8b8"
                          : isCurrent
                          ? "#f2a65a"
                          : "rgba(255,255,255,0.15)",
                        boxShadow: isCurrent ? "0 0 8px #f2a65a" : "none",
                      }}
                    />
                    <span
                      className={`text-sm ${
                        isCurrent
                          ? "text-[#f2ede2] font-medium"
                          : done
                          ? "text-[#a9a396]"
                          : "text-[#5a564c]"
                      }`}
                    >
                      {phase}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-[#7a7263] mt-4 pt-4 border-t border-white/5">
              Day 8 of ~14 · est. 6 days to harvest
            </p>
          </SectionCard>
        </section>

        <section className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <SectionCard title="Predicted vs actual yield" subtitle="kg">
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer>
                  <LineChart data={yieldData}>
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#f2a65a"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#7ee8b8"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-[#7a7263]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f2a65a]" /> Predicted
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7ee8b8]" /> Actual
                </span>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Manual override">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#a9a396]">Humidifier</span>
                <button onClick={() => setHumidifier(!humidifier)}>
                  {humidifier ? (
                    <ToggleRight size={26} className="text-[#7ee8b8]" />
                  ) : (
                    <ToggleLeft size={26} className="text-[#5a564c]" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#a9a396]">Exhaust fan</span>
                <button onClick={() => setFan(!fan)}>
                  {fan ? (
                    <ToggleRight size={26} className="text-[#7ee8b8]" />
                  ) : (
                    <ToggleLeft size={26} className="text-[#5a564c]" />
                  )}
                </button>
              </div>
            </div>
          </SectionCard>
        </section>

        <SectionCard title="Recent alerts">
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <AlertTriangle
                  size={14}
                  style={{
                    color:
                      a.severity === "high"
                        ? "#e0714a"
                        : a.severity === "medium"
                        ? "#f2a65a"
                        : "#7a7263",
                  }}
                />
                <span className="text-sm flex-1 text-[#f2ede2]">{a.text}</span>
                <span className="text-xs text-[#7a7263]">{a.time}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </main>
    </div>
  );
}