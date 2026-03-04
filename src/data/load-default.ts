import type { ExcelRow, DataState } from '@/types'
import { buildHierarchy } from './hierarchy'
import defaultRows from './default-data.json'

export function loadDefaultData(): DataState {
  return buildHierarchy(defaultRows as ReadonlyArray<ExcelRow>)
}
