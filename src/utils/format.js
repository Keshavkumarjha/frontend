// Currency formatter — INR (Indian Rupee)
export const fmtINR = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(parseFloat(value ?? 0))

export const fmtINRShort = (value) => {
  const v = parseFloat(value ?? 0)
  if (v >= 1000000) return `₹${(v / 100000).toFixed(1)}L`
  if (v >= 1000)    return `₹${(v / 1000).toFixed(0)}K`
  return `₹${v.toFixed(0)}`
}
