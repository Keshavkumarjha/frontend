import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Building2, Layers, Clock, CalendarOff,
  DollarSign, Briefcase, Star, UserCircle, Settings,
  LogOut, ChevronLeft
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees',   icon: Users,            label: 'Employees' },
  { to: '/departments', icon: Building2,         label: 'Departments' },
  { to: '/roles',       icon: Layers,            label: 'Job Roles' },
  { to: '/attendance',  icon: Clock,             label: 'Attendance' },
  { to: '/leave',       icon: CalendarOff,       label: 'Leave' },
  { to: '/payroll',     icon: DollarSign,        label: 'Payroll' },
  { to: '/recruitment', icon: Briefcase,         label: 'Recruitment' },
  { to: '/performance', icon: Star,              label: 'Performance' },
]

const BOTTOM = [
  { to: '/profile',  icon: UserCircle, label: 'Profile' },
  { to: '/settings', icon: Settings,   label: 'Settings' },
]

export default function Sidebar({ collapsed, setCollapsed }) {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <aside
      className={`flex flex-col h-screen bg-surface-card border-r border-surface-border transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 fixed lg:relative z-40`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-surface-border">
        <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
          <Building2 size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-white text-lg tracking-tight">Simper HRMS</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded-lg hover:bg-surface-hover text-slate-500 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {!collapsed && <p className="section-label px-3 mb-2 mt-1">Main Menu</p>}
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="p-3 border-t border-surface-border space-y-0.5">
        {BOTTOM.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
