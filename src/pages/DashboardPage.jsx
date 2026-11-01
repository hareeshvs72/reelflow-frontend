import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Upload, CheckCircle2, XCircle, Clock,
  Calendar, Instagram, AlertTriangle, ArrowRight
} from 'lucide-react';
import { dashboardService } from '../services/services.js';
import { StatCard, StatusBadge, Skeleton } from '../components/ui/UIComponents.jsx';
import { formatDistanceToNow, format } from 'date-fns';

function UpcomingItem({ post }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0">
      <div className="w-10 h-10 rounded-lg bg-surface-200 overflow-hidden shrink-0">
        {post.thumbnailUrl
          ? <img src={post.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Upload className="w-4 h-4 text-slate-600" /></div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">{post.originalFileName}</p>
        <p className="text-xs text-slate-500">{format(new Date(post.scheduledAt), 'MMM d, h:mm a')}</p>
      </div>
      <StatusBadge status="scheduled" />
    </div>
  );
}

function RecentItem({ post }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0">
      <div className="w-10 h-10 rounded-lg bg-surface-200 overflow-hidden shrink-0">
        {post.thumbnailUrl
          ? <img src={post.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Upload className="w-4 h-4 text-slate-600" /></div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">{post.originalFileName}</p>
        <p className="text-xs text-slate-500">
          {post.publishedAt
            ? `Published ${formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}`
            : post.lastError?.slice(0, 60) || 'Unknown error'
          }
        </p>
      </div>
      <StatusBadge status={post.status} />
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats().then((r) => r.data.data),
    refetchInterval: 30_000, // Refresh every 30 seconds
  });

  if (isLoading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );

  if (error) return (
    <div className="glass-card p-8 text-center">
      <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
      <p className="text-slate-300">Failed to load dashboard. Please refresh.</p>
    </div>
  );

  const { stats, upcoming, recent, instagramAccount } = data;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Instagram connection alert */}
      {!instagramAccount && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-300">Instagram account not connected</p>
            <p className="text-xs text-slate-500 mt-0.5">Connect your Instagram Professional account to start publishing Reels.</p>
          </div>
          <Link to="/settings" id="dashboard-connect-ig" className="btn-secondary text-xs shrink-0">
            Connect Now <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {instagramAccount && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">{instagramAccount.username?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-300">@{instagramAccount.username} connected</p>
            <p className="text-xs text-slate-500">{instagramAccount.accountType} account</p>
          </div>
          <span className="ml-auto text-xs text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Uploads" value={stats.total} icon={Upload} color="brand" />
        <StatCard title="Scheduled" value={stats.scheduled} icon={Clock} color="yellow" />
        <StatCard title="Published" value={stats.published} icon={CheckCircle2} color="green" />
        <StatCard title="Failed" value={stats.failed} icon={XCircle} color="red" />
      </div>

      {/* Upcoming & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Upcoming Posts */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-400" />
              Upcoming Posts
            </h2>
            <Link to="/queue" id="view-all-queue" className="text-xs text-brand-400 hover:text-brand-300">View all →</Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="py-8 text-center">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No upcoming posts</p>
              <Link to="/upload" id="dash-upload-link" className="text-xs text-brand-400 hover:underline mt-1 block">
                Upload a video →
              </Link>
            </div>
          ) : upcoming.map((p) => <UpcomingItem key={p._id} post={p} />)}
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-brand-400" />
              Recent Activity
            </h2>
            <Link to="/history" id="view-all-history" className="text-xs text-brand-400 hover:text-brand-300">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No activity yet</p>
            </div>
          ) : recent.map((p) => <RecentItem key={p._id} post={p} />)}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 flex-wrap">
        <Link to="/upload" id="dash-quick-upload" className="btn-primary text-sm">
          <Upload className="w-4 h-4" />
          Upload New Reel
        </Link>
        <Link to="/queue" id="dash-view-queue" className="btn-secondary text-sm">
          <Clock className="w-4 h-4" />
          View Queue
        </Link>
      </div>
    </div>
  );
}
