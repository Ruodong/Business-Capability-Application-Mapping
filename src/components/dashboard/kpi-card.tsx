import { cn } from '@/utils/cn'

interface KpiCardProps {
  readonly label: string
  readonly value: string | number
  readonly colorClass?: string
}

export function KpiCard({ label, value, colorClass = 'text-slate-900' }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <p className="muted mb-1">{label}</p>
      <p className={cn('text-2xl font-bold tracking-tight', colorClass)}>{value}</p>
    </div>
  )
}
