import React from 'react'
import { SocketProvider } from './context/SocketContext';
import { MapaPage } from './pages/MapaPage'

const App = () => {
  return (
    <AppState>
      <MapaPage />
    </AppState>
  )
}

const AppState: React.FC = ({ children }) => {
  return (
    <SocketProvider>
      { children }
    </SocketProvider>
  )
}

export default App;