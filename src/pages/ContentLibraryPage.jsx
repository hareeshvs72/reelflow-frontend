import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsService } from '../services/services.js';
import { StatusBadge, Skeleton, EmptyState, ConfirmDialog } from '../components/ui/UIComponents.jsx';
import { Library, Upload, Save, Calendar, Trash2, Hash, Smile, AlignLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MAX_CAPTION = 2200;

function PostCard({ post, onDelete }) {
  const queryClient = useQueryClient();
  const [caption, setCaption] = useState(post.caption || '');
  const [hashtags, setHashtags] = useState(post.hashtags?.join(' ') || '');
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const saveMutation = useMutation({
    mutationFn: () =>
      postsService.updatePost(post._id, {
        caption,
        hashtags: hashtags
          .split(/\s+/)
          .map((h) => h.replace(/^#/, '').trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      setDirty(false);
      toast.success('Caption saved');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Save failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => postsService.deletePost(post._id),
    onSuccess: () => {
      toast.success('Post deleted');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onDelete?.(post._id);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  });

  const charCount = caption.length;
  const pct = Math.min((charCount / MAX_CAPTION) * 100, 100);

  return (
    <>
      <div className="glass-card overflow-hidden group">
        {/* Video preview */}
        <div className="relative h-40 bg-surface-200">
          <video
            src={post.videoUrl}
            className="w-full h-full object-cover"
            muted
            playsInline
            onMouseOver={(e) => e.target.play()}
            onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
          />
          <div className="absolute top-2 left-2">
            <StatusBadge status={post.status} />
          </div>
          {post.scheduledAt && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-xs text-white px-2 py-1 rounded-lg">
              {format(new Date(post.scheduledAt), 'MMM d, h:mm a')}
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-500 truncate font-medium">{post.originalFileName}</p>

          {/* Caption */}
          <div>
            <label className="label flex items-center gap-1.5">
              <AlignLeft className="w-3 h-3" /> Caption
            </label>
            <textarea
              id={`caption-${post._id}`}
              value={caption}
              onChange={(e) => { setCaption(e.target.value); setDirty(true); }}
              placeholder="Write your caption…"
              rows={3}
              maxLength={MAX_CAPTION}
              className="input resize-none text-xs"
              disabled={['published', 'processing'].includes(post.status)}
            />
            {/* Character counter */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex-1 h-1 bg-surface-300 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pct > 90 ? 'bg-red-400' : pct > 75 ? 'bg-yellow-400' : 'bg-brand-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`text-xs ml-2 shrink-0 ${charCount > MAX_CAPTION * 0.9 ? 'text-red-400' : 'text-slate-500'}`}>
                {charCount}/{MAX_CAPTION}
              </span>
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <label className="label flex items-center gap-1.5">
              <Hash className="w-3 h-3" /> Hashtags
            </label>
            <input
              id={`hashtags-${post._id}`}
              type="text"
              value={hashtags}
              onChange={(e) => { setHashtags(e.target.value); setDirty(true); }}
              placeholder="#reel #instagram #viral"
              className="input text-xs"
              disabled={['published', 'processing'].includes(post.status)}
            />
            <p className="text-xs text-slate-600 mt-1">Space-separated. Max 30 hashtags.</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            {dirty && (
              <button
                id={`btn-save-${post._id}`}
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className="btn-primary text-xs flex-1 justify-center"
              >
                <Save className="w-3 h-3" />
                {saveMutation.isPending ? 'Saving…' : 'Save'}
              </button>
            )}
            {['draft', 'failed', 'cancelled'].includes(post.status) && (
              <Link to="/calendar" id={`btn-schedule-${post._id}`} className="btn-secondary text-xs flex-1 justify-center text-center">
                <Calendar className="w-3 h-3" />
                Schedule
              </Link>
            )}
            {!['published', 'processing'].includes(post.status) && (
              <button
                id={`btn-delete-${post._id}`}
                onClick={() => setConfirmDelete(true)}
                className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete Post"
        description={`Delete "${post.originalFileName}"? This will also remove it from Cloudinary.`}
        danger
        onConfirm={() => { setConfirmDelete(false); deleteMutation.mutate(); }}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}

export default function ContentLibraryPage() {
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['posts', statusFilter],
    queryFn: () => postsService.getPosts({ status: statusFilter || undefined, limit: 50 }).then((r) => r.data.data),
  });

  const FILTERS = [
    { value: '', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'published', label: 'Published' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Content Library</h2>
          <p className="text-sm text-slate-500">Manage captions and schedule your uploaded videos.</p>
        </div>
        <Link to="/upload" id="library-upload-btn" className="btn-primary text-sm">
          <Upload className="w-4 h-4" />
          Upload More
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            id={`filter-${label.toLowerCase()}`}
            onClick={() => setStatusFilter(value)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              statusFilter === value
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                : 'bg-surface-200 text-slate-400 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-80" />)}
        </div>
      ) : !data?.posts?.length ? (
        <EmptyState
          icon={Library}
          title="No videos yet"
          description="Upload your first video to get started."
          action={<Link to="/upload" className="btn-primary text-sm">Upload Video</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
