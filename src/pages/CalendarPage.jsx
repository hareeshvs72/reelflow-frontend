import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight,
  Plus, CheckCircle, AlertCircle, Video, X
} from 'lucide-react';
import { postsService } from '../services/services.js';
import { StatusBadge, Skeleton, EmptyState } from '../components/ui/UIComponents.jsx';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths,
  parseISO, isBefore, startOfToday
} from 'date-fns';
import toast from 'react-hot-toast';

export default function CalendarPage() {
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedulingPost, setSchedulingPost] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('12:00');

  // Fetch all posts (both scheduled and drafts)
  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postsService.getPosts({ limit: 100 }).then((r) => r.data.data),
  });

  const posts = postsData?.posts || [];
  const scheduledPosts = posts.filter((p) => p.status === 'scheduled' && p.scheduledAt);
  const draftPosts = posts.filter((p) => p.status === 'draft');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const scheduleMutation = useMutation({
    mutationFn: ({ id, scheduledAt }) => postsService.schedulePost(id, { scheduledAt }),
    onSuccess: () => {
      toast.success('Reel scheduled successfully!');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setSchedulingPost(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Scheduling failed');
    },
  });

  const handleOpenScheduleModal = (post) => {
    setSchedulingPost(post);
  };

  const handleConfirmSchedule = () => {
    if (!schedulingPost) return;
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const targetDate = new Date(selectedDate);
    targetDate.setHours(hours, minutes, 0, 0);

    if (isBefore(targetDate, new Date())) {
      toast.error('Cannot schedule in the past');
      return;
    }

    scheduleMutation.mutate({
      id: schedulingPost._id,
      scheduledAt: targetDate.toISOString(),
    });
  };

  const selectedDatePosts = scheduledPosts.filter((p) =>
    isSameDay(parseISO(p.scheduledAt), selectedDate)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">Publishing Calendar</h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual schedule for upcoming Instagram Reels • Timezone: Asia/Kolkata
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-100 rounded-xl border border-white/[0.08] p-1">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg hover:bg-surface-200 text-slate-300 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm font-semibold text-white min-w-[130px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg hover:bg-surface-200 text-slate-300 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => {
              setCurrentMonth(new Date());
              setSelectedDate(new Date());
            }}
            className="btn-secondary text-xs px-3 py-2"
          >
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 glass-card p-6">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-3 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {d}
              </span>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const dayPosts = scheduledPosts.filter((p) =>
                isSameDay(parseISO(p.scheduledAt), day)
              );
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[85px] p-2 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-brand-500/15 border-brand-500/50 shadow-glow-sm'
                      : isToday
                      ? 'bg-surface-100/80 border-accent-purple/40'
                      : 'bg-surface-100/30 border-white/[0.04] hover:bg-surface-100/60'
                  } ${!isCurrentMonth ? 'opacity-35' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-accent-purple text-white flex items-center justify-center font-bold'
                          : isSelected
                          ? 'text-brand-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayPosts.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                    )}
                  </div>

                  {dayPosts.length > 0 && (
                    <div className="mt-1 space-y-1 overflow-hidden">
                      {dayPosts.slice(0, 2).map((p) => (
                        <div
                          key={p._id}
                          className="text-[10px] truncate bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded border border-brand-500/30"
                        >
                          {format(parseISO(p.scheduledAt), 'HH:mm')} {p.originalFileName}
                        </div>
                      ))}
                      {dayPosts.length > 2 && (
                        <span className="text-[9px] text-slate-400 block text-right">
                          +{dayPosts.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details & Quick Schedule */}
        <div className="space-y-6">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <div>
                <h3 className="font-semibold text-white text-sm">
                  {format(selectedDate, 'EEEE, MMM d, yyyy')}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedDatePosts.length} Reel{selectedDatePosts.length === 1 ? '' : 's'} scheduled
                </p>
              </div>
              <CalendarIcon className="w-5 h-5 text-brand-400" />
            </div>

            {selectedDatePosts.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No Reels scheduled for this date.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {selectedDatePosts.map((p) => (
                  <div
                    key={p._id}
                    className="p-3 rounded-xl bg-surface-100/60 border border-white/[0.06] flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-200 overflow-hidden shrink-0">
                      {p.thumbnailUrl ? (
                        <img src={p.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-4 h-4 text-slate-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{p.originalFileName}</p>
                      <p className="text-[11px] text-brand-400 mt-0.5">
                        {format(parseISO(p.scheduledAt), 'hh:mm a')}
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Schedule Drafts Drawer */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-accent-purple" />
              Schedule Draft to this Date
            </h3>
            {draftPosts.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                No draft Reels available. Upload videos first!
              </p>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {draftPosts.map((draft) => (
                  <div
                    key={draft._id}
                    className="p-2.5 rounded-xl bg-surface-100/40 border border-white/[0.04] flex items-center justify-between gap-2 hover:bg-surface-100/70 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-200 truncate">{draft.originalFileName}</p>
                      <p className="text-[10px] text-slate-500">{draft.caption ? draft.caption.slice(0, 30) + '…' : 'No caption'}</p>
                    </div>
                    <button
                      onClick={() => handleOpenScheduleModal(draft)}
                      className="btn-primary text-[11px] px-2.5 py-1 shrink-0"
                    >
                      Schedule
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Time Modal */}
      {schedulingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-sm p-6 animate-slide-up space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-base">Select Publish Time</h3>
              <button
                onClick={() => setSchedulingPost(null)}
                className="p-1 rounded-lg hover:bg-surface-200 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Scheduling <strong className="text-slate-200">{schedulingPost.originalFileName}</strong> on{' '}
              <strong className="text-brand-400">{format(selectedDate, 'MMM d, yyyy')}</strong>
            </p>

            <div>
              <label className="label">Publish Time (24h format)</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="input"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSchedulingPost(null)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSchedule}
                disabled={scheduleMutation.isPending}
                className="btn-primary text-xs"
              >
                {scheduleMutation.isPending ? 'Scheduling…' : 'Confirm Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
