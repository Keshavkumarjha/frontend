import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit2, Trash2, Info, AlertTriangle, ExternalLink } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { employeeApi, departmentApi, roleApi } from '../../api/index'
import { StatusBadge } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { SkeletonTable } from '../../components/ui/Skeleton'
import DataTable from '../../components/ui/DataTable'

// ── Employee Form ────────────────────────────────────────────────────────────
function EmployeeForm({ onSubmit, defaultValues = {}, loading, departments, allRoles, onClose }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({ defaultValues })

  // useWatch returns string from <select>, API returns number — normalise with Number()
  const selectedDept = useWatch({ control, name: 'department' })
  const filteredRoles = selectedDept
    ? (allRoles ?? []).filter((r) => Number(r.department) === Number(selectedDept))
    : []

  const noRolesAtAll   = (allRoles ?? []).length === 0
  const noDeptSelected = !selectedDept
  const noDeptRoles    = selectedDept && filteredRoles.length === 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Warn if zero roles exist globally */}
      {noRolesAtAll && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/8 border border-amber-500/25 rounded-xl">
          <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-amber-300 font-medium">No job roles exist yet</p>
            <p className="text-slate-400 mt-0.5">
              Role is required for every employee.{' '}
              <button type="button" onClick={onClose} className="underline text-brand-400 hover:text-brand-300 inline-flex items-center gap-1">
                <Link to="/roles" className="flex items-center gap-1">Go to Job Roles <ExternalLink size={11} /></Link>
              </button>{' '}
              to create roles first.
            </p>
          </div>
        </div>
      )}

      {/* Employee ID + User ID */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Employee ID <span className="text-red-400">*</span>
          </label>
          <input
            {...register('employee_id', { required: 'Required' })}
            className="input"
            placeholder="EMP-001"
          />
          {errors.employee_id && <p className="text-red-400 text-xs mt-1">{errors.employee_id.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            User ID <span className="text-red-400">*</span>
            <span className="text-slate-600 font-normal ml-1 text-xs">(Django admin)</span>
          </label>
          <input
            {...register('user', { required: 'Required', valueAsNumber: true })}
            type="number"
            min="1"
            className="input"
            placeholder="1"
          />
          {errors.user && <p className="text-red-400 text-xs mt-1">{errors.user.message}</p>}
        </div>
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Department <span className="text-red-400">*</span>
        </label>
        <select {...register('department', { required: 'Required' })} className="input">
          <option value="">— Select department —</option>
          {departments?.map((d) => (
            <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
          ))}
        </select>
        {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
      </div>

      {/* Role — always required by backend */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Job Role <span className="text-red-400">*</span>
        </label>

        {noDeptSelected ? (
          /* No dept picked yet */
          <div className="input flex items-center gap-2 text-slate-600 cursor-not-allowed select-none">
            <Info size={14} className="flex-shrink-0" />
            Select a department above to see its roles
          </div>
        ) : noDeptRoles ? (
          /* Dept chosen but has no roles */
          <div className="p-3 bg-amber-500/8 border border-amber-500/25 rounded-xl flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-amber-300">
              This department has no roles.{' '}
              <Link to="/roles" onClick={onClose} className="underline text-brand-400 hover:text-brand-300 inline-flex items-center gap-1">
                Add roles <ExternalLink size={11} />
              </Link>
              {' '}and come back.
            </span>
          </div>
        ) : (
          /* Roles available → show dropdown */
          <select {...register('role', { required: 'Role is required' })} className="input">
            <option value="">— Select role —</option>
            {filteredRoles.map((r) => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>
        )}

        {errors.role && !noDeptSelected && !noDeptRoles && (
          <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* Date of Joining + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Date of Joining <span className="text-red-400">*</span>
          </label>
          <input
            {...register('date_of_joining', { required: 'Required' })}
            type="date"
            className="input"
          />
          {errors.date_of_joining && <p className="text-red-400 text-xs mt-1">{errors.date_of_joining.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
          <select {...register('status')} className="input">
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="exited">Exited</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || noRolesAtAll || noDeptRoles}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          title={noRolesAtAll ? 'Create roles first in Job Roles page' : noDeptRoles ? 'This department has no roles' : undefined}
        >
          {loading ? 'Saving…' : 'Save Employee'}
        </button>
      </div>
    </form>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function Employees() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)        // null | 'create' | {emp}
  const [deleteTarget, setDeleteTarget] = useState(null)

  // ── Queries
  const { data: empData, isLoading } = useQuery({
    queryKey: ['employees', page, search, statusFilter],
    queryFn: () => employeeApi.list({ page, search, ...(statusFilter ? { status: statusFilter } : {}) }),
    select: (r) => r.data,
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentApi.list(),
    select: (r) => r.data?.results ?? r.data ?? [],
  })

  const { data: allRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleApi.list(),
    select: (r) => r.data?.results ?? r.data ?? [],
  })

  const employees = empData?.results ?? empData ?? []
  const total     = empData?.count ?? employees.length

  // Display helpers
  const deptName = (id) => departments?.find((d) => Number(d.id) === Number(id))?.name ?? `Dept #${id}`
  const roleName = (id) => allRoles?.find((r) => Number(r.id) === Number(id))?.title ?? `Role #${id}`

  // ── Mutations
  const createMutation = useMutation({
    mutationFn: (data) => employeeApi.create(data),
    onSuccess: () => { qc.invalidateQueries(['employees']); setModal(null); toast.success('Employee created') },
    onError: (e) => {
      const msg = Object.values(e.response?.data ?? {}).flat().join(' ') || 'Failed to create'
      toast.error(msg)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => employeeApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['employees']); setModal(null); toast.success('Employee updated') },
    onError: (e) => {
      const msg = Object.values(e.response?.data ?? {}).flat().join(' ') || 'Failed to update'
      toast.error(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => employeeApi.remove(id),
    onSuccess: () => { qc.invalidateQueries(['employees']); setDeleteTarget(null); toast.success('Employee removed') },
    onError: () => toast.error('Failed to delete employee'),
  })

  // ── Columns
  const columns = [
    {
      label: 'Employee',
      render: (emp) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-600/20 border border-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-semibold flex-shrink-0">
            {String(emp.employee_id).slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-white text-sm">{emp.employee_id}</p>
            <p className="text-xs text-slate-500">User #{emp.user}</p>
          </div>
        </div>
      ),
    },
    { label: 'Department', render: (emp) => <span className="text-slate-300 text-sm">{deptName(emp.department)}</span> },
    { label: 'Role',       render: (emp) => <span className="text-slate-300 text-sm">{roleName(emp.role)}</span> },
    { label: 'Joined',     render: (emp) => <span className="text-slate-400 text-sm">{emp.date_of_joining}</span> },
    { label: 'Status',     render: (emp) => <StatusBadge status={emp.status} /> },
    {
      label: 'Actions',
      render: (emp) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setModal(emp)} className="p-1.5 rounded-lg hover:bg-surface-hover text-slate-500 hover:text-brand-400 transition-colors" title="Edit"><Edit2 size={14} /></button>
          <button onClick={() => setDeleteTarget(emp)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors" title="Remove"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} total employees</p>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary">
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by ID or email…"
            className="input pl-9 w-64"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {[['', 'All'], ['active', 'Active'], ['on_leave', 'On Leave'], ['exited', 'Exited']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setStatusFilter(val); setPage(1) }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                statusFilter === val
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                  : 'text-slate-500 hover:text-white hover:bg-surface-hover'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <SkeletonTable /> : (
        <DataTable columns={columns} data={employees} total={total} page={page} setPage={setPage} />
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'Add New Employee' : `Edit Employee — ${modal?.employee_id}`}
      >
        <EmployeeForm
          defaultValues={
            modal !== 'create'
              ? { ...modal, department: String(modal?.department), role: String(modal?.role) }
              : { status: 'active' }
          }
          departments={departments}
          allRoles={allRoles}
          loading={createMutation.isPending || updateMutation.isPending}
          onClose={() => setModal(null)}
          onSubmit={(data) =>
            modal === 'create'
              ? createMutation.mutate(data)
              : updateMutation.mutate({ id: modal.id, data })
          }
        />
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Employee" size="sm">
        <p className="text-slate-400 mb-6">
          Remove employee <span className="text-white font-semibold">{deleteTarget?.employee_id}</span>?
          This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteTarget(null)} className="btn-ghost border border-surface-border">Cancel</button>
          <button
            onClick={() => deleteMutation.mutate(deleteTarget.id)}
            disabled={deleteMutation.isPending}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2"
          >
            <Trash2 size={14} />
            {deleteMutation.isPending ? 'Removing…' : 'Remove'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
