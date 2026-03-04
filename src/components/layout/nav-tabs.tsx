import { GitFork, LayoutList, Network } from 'lucide-react'
import { cn } from '@/utils/cn'

const TABS = [
  { label: 'Relationship Tree', hash: '#/tree-map', icon: GitFork },
  { label: 'Applications', hash: '#/applications', icon: LayoutList },
  { label: 'Capabilities', hash: '#/capabilities', icon: Network },
] as const

interface NavTabsProps {
  readonly currentHash: string
  readonly onNavigate: (hash: string) => void
}

export function NavTabs({ currentHash, onNavigate }: NavTabsProps) {
  return (
    <nav className="flex gap-1 rounded-xl bg-slate-100/80 p-1">
      {TABS.map((tab) => {
        const active = currentHash === tab.hash
        const Icon = tab.icon
        return (
          <button
            key={tab.hash}
            onClick={() => onNavigate(tab.hash)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition',
              active
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
