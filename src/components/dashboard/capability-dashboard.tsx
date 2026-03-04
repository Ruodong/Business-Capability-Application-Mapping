import { useMemo, useState } from 'react'
import { useDataContext } from '@/store/data-context'
import { KpiCard } from './kpi-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDomainPalette } from '@/components/tree-map/constants'

export function CapabilityDashboard() {
  const { state } = useDataContext()
  const { capabilities, domains } = state
  const [domainFilter, setDomainFilter] = useState<string>('All')

  const l3Caps = useMemo(
    () => capabilities.filter((c) => c.level === 3),
    [capabilities],
  )

  const filtered = useMemo(() => {
    if (domainFilter === 'All') return l3Caps
    return l3Caps.filter((c) => c.domain === domainFilter)
  }, [l3Caps, domainFilter])

  const totalCaps = l3Caps.length
  const coveredCaps = l3Caps.filter((c) => c.applications.length > 0).length
  const coverageRate = totalCaps > 0 ? Math.round((coveredCaps / totalCaps) * 100) : 0

  const uniqueApps = useMemo(() => {
    const ids = new Set<string>()
    for (const cap of l3Caps) {
      for (const app of cap.applications) {
        ids.add(app.id)
      }
    }
    return ids.size
  }, [l3Caps])

  // Group by L1 domain, then L2 sub-domain
  const grouped = useMemo(() => {
    const l1Nodes = capabilities.filter((c) => c.level === 1)
    const l2Nodes = capabilities.filter((c) => c.level === 2)

    return l1Nodes
      .filter((l1) => domainFilter === 'All' || l1.domain === domainFilter)
      .map((l1) => {
        const l2Children = l2Nodes
          .filter((l2) => l2.parentId === l1.id)
          .map((l2) => {
            const l3Children = filtered.filter((l3) => l3.parentId === l2.id)
            return { ...l2, children: l3Children }
          })
          .filter((l2) => l2.children.length > 0)

        return { ...l1, subDomains: l2Children }
      })
      .filter((l1) => l1.subDomains.length > 0)
  }, [capabilities, filtered, domainFilter])

  return (
    <div className="flex flex-col gap-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Total Capabilities (L3)" value={totalCaps} />
        <KpiCard label="Covered" value={coveredCaps} colorClass="text-emerald-600" />
        <KpiCard label="Coverage Rate" value={`${coverageRate}%`} colorClass="text-sky-600" />
        <KpiCard label="Unique Applications" value={uniqueApps} colorClass="text-violet-600" />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="mac-select"
        >
          <option value="All">All Domains</option>
          {domains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <span className="muted">
          {filtered.length} capabilities across {grouped.length} domains
        </span>
      </div>

      {/* Domain groups */}
      {grouped.map((l1) => {
        const palette = getDomainPalette(l1.domain)
        return (
          <Card key={l1.id} className="p-4">
            <h2
              className="mb-3 inline-block rounded-lg px-3 py-1.5 text-sm font-semibold"
              style={{
                backgroundColor: palette.fill,
                color: palette.stroke,
                border: `1px solid ${palette.stroke}30`,
              }}
            >
              {l1.name}
            </h2>

            {l1.subDomains.map((l2) => (
              <div key={l2.id} className="mb-4 last:mb-0">
                <h3 className="mb-2 text-sm font-medium text-slate-700">{l2.name}</h3>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {l2.children.map((cap) => (
                    <div
                      key={cap.id}
                      className="rounded-xl border border-slate-100 bg-white/60 p-3"
                    >
                      <div className="mb-1.5 flex items-start justify-between gap-2">
                        <span className="text-xs font-medium text-slate-800">
                          {cap.name}
                        </span>
                        <Badge tone={cap.applications.length > 0 ? 'emerald' : 'slate'}>
                          {cap.applications.length}
                        </Badge>
                      </div>
                      {cap.nameCn && (
                        <p className="mb-1.5 text-xs text-slate-400">{cap.nameCn}</p>
                      )}
                      {cap.applications.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {cap.applications.map((app) => (
                            <span
                              key={app.id}
                              className="inline-block rounded px-1.5 py-0.5 text-[10px]"
                              style={{
                                backgroundColor: palette.fill,
                                color: palette.stroke,
                              }}
                            >
                              {app.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-300">No applications mapped</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        )
      })}
    </div>
  )
}
