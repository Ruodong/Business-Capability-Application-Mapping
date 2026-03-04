import { useCallback, useRef } from 'react'
import { Upload } from 'lucide-react'
import { useDataContext } from '@/store/data-context'
import { Button } from '@/components/ui/button'

export function ExcelUpload() {
  const { loadExcel, isLoading } = useDataContext()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (evt) => {
        const buffer = evt.target?.result as ArrayBuffer
        loadExcel(buffer)
      }
      reader.readAsArrayBuffer(file)

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [loadExcel],
  )

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        {isLoading ? 'Processing...' : 'Upload Excel'}
      </Button>
    </>
  )
}
