import { Bell, Moon, Shield, Globe, Palette, Database } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Appearance',
    icon: Palette,
    items: [
      { label: 'Dark Mode', desc: 'Use dark theme across the app', type: 'toggle', defaultOn: true },
      { label: 'Compact View', desc: 'Reduce spacing in tables and lists', type: 'toggle', defaultOn: false },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    items: [
      { label: 'Leave Requests',      desc: 'Notify when a leave request is submitted', type: 'toggle', defaultOn: true },
      { label: 'Payroll Generated',   desc: 'Alert when new payslips are created', type: 'toggle', defaultOn: true },
      { label: 'New Applications',    desc: 'Alert on new recruitment applications', type: 'toggle', defaultOn: false },
    ],
  },
  {
    title: 'Privacy & Security',
    icon: Shield,
    items: [
      { label: 'Two-Factor Auth',     desc: 'Add extra security to your account', type: 'toggle', defaultOn: false },
      { label: 'Audit Logs',          desc: 'Track all actions performed in the app', type: 'toggle', defaultOn: true },
    ],
  },
  {
    title: 'API & Integration',
    icon: Database,
    items: [
      { label: 'API Endpoint',        desc: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api', type: 'info' },
    ],
  },
]

function Toggle({ defaultOn }) {
  return (
    <div className={`w-10 h-5 rounded-full transition-colors ${defaultOn ? 'bg-brand-600' : 'bg-surface-border'} relative cursor-pointer`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${defaultOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </div>
  )
}

export default function Settings() {
  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <h1 className="page-title">Settings</h1>
      <p className="text-slate-500 text-sm">Configure your Simper HRMS workspace preferences</p>

      {SECTIONS.map(({ title, icon: Icon, items }) => (
        <div key={title} className="card p-6 space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Icon size={16} className="text-brand-400" />
            </div>
            <h2 className="font-display font-semibold text-white">{title}</h2>
          </div>
          {items.map(({ label, desc, type, defaultOn }) => (
            <div key={label} className="flex items-center justify-between p-4 bg-surface-hover rounded-xl">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
              {type === 'toggle' && <Toggle defaultOn={defaultOn} />}
            </div>
          ))}
        </div>
      ))}

      <div className="card p-6">
        <h2 className="font-display font-semibold text-white mb-4">About Simper HRMS</h2>
        <div className="space-y-2 text-sm text-slate-400">
          <p>Version: 1.0.0</p>
          <p>Stack: React 18 + Vite + TailwindCSS + Django REST Framework</p>
          <p>Authentication: JWT (SimpleJWT)</p>
        </div>
      </div>
    </div>
  )
}
