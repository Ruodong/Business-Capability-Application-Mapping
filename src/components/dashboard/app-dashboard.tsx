import { useMemo, useState } from 'react'
import { useDataContext } from '@/store/data-context'
import { KpiCard } from './kpi-card'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { getDomainPalette } from '@/components/tree-map/constants'

const DOMAIN_TONE_MAP: Record<string, 'blue' | 'cyan' | 'violet' | 'yellow' | 'green' | 'red' | 'orange' | 'slate'> = {
  Sales: 'blue',
  Service: 'cyan',
  Finance: 'violet',
  'Intelligent Operation': 'yellow',
  DTIT: 'green',
  'Product Development': 'red',
  Marketing: 'orange',
}

function getTone(domain: string) {
  return DOMAIN_TONE_MAP[domain] ?? 'slate'
}

const PORTFOLIO_TONE_MAP: Record<string, 'violet' | 'blue' | 'emerald' | 'amber'> = {
  Invest: 'violet',
  Run: 'blue',
  Grow: 'emerald',
}

function getPortfolioTone(portfolio: string) {
  return PORTFOLIO_TONE_MAP[portfolio] ?? 'amber'
}

export function AppDashboard() {
  const { state } = useDataContext()
  const { applications } = state
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const statuses = useMemo(
    () => ['All', ...new Set(applications.map((a) => a.appStatus).filter(Boolean))],
    [applications],
  )

  const filtered = useMemo(() => {
    let list = [...applications]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (a) =>
          a.appName.toLowerCase().includes(q) ||
          a.appSolutionOwner.toLowerCase().includes(q),
      )
    }
    if (statusFilter !== 'All') {
      list = list.filter((a) => a.appStatus === statusFilter)
    }
    return list
  }, [applications, search, statusFilter])

  const activeCount = applications.filter((a) => a.appStatus === 'Active').length
  const plannedCount = applications.filter((a) => a.appStatus === 'Planned').length
  const totalMappings = applications.reduce((sum, a) => sum + a.capabilities.length, 0)

  return (
    <div className="flex flex-col gap-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Total Applications" value={applications.length} />
        <KpiCard label="Active" value={activeCount} colorClass="text-emerald-600" />
        <KpiCard label="Planned" value={plannedCount} colorClass="text-sky-600" />
        <KpiCard label="Total Mappings" value={totalMappings} colorClass="text-violet-600" />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search applications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mac-input w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="mac-select"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="muted">
          {filtered.length} of {applications.length} applications
        </span>
      </div>

      {/* App cards */}
      <div className="grid gap-3">
        {filtered.map((app) => (
          <Card key={app.appId} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{app.appName}</h3>
                <p className="muted">
                  {app.appId} &middot; {app.appSolutionOwner || 'No owner'} &middot;{' '}
                  {app.appSolutionType}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge tone={app.appStatus === 'Active' ? 'emerald' : app.appStatus === 'Planned' ? 'blue' : 'amber'}>
                  {app.appStatus}
                </Badge>
                {app.geo && <Badge tone="cyan">{app.geo}</Badge>}
                {app.portfolioMgt && (
                  <Badge tone={getPortfolioTone(app.portfolioMgt)}>{app.portfolioMgt}</Badge>
                )}
              </div>
            </div>

            {app.capabilities.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {app.capabilities.map((cap) => (
                  <span
                    key={cap.bcId}
                    className="inline-block rounded-md px-2 py-1 text-xs"
                    style={{
                      backgroundColor: getDomainPalette(cap.lv1Domain).fill,
                      color: getDomainPalette(cap.lv1Domain).stroke,
                      border: `1px solid ${getDomainPalette(cap.lv1Domain).stroke}30`,
                    }}
                  >
                    {cap.bcName}
                  </span>
                ))}
              </div>
            )}

            {app.bizFunction && (
              <div className="mt-2 text-xs text-slate-400">
                Function: {app.bizFunction}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
