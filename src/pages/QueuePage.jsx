import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ListOrdered, Play, Clock, AlertCircle, RefreshCw, XCircle,
  CheckCircle2, Video, Calendar, MoreVertical, RotateCcw
} from 'lucide-react';
import { postsService, publishingService } from '../services/services.js';
import { StatusBadge, Skeleton, EmptyState, ConfirmDialog } from '../components/ui/UIComponents.jsx';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

export default function QueuePage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // all, scheduled, processing, failed
  const [cancellingPostId, setCancellingPostId] = useState(null);
  const [reschedulingPost, setReschedulingPost] = useState(null);
  const [newScheduleTime, setNewScheduleTime] = useState('');

  // Fetch posts in queue (scheduled, processing, failed)
  const { data: postsData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['queue-posts'],
    queryFn: () => postsService.getPosts({ limit: 50 }).then((r) => r.data.data),
    refetchInterval: 15_000, // Poll every 15s for queue updates
  });

  const posts = postsData?.posts || [];
  const queuePosts = posts.filter((p) =>
    ['scheduled', 'processing', 'failed'].includes(p.status)
  );

  const filteredPosts = queuePosts.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: (id) => postsService.cancelPost(id),
    onSuccess: () => {
      toast.success('Scheduled post cancelled and moved to drafts');
      queryClient.invalidateQueries({ queryKey: ['queue-posts'] });
      setCancellingPostId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to cancel post');
    },
  });

  // Retry mutation
  const retryMutation = useMutation({
    mutationFn: (id) => postsService.retryPost(id),
    onSuccess: () => {
      toast.success('Post queued for immediate retry');
      queryClient.invalidateQueries({ queryKey: ['queue-posts'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Retry failed');
    },
  });

  // Reschedule mutation
  const rescheduleMutation = useMutation({
    mutationFn: ({ id, scheduledAt }) => postsService.reschedulePost(id, { scheduledAt }),
    onSuccess: () => {
      toast.success('Post rescheduled successfully');
      queryClient.invalidateQueries({ queryKey: ['queue-posts'] });
      setReschedulingPost(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Reschedule failed');
    },
  });

  const handleConfirmReschedule = () => {
    if (!reschedulingPost || !newScheduleTime) return;
    rescheduleMutation.mutate({
      id: reschedulingPost._id,
      scheduledAt: new Date(newScheduleTime).toISOString(),
    });
  };

  const scheduledCount = queuePosts.filter((p) => p.status === 'scheduled').length;
  const processingCount = queuePosts.filter((p) => p.status === 'processing').length;
  const failedCount = queuePosts.filter((p) => p.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">Publishing Queue</h2>
          <p className="text-xs text-slate-400 mt-1">
            Reels awaiting automated publishing via BullMQ background worker
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn-secondary text-xs px-3 py-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Queue Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilter('scheduled')}
          className={`glass-card p-4 cursor-pointer transition-all ${
            filter === 'scheduled' ? 'border-blue-500/50 bg-blue-500/10' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Scheduled</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold font-display text-white mt-2">{scheduledCount}</p>
        </div>

        <div
          onClick={() => setFilter('processing')}
          className={`glass-card p-4 cursor-pointer transition-all ${
            filter === 'processing' ? 'border-yellow-500/50 bg-yellow-500/10' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Currently Processing</span>
            <RotateCcw className="w-4 h-4 text-yellow-400 animate-spin" />
          </div>
          <p className="text-2xl font-bold font-display text-white mt-2">{processingCount}</p>
        </div>

        <div
          onClick={() => setFilter('failed')}
          className={`glass-card p-4 cursor-pointer transition-all ${
            filter === 'failed' ? 'border-red-500/50 bg-red-500/10' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Needs Attention</span>
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold font-display text-white mt-2">{failedCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        {[
          { id: 'all', label: `All Queue (${queuePosts.length})` },
          { id: 'scheduled', label: `Scheduled (${scheduledCount})` },
          { id: 'processing', label: `Processing (${processingCount})` },
          { id: 'failed', label: `Failed (${failedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === tab.id
                ? 'bg-brand-500 text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-surface-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Queue List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          icon={ListOrdered}
          title="Queue is empty"
          description={
            filter === 'all'
              ? 'No Reels are currently queued for publishing. Schedule your content from the Library or Upload page.'
              : `No Reels matching "${filter}" status.`
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-xl bg-surface-200 overflow-hidden shrink-0 relative group">
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
                    {post.scheduledAt && (
                      <span className="flex items-center gap-1 text-brand-400">
                        <Clock className="w-3 h-3" />
                        {format(parseISO(post.scheduledAt), 'MMM d, yyyy • hh:mm a')}
                      </span>
                    )}
                    {post.attemptCount > 0 && (
                      <span>Attempts: {post.attemptCount}</span>
                    )}
                  </div>
                  {post.lastError && (
                    <p className="text-[11px] text-red-400 mt-1 truncate">
                      Error: {post.lastError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <StatusBadge status={post.status} />

                {post.status === 'failed' && (
                  <button
                    onClick={() => retryMutation.mutate(post._id)}
                    disabled={retryMutation.isPending}
                    className="btn-primary text-xs px-3 py-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry Now
                  </button>
                )}

                {post.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => setReschedulingPost(post)}
                      className="btn-secondary text-xs px-3 py-1.5"
                    >
                      <Calendar className="w-3 h-3" />
                      Reschedule
                    </button>
                    <button
                      onClick={() => setCancellingPostId(post._id)}
                      className="btn-danger text-xs px-3 py-1.5"
                    >
                      <XCircle className="w-3 h-3" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(cancellingPostId)}
        title="Cancel Scheduled Reel"
        description="Are you sure you want to cancel publishing this Reel? It will be returned to your drafts in the Content Library."
        danger={true}
        onConfirm={() => cancelMutation.mutate(cancellingPostId)}
        onCancel={() => setCancellingPostId(null)}
      />

      {/* Reschedule Modal */}
      {reschedulingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-sm p-6 animate-slide-up space-y-4">
            <h3 className="font-semibold text-white text-base">Reschedule Reel</h3>
            <p className="text-xs text-slate-400">
              Pick a new date & time for{' '}
              <strong className="text-slate-200">{reschedulingPost.originalFileName}</strong>:
            </p>

            <div>
              <label className="label">New Date & Time</label>
              <input
                type="datetime-local"
                value={newScheduleTime}
                onChange={(e) => setNewScheduleTime(e.target.value)}
                className="input"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setReschedulingPost(null)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                disabled={!newScheduleTime || rescheduleMutation.isPending}
                className="btn-primary text-xs"
              >
                {rescheduleMutation.isPending ? 'Rescheduling…' : 'Save New Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
