import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Briefcase, Users, MapPin, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { jobOpeningApi, candidateApi, applicationApi, departmentApi } from '../../api/index'
import Modal from '../../components/ui/Modal'
import { SkeletonCard } from '../../components/ui/Skeleton'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'

const STAGE_COLORS = { applied: 'blue', interview: 'yellow', offered: 'green', hired: 'green', rejected: 'red' }

export default function Recruitment() {
  const qc = useQueryClient()
  const [tab, setTab] = useState('openings')
  const [jobModal, setJobModal] = useState(false)
  const [appModal, setAppModal] = useState(false)
  const [page, setPage] = useState(1)

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['job-openings'],
    queryFn: () => jobOpeningApi.list(),
    select: (r) => r.data?.results ?? r.data ?? [],
  })

  const { data: candidates, isLoading: candsLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => candidateApi.list(),
    select: (r) => r.data?.results ?? r.data ?? [],
  })

  const { data: appData } = useQuery({
    queryKey: ['applications', page],
    queryFn: () => applicationApi.list({ page }),
    select: (r) => r.data,
  })

  const { data: depts } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentApi.list(),
    select: (r) => r.data?.results ?? r.data ?? [],
  })

  const applications = appData?.results ?? appData ?? []

  const { register: regJob, handleSubmit: hsJob, reset: resetJob } = useForm()
  const { register: regApp, handleSubmit: hsApp, reset: resetApp } = useForm()

  const createJobMutation = useMutation({
    mutationFn: (d) => jobOpeningApi.create(d),
    onSuccess: () => { qc.invalidateQueries(['job-openings']); setJobModal(false); resetJob(); toast.success('Job opening created') },
  })

  const createAppMutation = useMutation({
    mutationFn: (d) => applicationApi.create(d),
    onSuccess: () => { qc.invalidateQueries(['applications']); setAppModal(false); resetApp(); toast.success('Application added') },
  })

  const updateAppMutation = useMutation({
    mutationFn: ({ id, stage }) => applicationApi.update(id, { stage }),
    onSuccess: () => { qc.invalidateQueries(['applications']); toast.success('Stage updated') },
  })

  const TABS = ['openings', 'candidates', 'applications']

  const appColumns = [
    { label: 'Candidate', render: (a) => <span className="text-slate-300">{a.candidate}</span> },
    { label: 'Opening',   render: (a) => <span className="text-slate-300">{a.opening}</span> },
    {
      label: 'Stage',
      render: (a) => <Badge variant={STAGE_COLORS[a.stage] ?? 'gray'}>{a.stage}</Badge>,
    },
    {
      label: 'Move to',
      render: (a) => {
        const stages = ['applied', 'interview', 'offered', 'hired', 'rejected']
        const idx = stages.indexOf(a.stage)
        const next = stages[idx + 1]
        return next ? (
          <button onClick={() => updateAppMutation.mutate({ id: a.id, stage: next })}
            className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
            → {next}
          </button>
        ) : <CheckCircle size={14} className="text-emerald-400" />
      },
    },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Recruitment</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage openings, candidates & applications</p>
        </div>
        <div className="flex gap-2">
          {tab === 'openings' && <button onClick={() => setJobModal(true)} className="btn-primary"><Plus size={16} /> Post Job</button>}
          {tab === 'applications' && <button onClick={() => setAppModal(true)} className="btn-primary"><Plus size={16} /> Add Application</button>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open Positions', value: jobs?.filter((j) => j.is_open).length ?? 0,    icon: Briefcase, color: 'text-brand-400' },
          { label: 'Candidates',     value: candidates?.length ?? 0,                         icon: Users,     color: 'text-emerald-400' },
          { label: 'Applications',   value: applications?.length ?? 0,                       icon: CheckCircle, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <Icon size={20} className={color} />
            <div>
              <p className={`font-display text-xl font-bold text-white`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-card rounded-xl p-1 w-fit border border-surface-border">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              tab === t ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >{t}</button>
        ))}
      </div>

      {/* Job Openings */}
      {tab === 'openings' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobsLoading ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />) :
            jobs?.map((job) => (
              <div key={job.id} className="card p-5 hover:border-brand-500/30 transition-all hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <Briefcase size={16} className="text-brand-400" />
                  </div>
                  <Badge variant={job.is_open ? 'green' : 'gray'}>{job.is_open ? 'Open' : 'Closed'}</Badge>
                </div>
                <h3 className="font-semibold text-white">{job.title}</h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                  <MapPin size={11} /> {job.location}
                </div>
                <p className="text-xs text-slate-600 mt-3">{new Date(job.created_at).toLocaleDateString()}</p>
              </div>
            ))
          }
        </div>
      )}

      {/* Candidates */}
      {tab === 'candidates' && (
        <DataTable
          loading={candsLoading}
          data={candidates}
          columns={[
            { label: 'Name',  key: 'full_name' },
            { label: 'Email', key: 'email' },
            { label: 'Phone', key: 'phone' },
            { label: 'Applied', render: (c) => new Date(c.created_at).toLocaleDateString() },
          ]}
        />
      )}

      {/* Applications */}
      {tab === 'applications' && (
        <DataTable columns={appColumns} data={applications} total={appData?.count} page={page} setPage={setPage} />
      )}

      {/* Job Modal */}
      <Modal open={jobModal} onClose={() => setJobModal(false)} title="Post Job Opening" size="sm">
        <form onSubmit={hsJob((d) => createJobMutation.mutate({ ...d, is_open: true }))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Job Title</label>
            <input {...regJob('title', { required: true })} className="input" placeholder="Senior Engineer" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Department</label>
              <select {...regJob('department', { required: true })} className="input">
                <option value="">Select</option>
                {depts?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Location</label>
              <input {...regJob('location', { required: true })} className="input" placeholder="Remote / City" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={createJobMutation.isPending} className="btn-primary">
              {createJobMutation.isPending ? 'Posting…' : 'Post Job'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Application Modal */}
      <Modal open={appModal} onClose={() => setAppModal(false)} title="Add Application" size="sm">
        <form onSubmit={hsApp((d) => createAppMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Job Opening ID</label>
            <input {...regApp('opening', { required: true })} type="number" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Candidate ID</label>
            <input {...regApp('candidate', { required: true })} type="number" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Stage</label>
            <select {...regApp('stage')} className="input">
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={createAppMutation.isPending} className="btn-primary">
              {createAppMutation.isPending ? 'Adding…' : 'Add Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
