import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { ExpenseProvider } from './context/ExpenseContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ExpenseProvider>
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 2800 }} />
    </ExpenseProvider>
  </React.StrictMode>
)
