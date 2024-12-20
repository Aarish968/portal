import { createBrowserRouter } from 'react-router-dom'
import { protectedRoutes } from './protected-app-routes'
import LoginView from '@/models/auth/views/login-view'
import ROUTES from '@/data/routing/routes'
import App from '@/App'
import { RootRedirect } from '@/components/root-redirect'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <RootRedirect />,
      },
      {
        path: ROUTES.auth.login.href,
        element: <LoginView />,
      },
      ...protectedRoutes,
    ],
  },
]) as ReturnType<typeof createBrowserRouter>

export default router
