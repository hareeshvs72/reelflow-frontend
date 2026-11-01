import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  History, CheckCircle2, XCircle, ExternalLink, Calendar,
  Search, Video, AlertTriangle, ShieldCheck, ArrowUpRight
} from 'lucide-react';
import { publishingService } from '../services/services.js';
import { StatusBadge, Skeleton, EmptyState } from '../components/ui/UIComponents.jsx';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

export default function HistoryPage() {
  const [statusFilter, setStatusFilter] = useState('all'); // all, published, failed
  const [search, setSearch] = useState('');
  const [selectedAttemptPost, setSelectedAttemptPost] = useState(null);

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['publishing-history'],
    queryFn: () => publishingService.getHistory({ limit: 100 }).then((r) => r.data.data),
  });

  const posts = historyData?.posts || [];
  const attempts = historyData?.attempts || [];

  const filteredPosts = posts.filter((post) => {
    if (statusFilter !== 'all' && post.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const nameMatch = post.originalFileName?.toLowerCase().includes(q);
      const capMatch = post.caption?.toLowerCase().includes(q);
      if (!nameMatch && !capMatch) return false;
    }
    return true;
  });

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const failedCount = posts.filter((p) => p.status === 'failed').length;
  const totalCount = publishedCount + failedCount;
  const successRate = totalCount > 0 ? Math.round((publishedCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">Publishing History</h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit trail of all published and attempted Instagram Reels
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or caption…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 text-xs"
          />
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <span className="text-xs font-medium text-slate-400">Total Published Reels</span>
          <p className="text-2xl font-bold font-display text-emerald-400 mt-2">{publishedCount}</p>
        </div>

        <div className="glass-card p-4">
          <span className="text-xs font-medium text-slate-400">Failed Attempts</span>
          <p className="text-2xl font-bold font-display text-red-400 mt-2">{failedCount}</p>
        </div>

        <div className="glass-card p-4">
          <span className="text-xs font-medium text-slate-400">Publishing Success Rate</span>
          <p className="text-2xl font-bold font-display text-brand-400 mt-2">{successRate}%</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        {[
          { id: 'all', label: `All Records (${posts.length})` },
          { id: 'published', label: `Published (${publishedCount})` },
          { id: 'failed', label: `Failed (${failedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === tab.id
                ? 'bg-brand-500 text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-surface-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History Table / Cards */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          icon={History}
          title="No history records found"
          description={
            statusFilter === 'all'
              ? 'Published Reels and execution history will appear here once automated publishing triggers.'
              : `No Reels match the "${statusFilter}" status filter.`
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => {
            const postAttempts = attempts.filter((a) => String(a.postId) === String(post._id));

            return (
              <div
                key={post._id}
                className="glass-card p-4 hover:border-white/[0.12] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-surface-200 overflow-hidden shrink-0">
                      {post.thumbnailUrl ? (
                        <img src={post.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-5 h-5 text-slate-500" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-200 truncate">{post.originalFileName}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {post.caption || 'No caption entered'}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                        {post.publishedAt ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Published {format(parseISO(post.publishedAt), 'MMM d, yyyy • hh:mm a')}
                          </span>
                        ) : post.scheduledAt ? (
                          <span>Scheduled for {format(parseISO(post.scheduledAt), 'MMM d, yyyy')}</span>
                        ) : null}

                        {post.instagramMediaId && (
                          <span className="text-slate-400">
                            Instagram ID: {post.instagramMediaId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <StatusBadge status={post.status} />

                    {postAttempts.length > 0 && (
                      <button
                        onClick={() =>
                          setSelectedAttemptPost(
                            selectedAttemptPost === post._id ? null : post._id
                          )
                        }
                        className="btn-ghost text-xs px-2.5 py-1"
                      >
                        {postAttempts.length} Attempt{postAttempts.length === 1 ? '' : 's'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Last Error detail if failed */}
                {post.lastError && (
                  <div className="mt-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                    <span className="truncate">{post.lastError}</span>
                  </div>
                )}

                {/* Collapsible Attempts Audit Trail */}
                {selectedAttemptPost === post._id && postAttempts.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
                    <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Publishing Attempts Audit Trail
                    </h5>
                    {postAttempts.map((attempt) => (
                      <div
                        key={attempt._id}
                        className="p-2.5 rounded-lg bg-surface-100/50 text-xs flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="font-semibold text-slate-300">
                            Attempt #{attempt.attemptNumber}
                          </span>
                          <span className="text-slate-500 ml-2">
                            {attempt.startedAt
                              ? format(parseISO(attempt.startedAt), 'MMM d, HH:mm:ss')
                              : ''}
                          </span>
                        </div>
                        <div>
                          {attempt.outcome === 'success' ? (
                            <span className="text-emerald-400 font-medium">Success</span>
                          ) : (
                            <span className="text-red-400 font-medium">
                              {attempt.errorMessage || 'Failed'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
