import { Network } from 'lucide-react'
import { ExcelUpload } from '@/components/upload/excel-upload'
import { useDataContext } from '@/store/data-context'

export function Header() {
  const { error, clearError } = useDataContext()

  return (
    <header className="panel flex items-center justify-between px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100">
          <Network className="h-5 w-5 text-sky-700" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-900">
            Business Capability Mapping
          </h1>
          <p className="text-xs text-slate-500">Enterprise Architecture</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-700">
            <span>{error}</span>
            <button onClick={clearError} className="font-medium hover:underline">
              Dismiss
            </button>
          </div>
        )}
        <ExcelUpload />
      </div>
    </header>
  )
}
