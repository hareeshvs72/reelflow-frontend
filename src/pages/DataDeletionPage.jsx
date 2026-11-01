import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  ShieldAlert,
  Mail,
  Copy,
  Check,
  ArrowLeft,
  Zap,
  CheckCircle2,
  Lock,
  Instagram,
  FileVideo,
  Clock,
  UserX,
  ExternalLink,
} from 'lucide-react';

export default function DataDeletionPage() {
  const [copied, setCopied] = useState(false);
  const supportEmail = 'hareeshvs72@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface text-slate-300">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/[0.06] bg-surface/90 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <div className="h-4 w-[1px] bg-white/[0.1]" />
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center shadow-glow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white text-base">ReelFlow</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/privacy-policy" className="text-xs text-slate-400 hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link to="/login" className="btn-secondary text-xs px-3.5 py-1.5">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-4">
            <Trash2 className="w-3.5 h-3.5" />
            <span>User Data Deletion Instructions</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Data Deletion Request
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Your privacy matters to us. You can request complete deletion of your ReelFlow account,
            stored Instagram connection tokens, and associated data at any time.
          </p>
        </div>

        {/* Notice Card */}
        <div className="glass-card p-5 mb-8 border border-white/[0.08] bg-surface-100/40 flex items-start gap-3.5">
          <Lock className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Opening this page does <strong className="text-white">not</strong> display your private data
            or automatically delete anything. Follow the instructions below to submit a verified deletion request.
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1: What data can be deleted */}
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              What Data Can Be Deleted?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-4">
              Upon receiving a valid request, ReelFlow will permanently purge the following records from our
              database and cloud storage:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: Instagram,
                  title: 'Instagram Account Details',
                  desc: 'Instagram user ID, username, and profile metadata stored by ReelFlow.',
                },
                {
                  icon: Lock,
                  title: 'Instagram Access Tokens',
                  desc: 'All stored OAuth access tokens and AES-256-GCM encryption keys.',
                },
                {
                  icon: FileVideo,
                  title: 'Uploaded Videos & Captions',
                  desc: 'All draft and queued videos stored in Cloudinary and captions stored in database.',
                },
                {
                  icon: Clock,
                  title: 'Scheduled Reel Queue Data',
                  desc: 'Upcoming calendar schedules, publication queue records, and audit attempt history.',
                },
                {
                  icon: UserX,
                  title: 'ReelFlow Account Information',
                  desc: 'Your user profile, name, email address, password hash, and active session records.',
                },
              ].map(({ icon: Icon, title, desc }, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-100/50 border border-white/[0.04] flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">{title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: How to request deletion */}
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              How to Request Deletion
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Send a deletion request email',
                  desc: 'Send an email from your registered ReelFlow account address to our support contact below.',
                },
                {
                  step: '2',
                  title: 'Include your account identifier',
                  desc: 'State your registered email address and Instagram username associated with your ReelFlow account.',
                },
                {
                  step: '3',
                  title: 'We will verify your request',
                  desc: 'Our team verifies ownership to prevent accidental or unauthorized account deletion.',
                },
                {
                  step: '4',
                  title: 'Data deletion and confirmation',
                  desc: 'We permanently delete all eligible data, revoke Meta API tokens, and send a final email confirmation within 48 hours.',
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Self-service immediate options */}
          <section className="glass-card p-6 border-brand-500/20 bg-brand-500/5">
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-400" />
              Immediate In-App Controls
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              If you have access to your account, you can also delete your data instantly without waiting:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-slate-200">Disconnect Instagram:</strong> Go to{' '}
                <Link to="/settings" className="text-brand-400 hover:underline">Settings</Link> → click{' '}
                <span className="text-red-400 font-medium">Disconnect Account</span> to immediately delete stored Meta tokens.
              </li>
              <li>
                <strong className="text-slate-200">Delete Videos & Captions:</strong> In your{' '}
                <Link to="/library" className="text-brand-400 hover:underline">Content Library</Link>, click the trash icon on any post to remove it from Cloudinary and our database.
              </li>
              <li>
                <strong className="text-slate-200">Revoke via Meta:</strong> Visit{' '}
                <a
                  href="https://www.instagram.com/accounts/manage_access/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-400 hover:underline inline-flex items-center gap-0.5"
                >
                  Instagram App Settings <ExternalLink className="w-3 h-3" />
                </a>{' '}
                to revoke ReelFlow permissions directly from Meta.
              </li>
            </ul>
          </section>

          {/* Section 4: Contact card */}
          <section className="glass-card p-6 border-white/[0.1] text-center">
            <h2 className="text-base font-bold text-white mb-1 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-brand-400" />
              Contact for Deletion Requests
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Click to email us directly or copy the address below:
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-sm text-slate-200 font-mono">
                <span>{supportEmail}</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Copy email"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <a
                href={`mailto:${supportEmail}?subject=ReelFlow%20Data%20Deletion%20Request&body=Please%20delete%20all%20data%20associated%20with%20my%20ReelFlow%20account.%0A%0ARegistered%20Email:%20%0AInstagram%20Username:%20`}
                className="btn-primary text-xs px-4 py-2.5"
              >
                <Mail className="w-4 h-4" />
                Send Deletion Request Email
              </a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ReelFlow. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
