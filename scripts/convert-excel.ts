import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface RawRow {
  appId: string
  appName: string
  appOwnership: string
  appSolutionOwner: string
  appDtOwner: string
  portfolioMgt: string
  appSolutionType: string
  appClassification: string
  appStatus: string
  bizFunction: string
  lv1Domain: string
  lv2SubDomain: string
  lv3CapGroup: string
  bcId: string
  bcName: string
  parentBcId: string
  bcNameCn: string
  level: number
  alias: string
  bcDesc: string
  bizGroup: string
  geo: string
  dataVersion: string
  createBy: string
  createAt: string
}

function str(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

function num(value: unknown): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const excelPath = process.argv[2] || path.resolve(
  process.env.HOME || '',
  'Downloads/Business_Capability_Mapping_2026-3-4.xlsx',
)

const outputPath = path.resolve(__dirname, '../src/data/default-data.json')

const buffer = fs.readFileSync(excelPath)
const workbook = XLSX.read(buffer, { type: 'buffer' })
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const jsonRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

const rows: RawRow[] = jsonRows
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

fs.writeFileSync(outputPath, JSON.stringify(rows, null, 2), 'utf-8')

// eslint-disable-next-line no-console
console.log(`Converted ${rows.length} rows to ${outputPath}`)
