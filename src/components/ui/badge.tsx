import { cn } from '@/utils/cn'

type BadgeTone = 'slate' | 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan' | 'yellow' | 'red' | 'green' | 'orange'

const toneMap: Record<BadgeTone, string> = {
  slate: 'bg-slate-100/80 text-slate-700 border-slate-200/60',
  blue: 'bg-blue-100/80 text-blue-700 border-blue-200/60',
  emerald: 'bg-emerald-100/80 text-emerald-700 border-emerald-200/60',
  amber: 'bg-amber-100/80 text-amber-700 border-amber-200/60',
  rose: 'bg-rose-100/80 text-rose-700 border-rose-200/60',
  violet: 'bg-violet-100/80 text-violet-700 border-violet-200/60',
  cyan: 'bg-cyan-100/80 text-cyan-700 border-cyan-200/60',
  yellow: 'bg-yellow-100/80 text-yellow-700 border-yellow-200/60',
  red: 'bg-red-100/80 text-red-700 border-red-200/60',
  green: 'bg-green-100/80 text-green-700 border-green-200/60',
  orange: 'bg-orange-100/80 text-orange-700 border-orange-200/60',
}

interface BadgeProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly tone?: BadgeTone
}

export function Badge({ children, className, tone = 'slate' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
