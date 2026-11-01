import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Settings, Instagram, User, Shield, CheckCircle, AlertCircle,
  ExternalLink, LogOut, RefreshCw, Key, Database, Server, Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { instagramService } from '../services/services.js';
import { StatusBadge, ConfirmDialog } from '../components/ui/UIComponents.jsx';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  // Fetch Instagram account status
  const { data: igData, isLoading: igLoading, refetch: refetchIg } = useQuery({
    queryKey: ['instagram-account'],
    queryFn: () => instagramService.getAccount().then((r) => r.data.data),
  });

  const instagramAccount = igData?.account;

  // Disconnect mutation
  const disconnectMutation = useMutation({
    mutationFn: () => instagramService.disconnect(),
    onSuccess: () => {
      toast.success('Instagram account disconnected');
      queryClient.invalidateQueries({ queryKey: ['instagram-account'] });
      setConfirmDisconnect(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to disconnect');
    },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-display font-bold text-white">Settings & Integrations</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your Instagram connection, user preferences, and system status
        </p>
      </div>

      {/* Instagram Integration Card */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-glow-sm">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Meta Instagram Graph API</h3>
              <p className="text-xs text-slate-400">
                Official API connection for automated Reel publishing
              </p>
            </div>
          </div>
          {instagramAccount && instagramAccount.isConnected ? (
            <span className="badge-published">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Connected
            </span>
          ) : (
            <span className="badge-draft">Not Connected</span>
          )}
        </div>

        {instagramAccount && instagramAccount.isConnected ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-100/50 border border-white/[0.04]">
            <div className="flex items-center gap-3">
              {instagramAccount.profilePictureUrl ? (
                <img
                  src={instagramAccount.profilePictureUrl}
                  alt={instagramAccount.username}
                  className="w-12 h-12 rounded-full border border-brand-500/30 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-surface-200 flex items-center justify-center font-bold text-slate-300">
                  {instagramAccount.username?.[0]?.toUpperCase() || 'IG'}
                </div>
              )}
              <div>
                <p className="font-semibold text-white text-sm">@{instagramAccount.username}</p>
                <p className="text-xs text-slate-400">
                  Account Type: <span className="text-brand-400 font-medium">{instagramAccount.accountType || 'Professional'}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  ID: {instagramAccount.instagramUserId}
                </p>
              </div>
            </div>

            <button
              onClick={() => setConfirmDisconnect(true)}
              className="btn-danger text-xs px-3 py-2"
            >
              Disconnect Account
            </button>
          </div>
        ) : (
          <div className="py-4 space-y-3">
            <p className="text-xs text-slate-300">
              To automatically publish Reels, connect your Instagram Professional (Business or Creator) account via Meta login.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/meta-setup"
                className="btn-primary text-xs px-4 py-2.5"
              >
                <Instagram className="w-4 h-4" />
                Open Meta Setup Assistant
              </Link>
              <button
                onClick={instagramService.connect}
                className="btn-secondary text-xs px-4 py-2.5"
              >
                Direct Connect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Profile & Preferences */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-semibold text-white text-sm pb-3 border-b border-white/[0.06] flex items-center gap-2">
          <User className="w-4 h-4 text-brand-400" />
          User Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              readOnly
              value={user?.name || ''}
              className="input opacity-80 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              readOnly
              value={user?.email || ''}
              className="input opacity-80 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="label">Default Timezone</label>
            <input
              type="text"
              readOnly
              value={user?.timezone || 'Asia/Kolkata'}
              className="input opacity-80 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="label">Account Security</label>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-2">
              <CheckCircle className="w-4 h-4" />
              Tokens encrypted with AES-256-GCM
            </p>
          </div>
        </div>
      </div>

      {/* Services Status & Architecture Verification */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-semibold text-white text-sm pb-3 border-b border-white/[0.06] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-accent-purple" />
          System & Service Verification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-100/40 border border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="font-semibold text-slate-200">Express Backend</p>
                <p className="text-[10px] text-slate-500">Port 5000 / REST API</p>
              </div>
            </div>
            <span className="text-emerald-400 font-medium">Ready</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-100/40 border border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="font-semibold text-slate-200">MongoDB Database</p>
                <p className="text-[10px] text-slate-500">Service Running (Port 27017)</p>
              </div>
            </div>
            <span className="text-emerald-400 font-medium">Available</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-100/40 border border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-blue-400" />
              <div>
                <p className="font-semibold text-slate-200">Redis & BullMQ Queue</p>
                <p className="text-[10px] text-slate-500">Background Worker</p>
              </div>
            </div>
            <span className="text-blue-400 font-medium">Docker / Local</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-100/40 border border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4 text-accent-purple" />
              <div>
                <p className="font-semibold text-slate-200">Cloudinary CDN</p>
                <p className="text-[10px] text-slate-500">Signed Direct Upload</p>
              </div>
            </div>
            <span className="text-accent-purple font-medium">Configurable</span>
          </div>
        </div>
      </div>

      {/* Disconnect Dialog */}
      <ConfirmDialog
        open={confirmDisconnect}
        title="Disconnect Instagram Account"
        description="Are you sure you want to disconnect your Instagram Professional account? Any currently scheduled Reels will pause until reconnected."
        danger={true}
        onConfirm={() => disconnectMutation.mutate()}
        onCancel={() => setConfirmDisconnect(false)}
      />
    </div>
  );
}
