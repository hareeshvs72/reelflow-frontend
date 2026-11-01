import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle, Video, RefreshCw, FileVideo } from 'lucide-react';
import { uploadService } from '../services/services.js';
import toast from 'react-hot-toast';
import axios from 'axios';

const ACCEPTED_TYPES = { 'video/mp4': ['.mp4'], 'video/quicktime': ['.mov'] };
const MAX_SIZE_MB = 1000; // 1 GB Instagram limit
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const STATUS = { PENDING: 'pending', UPLOADING: 'uploading', SUCCESS: 'success', ERROR: 'error' };

export default function UploadPage() {
  const [files, setFiles] = useState([]); // Array of { id, file, preview, status, progress, error, postId }

  const addFiles = useCallback((accepted, rejected) => {
    // Handle rejections
    rejected.forEach((r) => {
      const msg = r.errors[0]?.message || 'Invalid file';
      toast.error(`${r.file.name}: ${msg}`);
    });

    const newFiles = accepted.map((file) => {
      // Duplicate check
      const isDupe = files.some((f) => f.file.name === file.name && f.file.size === file.size);
      if (isDupe) {
        toast.error(`${file.name} is already in the list`);
        return null;
      }
      return {
        id: Math.random().toString(36).slice(2),
        file,
        preview: URL.createObjectURL(file),
        status: STATUS.PENDING,
        progress: 0,
        error: null,
        postId: null,
      };
    }).filter(Boolean);

    setFiles((prev) => [...prev, ...newFiles]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: addFiles,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_BYTES,
    multiple: true,
  });

  const removeFile = (id) => {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f?.preview) URL.revokeObjectURL(f.preview);
      return prev.filter((x) => x.id !== id);
    });
  };

  const [isDevMock, setIsDevMock] = useState(false);

  const uploadFile = async (item, forceLocal = false) => {
    setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: STATUS.UPLOADING, progress: 0, error: null } : f));

    try {
      // 1. Get signed upload parameters from backend
      const sigRes = await uploadService.getSignature();
      const { signature, timestamp, folder, cloudName, apiKey } = sigRes.data.data;

      let public_id, secure_url, bytes, duration, format;

      if (cloudName === 'reelflow_dev' || apiKey === '123456789012345' || isDevMock || forceLocal) {
        // Development Mock Upload Mode: Simulate upload progress
        for (let p = 25; p <= 100; p += 25) {
          await new Promise((r) => setTimeout(r, 100));
          setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, progress: p } : f));
        }

        public_id = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        secure_url = item.preview; // Local object URL for preview
        bytes = item.file.size;
        duration = 15;
        format = item.file.name.split('.').pop() || 'mp4';
      } else {
        // 2. Upload directly to Cloudinary with progress tracking
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);

        const cloudRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
          formData,
          {
            onUploadProgress: (e) => {
              const pct = Math.round((e.loaded / e.total) * 100);
              setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, progress: pct } : f));
            },
          }
        );

        const data = cloudRes.data;
        public_id = data.public_id;
        secure_url = data.secure_url;
        bytes = data.bytes;
        duration = data.duration;
        format = data.format;
      }

      // 3. Notify backend — validate & create Post record
      const completeRes = await uploadService.completeUpload({
        publicId: public_id,
        secureUrl: secure_url,
        originalFilename: item.file.name,
        bytes,
        duration,
        format,
      });

      setFiles((prev) => prev.map((f) => f.id === item.id ? {
        ...f,
        status: STATUS.SUCCESS,
        progress: 100,
        postId: completeRes.data.data.post._id,
      } : f));

      toast.success(
        cloudName === 'reelflow_dev'
          ? `${item.file.name} saved (Dev Mode)!`
          : `${item.file.name} uploaded!`
      );
    } catch (err) {
      const cloudMsg = err.response?.data?.error?.message;
      let msg = cloudMsg || err.response?.data?.message || err.message || 'Upload failed';
      if (err.response?.status === 401 && !cloudMsg) {
        msg = 'Cloudinary 401 Unauthorized: Invalid Cloudinary credentials in server/.env.';
      }
      setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: STATUS.ERROR, error: msg } : f));
      toast.error(`${item.file.name}: ${msg}`, { duration: 7000 });
    }
  };

  const uploadAll = async () => {
    const pending = files.filter((f) => f.status === STATUS.PENDING || f.status === STATUS.ERROR);
    if (!pending.length) return toast.error('No files to upload');
    for (const item of pending) await uploadFile(item);
  };

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== STATUS.SUCCESS));
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Upload Videos</h2>
        <p className="text-sm text-slate-500">Upload MP4 or MOV files up to 1 GB. Add captions and schedule after uploading.</p>
      </div>

      {/* Dev Mode Notification Banner */}
      <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 shrink-0 text-brand-400 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Cloudinary Video Storage</p>
          <p className="text-slate-300 leading-relaxed">
            By default, mock development credentials (<code className="bg-surface-200 px-1 py-0.5 rounded text-brand-400">reelflow_dev</code>) are loaded so uploads simulate locally for testing. For live Instagram publishing, configure your free Cloudinary account in <code className="bg-surface-200 px-1 py-0.5 rounded text-brand-400">server/.env</code>.
          </p>
        </div>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        id="upload-dropzone"
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-brand-500 bg-brand-500/5 shadow-glow' : 'border-white/[0.12] hover:border-white/[0.2] hover:bg-surface-100/50'}`}
      >
        <input {...getInputProps()} id="upload-file-input" />
        <div className="flex flex-col items-center gap-3">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isDragActive ? 'bg-brand-500/20' : 'bg-surface-200'}`}>
            <Upload className={`w-7 h-7 ${isDragActive ? 'text-brand-400' : 'text-slate-500'}`} />
          </div>
          <div>
            <p className="font-semibold text-slate-200">
              {isDragActive ? 'Drop your videos here' : 'Drag & drop videos or click to browse'}
            </p>
            <p className="text-sm text-slate-500 mt-1">MP4 or MOV · Up to 1 GB each · Multiple files supported</p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="glass-card divide-y divide-white/[0.04]">
          {/* Toolbar */}
          <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">{files.length} file{files.length !== 1 ? 's' : ''}</p>
            <div className="flex flex-wrap items-center gap-2.5">
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer bg-surface-200/60 px-2.5 py-1.5 rounded-lg border border-white/[0.06] hover:bg-surface-200 transition-colors">
                <input
                  type="checkbox"
                  checked={isDevMock}
                  onChange={(e) => setIsDevMock(e.target.checked)}
                  className="rounded text-brand-500"
                />
                Local Test Mode (Bypass Cloudinary)
              </label>
              {files.some((f) => f.status === STATUS.SUCCESS) && (
                <button id="btn-clear-completed" onClick={clearCompleted} className="btn-ghost text-xs">
                  Clear completed
                </button>
              )}
              <button
                id="btn-upload-all"
                onClick={uploadAll}
                disabled={!files.some((f) => [STATUS.PENDING, STATUS.ERROR].includes(f.status))}
                className="btn-primary text-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload All
              </button>
            </div>
          </div>

          {files.map((item) => (
            <div key={item.id} id={`file-item-${item.id}`} className="px-5 py-4">
              <div className="flex items-start gap-4">
                {/* Video preview thumbnail */}
                <div className="w-16 h-12 rounded-lg bg-surface-200 overflow-hidden shrink-0 relative">
                  {item.preview && (
                    <video src={item.preview} className="w-full h-full object-cover" muted playsInline />
                  )}
                  {item.status === STATUS.UPLOADING && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{item.progress}%</span>
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{item.file.name}</p>
                      <p className="text-xs text-slate-500">{formatBytes(item.file.size)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === STATUS.PENDING && (
                        <button
                          id={`btn-upload-${item.id}`}
                          onClick={() => uploadFile(item)}
                          className="btn-secondary text-xs py-1.5 px-3"
                        >
                          Upload
                        </button>
                      )}
                      {item.status === STATUS.ERROR && (
                        <button
                          id={`btn-retry-${item.id}`}
                          onClick={() => uploadFile(item)}
                          className="btn-danger text-xs py-1.5 px-3"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Retry
                        </button>
                      )}
                      {item.status === STATUS.SUCCESS && (
                        <span className="text-emerald-400 flex items-center gap-1 text-xs font-medium">
                          <CheckCircle className="w-4 h-4" /> Uploaded
                        </span>
                      )}
                      {item.status !== STATUS.UPLOADING && (
                        <button
                          id={`btn-remove-${item.id}`}
                          onClick={() => removeFile(item.id)}
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {item.status === STATUS.UPLOADING && (
                    <div className="mt-2 h-1.5 rounded-full bg-surface-300 overflow-hidden">
                      <div
                        className="h-full bg-gradient-brand transition-all duration-300 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Error */}
                  {item.status === STATUS.ERROR && (
                    <div className="mt-1 flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {item.error}
                      </p>
                      <button
                        onClick={() => uploadFile(item, true)}
                        className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold underline"
                      >
                        Retry with Local Test Mode →
                      </button>
                    </div>
                  )}

                  {/* Success — link to edit */}
                  {item.status === STATUS.SUCCESS && item.postId && (
                    <p className="mt-1 text-xs text-slate-500">
                      Saved · <a href="/library" className="text-brand-400 hover:underline">Add caption & schedule →</a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Format requirements */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <FileVideo className="w-4 h-4 text-brand-400" />
          Instagram Reel Requirements
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-500">
          <li>• Format: MP4 (H.264) or MOV — recommended MP4</li>
          <li>• Duration: 3 seconds to 15 minutes</li>
          <li>• Aspect ratio: 9:16 (vertical) — 1080×1920 px recommended</li>
          <li>• Frame rate: 23–60 fps</li>
          <li>• Max file size: 1 GB (Instagram limit)</li>
          <li>• Audio: AAC, 48kHz sample rate recommended</li>
        </ul>
      </div>
    </div>
  );
}
