import { ChevronLeft, ChevronRight } from 'lucide-react'
import Spinner from './Spinner'

export default function DataTable({ columns, data, loading, page, setPage, total, pageSize = 10 }) {
  const totalPages = Math.ceil((total ?? data?.length ?? 0) / pageSize)

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="flex items-center justify-center h-48">
          <Spinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              {columns.map((col) => (
                <th key={col.key ?? col.label} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(!data || data.length === 0) ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-slate-500">
                  No records found
                </td>
              </tr>
            ) : data.map((row, i) => (
              <tr key={row.id ?? i} className="border-b border-surface-border last:border-0 hover:bg-surface-hover transition-colors">
                {columns.map((col) => (
                  <td key={col.key ?? col.label} className="px-4 py-3 text-slate-300">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border">
          <p className="text-xs text-slate-500">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total ?? data?.length)} of {total ?? data?.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-lg hover:bg-surface-hover disabled:opacity-40 text-slate-400"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 text-sm text-white">{page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-lg hover:bg-surface-hover disabled:opacity-40 text-slate-400"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
