import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Plus, CheckCircle2, TrendingUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { getYieldData, createYieldEntry } from '../api/api';

export default function Yield() {
  const [yieldRecords, setYieldRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Form State
  const [dayLabel, setDayLabel] = useState('');
  const [predictedKg, setPredictedKg] = useState('');
  const [actualKg, setActualKg] = useState('');
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchYield = async () => {
    try {
      setFetchError(null);
      const data = await getYieldData();
      setYieldRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setFetchError(err.message || 'Failed to fetch yield records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYield();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validation
    if (!dayLabel.trim()) {
      setFormError('Day label is required (e.g. Day 7).');
      return;
    }

    const predVal = parseFloat(predictedKg);
    const actVal = parseFloat(actualKg);

    if (isNaN(predVal) || predVal < 0) {
      setFormError('Predicted yield must be a valid number >= 0.');
      return;
    }

    if (isNaN(actVal) || actVal < 0) {
      setFormError('Actual yield must be a valid number >= 0.');
      return;
    }

    setSubmitting(true);

    const payload = {
      day: dayLabel.trim(),
      predicted_kg: predVal,
      actual_kg: actVal,
      // Fallback aliases for backends expecting 'predicted' / 'actual'
      predicted: predVal,
      actual: actVal,
    };

    try {
      await createYieldEntry(payload);
      setFormSuccess(`Yield record for ${dayLabel} added successfully!`);
      setDayLabel('');
      setPredictedKg('');
      setActualKg('');
      await fetchYield();
    } catch (err) {
      setFormError(err.message || 'Failed to submit yield entry.');
    } finally {
      setSubmitting(false);
    }
  };

  // Format chart data to ensure keys match predicted_kg / actual_kg
  const chartData = yieldRecords.map((item) => ({
    day: item.day || 'Day --',
    'Predicted Yield (kg)': item.predicted_kg !== undefined ? item.predicted_kg : item.predicted ?? 0,
    'Actual Yield (kg)': item.actual_kg !== undefined ? item.actual_kg : item.actual ?? 0,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Yield Tracking"
        subtitle="Compare predicted and actual mushroom yield over the cultivation cycle."
      />

      {/* Main Yield Chart Section */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-[#a9a396]">
          Yield Trajectory (kg)
        </h2>

        {loading ? (
          <LoadingState message="Loading yield cultivation records..." />
        ) : fetchError ? (
          <ErrorState
            title="Unable to Load Yield Data"
            message={fetchError}
            onRetry={fetchYield}
          />
        ) : yieldRecords.length === 0 ? (
          <EmptyState
            title="Yield data will appear here after cultivation records are added."
            message="Use the form below to log harvest records into the backend database."
            icon={TrendingUp}
          />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#161411] p-5">
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="day" stroke="#7a7263" fontSize={12} tickLine={false} />
                  <YAxis stroke="#7a7263" fontSize={12} tickLine={false} unit=" kg" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161411',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#f2ede2',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#a9a396' }} />
                  <Line
                    type="monotone"
                    dataKey="Predicted Yield (kg)"
                    stroke="#f2a65a"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#f2a65a' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Actual Yield (kg)"
                    stroke="#7ee8b8"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#7ee8b8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>

      {/* Yield Entry Form Section */}
      <section className="rounded-2xl border border-white/10 bg-[#161411] p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#f2ede2]">Log New Yield Record</h2>
          <p className="text-xs text-[#7a7263] mt-0.5">
            Submit flush measurements to update predictive model metrics.
          </p>
        </div>

        {formSuccess && (
          <div className="p-3.5 rounded-xl bg-[#7ee8b8]/15 border border-[#7ee8b8]/30 text-[#7ee8b8] text-xs flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{formSuccess}</span>
          </div>
        )}

        {formError && (
          <div className="p-3.5 rounded-xl bg-[#e0714a]/15 border border-[#e0714a]/30 text-[#e0714a] text-xs">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-[#a9a396] block mb-1.5">
              Day Label
            </label>
            <input
              type="text"
              value={dayLabel}
              onChange={(e) => setDayLabel(e.target.value)}
              placeholder="e.g. Day 7"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#f2ede2] focus:outline-none focus:border-[#7ee8b8]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#a9a396] block mb-1.5">
              Predicted Yield (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={predictedKg}
              onChange={(e) => setPredictedKg(e.target.value)}
              placeholder="e.g. 2.5"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#f2ede2] focus:outline-none focus:border-[#7ee8b8]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#a9a396] block mb-1.5">
              Actual Yield (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={actualKg}
              onChange={(e) => setActualKg(e.target.value)}
              placeholder="e.g. 2.3"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#f2ede2] focus:outline-none focus:border-[#7ee8b8]"
              required
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#7ee8b8] text-[#0d0c0a] font-bold text-xs uppercase tracking-wider hover:bg-[#7ee8b8]/90 transition-colors flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>{submitting ? 'Submitting...' : 'Add Yield Record'}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
