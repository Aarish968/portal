import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/app-routes'
import '@unocss/reset/tailwind.css'
import './assets/app.scss'
import './base_submod/assets/styles/index.css'
import './base_submod/assets/styles/typography.css'
import 'virtual:uno.css'
import './i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
