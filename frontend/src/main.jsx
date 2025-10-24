
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './authentication/reactfiles/Auth.jsx' // 1. Import AuthProvider

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      {/* 2. Wrap App in AuthProvider */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>
)
