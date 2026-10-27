/**
 * Centralized API module for Mycelia Mushroom Cultivation System.
 * Connects to Flask REST backend using import.meta.env.VITE_API_URL.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData) {
        errorMessage = errorData.details || errorData.detail || errorData.message || errorData.error || errorMessage;
      }
    } catch (_) {
      // Failed to parse JSON error, keep default HTTP message
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

// 1. Get Environmental Sensors Telemetry
export async function getSensors() {
  try {
    const response = await fetch(`${BASE_URL}/api/sensors`);
    return await handleResponse(response);
  } catch (error) {
    console.error('getSensors error:', error.message);
    throw error;
  }
}

// 2. Get Contamination Predictions History
export async function getPredictions() {
  try {
    const response = await fetch(`${BASE_URL}/api/predictions`);
    return await handleResponse(response);
  } catch (error) {
    console.error('getPredictions error:', error.message);
    throw error;
  }
}

// 3. Upload Image for Contamination Anomaly Inference
export async function predictMushroom(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    // Note: Do NOT set Content-Type header manually for FormData.
    // The browser automatically sets multipart/form-data with proper boundary.
    const response = await fetch(`${BASE_URL}/api/predict`, {
      method: 'POST',
      body: formData,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('predictMushroom error:', error.message);
    throw error;
  }
}

// Alias for predictMushroom
export const uploadPrediction = predictMushroom;

// 4. Get Yield Records
export async function getYieldData() {
  try {
    const response = await fetch(`${BASE_URL}/api/yield`);
    return await handleResponse(response);
  } catch (error) {
    console.error('getYieldData error:', error.message);
    throw error;
  }
}

// Alias for getYieldData
export const getYield = getYieldData;

// 5. Create Yield Entry
export async function createYieldEntry(data) {
  try {
    const response = await fetch(`${BASE_URL}/api/yield`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('createYieldEntry error:', error.message);
    throw error;
  }
}

// Alias for createYieldEntry
export const addYield = createYieldEntry;

// 6. Get System Alerts
export async function getAlerts() {
  try {
    const response = await fetch(`${BASE_URL}/api/alerts`);
    return await handleResponse(response);
  } catch (error) {
    console.error('getAlerts error:', error.message);
    throw error;
  }
}

// 7. Create System Alert
export async function createAlert(data) {
  try {
    const response = await fetch(`${BASE_URL}/api/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('createAlert error:', error.message);
    throw error;
  }
}

// Alias for createAlert
export const addAlert = createAlert;

// 8. Health Check
export async function getBackendHealth() {
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    return await handleResponse(response);
  } catch (error) {
    // Also try root / health endpoint if /api/health fails
    try {
      const fallbackResponse = await fetch(`${BASE_URL}/health`);
      return await handleResponse(fallbackResponse);
    } catch (_) {
      console.error('getBackendHealth error:', error.message);
      throw error;
    }
  }
}

// 9. Cloud Status (ThingSpeak & Blynk)
export async function getCloudStatus() {
  try {
    const response = await fetch(`${BASE_URL}/api/cloud-status`);
    return await handleResponse(response);
  } catch (error) {
    console.error('getCloudStatus error:', error.message);
    throw error;
  }
}

// 10. Blynk IoT Cloud Status
export async function getBlynkStatus() {
  try {
    const response = await fetch(`${BASE_URL}/api/blynk/status`);
    return await handleResponse(response);
  } catch (error) {
    console.error('getBlynkStatus error:', error.message);
    throw error;
  }
}

// 11. Trigger Blynk Manual Sync
export async function triggerBlynkSync() {
  try {
    const response = await fetch(`${BASE_URL}/api/blynk/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('triggerBlynkSync error:', error.message);
    throw error;
  }
}

export default {
  getSensors,
  getPredictions,
  predictMushroom,
  uploadPrediction,
  getYieldData,
  getYield,
  createYieldEntry,
  addYield,
  getAlerts,
  createAlert,
  addAlert,
  getBackendHealth,
  getCloudStatus,
  getBlynkStatus,
  triggerBlynkSync,
};
