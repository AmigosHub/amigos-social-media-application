
// src/main.jsx
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './styles/globals.css'
import LoadingSpinner from './components/common/LoadingSpinner'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
)