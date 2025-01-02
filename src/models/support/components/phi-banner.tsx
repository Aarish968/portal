import { Alert } from '@/base_submod/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

export function PhiBanner() {
  return (
    <Alert variant="destructive">
      <div className=":uno: flex items-center gap-2">
        <AlertTriangle className="mb-1 h-5 w-5" />
        <span className=":uno: font-semibold">
          Do not submit any PHI or other sensitive information
        </span>
      </div>
    </Alert>
  )
}
