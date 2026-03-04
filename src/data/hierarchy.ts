import type { ExcelRow, CapNode, Application, CapRef, MappingRow, AppRef, DataState } from '@/types'

function uniqueBy<T, K>(items: ReadonlyArray<T>, keyFn: (item: T) => K): T[] {
  const seen = new Set<K>()
  const result: T[] = []
  for (const item of items) {
    const key = keyFn(item)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }
  return result
}

function collectApps(rows: ReadonlyArray<ExcelRow>): ReadonlyArray<AppRef> {
  return uniqueBy(
    rows.map((r) => ({ id: r.appId, name: r.appName, status: r.appStatus })),
    (a) => a.id,
  )
}

export function buildHierarchy(rows: ReadonlyArray<ExcelRow>): DataState {
  const validRows = rows.filter((r) => r.lv1Domain && r.bcId)

  // --- L1 nodes: unique lv1Domain values ---
  const l1DomainNames = [...new Set(validRows.map((r) => r.lv1Domain))].sort(
    (a, b) => a.localeCompare(b, 'en'),
  )

  const l1Nodes: CapNode[] = l1DomainNames.map((domain) => {
    const id = `L1-${domain}`
    // Only apps explicitly mapped to this L1 node's own bcId (not bubbled up from children)
    const directRows = validRows.filter((r) => r.lv1Domain === domain && r.bcId === id)
    return {
      id,
      name: domain,
      nameCn: '',
      level: 1 as const,
      parentId: null,
      domain,
      description: '',
      appCount: collectApps(directRows).length,
      applications: collectApps(directRows),
    }
  })

  // --- L2 nodes: unique (lv1Domain, lv2SubDomain) pairs ---
  const l2Pairs = uniqueBy(
    validRows.map((r) => ({ domain: r.lv1Domain, subDomain: r.lv2SubDomain, parentBcId: r.parentBcId })),
    (p) => `${p.domain}|${p.subDomain}`,
  )

  const l2Nodes: CapNode[] = l2Pairs.map((pair) => {
    const id = pair.parentBcId || `L2-${pair.domain}-${pair.subDomain}`
    // Only apps explicitly mapped to this L2 node's own bcId (not bubbled up from L3 children)
    const directRows = validRows.filter(
      (r) => r.lv1Domain === pair.domain && r.lv2SubDomain === pair.subDomain && r.bcId === id,
    )
    return {
      id,
      name: pair.subDomain,
      nameCn: '',
      level: 2 as const,
      parentId: `L1-${pair.domain}`,
      domain: pair.domain,
      description: '',
      appCount: collectApps(directRows).length,
      applications: collectApps(directRows),
    }
  })

  // --- L3 nodes: unique bcId values ---
  const l3Groups = uniqueBy(validRows, (r) => r.bcId)

  const l3Nodes: CapNode[] = l3Groups.map((row) => {
    const bcRows = validRows.filter((r) => r.bcId === row.bcId)
    const l2Parent = l2Nodes.find(
      (n) => n.domain === row.lv1Domain && n.name === row.lv2SubDomain,
    )
    return {
      id: row.bcId,
      name: row.bcName,
      nameCn: row.bcNameCn || '',
      level: 3 as const,
      parentId: l2Parent?.id ?? null,
      domain: row.lv1Domain,
      description: row.bcDesc || '',
      appCount: collectApps(bcRows).length,
      applications: collectApps(bcRows),
    }
  })

  // --- Applications ---
  const appGroups = uniqueBy(validRows, (r) => r.appId)

  const applications: Application[] = appGroups.map((row) => {
    const appRows = validRows.filter((r) => r.appId === row.appId)
    const capabilities: CapRef[] = uniqueBy(appRows, (r) => r.bcId).map((r) => ({
      bcId: r.bcId,
      bcName: r.bcName,
      lv1Domain: r.lv1Domain,
      lv2SubDomain: r.lv2SubDomain,
      lv3CapGroup: r.lv3CapGroup,
    }))

    return {
      appId: row.appId,
      appName: row.appName,
      appOwnership: row.appOwnership,
      appSolutionOwner: row.appSolutionOwner,
      appDtOwner: row.appDtOwner,
      portfolioMgt: row.portfolioMgt,
      appSolutionType: row.appSolutionType,
      appClassification: row.appClassification,
      appStatus: row.appStatus,
      bizFunction: row.bizFunction,
      geo: row.geo,
      capabilities,
    }
  })

  // --- Mappings ---
  const mappings: MappingRow[] = uniqueBy(
    validRows.map((r) => ({ appId: r.appId, bcId: r.bcId })),
    (m) => `${m.appId}|${m.bcId}`,
  )

  const capabilities = [...l1Nodes, ...l2Nodes, ...l3Nodes]
  const domains = l1DomainNames

  return {
    capabilities,
    applications,
    mappings,
    domains,
    dataVersion: validRows[0]?.dataVersion || '1.0',
  }
}
