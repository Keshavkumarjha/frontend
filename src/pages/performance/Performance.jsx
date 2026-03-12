import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { performanceApi } from '../../api/index'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { SkeletonTable } from '../../components/ui/Skeleton'

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={13} className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} />
    ))}
  </div>
)

export default function Performance() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(false)

  const { data: reviewData, isLoading } = useQuery({
    queryKey: ['reviews', page],
    queryFn: () => performanceApi.list({ page }),
    select: (r) => r.data,
  })

  const reviews = reviewData?.results ?? reviewData ?? []
  const total   = reviewData?.count ?? reviews.length
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const createMutation = useMutation({
    mutationFn: (d) => performanceApi.create(d),
    onSuccess: () => { qc.invalidateQueries(['reviews']); setModal(false); reset(); toast.success('Review submitted') },
    onError: (e) => toast.error(e.response?.data?.non_field_errors?.[0] ?? 'Failed'),
  })

  const columns = [
    { label: 'Employee',      render: (r) => <span className="text-brand-400 font-mono text-xs">{r.employee}</span> },
    { label: 'Reviewer',      render: (r) => <span className="text-slate-300">{r.reviewer}</span> },
    { label: 'Period',        key: 'review_period' },
    { label: 'Rating',        render: (r) => <StarRating rating={r.rating} /> },
    { label: 'Comments',      render: (r) => <span className="text-slate-400 text-xs line-clamp-1 max-w-xs">{r.comments || '—'}</span> },
    { label: 'Date',          render: (r) => <span className="text-slate-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</span> },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Performance Reviews</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} reviews submitted</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> Add Review</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <p className="font-display text-3xl font-bold text-amber-400">{avgRating}</p>
          <div className="flex justify-center mt-1 mb-1">
            {avgRating !== '—' && <StarRating rating={Math.round(parseFloat(avgRating))} />}
          </div>
          <p className="text-xs text-slate-500">Average Rating</p>
        </div>
        <div className="card p-5 text-center">
          <p className="font-display text-3xl font-bold text-white">{reviews.filter((r) => r.rating >= 4).length}</p>
          <p className="text-xs text-slate-500 mt-1">High Performers (4–5★)</p>
        </div>
        <div className="card p-5 text-center">
          <p className="font-display text-3xl font-bold text-white">{total}</p>
          <p className="text-xs text-slate-500 mt-1">Total Reviews</p>
        </div>
      </div>

      {isLoading ? <SkeletonTable /> : <DataTable columns={columns} data={reviews} total={total} page={page} setPage={setPage} />}

      <Modal open={modal} onClose={() => setModal(false)} title="Submit Performance Review">
        <form onSubmit={handleSubmit((d) => createMutation.mutate({ ...d, rating: parseInt(d.rating) }))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Employee ID</label>
              <input {...register('employee', { required: true })} type="number" className="input" />
              {errors.employee && <p className="text-red-400 text-xs mt-1">Required</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Reviewer ID</label>
              <input {...register('reviewer', { required: true })} type="number" className="input" />
              {errors.reviewer && <p className="text-red-400 text-xs mt-1">Required</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Review Period</label>
              <input {...register('review_period', { required: true })} className="input" placeholder="Q1-2024" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Rating (1–5)</label>
              <select {...register('rating', { required: true })} className="input">
                <option value="">Select rating</option>
                {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Comments</label>
            <textarea {...register('comments')} className="input resize-none" rows={3} placeholder="Detailed review comments…" />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={createMutation.isPending} className="btn-primary">
              {createMutation.isPending ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
