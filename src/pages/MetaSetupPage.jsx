import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  Instagram, CheckCircle2, AlertCircle, ExternalLink, Copy, Check,
  RefreshCw, ShieldCheck, Key, HelpCircle, ArrowRight, Sparkles,
  Layers, Lock, PlayCircle, AlertTriangle, UserCheck, ChevronRight
} from 'lucide-react';
import { instagramService } from '../services/services.js';
import { StatusBadge, ConfirmDialog, Skeleton } from '../components/ui/UIComponents.jsx';
import toast from 'react-hot-toast';

export default function MetaSetupPage() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [copiedUri, setCopiedUri] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  // Parse callback errors or success from URL params
  useEffect(() => {
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (connected === 'true') {
      toast.success('Instagram Creator account connected successfully!', { duration: 5000 });
      queryClient.invalidateQueries({ queryKey: ['meta-config-status'] });
      queryClient.invalidateQueries({ queryKey: ['meta-readiness'] });
    } else if (error) {
      toast.error(`OAuth error: ${message || error}`, { duration: 6000 });
    }
  }, [searchParams, queryClient]);

  // 1. Fetch Backend Config Status
  const { data: configData, isLoading: configLoading, refetch: refetchConfig } = useQuery({
    queryKey: ['meta-config-status'],
    queryFn: () => instagramService.getConfigStatus().then((r) => r.data.data),
    refetchInterval: 10_000,
  });

  // 2. Fetch Publishing Readiness Checklist
  const { data: readinessData, isLoading: readinessLoading, refetch: refetchReadiness } = useQuery({
    queryKey: ['meta-readiness'],
    queryFn: () => instagramService.getReadiness().then((r) => r.data.data),
    refetchInterval: 15_000,
  });

  // Test Connection Mutation
  const testMutation = useMutation({
    mutationFn: () => instagramService.testConnection().then((r) => r.data.data),
    onSuccess: (data) => {
      setTestResult(data);
      toast.success(data.message || 'Connection test successful!');
      queryClient.invalidateQueries({ queryKey: ['meta-readiness'] });
      queryClient.invalidateQueries({ queryKey: ['meta-config-status'] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message || 'Test failed';
      setTestResult({ valid: false, error: msg });
      toast.error(`Verification failed: ${msg}`);
    },
  });

  // Disconnect Mutation
  const disconnectMutation = useMutation({
    mutationFn: () => instagramService.disconnect(),
    onSuccess: () => {
      toast.success('Instagram account disconnected');
      setTestResult(null);
      setConfirmDisconnect(false);
      queryClient.invalidateQueries({ queryKey: ['meta-config-status'] });
      queryClient.invalidateQueries({ queryKey: ['meta-readiness'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Disconnect failed');
    },
  });

  const redirectUri = configData?.redirectUri || 'https://reelflow-5s62.onrender.com/api/instagram/callback';
  const isAppConfigured = configData?.appIdConfigured && configData?.appSecretConfigured;
  const connectedAccount = configData?.connectedAccount;
  const isConnected = Boolean(connectedAccount && connectedAccount.isConnected);

  const handleCopyUri = () => {
    navigator.clipboard.writeText(redirectUri);
    setCopiedUri(true);
    toast.success('Redirect URI copied to clipboard!');
    setTimeout(() => setCopiedUri(false), 2500);
  };

  // Compute status for the 9 setup steps
  const steps = [
    {
      step: 1,
      title: 'Meta Developer Account Registration',
      description: 'Register as a developer on the official Meta Developers portal.',
      status: 'Completed',
      actionUrl: 'https://developers.facebook.com/',
      actionLabel: 'Open Meta Portal',
      isAutomated: false,
      detail: 'Log into developers.facebook.com using your personal Facebook account.',
    },
    {
      step: 2,
      title: 'Create Meta Developer App',
      description: 'Create a Business App in Meta to obtain your App ID and App Secret.',
      status: isAppConfigured ? 'Completed' : 'Action Required',
      actionUrl: 'https://developers.facebook.com/apps/create/',
      actionLabel: 'Create App in Meta',
      isAutomated: false,
      detail: 'Select use case "Other" → App Type "Business" → Name it "ReelFlow".',
    },
    {
      step: 3,
      title: 'Select Instagram API Product',
      description: 'Add the Instagram API product to your Meta app dashboard.',
      status: isAppConfigured ? 'Completed' : 'Action Required',
      actionUrl: 'https://developers.facebook.com/apps/',
      actionLabel: 'App Dashboard',
      isAutomated: false,
      detail: 'In your App Dashboard, find "Instagram" in the product list and click "Set up".',
    },
    {
      step: 4,
      title: 'Configure Instagram Login Flow',
      description: 'Select "Instagram API (Unified Login)" as the authentication mode.',
      status: isAppConfigured ? 'Completed' : 'Action Required',
      actionUrl: 'https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/',
      actionLabel: 'Official Guide',
      isAutomated: false,
      detail: 'Supports Instagram Professional Creator and Business accounts with Meta Unified Login.',
    },
    {
      step: 5,
      title: 'Configure OAuth Redirect URI',
      description: 'Add ReelFlow\'s callback URL to your Meta App\'s allowed redirect URIs.',
      status: isAppConfigured ? 'Completed' : 'Action Required',
      actionUrl: 'https://developers.facebook.com/apps/',
      actionLabel: 'Meta App Settings',
      isAutomated: true,
      hasCopy: true,
      copyValue: redirectUri,
      detail: `Paste into Meta App: Facebook Login for Business → Settings → Valid OAuth Redirect URIs: ${redirectUri}`,
    },
    {
      step: 6,
      title: 'Configure Required Instagram Permissions',
      description: 'Activate instagram_basic and instagram_content_publish.',
      status: isConnected ? 'Completed' : isAppConfigured ? 'In Progress' : 'Action Required',
      actionUrl: 'https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/content-publishing',
      actionLabel: 'Permissions Docs',
      isAutomated: true,
      detail: 'In Development Mode, all requested scopes are immediately available for test users without App Review.',
    },
    {
      step: 7,
      title: 'Connect Instagram Creator Account',
      description: 'Authorize ReelFlow via Meta Instagram OAuth to obtain a 60-day token.',
      status: isConnected ? 'Completed' : isAppConfigured ? 'Action Required' : 'Not Started',
      isConnectButton: true,
      isAutomated: true,
      detail: connectedAccount
        ? `Connected as @${connectedAccount.username} (${connectedAccount.accountType})`
        : 'Click "Connect Instagram" below to log in and grant publishing access.',
    },
    {
      step: 8,
      title: 'Verify Access & Permissions',
      description: 'Validate token integrity, expiration timeline, and API connectivity.',
      status: testResult?.valid ? 'Completed' : isConnected ? 'Action Required' : 'Not Started',
      isTestButton: true,
      isAutomated: true,
      detail: testResult
        ? `Token status: ${testResult.token?.status} (${testResult.token?.daysRemaining} days remaining)`
        : 'Run automated verification to validate the decrypted token against Meta Graph API.',
    },
    {
      step: 9,
      title: 'Test Publishing Readiness',
      description: 'Confirm complete pipeline readiness for automated Reel scheduling & publishing.',
      status: readinessData?.readyToPublish ? 'Completed' : 'Not Started',
      isAutomated: true,
      detail: readinessData?.readyToPublish
        ? 'All 6 publishing prerequisites passed! You are ready to schedule Reels.'
        : 'Complete steps 1–8 to achieve publishing readiness.',
    },
  ];

  const completedCount = steps.filter((s) => s.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-glow-sm">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">Meta Developer Setup Assistant</h2>
              <p className="text-xs text-slate-400">
                Automated configuration, verification, and step-by-step setup for Instagram Reel scheduling
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              refetchConfig();
              refetchReadiness();
            }}
            className="btn-secondary text-xs px-3 py-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Status
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
              Setup Progress
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {completedCount} of {steps.length} Steps Completed ({progressPercent}%)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {readinessData?.readyToPublish ? (
              <span className="badge-published text-xs px-3 py-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Publishing Ready
              </span>
            ) : isConnected ? (
              <span className="badge-scheduled text-xs px-3 py-1">
                Connected • Verification Pending
              </span>
            ) : (
              <span className="badge-draft text-xs px-3 py-1">
                Setup In Progress
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-surface-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 via-accent-purple to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Configuration Alert if Credentials Missing */}
      {!isAppConfigured && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-white">Meta App Credentials Required in server/.env</h4>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                ReelFlow needs your Meta Developer App ID and App Secret to authenticate your Instagram Creator account. Follow Steps 1–3 below to generate them in Meta Developers, then add them to your environment file.
              </p>
            </div>
          </div>
          <div className="bg-surface-300/80 p-3 rounded-xl font-mono text-[11px] text-slate-300 border border-white/[0.06] select-all">
            META_APP_ID=your_actual_meta_app_id<br />
            META_APP_SECRET=your_actual_meta_app_secret<br />
            META_REDIRECT_URI={redirectUri}
          </div>
        </div>
      )}

      {/* Connected Account Banner if Active */}
      {isConnected && (
        <div className="glass-card p-5 border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {connectedAccount.profilePictureUrl ? (
              <img
                src={connectedAccount.profilePictureUrl}
                alt={connectedAccount.username}
                className="w-12 h-12 rounded-full border-2 border-emerald-400/50 object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center font-bold text-emerald-300">
                {connectedAccount.username?.[0]?.toUpperCase() || 'IG'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">@{connectedAccount.username}</h4>
                <span className="badge-published text-[10px]">Connected</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Account Type: <span className="text-emerald-400 font-medium">{connectedAccount.accountType || 'Creator'}</span> • ID: {connectedAccount.instagramUserId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => testMutation.mutate()}
              disabled={testMutation.isPending}
              className="btn-primary text-xs px-3.5 py-2"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${testMutation.isPending ? 'animate-spin' : ''}`} />
              Test Connection
            </button>
            <button
              onClick={() => setConfirmDisconnect(true)}
              className="btn-danger text-xs px-3 py-2"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {/* 9 Setup Steps Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Step-by-Step Setup Guide & Automated Actions
        </h3>

        {steps.map((s) => (
          <div
            key={s.step}
            className={`glass-card p-4 transition-all hover:border-white/[0.12] ${
              s.status === 'Completed' ? 'border-emerald-500/20 bg-emerald-500/[0.02]' : ''
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 ${
                    s.status === 'Completed'
                      ? 'bg-emerald-500 text-white shadow-glow-sm'
                      : s.status === 'In Progress'
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-200 text-slate-400'
                  }`}
                >
                  {s.status === 'Completed' ? <Check className="w-4 h-4" /> : s.step}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-white text-sm">{s.title}</h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        s.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : s.status === 'In Progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : s.status === 'Action Required'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {s.status}
                    </span>
                    {s.isAutomated && (
                      <span className="text-[10px] bg-brand-500/15 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/30">
                        Automated
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{s.description}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{s.detail}</p>
                </div>
              </div>

              {/* Action buttons per step */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {s.hasCopy && (
                  <button
                    onClick={handleCopyUri}
                    className="btn-secondary text-xs px-3 py-1.5"
                    title="Copy OAuth Redirect URI"
                  >
                    {copiedUri ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedUri ? 'Copied' : 'Copy Redirect URI'}
                  </button>
                )}

                {s.actionUrl && (
                  <a
                    href={s.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs px-3 py-1.5"
                  >
                    <span>{s.actionLabel}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}

                {s.isConnectButton && (
                  <button
                    onClick={instagramService.connect}
                    disabled={!isAppConfigured}
                    className="btn-primary text-xs px-3.5 py-1.5"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    {isConnected ? 'Re-authorize Account' : 'Connect Instagram'}
                  </button>
                )}

                {s.isTestButton && isConnected && (
                  <button
                    onClick={() => testMutation.mutate()}
                    disabled={testMutation.isPending}
                    className="btn-secondary text-xs px-3 py-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Run Check
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Test Verification Results Drawer */}
      {testResult && (
        <div className="glass-card p-5 border-brand-500/30 bg-brand-500/[0.03] space-y-3">
          <h4 className="font-semibold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            Meta API Verification Diagnostics
          </h4>

          {testResult.valid ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-100/50">
                <span className="text-slate-400">Account Username</span>
                <p className="font-bold text-white text-sm mt-1">@{testResult.account?.username}</p>
                <span className="text-emerald-400 text-[10px]">Verified Creator / Business</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-100/50">
                <span className="text-slate-400">Token Expiration</span>
                <p className="font-bold text-emerald-400 text-sm mt-1">
                  {testResult.token?.daysRemaining} Days Active
                </p>
                <span className="text-slate-500 text-[10px]">60-day Long-Lived Token</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-100/50">
                <span className="text-slate-400">Publishing Permissions</span>
                <p className="font-bold text-white text-sm mt-1">Active (2/2 scopes)</p>
                <span className="text-emerald-400 text-[10px]">
                  {testResult.permissions?.join(', ') || 'instagram_basic, instagram_content_publish'}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
              <p className="font-semibold">Verification Error:</p>
              <p className="mt-1">{testResult.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Publishing Readiness Checklist (Phase 5 verification) */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div>
            <h4 className="font-semibold text-white text-sm">Automated Publishing Pipeline Readiness</h4>
            <p className="text-xs text-slate-400">
              Validates that BullMQ worker has all prerequisites to publish Reels to Instagram API
            </p>
          </div>
          <button
            onClick={() => refetchReadiness()}
            className="btn-ghost text-xs"
          >
            <RefreshCw className="w-3 h-3" />
            Check Now
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {readinessData?.checklist?.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border flex items-center justify-between ${
                item.completed
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200'
                  : 'bg-surface-100/40 border-white/[0.04] text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <div>
                  <p className={`font-semibold ${item.completed ? 'text-white' : 'text-slate-400'}`}>
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-500">{item.details}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  item.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-surface-200 text-slate-500'
                }`}
              >
                {item.completed ? 'Ready' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Disconnect Account Modal */}
      <ConfirmDialog
        open={confirmDisconnect}
        title="Disconnect Instagram Account"
        description="Are you sure you want to disconnect this Instagram account? Any scheduled Reels will pause until an account is reconnected."
        danger={true}
        onConfirm={() => disconnectMutation.mutate()}
        onCancel={() => setConfirmDisconnect(false)}
      />
    </div>
  );
}
