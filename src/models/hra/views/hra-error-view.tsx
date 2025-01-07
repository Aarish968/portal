import { Button } from '@/base_submod/components/ui/button'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'

interface HRAErrorViewProps {
  error: string
  onBack: () => void
}

function HRAErrorView({ error, onBack }: HRAErrorViewProps) {
  return (
    <BasePractitionerView>
      <div className=":uno: h-[calc(100vh-200px)] flex items-center justify-center">
        <Card className=":uno: w-[400px]">
          <CardContent className=":uno: p-6">
            <div className=":uno: flex flex-col items-center justify-center gap-4">
              <div className=":uno: w-full text-center">
                <h3 className=":uno: mb-2 text-xl text-destructive font-medium">Error Occurred</h3>
                <div className=":uno: text-muted-foreground">{error}</div>
              </div>
              <Button onClick={onBack}>Back to HRA Activity</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </BasePractitionerView>
  )
}

export default HRAErrorView
