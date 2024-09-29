import BounceMenu from './BounceMenu'
import { Button } from '@/base_submod/components/ui/button'

function BounceMenuView() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col items-center gap-2">
        <h1>Bounce Menu</h1>
        <Button asChild variant="link">
          <a className="!text-lg" href="https://twitter.com/learnframer/status/1813161143831306398" target="_blank" rel="noopener noreferrer">
            Inspiration
          </a>
        </Button>
      </div>
      <BounceMenu className="col-span-1 lg:col-span-2" />
    </div>
  )
}

export default BounceMenuView
