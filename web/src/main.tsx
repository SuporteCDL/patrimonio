import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Modal from "react-modal";
import { AuthProvider } from './context/AuthContext';
Modal.setAppElement("#root");

const rootElement = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)