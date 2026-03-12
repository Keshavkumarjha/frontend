import { useQuery } from '@tanstack/react-query'
import { userApi } from '../../api/index'
import { useAuthStore } from '../../store/authStore'
import { UserCircle, Mail, Building2, LogOut } from 'lucide-react'
import { Skeleton } from '../../components/ui/Skeleton'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Profile() {
  const storeUser   = useAuthStore((s) => s.user)
  const logout      = useAuthStore((s) => s.logout)
  const navigate    = useNavigate()

  // NOTE: UserSerializer only exposes {name, url} — email comes from stored auth data
  const { data: meData, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => userApi.me(),
    select: (r) => r.data,
  })

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  // Merge API data + stored auth data for full picture
  const displayName  = meData?.name || storeUser?.name || 'User'
  const displayEmail = storeUser?.email ?? '—'
  const initials     = displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <h1 className="page-title">My Profile</h1>

      {/* Avatar card */}
      <div className="card p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-display text-2xl font-bold flex-shrink-0">
            {isLoading ? '…' : initials}
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="space-y-2"><Skeleton className="h-6 w-40" /><Skeleton className="h-4 w-56" /></div>
            ) : (
              <>
                <h2 className="font-display text-xl font-bold text-white">{displayName}</h2>
                <p className="text-slate-400 text-sm mt-0.5">{displayEmail}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-brand-400">
                  <Building2 size={12} /> Simper HRMS
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="card p-6 space-y-3">
        <h3 className="font-display font-semibold text-white mb-2">Account Details</h3>
        <div className="flex items-center gap-4 p-4 bg-surface-hover rounded-xl">
          <UserCircle size={18} className="text-brand-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Full Name</p>
            <p className="text-sm text-white font-medium mt-0.5">{isLoading ? '…' : displayName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-surface-hover rounded-xl">
          <Mail size={18} className="text-brand-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="text-sm text-white font-medium mt-0.5">{displayEmail}</p>
          </div>
        </div>

        <div className="pt-2 mt-2 border-t border-surface-border">
          <p className="text-xs text-slate-600 mb-3">
            To update your name or email, contact your HR administrator who can make changes via the admin panel.
          </p>
        </div>
      </div>

      {/* Logout */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Sign out</p>
            <p className="text-xs text-slate-500 mt-0.5">You'll need to sign in again to access the dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium transition-colors"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
