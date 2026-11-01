import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

const REQS = [
  { test: (v) => v?.length >= 8, label: '8+ characters' },
  { test: (v) => /[A-Z]/.test(v || ''), label: 'Uppercase letter' },
  { test: (v) => /[0-9]/.test(v || ''), label: 'Number' },
];

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const pw = watch('password', '');

  const onSubmit = async (data) => {
    try {
      await authRegister(data);
      toast.success('Account created! Welcome to ReelFlow.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent-purple/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 mt-1 text-sm">Free forever — no credit card needed</p>
        </div>

        <div className="glass-card p-8">
          <form id="form-register" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="label">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your Name"
                  className={`input pl-10 ${errors.name ? 'border-red-500/50' : ''}`}
                  {...register('name')}
                />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`input pl-10 ${errors.email ? 'border-red-500/50' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="reg-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                  {...register('password')}
                />
                <button type="button" id="btn-toggle-reg-pw" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password requirements */}
              <div className="mt-2 space-y-1">
                {REQS.map(({ test, label }) => (
                  <div key={label} className={`flex items-center gap-1.5 text-xs ${test(pw) ? 'text-emerald-400' : 'text-slate-600'}`}>
                    <CheckCircle className="w-3 h-3" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <button id="btn-register-submit" type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3">
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" id="link-to-login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>

          <p className="text-center text-xs text-slate-600 mt-4">
            By creating an account, you agree to our{' '}
            <Link to="/privacy-policy" className="text-slate-400 hover:text-white hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
