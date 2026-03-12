import { Link } from 'react-router-dom'
import { Building2, Users, Clock, DollarSign, BarChart3, Shield, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react'

const FEATURES = [
  { icon: Users,     color: 'text-brand-400',   bg: 'bg-brand-500/10',   title: 'Employee Management',  desc: 'Centralize all employee records, documents, and profiles in one place.' },
  { icon: Clock,     color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: 'Attendance Tracking',  desc: 'Real-time check-in/out, remote work flags, and daily summaries.' },
  { icon: DollarSign,color: 'text-amber-400',   bg: 'bg-amber-500/10',   title: 'Payroll & Payslips',   desc: 'Generate payslips, manage allowances, and track deductions in INR.' },
  { icon: BarChart3, color: 'text-sky-400',     bg: 'bg-sky-500/10',     title: 'Performance Reviews',  desc: 'Track ratings, reviews, and career growth for each team member.' },
  { icon: Shield,    color: 'text-rose-400',    bg: 'bg-rose-500/10',    title: 'Leave Management',     desc: 'Automated approval workflows with full audit trail and notifications.' },
  { icon: Briefcase, color: 'text-violet-400',  bg: 'bg-violet-500/10',  title: 'Recruitment Pipeline', desc: 'Post job openings, track candidates and manage the hiring funnel.' },
]

const PERKS = [
  'JWT-secured authentication', 'Role-based access control',
  'Real-time notifications', 'Mobile-first responsive UI',
  'Audit logs for every action', 'INR payroll support',
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface text-white font-body">
      {/* Nav */}
      <header className="border-b border-surface-border bg-surface-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">Simper HRMS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost">Sign in</Link>
            <Link to="/register" className="btn-primary">Learn more <ArrowRight size={14} /></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-6 py-24 lg:py-36 text-center relative">
          <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-sm text-brand-400 mb-8 animate-fade-in">
            <Building2 size={13} />
            The modern HR platform for Indian businesses
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6 animate-slide-up">
            HR management
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-violet-400">
              made simple.
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Simper HRMS brings your entire HR workflow into one clean, fast dashboard —
            employees, attendance, payroll (₹), leaves, and performance reviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/login" className="btn-primary text-base px-8 py-3 rounded-xl">
              Sign in to dashboard <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="btn-ghost text-base px-8 py-3 rounded-xl border border-surface-border">
              Contact HR admin
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Features</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">Everything your HR team needs</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">One platform to manage your entire people operations.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="card p-6 hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon size={22} className={color} />
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="card p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/5 rounded-full blur-2xl" />
          <div className="grid lg:grid-cols-2 gap-10 items-center relative">
            <div>
              <p className="section-label mb-3">Why Simper HRMS</p>
              <h2 className="font-display text-3xl font-bold text-white mb-4">Built for Indian workplaces</h2>
              <p className="text-slate-400 leading-relaxed">
                A full-stack HR system with Django REST API and a clean React dashboard.
                INR payroll, role-based access, and audit trails built in.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {PERKS.map((p) => (
                <div key={p} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to get started?</h2>
        <p className="text-slate-400 mb-8">Sign in with your work credentials to access the Simper HRMS dashboard.</p>
        <Link to="/login" className="btn-primary text-base px-10 py-3 rounded-xl inline-flex">
          Sign in <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8 text-center text-slate-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Building2 size={14} className="text-brand-500" />
          <span className="font-display font-semibold text-slate-400">Simper HRMS</span>
        </div>
        © {new Date().getFullYear()} Simper HRMS. Built with Django + React.
      </footer>
    </div>
  )
}
