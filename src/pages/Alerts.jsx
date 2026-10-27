import React, { useState, useEffect } from 'react';
import { Bell, Plus, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import AlertCard from '../components/AlertCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { getAlerts, createAlert } from '../api/api';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Form State
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('WARNING');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const fetchAlertsData = async () => {
    try {
      setError(null);
      const data = await getAlerts();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch alerts from backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsData();
  }, []);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!message.trim()) {
      setFormError('Alert message cannot be empty.');
      return;
    }

    setSubmitting(true);

    const payload = {
      message: message.trim(),
      severity: severity.toUpperCase(),
      // Fallback aliases
      text: message.trim(),
    };

    try {
      await createAlert(payload);
      setFormSuccess('Alert logged successfully.');
      setMessage('');
      setSeverity('WARNING');
      await fetchAlertsData();
    } catch (err) {
      setFormError(err.message || 'Failed to dispatch alert.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (activeFilter === 'ALL') return true;
    const sev = (alert.severity || 'INFO').toUpperCase();
    return sev === activeFilter;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="System Alerts"
        subtitle="Real-time environmental warnings, pathogen detection, and cultivation events."
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'INFO', 'WARNING', 'CRITICAL'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all ${
              activeFilter === filter
                ? 'bg-[#7ee8b8]/15 text-[#7ee8b8] border border-[#7ee8b8]/30 shadow-sm'
                : 'bg-[#161411] text-[#a9a396] border border-white/5 hover:bg-white/5'
            }`}
          >
            {filter} {filter === 'ALL' ? `(${alerts.length})` : ''}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <section className="space-y-3">
        {loading ? (
          <LoadingState message="Loading system alerts..." />
        ) : error ? (
          <ErrorState
            title="Failed to Load Alerts"
            message={error}
            onRetry={fetchAlertsData}
          />
        ) : filteredAlerts.length === 0 ? (
          <EmptyState
            title="No active alerts recorded."
            message="No system warnings match the selected filter."
            icon={Bell}
          />
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((item, idx) => (
              <AlertCard key={item.id || idx} alert={item} />
            ))}
          </div>
        )}
      </section>

      {/* Dispatch New Alert Form */}
      <section className="rounded-2xl border border-white/10 bg-[#161411] p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#f2ede2]">Create System Alert</h2>
          <p className="text-xs text-[#7a7263] mt-0.5">
            Manually log a cultivation incident or environmental warning into the system feed.
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

        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-[#a9a396] block mb-1.5">
                Alert Message
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Humidity dropped below recommended level"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#f2ede2] focus:outline-none focus:border-[#7ee8b8]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#a9a396] block mb-1.5">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161411] border border-white/10 text-xs text-[#f2ede2] focus:outline-none focus:border-[#7ee8b8]"
              >
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#7ee8b8] text-[#0d0c0a] font-bold text-xs uppercase tracking-wider hover:bg-[#7ee8b8]/90 transition-colors flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>{submitting ? 'Dispatching...' : 'Create Alert'}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
