import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Database,
  Eye,
  Trash2,
  Mail,
  ArrowLeft,
  Zap,
  CheckCircle2,
  Server,
  ExternalLink,
  Calendar,
  Layers,
} from 'lucide-react';

export default function PrivacyPolicyPage() {
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
          <Link to="/login" className="btn-secondary text-xs px-3.5 py-1.5">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary text-xs px-3.5 py-1.5">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Official Meta Graph API Integration</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400">
            Last Updated: <span className="text-slate-200 font-medium">November 1, 2026</span>
          </p>
        </div>

        {/* Summary Card */}
        <div className="glass-card p-6 mb-10 border border-brand-500/30 bg-brand-500/5">
          <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-400" />
            Privacy Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            ReelFlow respects and protects your privacy. We only access the Instagram permissions you
            explicitly approve, encrypt all API tokens with industry-grade AES-256-GCM encryption, never
            sell your personal data, and allow you to request full deletion of your account and assets at
            any time.
          </p>
        </div>

        {/* Sections Content */}
        <div className="space-y-8 text-sm leading-relaxed">
          {/* 1. Introduction */}
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-500/20 text-brand-400 text-xs font-bold">
                1
              </span>
              Introduction
            </h2>
            <p className="text-slate-300">
              ReelFlow is an Instagram Reel scheduling and publishing platform that helps creators and
              businesses manage and publish Instagram video content through Meta&apos;s official APIs.
            </p>
            <p className="text-slate-300 mt-2">
              This Privacy Policy explains how ReelFlow collects, uses, stores, and protects user
              information when you interact with our web application hosted at{' '}
              <a
                href="https://reelflow-nu.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="text-brand-400 hover:underline"
              >
                https://reelflow-nu.vercel.app
              </a>
              .
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-500/20 text-brand-400 text-xs font-bold">
                2
              </span>
              Information We Collect
            </h2>
            <p className="text-slate-300 mb-3">ReelFlow may collect the following information:</p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside">
              <li>
                <strong className="text-white">Instagram Account Information:</strong> Instagram
                account ID, username, profile picture URL, and account type (Creator or Business).
              </li>
              <li>
                <strong className="text-white">Authorization Tokens:</strong> OAuth authorization codes,
                short-lived and long-lived Meta Graph API access tokens.
              </li>
              <li>
                <strong className="text-white">Uploaded Content:</strong> Video files (MP4/MOV), video
                captions, hashtags, and generated thumbnails.
              </li>
              <li>
                <strong className="text-white">Scheduling Data:</strong> Scheduled publishing dates,
                times, publication statuses, container IDs, and publishing attempt logs.
              </li>
              <li>
                <strong className="text-white">Account Details:</strong> Your name, email address,
                encrypted password hash, and application usage information.
              </li>
            </ul>
          </section>

          {/* 3. How We Use Your Information */}
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-500/20 text-brand-400 text-xs font-bold">
                3
              </span>
              How We Use Your Information
            </h2>
            <p className="text-slate-300 mb-3">We use collected information solely to:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Connect and verify Instagram Professional accounts.',
                'Authenticate users securely through Meta OAuth.',
                'Schedule and automatically publish eligible Instagram Reels.',
                'Manage uploaded videos, thumbnails, and captions in your Library.',
                'Monitor queue execution and provide real-time publishing history.',
                'Provide, secure, maintain, and improve ReelFlow services.',
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-surface-100/50 border border-white/[0.04] flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Instagram API and Meta */}
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-500/20 text-brand-400 text-xs font-bold">
                4
              </span>
              Instagram API and Meta Compliance
            </h2>
            <p className="text-slate-300">
              ReelFlow uses Meta&apos;s official Instagram Graph APIs to provide Instagram account
              connection and automated content publishing functionality.
            </p>
            <p className="text-slate-300 mt-2">
              When users authorize ReelFlow via Meta Login, the application requests and accesses only the
              explicit permissions approved by the user:
            </p>
            <div className="mt-3 space-y-1.5 pl-3 border-l-2 border-brand-500/50 text-xs text-slate-400">
              <p>• <code className="text-brand-300">instagram_business_basic</code>: To read basic profile info and identify Creator/Business account status.</p>
              <p>• <code className="text-brand-300">instagram_business_content_publish</code>: To upload video media containers and publish Reels to your feed.</p>
              <p>• <code className="text-brand-300">instagram_business_manage_messages</code>: Standard Instagram Graph API scope for business communication.</p>
            </div>
            <p className="text-slate-300 mt-3">
              ReelFlow&apos;s use and transfer of information received through Meta APIs strictly
              complies with the applicable{' '}
              <a
                href="https://developers.facebook.com/terms/"
                target="_blank"
                rel="noreferrer"
                className="text-brand-400 hover:underline inline-flex items-center gap-1"
              >
                Meta Platform Terms <ExternalLink className="w-3 h-3" />
              </a>{' '}
              and Developer Policies.
            </p>
          </section>

          {/* 5. Data Storage and Security */}
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-500/20 text-brand-400 text-xs font-bold">
                5
              </span>
              Data Storage and Security
            </h2>
            <p className="text-slate-300 mb-4">
              All Instagram access tokens stored by ReelFlow are encrypted at rest using industry-standard{' '}
              <strong className="text-white">AES-256-GCM</strong> encryption with 96-bit initialization
              vectors and authentication tags. Passwords are salted and hashed with{' '}
              <strong className="text-white">bcrypt</strong>.
            </p>
            <p className="text-slate-300 mb-3">
              ReelFlow utilizes trusted third-party infrastructure providers for application hosting, database
              storage, and video processing:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-100/50 border border-white/[0.04]">
                <div className="flex items-center gap-2 font-semibold text-white text-xs mb-1">
                  <Server className="w-4 h-4 text-brand-400" />
                  Render
                </div>
                <p className="text-xs text-slate-400">Node.js Express backend hosting and background BullMQ publishing workers.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-100/50 border border-white/[0.04]">
                <div className="flex items-center gap-2 font-semibold text-white text-xs mb-1">
                  <Layers className="w-4 h-4 text-accent-teal" />
                  Vercel
                </div>
                <p className="text-xs text-slate-400">Frontend single-page application hosting with global Edge CDN.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-100/50 border border-white/[0.04]">
                <div className="flex items-center gap-2 font-semibold text-white text-xs mb-1">
                  <Database className="w-4 h-4 text-emerald-400" />
                  MongoDB Atlas
                </div>
                <p className="text-xs text-slate-400">Encrypted cloud database storage for user metadata, post schedules, and audit history.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-100/50 border border-white/[0.04]">
                <div className="flex items-center gap-2 font-semibold text-white text-xs mb-1">
                  <Eye className="w-4 h-4 text-accent-pink" />
                  Cloudinary
                </div>
                <p className="text-xs text-slate-400">Signed, authenticated video and thumbnail storage for Reel publishing pipelines.</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs mt-3">
              We take all reasonable and appropriate administrative, technical, and physical measures to protect
              your personal information and prevent unauthorized access or disclosure.
            </p>
          </section>

          {/* 6. Data Sharing */}
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-500/20 text-brand-400 text-xs font-bold">
                6
              </span>
              Data Sharing
            </h2>
            <p className="text-slate-300">
              <strong className="text-white">ReelFlow does not sell or rent your personal information to any third party.</strong>
            </p>
            <p className="text-slate-300 mt-2">
              Information is processed only by our infrastructure providers and Meta Platforms strictly as
              necessary to operate the service, process video files, and publish requested Instagram Reels on
              your behalf.
            </p>
          </section>

          {/* 7. Data Retention and Deletion */}
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-500/20 text-brand-400 text-xs font-bold">
                7
              </span>
              Data Retention and Deletion
            </h2>
            <p className="text-slate-300">
              Users retain complete ownership and control over their data. You may at any time:
            </p>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside mt-2 text-xs sm:text-sm">
              <li>Disconnect your Instagram account directly from your ReelFlow Dashboard Settings with one click.</li>
              <li>Revoke ReelFlow&apos;s authorization in your Facebook / Instagram Security Settings.</li>
              <li>Delete individual video files, draft captions, and scheduled jobs from your Content Library.</li>
              <li>Request full deletion of your ReelFlow user account, encrypted authorization tokens, and all uploaded media.</li>
            </ul>
            <div className="mt-4 p-4 rounded-xl bg-surface-100/60 border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-white">How to request data deletion:</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Email your request to <span className="text-brand-300 font-mono">hareeshvs72@gmail.com</span> with your registered account email.
                </p>
              </div>
              <a
                href="mailto:hareeshvs72@gmail.com?subject=ReelFlow%20Data%20Deletion%20Request"
                className="btn-danger text-xs px-3.5 py-1.5 whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Request Deletion
              </a>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              For complete step-by-step instructions and immediate in-app deletion steps, visit our{' '}
              <Link to="/data-deletion" className="text-brand-400 hover:underline font-medium">
                Data Deletion Instructions Page
              </Link>
              .
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Valid deletion requests are processed in accordance with applicable legal and platform requirements,
              and all stored tokens and assets are permanently purged within 30 days.
            </p>
          </section>

          {/* 8. Third-Party Services */}
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-500/20 text-brand-400 text-xs font-bold">
                8
              </span>
              Third-Party Services
            </h2>
            <p className="text-slate-300">
              ReelFlow integrates with third-party services, including Meta Platforms, Inc., for Instagram
              authentication and content publishing. These services have their own independent privacy
              policies and terms of service:
            </p>
            <div className="mt-3 space-y-1.5 text-xs">
              <p>
                • Meta / Instagram Privacy Policy:{' '}
                <a
                  href="https://privacycenter.instagram.com/policy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-400 hover:underline"
                >
                  https://privacycenter.instagram.com/policy
                </a>
              </p>
              <p>
                • Cloudinary Privacy Policy:{' '}
                <a
                  href="https://cloudinary.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-400 hover:underline"
                >
                  https://cloudinary.com/privacy
                </a>
              </p>
            </div>
          </section>

          {/* 9. Children's Privacy */}
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-500/20 text-brand-400 text-xs font-bold">
                9
              </span>
              Children&apos;s Privacy
            </h2>
            <p className="text-slate-300">
              ReelFlow is designed for creators and businesses and is not intended for use by children under the
              age of 13. We do not knowingly collect or solicit personal information from children under 13.
            </p>
          </section>

          {/* 10. Changes to This Policy */}
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-500/20 text-brand-400 text-xs font-bold">
                10
              </span>
              Changes to This Policy
            </h2>
            <p className="text-slate-300">
              We may update this Privacy Policy from time to time when our services, features, or legal
              requirements change. Updated versions will always be published on this page with an updated
              &quot;Last Updated&quot; timestamp.
            </p>
          </section>

          {/* 11. Contact Information */}
          <section className="glass-card p-6 border-brand-500/30">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-500/20 text-brand-400 text-xs font-bold">
                11
              </span>
              Contact Information
            </h2>
            <p className="text-slate-300 mb-4">
              For any questions, privacy concerns, or data deletion requests regarding ReelFlow:
            </p>
            <div className="space-y-2 text-xs sm:text-sm bg-surface-100/50 p-4 rounded-xl border border-white/[0.04]">
              <p>
                <strong className="text-white">Application:</strong> ReelFlow
              </p>
              <p>
                <strong className="text-white">Contact Email:</strong>{' '}
                <a
                  href="mailto:hareeshvs72@gmail.com"
                  className="text-brand-400 hover:underline font-medium"
                >
                  hareeshvs72@gmail.com
                </a>
              </p>
              <p>
                <strong className="text-white">Website:</strong>{' '}
                <a
                  href="https://reelflow-nu.vercel.app"
                  className="text-brand-400 hover:underline"
                >
                  https://reelflow-nu.vercel.app
                </a>
              </p>
              <p>
                <strong className="text-white">Privacy URL:</strong>{' '}
                <a
                  href="https://reelflow-nu.vercel.app/privacy-policy"
                  className="text-brand-400 hover:underline"
                >
                  https://reelflow-nu.vercel.app/privacy-policy
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Back to top / home footer */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ReelFlow. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-slate-400 hover:text-white transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
