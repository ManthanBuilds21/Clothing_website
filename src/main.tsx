import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { AuthProvider } from './hooks/useAuth'
import { CatalogProvider } from './hooks/useCatalog'
import { StoreProvider } from './hooks/useStore'
import { ToastProvider } from './hooks/useToast'
import ToastRegion from './components/ui/Toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ToastProvider>
        <AuthProvider>
          <CatalogProvider>
            <StoreProvider>
              <App />
              <ToastRegion />
            </StoreProvider>
          </CatalogProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
