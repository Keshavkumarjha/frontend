import { Link } from 'react-router-dom'
import { Building2, Shield, Mail, ArrowLeft } from 'lucide-react'

export default function Register() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-10 justify-center">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
            <Building2 size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">Simper HRMS</span>
        </Link>

        <div className="card p-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-5">
            <Shield size={26} className="text-brand-400" />
          </div>

          <h1 className="font-display text-2xl font-bold text-white mb-3">
            Accounts are admin-managed
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Simper HRMS is an internal HR platform. New accounts are created by your
            HR administrator — self-registration is not available for security reasons.
          </p>

          <div className="bg-surface-hover border border-surface-border rounded-xl p-4 mb-6 text-left space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">What to do</p>
            {[
              'Contact your HR administrator to request an account',
              'They will create your account with your work email',
              'Sign in using your email and the provided password',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-brand-400 text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-sm text-slate-300">{text}</p>
              </div>
            ))}
          </div>

          <a href="mailto:hr@yourcompany.com" className="btn-primary w-full justify-center py-3 mb-4">
            <Mail size={16} /> Email HR Admin
          </a>

          <Link to="/login" className="btn-ghost w-full justify-center border border-surface-border">
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
