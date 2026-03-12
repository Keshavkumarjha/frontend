import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { payrollApi } from '../../api/index'
import { fmtINR, fmtINRShort } from '../../utils/format'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { SkeletonTable } from '../../components/ui/Skeleton'

export default function Payroll() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(false)

  const { data: payData, isLoading } = useQuery({
    queryKey: ['payslips', page],
    queryFn: () => payrollApi.list({ page }),
    select: (r) => r.data,
  })

  const payslips       = payData?.results ?? payData ?? []
  const total          = payData?.count ?? payslips.length
  const totalNet       = payslips.reduce((s, p) => s + parseFloat(p.net_pay    ?? 0), 0)
  const totalBasic     = payslips.reduce((s, p) => s + parseFloat(p.basic_pay  ?? 0), 0)
  const totalDeductions = payslips.reduce((s, p) => s + parseFloat(p.deductions ?? 0), 0)
  const totalAllowances = payslips.reduce((s, p) => s + parseFloat(p.allowances ?? 0), 0)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const createMutation = useMutation({
    mutationFn: (d) => payrollApi.create(d),
    onSuccess: () => { qc.invalidateQueries(['payslips']); setModal(false); reset(); toast.success('Payslip created') },
    onError: () => toast.error('Failed to create payslip'),
  })

  const columns = [
    { label: 'Employee',    render: (p) => <span className="text-brand-400 font-mono text-xs">#{p.employee}</span> },
    { label: 'Period',      render: (p) => <span className="text-slate-300 text-xs">{p.period_start} → {p.period_end}</span> },
    { label: 'Basic Pay',   render: (p) => <span className="text-white font-medium text-sm">{fmtINR(p.basic_pay)}</span> },
    { label: 'Allowances',  render: (p) => <span className="text-emerald-400 text-sm">+{fmtINR(p.allowances)}</span> },
    { label: 'Deductions',  render: (p) => <span className="text-rose-400 text-sm">-{fmtINR(p.deductions)}</span> },
    { label: 'Net Pay',     render: (p) => <span className="font-display font-bold text-white text-sm">{fmtINR(p.net_pay)}</span> },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Payroll</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} payslips</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> New Payslip</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 border-brand-500/20">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee size={16} className="text-brand-400" />
            <p className="text-xs text-slate-500">Total Net Payout</p>
          </div>
          <p className="font-display text-2xl font-bold text-white">{fmtINRShort(totalNet)}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400"><TrendingUp size={11} /> This cycle</div>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500 mb-2">Total Basic</p>
          <p className="font-display text-2xl font-bold text-white">{fmtINRShort(totalBasic)}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500 mb-2">Total Allowances</p>
          <p className="font-display text-2xl font-bold text-emerald-400">{fmtINRShort(totalAllowances)}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-500 mb-2">Total Deductions</p>
          <p className="font-display text-2xl font-bold text-rose-400">{fmtINRShort(totalDeductions)}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-rose-400"><TrendingDown size={11} /> Deducted</div>
        </div>
      </div>

      {isLoading ? <SkeletonTable /> : <DataTable columns={columns} data={payslips} total={total} page={page} setPage={setPage} />}

      <Modal open={modal} onClose={() => setModal(false)} title="Create Payslip">
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Employee ID</label>
            <input {...register('employee', { required: 'Required' })} type="number" className="input" />
            {errors.employee && <p className="text-red-400 text-xs mt-1">{errors.employee.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Period Start</label>
              <input {...register('period_start', { required: 'Required' })} type="date" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Period End</label>
              <input {...register('period_end', { required: 'Required' })} type="date" className="input" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Basic Pay (₹)</label>
              <input {...register('basic_pay', { required: 'Required' })} type="number" step="0.01" className="input" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Allowances (₹)</label>
              <input {...register('allowances')} type="number" step="0.01" className="input" defaultValue="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Deductions (₹)</label>
              <input {...register('deductions')} type="number" step="0.01" className="input" defaultValue="0.00" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={createMutation.isPending} className="btn-primary">
              {createMutation.isPending ? 'Creating…' : 'Create Payslip'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
