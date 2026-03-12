import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Layers, Edit2, Trash2, Search, Building2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { roleApi, departmentApi } from '../../api/index'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { SkeletonTable } from '../../components/ui/Skeleton'

// ── Role Form (create + edit) ────────────────────────────────────────────────
function RoleForm({ onSubmit, defaultValues = {}, loading, departments }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Role Title <span className="text-red-400">*</span>
        </label>
        <input
          {...register('title', { required: 'Title is required', maxLength: { value: 140, message: 'Max 140 characters' } })}
          className="input"
          placeholder="e.g. Senior Software Engineer"
        />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Department <span className="text-red-400">*</span>
        </label>
        <select {...register('department', { required: 'Department is required' })} className="input">
          <option value="">— Select department —</option>
          {departments?.map((d) => (
            <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
          ))}
        </select>
        {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
      </div>

      {/* Description (optional) */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Description <span className="text-slate-600 font-normal">(optional)</span>
        </label>
        <textarea
          {...register('description')}
          className="input resize-none"
          rows={3}
          placeholder="Brief description of responsibilities…"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving…' : 'Save Role'}
        </button>
      </div>
    </form>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function Roles() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)          // null | 'create' | {role obj}
  const [deleteTarget, setDeleteTarget] = useState(null)

  // ── Queries
  const { data: roleData, isLoading } = useQuery({
    queryKey: ['roles', page, search],
    queryFn: () => roleApi.list({ page, search }),
    select: (r) => r.data,
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentApi.list(),
    select: (r) => r.data?.results ?? r.data ?? [],
  })

  const allRoles = roleData?.results ?? roleData ?? []
  const total    = roleData?.count ?? allRoles.length

  // client-side dept filter
  const roles = deptFilter
    ? allRoles.filter((r) => Number(r.department) === Number(deptFilter))
    : allRoles

  const deptName = (id) => departments?.find((d) => Number(d.id) === Number(id))?.name ?? `#${id}`

  // ── Mutations
  const createMutation = useMutation({
    mutationFn: (data) => roleApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries(['roles'])
      setModal(null)
      toast.success('Role created successfully')
    },
    onError: (e) => {
      const msg = e.response?.data?.non_field_errors?.[0]
        ?? Object.values(e.response?.data ?? {}).flat().join(' ')
        ?? 'Failed to create role'
      toast.error(msg)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => roleApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries(['roles'])
      setModal(null)
      toast.success('Role updated')
    },
    onError: (e) => {
      const msg = Object.values(e.response?.data ?? {}).flat().join(' ') || 'Failed to update'
      toast.error(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => roleApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries(['roles'])
      setDeleteTarget(null)
      toast.success('Role deleted')
    },
    onError: () =>
      toast.error('Cannot delete — this role may be assigned to employees'),
  })

  // ── Table columns
  const columns = [
    {
      label: 'Role Title',
      render: (role) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Layers size={14} className="text-violet-400" />
          </div>
          <div>
            <p className="font-medium text-white text-sm">{role.title}</p>
            {role.description && (
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{role.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      label: 'Department',
      render: (role) => (
        <div className="flex items-center gap-2">
          <Building2 size={13} className="text-brand-400 flex-shrink-0" />
          <span className="text-slate-300 text-sm">{deptName(role.department)}</span>
        </div>
      ),
    },
    {
      label: 'Created',
      render: (role) => (
        <span className="text-slate-500 text-xs">
          {role.created_at ? new Date(role.created_at).toLocaleDateString('en-IN') : '—'}
        </span>
      ),
    },
    {
      label: 'Actions',
      render: (role) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModal(role)}
            className="p-1.5 rounded-lg hover:bg-surface-hover text-slate-500 hover:text-brand-400 transition-colors"
            title="Edit role"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteTarget(role)}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
            title="Delete role"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Job Roles</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {total} roles across {departments?.length ?? 0} departments
          </p>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary">
          <Plus size={16} /> Add Role
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-brand-500/5 border border-brand-500/20 rounded-xl">
        <Layers size={16} className="text-brand-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-slate-400">
          Roles are <strong className="text-white">required</strong> when adding employees.
          Each role belongs to a department. Create all needed roles here first, then assign them in the Employees page.
        </p>
      </div>

      {/* Stats by department */}
      {departments && departments.length > 0 && allRoles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {departments
            .map((d) => ({ dept: d, count: allRoles.filter((r) => Number(r.department) === d.id).length }))
            .filter((x) => x.count > 0)
            .map(({ dept, count }) => (
              <button
                key={dept.id}
                onClick={() => setDeptFilter(deptFilter === String(dept.id) ? '' : String(dept.id))}
                className={`card p-3 text-left hover:border-brand-500/30 transition-all ${
                  deptFilter === String(dept.id) ? 'border-brand-500/40 bg-brand-500/5' : ''
                }`}
              >
                <p className="text-xs text-slate-500 truncate">{dept.name}</p>
                <p className="font-display text-xl font-bold text-white mt-0.5">{count}</p>
                <p className="text-xs text-slate-600">role{count !== 1 ? 's' : ''}</p>
              </button>
            ))}
        </div>
      )}

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search roles…"
            className="input pl-9 w-56"
          />
        </div>

        {/* Dept filter pills */}
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setDeptFilter('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              deptFilter === ''
                ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                : 'text-slate-500 hover:text-white hover:bg-surface-hover'
            }`}
          >
            All Depts
          </button>
          {departments?.map((d) => (
            <button
              key={d.id}
              onClick={() => setDeptFilter(deptFilter === String(d.id) ? '' : String(d.id))}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                deptFilter === String(d.id)
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                  : 'text-slate-500 hover:text-white hover:bg-surface-hover'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={6} />
      ) : roles.length === 0 ? (
        <div className="card p-16 text-center">
          <Layers size={36} className="mx-auto mb-4 text-slate-600" />
          <p className="text-white font-medium mb-1">No roles found</p>
          <p className="text-slate-500 text-sm mb-5">
            {search || deptFilter
              ? 'Try adjusting your filters'
              : 'Create your first job role to start assigning employees'}
          </p>
          {!search && !deptFilter && (
            <button onClick={() => setModal('create')} className="btn-primary mx-auto">
              <Plus size={15} /> Create First Role
            </button>
          )}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={roles}
          total={total}
          page={page}
          setPage={setPage}
        />
      )}

      {/* ── Create / Edit Modal ── */}
      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'Add New Role' : `Edit Role — ${modal?.title}`}
        size="sm"
      >
        <RoleForm
          defaultValues={modal !== 'create' ? { ...modal, department: String(modal?.department) } : {}}
          departments={departments}
          loading={createMutation.isPending || updateMutation.isPending}
          onSubmit={(data) =>
            modal === 'create'
              ? createMutation.mutate(data)
              : updateMutation.mutate({ id: modal.id, data })
          }
        />
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Role"
        size="sm"
      >
        <p className="text-slate-400 mb-2">
          Delete role <span className="text-white font-semibold">"{deleteTarget?.title}"</span>?
        </p>
        <p className="text-xs text-amber-400 mb-6">
          ⚠ This will fail if the role is currently assigned to any employee.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteTarget(null)} className="btn-ghost border border-surface-border">
            Cancel
          </button>
          <button
            onClick={() => deleteMutation.mutate(deleteTarget.id)}
            disabled={deleteMutation.isPending}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2"
          >
            <Trash2 size={14} />
            {deleteMutation.isPending ? 'Deleting…' : 'Delete Role'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
