import { Suspense } from 'react'
import AppRoutes from './routes/app-routes'
import { NavigationProvider } from '@/contexts/navigation-context'
import LoadingSpinner from '@/base_submod/components/Misc/loading-spinner'

function App() {
  return (
    <NavigationProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <AppRoutes />
      </Suspense>
    </NavigationProvider>
  )
}

export default App
