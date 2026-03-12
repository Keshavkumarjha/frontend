import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Clock, Search, MapPin, Monitor } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { attendanceApi } from '../../api/index'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { SkeletonTable } from '../../components/ui/Skeleton'
import Badge from '../../components/ui/Badge'

export default function Attendance() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)

  const { data: attData, isLoading } = useQuery({
    queryKey: ['attendance', page, search],
    queryFn: () => attendanceApi.list({ page }),
    select: (r) => r.data,
  })

  const records = attData?.results ?? attData ?? []
  const total   = attData?.count ?? records.length

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const createMutation = useMutation({
    mutationFn: (d) => attendanceApi.create(d),
    onSuccess: () => { qc.invalidateQueries(['attendance']); setModal(false); reset(); toast.success('Attendance recorded') },
    onError: (e) => toast.error(e.response?.data?.non_field_errors?.[0] ?? 'Failed'),
  })

  const columns = [
    {
      label: 'Employee',
      render: (r) => <span className="text-brand-400 font-mono text-xs">{r.employee}</span>,
    },
    { label: 'Date', key: 'work_date' },
    {
      label: 'Check In',
      render: (r) => <span className="text-emerald-400 text-xs font-mono">{r.check_in ? new Date(r.check_in).toLocaleTimeString() : '—'}</span>,
    },
    {
      label: 'Check Out',
      render: (r) => <span className="text-rose-400 text-xs font-mono">{r.check_out ? new Date(r.check_out).toLocaleTimeString() : '—'}</span>,
    },
    {
      label: 'Duration',
      render: (r) => {
        if (!r.check_in || !r.check_out) return <span className="text-slate-600">—</span>
        const h = ((new Date(r.check_out) - new Date(r.check_in)) / 3600000).toFixed(1)
        return <span className="text-white text-xs">{h}h</span>
      },
    },
    {
      label: 'Type',
      render: (r) => r.is_remote
        ? <Badge variant="blue"><Monitor size={10} className="mr-1" />Remote</Badge>
        : <Badge variant="gray"><MapPin size={10} className="mr-1" />Office</Badge>,
    },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} total records</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> Record Attendance</button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Records', value: total, color: 'text-brand-400' },
          { label: 'Remote Days', value: records.filter((r) => r.is_remote).length, color: 'text-sky-400' },
          { label: 'Checked Out',  value: records.filter((r) => r.check_out).length, color: 'text-emerald-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {isLoading ? <SkeletonTable /> : <DataTable columns={columns} data={records} total={total} page={page} setPage={setPage} />}

      <Modal open={modal} onClose={() => setModal(false)} title="Record Attendance" size="sm">
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Employee ID</label>
            <input {...register('employee', { required: true })} type="number" className="input" placeholder="Employee ID" />
            {errors.employee && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Work Date</label>
            <input {...register('work_date', { required: true })} type="date" className="input" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Check In</label>
              <input {...register('check_in', { required: true })} type="datetime-local" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Check Out</label>
              <input {...register('check_out')} type="datetime-local" className="input" />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input {...register('is_remote')} type="checkbox" className="w-4 h-4 rounded border-surface-border bg-surface-hover accent-brand-500" />
            <span className="text-sm text-slate-300">Remote work day</span>
          </label>
          <div className="flex justify-end">
            <button type="submit" disabled={createMutation.isPending} className="btn-primary">
              {createMutation.isPending ? 'Saving…' : 'Save Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
