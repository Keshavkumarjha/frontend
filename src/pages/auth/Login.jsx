import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Building2, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const { handleLogin } = useAuth()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      setError('')
      await handleLogin(data)
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(detail ?? 'Invalid email or password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] bg-surface-card border-r border-surface-border p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-600/8 rounded-full blur-3xl" />
        </div>
        <Link to="/" className="flex items-center gap-2.5 relative">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
            <Building2 size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">Simper HRMS</span>
        </Link>

        <div className="relative">
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Your team,<br />beautifully managed.
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Everything from attendance to payroll — streamlined into one intelligent dashboard.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 relative">
          {[
            { label: 'Active Employees', value: '240+' },
            { label: 'Departments',      value: '14' },
            { label: 'Leave Approval',   value: '98%' },
            { label: 'Time Saved',       value: '12h/wk' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-surface/60 rounded-xl p-4 border border-surface-border">
              <p className="font-display text-2xl font-bold text-brand-400">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">Simper HRMS</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400 mb-8">Sign in with your work email</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Work Email</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                })}
                type="email"
                placeholder="you@company.com"
                className="input"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3 text-base">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-surface-hover rounded-xl border border-surface-border">
            <p className="text-xs text-slate-500 text-center">
              New accounts are created by your HR administrator.
              <br />Contact your admin if you need access.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
