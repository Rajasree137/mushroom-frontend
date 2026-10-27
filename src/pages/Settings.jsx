import React, { useState, useEffect } from 'react';
import {
  Server,
  Activity,
  Cpu,
  Layers,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Info,
  Smartphone,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getBackendHealth } from '../api/api';

export default function Settings() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);

  // Local UI Override Toggles (React state only)
  const [localFanOverride, setLocalFanOverride] = useState(false);
  const [localHumidifierOverride, setLocalHumidifierOverride] = useState(false);

  const checkHealth = async () => {
    setHealthLoading(true);
    try {
      const data = await getBackendHealth();
      setHealthStatus({ online: true, data });
    } catch (err) {
      setHealthStatus({ online: false, error: err.message });
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <div className="space-y-8">
      <PageHeader
        title="System Settings"
        subtitle="System architecture overview, API configuration, and manual actuator overrides."
      />

      {/* Connection Status Card */}
      <section className="rounded-2xl border border-white/10 bg-[#161411] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#7ee8b8]">
              <Server size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f2ede2]">Backend Connection Status</h2>
              <p className="text-xs text-[#7a7263]">Endpoint: {apiUrl}</p>
            </div>
          </div>

          <button
            onClick={checkHealth}
            disabled={healthLoading}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#a9a396] border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={14} className={healthLoading ? 'animate-spin' : ''} />
            <span>Test Ping</span>
          </button>
        </div>

        <div className="pt-3 border-t border-white/5">
          {healthLoading ? (
            <div className="text-xs text-[#a9a396] flex items-center gap-2 font-mono">
              <RefreshCw size={14} className="animate-spin text-[#7ee8b8]" />
              <span>Pinging GET /api/health...</span>
            </div>
          ) : healthStatus?.online ? (
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-[#7ee8b8]/15 border border-[#7ee8b8]/30 flex items-center justify-between text-[#7ee8b8] text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Flask Backend Connected (HTTP 200 OK)</span>
                </div>
                <span className="font-mono text-[11px] text-[#a9a396]">Port 5000</span>
              </div>

              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between font-semibold ${
                healthStatus?.data?.ml_service?.includes('available')
                  ? 'bg-[#7ee8b8]/10 border-[#7ee8b8]/25 text-[#7ee8b8]'
                  : 'bg-[#f2a65a]/10 border-[#f2a65a]/25 text-[#f2a65a]'
              }`}>
                <div className="flex items-center gap-2">
                  {healthStatus?.data?.ml_service?.includes('available') ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <AlertTriangle size={15} />
                  )}
                  <span>FastAPI ML Service: {healthStatus?.data?.ml_service || 'Unknown'}</span>
                </div>
                <span className="font-mono text-[11px] text-[#a9a396]">Port 8000</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-[#e0714a]/15 border border-[#e0714a]/30 flex items-center gap-2 text-[#e0714a] text-xs font-semibold">
              <AlertTriangle size={16} />
              <span>Backend Offline — Could not reach {apiUrl}</span>
            </div>
          )}
        </div>
      </section>

      {/* System Information Card */}
      <section className="rounded-2xl border border-white/10 bg-[#161411] p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#f2ede2]">System Architecture Overview</h2>
          <p className="text-xs text-[#7a7263] mt-0.5">
            B.E. Electronics and Communication Engineering Final-Year Project Specs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">
              Configured API Endpoint
            </span>
            <span className="text-sm font-bold text-[#7ee8b8] truncate block">
              {apiUrl}
            </span>
            <span className="text-[10px] text-[#7a7263] block font-sans">
              Set via import.meta.env.VITE_API_URL
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">
              Machine Learning Model
            </span>
            <span className="text-sm font-bold text-[#f2ede2] block">
              CNN Autoencoder
            </span>
            <span className="text-[10px] text-[#7a7263] block font-sans">
              Anomaly detection & image reconstruction
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">
              Full Stack Architecture
            </span>
            <span className="text-sm font-bold text-[#f2ede2] block">
              ESP32 → Flask → React + FastAPI ML
            </span>
            <span className="text-[10px] text-[#7a7263] block font-sans">
              Telemetry streaming & REST inference
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">
              Frontend Tech Stack
            </span>
            <span className="text-sm font-bold text-[#f2ede2] block">
              React + Vite + Tailwind CSS
            </span>
            <span className="text-[10px] text-[#7a7263] block font-sans">
              Lucide React & Recharts
            </span>
          </div>
        </div>
      </section>

      {/* ThingSpeak IoT Cloud Integration Card */}
      <section className="rounded-2xl border border-white/10 bg-[#161411] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#7ee8b8]">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f2ede2]">ThingSpeak™ IoT Cloud Integration</h2>
              <p className="text-xs text-[#7a7263]">MathWorks Cloud Analytics & Historical Time-Series Storage</p>
            </div>
          </div>

          {healthStatus?.data?.thingspeak?.channel_id ? (
            <a
              href={`https://thingspeak.mathworks.com/channels/${healthStatus.data.thingspeak.channel_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#7ee8b8]/15 hover:bg-[#7ee8b8]/25 text-xs font-semibold text-[#7ee8b8] border border-[#7ee8b8]/30 flex items-center gap-1.5 transition-colors"
            >
              <span>View Cloud Channel</span>
            </a>
          ) : (
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-white/5 text-[#a9a396] border border-white/5">
              Dual-Sync Ready
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-2">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">Cloud Status</span>
            <span className="text-xs font-bold text-[#7ee8b8] block truncate">
              {healthStatus?.data?.thingspeak?.last_status || 'Ready (Free 15s Tier)'}
            </span>
            <span className="text-[10px] text-[#7a7263] block font-sans">
              Syncs completed: {healthStatus?.data?.thingspeak?.total_syncs ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">Cloud Field Mapping</span>
            <span className="text-[11px] text-[#f2ede2] block">
              F1:Temp | F2:Hum | F3:Air
            </span>
            <span className="text-[10px] text-[#7a7263] block font-sans">
              F4:Fan | F5:Humidifier
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">Configuration Key</span>
            <span className="text-xs font-bold text-[#a9a396] block truncate">
              {healthStatus?.data?.thingspeak?.configured ? '••••••••••••••••' : 'Set in backend/.env'}
            </span>
            <span className="text-[10px] text-[#7a7263] block font-sans">
              THINGSPEAK_WRITE_API_KEY
            </span>
          </div>
        </div>
      </section>

      {/* Blynk IoT Cloud Integration Card */}
      <section className="rounded-2xl border border-white/10 bg-[#161411] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#24c48e]/10 border border-[#24c48e]/20 flex items-center justify-center text-[#24c48e]">
              <Smartphone size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f2ede2]">Blynk™ IoT Cloud 2.0 Integration</h2>
              <p className="text-xs text-[#7a7263]">Mobile App (iOS/Android) & Web Dashboard Remote Telemetry</p>
            </div>
          </div>

          <a
            href="https://blynk.cloud/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-[#24c48e]/15 hover:bg-[#24c48e]/25 text-xs font-semibold text-[#24c48e] border border-[#24c48e]/30 flex items-center gap-1.5 transition-colors"
          >
            <span>Launch Blynk Console</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs pt-2">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">Cloud Status</span>
            <span className="text-xs font-bold text-[#24c48e] block truncate">
              {healthStatus?.data?.blynk?.last_status || 'Ready (Direct / REST API)'}
            </span>
            <span className="text-[10px] text-[#7a7263] block font-sans">
              Syncs completed: {healthStatus?.data?.blynk?.total_syncs ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">Sensor Datastreams</span>
            <span className="text-[11px] text-[#f2ede2] block">
              V0: Temp | V1: Hum
            </span>
            <span className="text-[10px] text-[#7a7263] block font-sans">
              V2: Air | V6: MQ135 ADC
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">Actuator Datastreams</span>
            <span className="text-[11px] text-[#f2ede2] block">
              V3: Fan | V4: Humidifier
            </span>
            <span className="text-[10px] text-[#7a7263] block font-sans">
              V5: Manual/Auto Mode Toggle
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">Authentication</span>
            <span className="text-xs font-bold text-[#a9a396] block truncate">
              {healthStatus?.data?.blynk?.configured ? '••••••••••••••••' : 'Set BLYNK_AUTH_TOKEN'}
            </span>
            <span className="text-[10px] text-[#7a7263] block font-sans">
              Template: {healthStatus?.data?.blynk?.template_id || 'Mushroom Monitor'}
            </span>
          </div>
        </div>
      </section>

      {/* Manual Override UI Section */}
      <section className="rounded-2xl border border-white/10 bg-[#161411] p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#f2ede2]">Manual Actuator Override</h2>
          <p className="text-xs text-[#7a7263] mt-0.5">
            Test frontend state toggles for chamber climate actuators.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#f2a65a]/10 border border-[#f2a65a]/30 text-[#f2a65a] text-xs flex items-start gap-2">
          <Info size={16} className="shrink-0 mt-0.5" />
          <span>Local UI override — hardware control API not configured.</span>
        </div>

        <div className="space-y-4 pt-2">
          {/* Fan Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <span className="text-sm font-semibold text-[#f2ede2] block">
                Fan Manual Override
              </span>
              <span className="text-xs text-[#7a7263]">
                State: {localFanOverride ? 'ACTIVE (ON)' : 'INACTIVE (OFF)'}
              </span>
            </div>

            <button
              onClick={() => setLocalFanOverride(!localFanOverride)}
              className="text-[#7ee8b8] hover:opacity-80 transition-opacity"
            >
              {localFanOverride ? (
                <ToggleRight size={32} className="text-[#7ee8b8]" />
              ) : (
                <ToggleLeft size={32} className="text-[#78716c]" />
              )}
            </button>
          </div>

          {/* Humidifier Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <span className="text-sm font-semibold text-[#f2ede2] block">
                Humidifier Manual Override
              </span>
              <span className="text-xs text-[#7a7263]">
                State: {localHumidifierOverride ? 'ACTIVE (ON)' : 'INACTIVE (OFF)'}
              </span>
            </div>

            <button
              onClick={() => setLocalHumidifierOverride(!localHumidifierOverride)}
              className="text-[#7ee8b8] hover:opacity-80 transition-opacity"
            >
              {localHumidifierOverride ? (
                <ToggleRight size={32} className="text-[#7ee8b8]" />
              ) : (
                <ToggleLeft size={32} className="text-[#78716c]" />
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
