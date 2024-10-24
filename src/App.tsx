import { MsalProvider } from '@azure/msal-react'
import { Suspense } from 'react'
import AppRoutes from '@/routes/app-routes'
import { NavigationProvider } from '@/base_submod/contexts/navigation-context'
import LoadingSpinner from '@/base_submod/components/misc/loading-spinner'
import { msalInstance } from '@/base_submod/utils/MSAL'

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <NavigationProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <AppRoutes />
        </Suspense>
      </NavigationProvider>
    </MsalProvider>
  )
}

export default App
