import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function PredictionCard({ prediction }) {
  if (!prediction) return null;

  const detectedClass = (
    prediction.detected_class ||
    prediction.result ||
    'HEALTHY'
  ).toString().toUpperCase();

  const isHealthy = detectedClass === 'HEALTHY' || detectedClass.includes('HEALTH');
  const confidence = prediction.confidence !== undefined ? prediction.confidence : 0;
  const anomalyScore = prediction.anomaly_score !== undefined ? prediction.anomaly_score : null;
  const reconstructionError = prediction.reconstruction_error !== undefined ? prediction.reconstruction_error : null;
  const threshold = prediction.threshold !== undefined ? prediction.threshold : null;
  const timestamp = prediction.timestamp || prediction.time || new Date().toLocaleTimeString();

  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        isHealthy
          ? 'bg-[#7ee8b8]/10 border-[#7ee8b8]/30'
          : 'bg-[#e0714a]/10 border-[#e0714a]/30'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isHealthy ? (
            <CheckCircle2 size={22} className="text-[#7ee8b8]" />
          ) : (
            <AlertTriangle size={22} className="text-[#e0714a]" />
          )}
          <h3
            className={`text-lg font-bold tracking-tight ${
              isHealthy ? 'text-[#7ee8b8]' : 'text-[#e0714a]'
            }`}
          >
            {isHealthy ? '✓ Healthy Mushroom' : '⚠ Possible Contamination'}
          </h3>
        </div>

        <StatusBadge status={detectedClass} />
      </div>

      <p className="text-xs text-[#a9a396] mb-4">
        {prediction.details || (isHealthy
          ? 'No anomalous features detected in substrate scan.'
          : 'Pathogenic fungal mold patterns identified by autoencoder anomaly model.')}
      </p>

      {/* Numerical Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 font-mono text-xs">
        <div>
          <span className="text-[10px] text-[#7a7263] uppercase block font-sans">
            Model Confidence Score
          </span>
          <span className="text-sm font-bold text-[#f2ede2]">{confidence}%</span>
        </div>

        {anomalyScore !== null && (
          <div>
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">
              Anomaly Score
            </span>
            <span className="text-sm font-bold text-[#f2ede2]">{anomalyScore}</span>
          </div>
        )}

        {reconstructionError !== null && (
          <div>
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">
              Reconstruction Error
            </span>
            <span className="text-sm font-bold text-[#f2ede2]">{reconstructionError}</span>
          </div>
        )}

        {threshold !== null && (
          <div>
            <span className="text-[10px] text-[#7a7263] uppercase block font-sans">
              Threshold
            </span>
            <span className="text-sm font-bold text-[#f2ede2]">{threshold}</span>
          </div>
        )}
      </div>

      <div className="mt-3 text-[10px] text-[#7a7263] text-right">
        Analysis Timestamp: {timestamp}
      </div>
    </div>
  );
}
