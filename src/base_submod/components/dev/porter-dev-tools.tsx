import { Button } from '@/base_submod/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/base_submod/components/ui/drawer'

interface PorterDevToolsProps {
  children?: React.ReactNode
}

function PorterDevTools({ children }: PorterDevToolsProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          Dev Tools
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Porter Dev Tools</DrawerTitle>
        </DrawerHeader>
        <div className=":uno: p-4">
          <div className=":uno: mb-4 flex items-center space-x-2">
          </div>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default PorterDevTools
