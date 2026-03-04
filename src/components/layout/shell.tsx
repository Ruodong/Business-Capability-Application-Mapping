import type { ReactNode } from 'react'
import { Header } from './header'
import { NavTabs } from './nav-tabs'

interface ShellProps {
  readonly currentHash: string
  readonly onNavigate: (hash: string) => void
  readonly children: ReactNode
}

export function Shell({ currentHash, onNavigate, children }: ShellProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6">
      <Header />
      <NavTabs currentHash={currentHash} onNavigate={onNavigate} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
