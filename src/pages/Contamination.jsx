import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Code,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PredictionCard from '../components/PredictionCard';
import ErrorState from '../components/ErrorState';
import { predictMushroom } from '../api/api';

export default function Contamination() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const fileInputRef = useRef(null);

  // File Validation
  const validateAndSetFile = (file) => {
    setValidationError(null);
    setApiError(null);
    setPredictionResult(null);

    if (!file) return;

    // Type check
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setValidationError('Unsupported file format. Please upload a PNG, JPG, or JPEG image.');
      return;
    }

    // Size check (max 10MB)
    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setValidationError(`File size exceeds ${maxSizeMB}MB limit. Please select a smaller photo.`);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    setPredictionResult(null);
    setApiError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Perform Analysis
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setApiError(null);

    try {
      // Calls POST /api/predict with multipart/form-data
      const result = await predictMushroom(selectedFile);
      setPredictionResult(result.prediction || result);
    } catch (err) {
      setApiError(err.message || 'Failed to complete image analysis');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Contamination Detection"
        subtitle="Analyze mushroom images using the CNN Autoencoder anomaly detection model."
      />

      {/* Upload Dropzone Container */}
      <div className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !previewUrl && fileInputRef.current?.click()}
          className={`rounded-2xl border-2 border-dashed p-8 transition-all flex flex-col items-center justify-center text-center ${
            isDragging
              ? 'border-[#7ee8b8] bg-[#7ee8b8]/5'
              : previewUrl
              ? 'border-white/10 bg-[#161411]'
              : 'border-white/15 bg-[#161411] hover:border-[#7ee8b8]/50 cursor-pointer'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />

          {previewUrl ? (
            <div className="w-full max-w-md space-y-4 flex flex-col items-center">
              <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-64 bg-black/40">
                <img
                  src={previewUrl}
                  alt="Substrate upload preview"
                  className="max-h-64 object-contain rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 text-xs text-[#a9a396]">
                <div className="flex items-center gap-2 truncate">
                  <ImageIcon size={16} className="text-[#7ee8b8] shrink-0" />
                  <span className="font-mono text-[#f2ede2] truncate">
                    {selectedFile.name}
                  </span>
                  <span className="text-[11px] text-[#7a7263]">
                    ({formatFileSize(selectedFile.size)})
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="p-1 rounded-lg hover:bg-white/10 text-[#e0714a] transition-colors"
                  title="Remove Image"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#7ee8b8]/15 border border-[#7ee8b8]/30 flex items-center justify-center mx-auto text-[#7ee8b8]">
                <Upload size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#f2ede2]">
                  Click to upload or drag & drop mushroom photo
                </p>
                <p className="text-xs text-[#7a7263] mt-1">
                  Supports PNG, JPG, or JPEG up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Validation Errors */}
        {validationError && (
          <div className="p-3.5 rounded-xl bg-[#e0714a]/15 border border-[#e0714a]/30 text-[#e0714a] text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Analyze Action Button */}
        {previewUrl && !predictionResult && (
          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
                loading
                  ? 'bg-white/10 text-[#7a7263] cursor-not-allowed'
                  : 'bg-[#7ee8b8] text-[#0d0c0a] hover:bg-[#7ee8b8]/90'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Analyzing image...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Analyze Mushroom</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* API Failure Error Box */}
      {apiError && (
        <ErrorState
          title="Analysis Request Failed"
          message={apiError}
          onRetry={handleAnalyze}
        />
      )}

      {/* Prediction Result Section */}
      {predictionResult && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-[#a9a396]">
            CNN Autoencoder Analysis Result
          </h2>

          <PredictionCard prediction={predictionResult} />

          {/* Collapsible Raw JSON Section */}
          <div className="rounded-2xl border border-white/10 bg-[#161411] overflow-hidden">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="w-full px-5 py-3 flex items-center justify-between text-xs font-mono text-[#a9a396] hover:bg-white/5 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Code size={14} className="text-[#7ee8b8]" />
                <span>View Raw Response</span>
              </span>
              {showRawJson ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showRawJson && (
              <div className="p-4 border-t border-white/5 bg-[#0d0c0a]">
                <pre className="font-mono text-xs text-[#7ee8b8] overflow-x-auto leading-relaxed">
                  {JSON.stringify(predictionResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
