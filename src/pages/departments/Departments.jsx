import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Building2, Edit2, Trash2, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { departmentApi, roleApi } from '../../api/index'
import Modal from '../../components/ui/Modal'
import { SkeletonCard } from '../../components/ui/Skeleton'

function DeptForm({ onSubmit, defaultValues, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Department Name</label>
        <input {...register('name', { required: 'Required' })} className="input" placeholder="Engineering" />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Department Code</label>
        <input {...register('code', { required: 'Required' })} className="input" placeholder="ENG" />
        {errors.code && <p className="text-red-400 text-xs mt-1">{errors.code.message}</p>}
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving…' : 'Save Department'}</button>
      </div>
    </form>
  )
}

function RoleForm({ onSubmit, departmentId, loading }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  return (
    <form onSubmit={handleSubmit((d) => { onSubmit({ ...d, department: departmentId }); reset() })} className="flex gap-2 mt-3">
      <input
        {...register('title', { required: true })}
        className="input flex-1 text-sm py-2"
        placeholder="e.g. Senior Engineer"
      />
      <button type="submit" disabled={loading} className="btn-primary py-2 text-sm whitespace-nowrap">
        {loading ? '…' : <><Plus size={14} /> Add Role</>}
      </button>
    </form>
  )
}

export default function Departments() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [expandedDept, setExpandedDept] = useState(null)

  const { data: depts, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentApi.list(),
    select: (r) => r.data?.results ?? r.data ?? [],
  })

  const { data: allRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleApi.list(),
    select: (r) => r.data?.results ?? r.data ?? [],
  })

  const deptRoles = (deptId) => (allRoles ?? []).filter((r) => Number(r.department) === Number(deptId))

  const createDept = useMutation({
    mutationFn: (d) => departmentApi.create(d),
    onSuccess: () => { qc.invalidateQueries(['departments']); setModal(null); toast.success('Department created') },
    onError: (e) => toast.error(e.response?.data?.name?.[0] ?? 'Failed'),
  })

  const updateDept = useMutation({
    mutationFn: ({ id, data }) => departmentApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['departments']); setModal(null); toast.success('Department updated') },
  })

  const deleteDept = useMutation({
    mutationFn: (id) => departmentApi.remove(id),
    onSuccess: () => { qc.invalidateQueries(['departments']); setDeleteTarget(null); toast.success('Deleted') },
    onError: () => toast.error('Cannot delete — department may have employees assigned'),
  })

  const createRole = useMutation({
    mutationFn: (d) => roleApi.create(d),
    onSuccess: () => { qc.invalidateQueries(['roles']); toast.success('Role added') },
    onError: (e) => toast.error(e.response?.data?.non_field_errors?.[0] ?? 'Failed to add role'),
  })

  const deleteRole = useMutation({
    mutationFn: (id) => roleApi.remove(id),
    onSuccess: () => { qc.invalidateQueries(['roles']); toast.success('Role removed') },
    onError: () => toast.error('Cannot delete — role may have employees assigned'),
  })

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="text-slate-500 text-sm mt-0.5">{depts?.length ?? 0} departments · {allRoles?.length ?? 0} roles</p>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary">
          <Plus size={16} /> Add Department
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-brand-500/5 border border-brand-500/20 rounded-xl text-sm text-slate-400">
        <Building2 size={16} className="text-brand-400 flex-shrink-0 mt-0.5" />
        <span>Expand a department to manage its <strong className="text-white">Job Roles</strong>. Roles must exist here before they can be assigned to employees.</span>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {depts?.length === 0 ? (
            <div className="card p-16 text-center text-slate-500">
              <Building2 size={32} className="mx-auto mb-3 text-slate-600" />
              No departments yet. Create one to get started.
            </div>
          ) : depts.map((dept) => {
            const roles = deptRoles(dept.id)
            const isOpen = expandedDept === dept.id

            return (
              <div key={dept.id} className="card overflow-hidden hover:border-brand-500/20 transition-all">
                {/* Dept header row */}
                <div className="flex items-center gap-4 p-5">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                    <Building2 size={18} className="text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-white">{dept.name}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-500 font-mono">{dept.code}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Users size={11} /> {roles.length} role{roles.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setModal(dept)}
                      className="p-1.5 rounded-lg hover:bg-surface-hover text-slate-500 hover:text-brand-400 transition-colors"
                      title="Edit department"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(dept)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete department"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => setExpandedDept(isOpen ? null : dept.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-surface-hover text-slate-400 hover:text-white transition-colors text-xs font-medium"
                    >
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {isOpen ? 'Hide roles' : 'Manage roles'}
                    </button>
                  </div>
                </div>

                {/* Expandable roles section */}
                {isOpen && (
                  <div className="border-t border-surface-border p-5 bg-surface/50">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Job Roles</p>

                    {roles.length === 0 ? (
                      <p className="text-sm text-slate-600 mb-3">No roles yet — add one below.</p>
                    ) : (
                      <div className="space-y-2 mb-3">
                        {roles.map((role) => (
                          <div key={role.id} className="flex items-center justify-between px-3 py-2 bg-surface-hover rounded-xl group">
                            <div>
                              <span className="text-sm text-white font-medium">{role.title}</span>
                              {role.description && (
                                <p className="text-xs text-slate-500 mt-0.5">{role.description}</p>
                              )}
                            </div>
                            <button
                              onClick={() => deleteRole.mutate(role.id)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"
                              title="Remove role"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add role inline form */}
                    <RoleForm
                      departmentId={dept.id}
                      loading={createRole.isPending}
                      onSubmit={(d) => createRole.mutate(d)}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit Department */}
      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'create' ? 'New Department' : 'Edit Department'} size="sm">
        <DeptForm
          defaultValues={modal !== 'create' ? modal : {}}
          loading={createDept.isPending || updateDept.isPending}
          onSubmit={(data) => modal === 'create' ? createDept.mutate(data) : updateDept.mutate({ id: modal.id, data })}
        />
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Department" size="sm">
        <p className="text-slate-400 mb-6">
          Delete <span className="text-white font-medium">{deleteTarget?.name}</span>?
          <br />
          <span className="text-xs text-amber-400 mt-1 block">Note: departments with active employees cannot be deleted.</span>
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteTarget(null)} className="btn-ghost border border-surface-border">Cancel</button>
          <button
            onClick={() => deleteDept.mutate(deleteTarget.id)}
            disabled={deleteDept.isPending}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium px-4 py-2 rounded-xl text-sm transition-all"
          >
            {deleteDept.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
