import { useEffect } from 'react'
import { useNavigation } from '@/base_submod/contexts/navigation-context'
import HRAView from '@/models/hra/views/hra-view'

function HRAPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      'Health Risk Assessment',
      'Complete the Health Risk Assessment for the selected member',
    )
  }, [updatePageInfo])

  return <HRAView />
}

export default HRAPage
