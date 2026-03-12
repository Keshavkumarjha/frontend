import { useQuery } from '@tanstack/react-query'
import { Users, CalendarOff, DollarSign, TrendingUp, Activity } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { employeeApi, leaveApi, payrollApi, activityApi } from '../../api/index'
import { fmtINR, fmtINRShort } from '../../utils/format'
import StatCard from '../../components/ui/StatCard'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { StatusBadge } from '../../components/ui/Badge'
import { useAuthStore } from '../../store/authStore'

const COLORS = ['#6366f1', '#34d399', '#f59e0b', '#f87171']

const MOCK_ATTENDANCE = [
  { day: 'Mon', present: 85, absent: 15 },
  { day: 'Tue', present: 90, absent: 10 },
  { day: 'Wed', present: 78, absent: 22 },
  { day: 'Thu', present: 88, absent: 12 },
  { day: 'Fri', present: 82, absent: 18 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-sm font-medium" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)

  const { data: empData, isLoading: empLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeApi.list(),
    select: (r) => r.data?.results ?? r.data ?? [],
  })

  const { data: leaveData, isLoading: leaveLoading } = useQuery({
    queryKey: ['leaves'],
    queryFn: () => leaveApi.list(),
    select: (r) => r.data?.results ?? r.data ?? [],
  })

  const { data: payrollData, isLoading: payrollLoading } = useQuery({
    queryKey: ['payslips'],
    queryFn: () => payrollApi.list(),
    select: (r) => r.data?.results ?? r.data ?? [],
  })

  const { data: activityData } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: () => activityApi.list({ limit: 10 }),
    select: (r) => r.data?.results ?? r.data ?? [],
  })

  const employees = empData ?? []
  const leaves = leaveData ?? []
  const payslips = payrollData ?? []

  const activeEmployees = employees.filter((e) => e.status === 'active').length
  const pendingLeaves   = leaves.filter((l) => l.status === 'pending').length
  const totalPayroll    = payslips.reduce((s, p) => s + parseFloat(p.net_pay ?? 0), 0)

  const leaveStatusData = [
    { name: 'Pending',  value: leaves.filter((l) => l.status === 'pending').length },
    { name: 'Approved', value: leaves.filter((l) => l.status === 'approved').length },
    { name: 'Rejected', value: leaves.filter((l) => l.status === 'rejected').length },
  ].filter((d) => d.value > 0)

  const empStatusData = [
    { name: 'Active',   value: employees.filter((e) => e.status === 'active').length },
    { name: 'On Leave', value: employees.filter((e) => e.status === 'on_leave').length },
    { name: 'Exited',   value: employees.filter((e) => e.status === 'exited').length },
  ].filter((d) => d.value > 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          <span className="text-white font-medium">{user?.name ?? user?.username ?? 'there'}</span> 👋
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {empLoading ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />) : (
          <>
            <StatCard label="Total Employees"  value={employees.length}  icon={Users}      color="brand"   trend={4} trendLabel="vs last month" />
            <StatCard label="Active Staff"     value={activeEmployees}   icon={TrendingUp}  color="emerald" />
            <StatCard label="Pending Leaves"   value={pendingLeaves}     icon={CalendarOff} color="amber"   />
            <StatCard label="Total Payroll"    value={fmtINRShort(totalPayroll)} icon={DollarSign} color="sky" />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Attendance chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-semibold text-white">Weekly Attendance</h2>
              <p className="text-xs text-slate-500 mt-0.5">Present vs Absent this week</p>
            </div>
            <span className="badge-blue">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_ATTENDANCE} barSize={28} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="present" fill="#6366f1" radius={[6, 6, 0, 0]} name="Present" />
              <Bar dataKey="absent"  fill="#1e2535"  radius={[6, 6, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave pie */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-1">Leave Status</h2>
          <p className="text-xs text-slate-500 mb-6">Distribution of leave requests</p>
          {leaveStatusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={leaveStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {leaveStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {leaveStatusData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-400">{d.name}</span>
                    </div>
                    <span className="text-white font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-500 text-sm">No leave data</div>
          )}
        </div>
      </div>

      {/* Second charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Employee status */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-1">Employee Status</h2>
          <p className="text-xs text-slate-500 mb-6">Active, on leave and exited</p>
          {empStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={empStatusData} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {empStatusData.map((_, i) => <Cell key={i} fill={[COLORS[0], COLORS[1], COLORS[3]][i % 3]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-500 text-sm">No employee data</div>
          )}
        </div>

        {/* Recent activity */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={16} className="text-brand-400" />
            <h2 className="font-display font-semibold text-white">Recent Activity</h2>
          </div>
          {activityData?.length > 0 ? (
            <div className="space-y-3">
              {activityData.slice(0, 6).map((a, i) => (
                <div key={a.id ?? i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{a.action}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{new Date(a.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-500 text-sm">No recent activity</div>
          )}
        </div>
      </div>

      {/* Recent employees */}
      {employees.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-surface-border">
            <h2 className="font-display font-semibold text-white">Recent Employees</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  {['Employee ID', 'Department', 'Role', 'Joined', 'Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 5).map((emp) => (
                  <tr key={emp.id} className="border-b border-surface-border last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3 text-brand-400 font-mono text-xs">{emp.employee_id}</td>
                    <td className="px-4 py-3 text-slate-300">{emp.department}</td>
                    <td className="px-4 py-3 text-slate-300">{emp.role}</td>
                    <td className="px-4 py-3 text-slate-400">{emp.date_of_joining}</td>
                    <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
