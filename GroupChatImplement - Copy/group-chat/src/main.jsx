import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { GroupProvider } from './contexts/GroupContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GroupProvider>
      <App />
    </GroupProvider>
  </React.StrictMode>
)