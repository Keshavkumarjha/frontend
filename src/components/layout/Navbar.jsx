import { useState } from 'react'
import { Bell, Search, Menu } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useQuery } from '@tanstack/react-query'
import { notificationApi, userApi } from '../../api/index'

export default function Navbar({ onMenuClick }) {
  const storeUser = useAuthStore((s) => s.user)
  const [showNotifs, setShowNotifs] = useState(false)

  // Fetch fresh user profile (only returns {name, url} from backend)
  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => userApi.me(),
    select: (r) => r.data,
    staleTime: 5 * 60 * 1000,
  })

  const displayName  = meData?.name || storeUser?.name || 'User'
  const displayEmail = storeUser?.email ?? ''
  const initials     = displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list({ is_read: false }),
    select: (r) => r.data?.results ?? r.data ?? [],
  })

  const unread = notifData?.length ?? 0

  return (
    <header className="h-16 bg-surface-card border-b border-surface-border flex items-center px-4 gap-4 sticky top-0 z-30">
      {/* Mobile menu */}
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl hover:bg-surface-hover text-slate-400">
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search anything..." className="input pl-9 py-2 text-sm" />
        </div>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifs(!showNotifs)}
          className="relative p-2 rounded-xl hover:bg-surface-hover text-slate-400 hover:text-white transition-colors"
        >
          <Bell size={20} />
          {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />}
        </button>
        {showNotifs && (
          <div className="absolute right-0 top-12 w-80 card shadow-2xl shadow-black/50 z-50 animate-slide-up">
            <div className="p-4 border-b border-surface-border flex items-center justify-between">
              <span className="font-semibold text-sm text-white">Notifications</span>
              {unread > 0 && <span className="badge-blue">{unread} new</span>}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {(!notifData || notifData.length === 0) ? (
                <p className="text-slate-500 text-sm p-6 text-center">No new notifications</p>
              ) : notifData.slice(0, 8).map((n) => (
                <div key={n.id} className="p-4 border-b border-surface-border hover:bg-surface-hover transition-colors">
                  <p className="text-sm font-medium text-white">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-brand-400 font-semibold text-sm">
          {initials}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-white leading-none">{displayName}</p>
          <p className="text-xs text-slate-500 mt-0.5">{displayEmail}</p>
        </div>
      </div>
    </header>
  )
}
