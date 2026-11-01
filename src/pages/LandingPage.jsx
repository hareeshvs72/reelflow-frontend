import { Link } from 'react-router-dom';
import {
  Zap, Upload, Calendar, Clock, CheckCircle, ArrowRight,
  Play, Shield, Layers, Globe
} from 'lucide-react';

const FEATURES = [
  {
    icon: Upload,
    title: 'Bulk Video Upload',
    description: 'Drag and drop multiple videos at once. Preview, validate, and manage your entire content library.',
    color: 'from-brand-500 to-brand-600',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Pick exact dates and times for each Reel. Schedule batches at once with timezone support.',
    color: 'from-accent-purple to-brand-500',
  },
  {
    icon: Zap,
    title: 'Auto-Publishing',
    description: 'BullMQ background worker publishes your Reels automatically via the official Meta API.',
    color: 'from-accent-pink to-accent-purple',
  },
  {
    icon: Shield,
    title: 'Secure & Official',
    description: 'Uses the official Instagram API with Instagram Login. No passwords stored. Tokens encrypted.',
    color: 'from-accent-teal to-brand-500',
  },
  {
    icon: Layers,
    title: 'Caption Editor',
    description: 'Write captions with hashtags and emoji support. 2200 character limit with live counter.',
    color: 'from-brand-600 to-accent-purple',
  },
  {
    icon: Globe,
    title: 'Free Tier First',
    description: 'Built on MongoDB Atlas, Cloudinary, and Redis. No credit card needed to get started.',
    color: 'from-accent-purple to-accent-pink',
  },
];

const STEPS = [
  { step: '01', title: 'Connect Instagram', description: 'Link your Instagram Professional account via Meta OAuth. Takes 30 seconds.' },
  { step: '02', title: 'Upload Your Reels', description: 'Drag & drop MP4 videos. Add captions, hashtags, and schedule dates.' },
  { step: '03', title: 'Set Schedule & Relax', description: 'ReelFlow publishes automatically at your chosen time — even while you sleep.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/[0.06] bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white text-lg">ReelFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" id="nav-login" className="btn-ghost text-sm">Sign In</Link>
          <Link to="/register" id="nav-register" className="btn-primary text-sm">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center relative">
        {/* Glow blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8">
            <CheckCircle className="w-3.5 h-3.5" />
            Official Meta Instagram API — No hacks, no bots
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Schedule Instagram Reels
            <span className="block bg-gradient-brand bg-clip-text text-transparent">
              on Autopilot
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Bulk upload, write captions, pick your schedule — ReelFlow publishes your Reels
            automatically using the official Meta API. Free to start.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" id="hero-cta-primary" className="btn-primary text-base px-8 py-3 shadow-glow">
              Start Scheduling Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" id="hero-cta-secondary" className="btn-secondary text-base px-8 py-3">
              <Play className="w-4 h-4" />
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-slate-400 text-lg">A complete Reel scheduling platform built for creators.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="glass-card p-6 group hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-glow-sm group-hover:shadow-glow transition-shadow`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-400 text-lg mb-16">Three steps to hands-free Reel publishing.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(({ step, title, description }) => (
              <div key={step} className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto mb-5 shadow-glow font-display font-bold text-white text-lg">
                  {step}
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Tier Note */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto glass-card p-10 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">100% Free to Start</h2>
          <p className="text-slate-400 leading-relaxed mb-6">
            ReelFlow uses <strong className="text-slate-300">MongoDB Atlas</strong> (512 MB free),{' '}
            <strong className="text-slate-300">Cloudinary</strong> (25 credits/month free), and{' '}
            <strong className="text-slate-300">Redis in Docker</strong> locally.{' '}
            No credit card needed for development. Check SETUP.md for free deployment options.
          </p>
          <Link to="/register" id="free-tier-cta" className="btn-primary mx-auto">
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/[0.06] text-center text-slate-500 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto mb-3">
          <p>© {new Date().getFullYear()} ReelFlow. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" id="footer-privacy-policy-link" className="text-slate-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/data-deletion" id="footer-data-deletion-link" className="text-slate-400 hover:text-white transition-colors">
              Data Deletion
            </Link>
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-slate-400 hover:text-white transition-colors">
              Register
            </Link>
          </div>
        </div>
        <p className="text-slate-600 text-[11px]">ReelFlow — Built with the official Meta Instagram API. Not affiliated with Meta Platforms.</p>
      </footer>
    </div>
  );
}
