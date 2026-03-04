import * as XLSX from 'xlsx'
import type { ExcelRow } from '@/types'

const REQUIRED_HEADERS = [
  'appId', 'appName', 'appStatus',
  'lv1Domain', 'lv2SubDomain',
  'bcId', 'bcName', 'parentBcId',
]

function str(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

function num(value: unknown): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export function parseExcelBuffer(buffer: ArrayBuffer): ReadonlyArray<ExcelRow> {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) {
    throw new Error('Excel file contains no sheets')
  }

  const sheet = workbook.Sheets[sheetName]
  const jsonRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

  if (jsonRows.length === 0) {
    throw new Error('Excel sheet is empty')
  }

  const allKeys = new Set<string>()
  for (const row of jsonRows) {
    for (const key of Object.keys(row)) {
      allKeys.add(key)
    }
  }
  const missing = REQUIRED_HEADERS.filter((h) => !allKeys.has(h))
  if (missing.length > 0) {
    throw new Error(`Missing required columns: ${missing.join(', ')}`)
  }

  return jsonRows
    .filter((row) => str(row.appId) && str(row.bcId))
    .map((row) => ({
      appId: str(row.appId),
      appName: str(row.appName),
      appOwnership: str(row.appOwnership),
      appSolutionOwner: str(row.appSolutionOwner),
      appDtOwner: str(row.appDtOwner),
      portfolioMgt: str(row.portfolioMgt),
      appSolutionType: str(row.appSolutionType),
      appClassification: str(row.appClassification),
      appStatus: str(row.appStatus),
      bizFunction: str(row.bizFunction),
      lv1Domain: str(row.lv1Domain),
      lv2SubDomain: str(row.lv2SubDomain),
      lv3CapGroup: str(row.lv3CapGroup),
      bcId: str(row.bcId),
      bcName: str(row.bcName),
      parentBcId: str(row.parentBcId),
      bcNameCn: str(row.bcNameCn),
      level: num(row.level),
      alias: str(row.alias),
      bcDesc: str(row.bcDesc),
      bizGroup: str(row.bizGroup),
      geo: str(row.geo),
      dataVersion: str(row.dataVersion),
      createBy: str(row.createBy),
      createAt: str(row.createAt),
    }))
}
