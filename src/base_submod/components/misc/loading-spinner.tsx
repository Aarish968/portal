import { Loader2 } from 'lucide-react'

function LoadingSpinner() {
  return (
    <div className=":uno: fixed inset-0 flex items-center justify-center bg-background/10 backdrop-blur-sm">
      <Loader2 className=":uno: h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default LoadingSpinner
