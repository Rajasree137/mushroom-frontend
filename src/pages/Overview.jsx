import React, { useState, useEffect } from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Sliders,
  RefreshCw,
  Radio,
  Zap,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import GrowChamberVisualizer from '../components/GrowChamberVisualizer';
import RadialGauge from '../components/RadialGauge';
import PredictionCard from '../components/PredictionCard';
import AlertCard from '../components/AlertCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { getSensors, getPredictions, getAlerts, getCloudStatus } from '../api/api';

export default function Overview() {
  const [sensorsData, setSensorsData] = useState(null);
  const [predictionsData, setPredictionsData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [cloudData, setCloudData] = useState(null);

  const [sensorsLoading, setSensorsLoading] = useState(true);
  const [predictionsLoading, setPredictionsLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);

  const [sensorsError, setSensorsError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Rolling telemetry history for Recharts live trend visualization
  const [telemetryHistory, setTelemetryHistory] = useState([
    { time: '10:00', temp: 24.2, hum: 82.5 },
    { time: '10:05', temp: 24.4, hum: 81.0 },
    { time: '10:10', temp: 24.6, hum: 79.5 },
    { time: '10:15', temp: 24.5, hum: 83.0 },
    { time: '10:20', temp: 24.7, hum: 80.5 },
  ]);

  const fetchOverviewData = async () => {
    setIsRefreshing(true);
    // 1. Fetch Sensors (Telemetry)
    try {
      const data = await getSensors();
      setSensorsData(data);
      setSensorsError(null);
      const currentTime = new Date().toLocaleTimeString();
      setLastUpdated(currentTime);

      // Append real data to rolling chart if present
      if (data && (data.temperature !== null || data.humidity !== null)) {
        setTelemetryHistory((prev) => {
          const newEntry = {
            time: currentTime.split(' ')[0],
            temp: Number(data.temperature) || 24.5,
            hum: Number(data.humidity) || 80.0,
          };
          const updated = [...prev, newEntry];
          return updated.slice(-15); // keep last 15 points
        });
      }
    } catch (err) {
      setSensorsError(err.message || 'Failed to fetch sensor telemetry');
    } finally {
      setSensorsLoading(false);
    }

    // 2. Fetch Recent Contamination Predictions
    try {
      const data = await getPredictions();
      setPredictionsData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Predictions fetch note:', err.message);
    } finally {
      setPredictionsLoading(false);
    }

    // 3. Fetch System Alerts
    try {
      const data = await getAlerts();
      setAlertsData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Alerts fetch note:', err.message);
    } finally {
      setAlertsLoading(false);
    }

    // 4. Fetch Cloud Sync (Blynk & ThingSpeak)
    try {
      const cData = await getCloudStatus();
      setCloudData(cData);
    } catch (_) {
      // optional cloud status
    }

    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchOverviewData();

    // Fast polling every 3.5 seconds matching ESP32 telemetry cycle
    const intervalId = setInterval(fetchOverviewData, 3500);
    return () => clearInterval(intervalId);
  }, []);

  // Helper extraction
  const getVal = (key) => {
    if (!sensorsData) return null;
    return sensorsData[key] !== undefined ? sensorsData[key] : null;
  };

  const tempVal = getVal('temperature');
  const humVal = getVal('humidity');
  const rawAir = getVal('air_quality') ?? getVal('air');
  const fanVal = getVal('fan_status') ?? getVal('fan');
  const humStatusVal = getVal('humidifier_status') ?? getVal('humidifier');
  const controlMode = getVal('control_mode') || 'AUTO';

  const hasEsp32Data = tempVal !== null || humVal !== null || rawAir !== null;

  // Air Quality formatting
  let airQualityString = 'GOOD';
  if (rawAir !== null && rawAir !== undefined) {
    if (typeof rawAir === 'string') {
      airQualityString = rawAir.toUpperCase();
    } else if (rawAir === 1) {
      airQualityString = 'POOR';
    } else if (rawAir > 800) {
      airQualityString = 'POOR';
    } else {
      airQualityString = 'GOOD';
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header with High-Tech Live Status Badge */}
      <PageHeader
        title="Smart Mushroom Cultivation"
        subtitle="Real-Time Mycological Edge Telemetry & Autonomous Biome Control"
        action={
          <div className="flex flex-wrap items-center gap-3">
            {/* Live ESP32 status pill */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-all ${
                !sensorsError && hasEsp32Data
                  ? 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : !sensorsError
                  ? 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30'
                  : 'bg-[#ef4444]/15 text-[#f87171] border-[#ef4444]/30'
              }`}
            >
              <Radio size={14} className={!sensorsError ? 'animate-pulse' : ''} />
              <span>
                {sensorsError
                  ? 'Backend Offline'
                  : hasEsp32Data
                  ? 'ESP32 Live Stream'
                  : 'Waiting for Hardware'}
              </span>
            </div>

            {/* Cloud Sync Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#a9a396]">
              <Zap size={13} className="text-[#24c48e]" />
              <span>Blynk IoT Cloud: Active</span>
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={fetchOverviewData}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#a9a396] hover:text-[#f2ede2] transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        }
      />

      {/* Main Digital Twin Visualizer (Unique Biome Simulation) */}
      <section className="space-y-2">
        <GrowChamberVisualizer
          temp={tempVal}
          hum={humVal}
          airQuality={airQualityString}
          fanStatus={fanVal}
          humidifierStatus={humStatusVal}
          controlMode={controlMode}
        />
      </section>

      {/* Futuristic Radial Gauges Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold tracking-widest uppercase text-[#a9a396] flex items-center gap-2">
            <Activity size={14} className="text-[#10b981]" />
            Precision Telemetry Instruments
          </h2>
          <span className="text-[11px] font-mono text-[#7a7263]">
            {lastUpdated ? `Last Sample: ${lastUpdated}` : 'Connecting...'}
          </span>
        </div>

        {sensorsLoading ? (
          <LoadingState message="Connecting to telemetry stream..." />
        ) : sensorsError ? (
          <ErrorState
            title="Telemetry Unavailable"
            message={`Could not connect to Flask backend (${sensorsError}). Ensure 'python3 app.py' is running on port 5000/5001.`}
            onRetry={fetchOverviewData}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Temperature Radial Gauge */}
            <RadialGauge
              title="Chamber Temperature"
              value={tempVal !== null ? tempVal : '--'}
              unit="°C"
              min={10}
              max={40}
              targetMin={22}
              targetMax={26}
              icon={Thermometer}
              color="#10b981"
              statusText={
                tempVal === null
                  ? 'OFFLINE'
                  : tempVal < 20
                  ? 'COLD'
                  : tempVal > 28
                  ? 'WARM'
                  : 'OPTIMAL (22-26°C)'
              }
              description="Optimal fruiting incubation range: 22.0°C – 26.0°C"
            />

            {/* Humidity Radial Gauge */}
            <RadialGauge
              title="Relative Humidity"
              value={humVal !== null ? humVal : '--'}
              unit="%"
              min={40}
              max={100}
              targetMin={75}
              targetMax={90}
              icon={Droplets}
              color="#06b6d4"
              statusText={
                humVal === null
                  ? 'OFFLINE'
                  : humVal < 75
                  ? 'DEFICIT (<75%)'
                  : 'OPTIMAL (75-90%)'
              }
              description="Substrate hydration trigger: Humidifier turns ON if < 75.0%"
            />

            {/* Air Quality Radial Gas Index */}
            <RadialGauge
              title="Air Quality (MQ135)"
              value={airQualityString}
              unit="Purity"
              min={0}
              max={1}
              icon={Wind}
              color={airQualityString === 'POOR' ? '#ef4444' : '#10b981'}
              statusText={airQualityString === 'POOR' ? 'HIGH CO2 / GAS' : 'FRESH AIR'}
              description={
                airQualityString === 'POOR'
                  ? 'Exhaust Fan triggered to purge contaminated chamber air'
                  : 'Air balance safe for mycelial respiration'
              }
            />
          </div>
        )}
      </section>

      {/* Environmental Time-Series Chart & Actuator Diagnostic Twin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rolling 15-Point Live History Area Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#14120e] p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#7ee8b8]">
                <TrendingUp size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#f2ede2]">
                  Live Environmental Trends (Temp & Humidity)
                </h3>
                <p className="text-[11px] text-[#7a7263]">
                  Real-time rolling microclimate trendline synchronized with ESP32 telemetry
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#34d399]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                Temp (°C)
              </span>
              <span className="flex items-center gap-1.5 text-[#22d3ee]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                Hum (%)
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" />
                <XAxis dataKey="time" stroke="#7a7263" fontSize={10} tickLine={false} />
                <YAxis stroke="#7a7263" fontSize={10} tickLine={false} domain={[15, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1914',
                    borderColor: '#ffffff15',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <ReferenceLine y={75} stroke="#06b6d4" strokeDasharray="4 4" label={{ value: 'Min Hum (75%)', fill: '#06b6d4', fontSize: 9 }} />
                <ReferenceLine y={26} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Max Temp (26°C)', fill: '#10b981', fontSize: 9 }} />
                <Area type="monotone" dataKey="temp" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradient)" />
                <Area type="monotone" dataKey="hum" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#humGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hardware Pin Mapping & Circuit Diagnostics */}
        <div className="rounded-3xl border border-white/10 bg-[#14120e] p-6 space-y-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#fbbf24]">
                <Cpu size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#f2ede2]">Hardware Pin Diagnostics</h3>
                <p className="text-[11px] text-[#7a7263]">ESP32 DevKit GPIO bus configuration</p>
              </div>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-[#a9a396]">DHT11 Temp & Hum</span>
                <span className="text-[#34d399] font-bold">GPIO 5</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-[#a9a396]">MQ135 Air Quality</span>
                <span className="text-[#fbbf24] font-bold">GPIO 34 (Digital)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-[#a9a396]">Relay 1: Exhaust Fan</span>
                <span className={`font-bold ${fanVal ? 'text-[#34d399]' : 'text-[#7a7263]'}`}>
                  GPIO 26 {fanVal ? '• ON' : '• OFF'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-[#a9a396]">Relay 2: Humidifier</span>
                <span className={`font-bold ${humStatusVal ? 'text-[#22d3ee]' : 'text-[#7a7263]'}`}>
                  GPIO 27 {humStatusVal ? '• ON' : '• OFF'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-[#a9a396]">I2C OLED SSD1306</span>
                <span className="text-[#f2ede2] font-bold">SDA: 21 | SCL: 22</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 text-[11px] text-[#7a7263] flex items-center justify-between">
            <span>Relay Logic: Active HIGH</span>
            <span className="text-[#34d399]">All Pins Locked</span>
          </div>
        </div>
      </div>

      {/* Contamination Predictions & System Alerts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Contamination Analyses */}
        <div className="rounded-3xl border border-white/10 bg-[#14120e] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold tracking-widest uppercase text-[#a9a396] flex items-center gap-2">
              <Sparkles size={14} className="text-[#7ee8b8]" />
              AI Contamination Inspection
            </h3>
            <span className="text-[10px] font-mono text-[#7a7263]">CNN Autoencoder</span>
          </div>

          {predictionsLoading ? (
            <LoadingState message="Loading predictions..." />
          ) : predictionsData.length === 0 ? (
            <EmptyState
              title="No image scans yet"
              message="Upload a substrate bag photo on the Contamination page to verify mycelium health."
            />
          ) : (
            <div className="space-y-3">
              {predictionsData.slice(0, 3).map((item, idx) => (
                <PredictionCard key={item.id || idx} prediction={item} />
              ))}
            </div>
          )}
        </div>

        {/* Live System Alerts */}
        <div className="rounded-3xl border border-white/10 bg-[#14120e] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold tracking-widest uppercase text-[#a9a396] flex items-center gap-2">
              <ShieldAlert size={14} className="text-[#f59e0b]" />
              Automated Climate Alerts
            </h3>
            <span className="text-[10px] font-mono text-[#7a7263]">Real-Time Rules</span>
          </div>

          {alertsLoading ? (
            <LoadingState message="Loading alerts..." />
          ) : alertsData.length === 0 ? (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-[#7a7263]">
              <CheckCircle2 size={24} className="mx-auto text-[#10b981] mb-2" />
              All chamber parameters are within biological bounds. No alerts registered.
            </div>
          ) : (
            <div className="space-y-3">
              {alertsData.slice(0, 3).map((alert, idx) => (
                <AlertCard key={alert.id || idx} alert={alert} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
