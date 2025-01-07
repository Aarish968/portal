import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'

interface HRASavingViewProps {
  isSaving?: boolean
}

function HRASavingView({ isSaving }: HRASavingViewProps) {
  return (
    <BasePractitionerView>
      <div className=":uno: h-[calc(100vh-200px)] flex items-center justify-center">
        <Card className=":uno: w-[400px]">
          <CardContent className=":uno: p-6">
            <div className=":uno: flex flex-col items-center justify-center gap-4">
              <Loader2 className=":uno: h-8 w-8 animate-spin text-primary" />
              <div className=":uno: w-full text-center">
                <h3 className=":uno: text-xl font-medium">
                  {isSaving ? 'Saving Progress' : 'Loading HRA'}
                </h3>
                <div className=":uno: text-muted-foreground">
                  {isSaving ? 'Please wait while we save your changes...' : 'Please wait while we load your HRA...'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BasePractitionerView>
  )
}

export default HRASavingView
