import { Button } from '@/base_submod/components/ui/button'
import { Card, CardContent } from '@/base_submod/components/ui/card'

function MemberSearchLoadingCard() {
  return (
    <Card className=":uno: mt-6 flex items-center justify-center rounded-5 bg-white">
      <CardContent className=":uno: pt-6">
        <div className=":uno: flex flex-col gap-4">
          <p className=":uno: font-sans">Please wait while we find your member...</p>
          <div className=":uno: flex justify-center">
            <Button variant="secondary">Cancel</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MemberSearchLoadingCard
