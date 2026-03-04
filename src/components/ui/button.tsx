import { cn } from '@/utils/cn'

type ButtonVariant = 'default' | 'outline' | 'destructive' | 'link'

const variantMap: Record<ButtonVariant, string> = {
  default:
    'bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:bg-slate-950',
  outline:
    'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100',
  destructive:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800',
  link: 'text-sky-600 underline-offset-4 hover:underline p-0',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant
}

export function Button({ variant = 'default', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 disabled:pointer-events-none disabled:opacity-50',
        variantMap[variant],
        className,
      )}
      {...props}
    />
  )
}
