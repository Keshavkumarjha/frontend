import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { leaveApi } from '../../api/index'
import { StatusBadge } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { SkeletonTable } from '../../components/ui/Skeleton'

export default function Leave() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [modal, setModal] = useState(false)

  const { data: leaveData, isLoading } = useQuery({
    queryKey: ['leaves', page, statusFilter],
    queryFn: () => leaveApi.list({ page, ...(statusFilter ? { status: statusFilter } : {}) }),
    select: (r) => r.data,
  })

  const leaves = leaveData?.results ?? leaveData ?? []
  const total  = leaveData?.count ?? leaves.length

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const createMutation = useMutation({
    mutationFn: (d) => leaveApi.create(d),
    onSuccess: () => { qc.invalidateQueries(['leaves']); setModal(false); reset(); toast.success('Leave request submitted') },
    onError: (e) => toast.error(e.response?.data?.non_field_errors?.[0] ?? 'Failed to submit'),
  })

  // Uses the dedicated POST /api/v1/leaves/{id}/approve/ action (triggers notifications + audit log)
  const approveMutation = useMutation({
    mutationFn: (id) => leaveApi.approve(id),
    onSuccess: () => { qc.invalidateQueries(['leaves']); toast.success('Leave approved — employee notified') },
    onError: (e) => toast.error(e.response?.data?.detail ?? 'Could not approve. Are you linked to an employee profile?'),
  })

  // Reject uses PATCH (no dedicated reject action in backend)
  const rejectMutation = useMutation({
    mutationFn: (id) => leaveApi.reject(id),
    onSuccess: () => { qc.invalidateQueries(['leaves']); toast.success('Leave rejected') },
    onError: (e) => toast.error(e.response?.data?.detail ?? 'Could not reject'),
  })

  const columns = [
    { label: 'Employee', render: (l) => <span className="text-brand-400 font-mono text-xs">#{l.employee}</span> },
    { label: 'Period',   render: (l) => <span className="text-slate-300 text-xs">{l.start_date} → {l.end_date}</span> },
    { label: 'Reason',   render: (l) => <span className="text-slate-400 text-xs line-clamp-1 max-w-xs">{l.reason}</span> },
    { label: 'Status',   render: (l) => <StatusBadge status={l.status} /> },
    {
      label: 'Actions',
      render: (l) => l.status === 'pending' ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => approveMutation.mutate(l.id)}
            disabled={approveMutation.isPending}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium transition-colors border border-emerald-500/20 disabled:opacity-50"
            title="Approve"
          >
            <CheckCircle size={12} /> Approve
          </button>
          <button
            onClick={() => rejectMutation.mutate(l.id)}
            disabled={rejectMutation.isPending}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors border border-red-500/20 disabled:opacity-50"
            title="Reject"
          >
            <XCircle size={12} /> Reject
          </button>
        </div>
      ) : (
        <span className="text-slate-600 text-xs">—</span>
      ),
    },
  ]

  const stats = [
    { label: 'Total',    value: leaves.length,                                        icon: Clock,       color: 'text-slate-400' },
    { label: 'Pending',  value: leaves.filter((l) => l.status === 'pending').length,  icon: Clock,       color: 'text-amber-400' },
    { label: 'Approved', value: leaves.filter((l) => l.status === 'approved').length, icon: CheckCircle, color: 'text-emerald-400' },
    { label: 'Rejected', value: leaves.filter((l) => l.status === 'rejected').length, icon: XCircle,     color: 'text-rose-400' },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} leave requests</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> Request Leave</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <Icon size={20} className={color} />
            <div>
              <p className="font-display text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {['', 'pending', 'approved', 'rejected'].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === s ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30' : 'text-slate-500 hover:text-white hover:bg-surface-hover'
            }`}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {isLoading ? <SkeletonTable /> : <DataTable columns={columns} data={leaves} total={total} page={page} setPage={setPage} />}

      <Modal open={modal} onClose={() => setModal(false)} title="Request Leave" size="sm">
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Employee ID</label>
            <input {...register('employee', { required: 'Required' })} type="number" className="input" placeholder="Your employee ID" />
            {errors.employee && <p className="text-red-400 text-xs mt-1">{errors.employee.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Start Date</label>
              <input {...register('start_date', { required: 'Required' })} type="date" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">End Date</label>
              <input {...register('end_date', { required: 'Required' })} type="date" className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Reason</label>
            <textarea {...register('reason', { required: 'Required' })} className="input resize-none" rows={3} placeholder="Reason for leave request…" />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={createMutation.isPending} className="btn-primary">
              {createMutation.isPending ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
