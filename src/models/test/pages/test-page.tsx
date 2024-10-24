import { useEffect } from 'react'
import ROUTES from '@/data/routing/routes'
import { useNavigation } from '@/base_submod/contexts/navigation-context'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import TestView from '@/models/test/views/test-view'
import RootLayout from '@/layouts/root-layout'

function TestPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      ROUTES.app.test.title,
      ROUTES.app.test.metaDescription,
    )
  }, [updatePageInfo])

  return (
    <RootLayout>
      <BasePractitionerView>
        <TestView />
      </BasePractitionerView>
    </RootLayout>
  )
}

export default TestPage
