const VARIANTS = {
  green:  'badge-green',
  yellow: 'badge-yellow',
  red:    'badge-red',
  blue:   'badge-blue',
  gray:   'badge-gray',
  // Status mappings
  active:    'badge-green',
  on_leave:  'badge-yellow',
  exited:    'badge-gray',
  approved:  'badge-green',
  pending:   'badge-yellow',
  rejected:  'badge-red',
  applied:   'badge-blue',
  interview: 'badge-yellow',
  offered:   'badge-green',
  hired:     'badge-green',
  open:      'badge-green',
  closed:    'badge-gray',
}

export default function Badge({ variant = 'gray', children }) {
  const cls = VARIANTS[variant] ?? VARIANTS.gray
  return <span className={cls}>{children}</span>
}

export function StatusBadge({ status }) {
  const LABELS = {
    active: 'Active', on_leave: 'On Leave', exited: 'Exited',
    approved: 'Approved', pending: 'Pending', rejected: 'Rejected',
    applied: 'Applied', interview: 'Interview', offered: 'Offered', hired: 'Hired',
  }
  return <Badge variant={status}>{LABELS[status] ?? status}</Badge>
}
