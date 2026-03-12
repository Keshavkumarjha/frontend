import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Clock, CalendarOff, DollarSign } from 'lucide-react'

const ITEMS = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Home' },
  { to: '/employees',  icon: Users,           label: 'Staff' },
  { to: '/attendance', icon: Clock,            label: 'Attend.' },
  { to: '/leave',      icon: CalendarOff,      label: 'Leave' },
  { to: '/payroll',    icon: DollarSign,       label: 'Payroll' },
]

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-surface-card border-t border-surface-border z-40 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                isActive ? 'text-brand-400' : 'text-slate-500'
              }`
            }
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
