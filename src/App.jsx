import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Mapa from './pages/Mapa'
import Perfil from './pages/Perfil'
import Crear from './pages/Crear'
import PichangaDetalle from './pages/PichangaDetalle'
import Editar from './pages/Editar'
import JugadorPerfil from './pages/JugadorPerfil'
import Jugadores from './pages/Jugadores'
import Ayuda from './pages/Ayuda'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/"         element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/mapa"     element={<ProtectedRoute><Mapa /></ProtectedRoute>} />
              <Route path="/perfil"   element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
              <Route path="/crear"    element={<ProtectedRoute><Crear /></ProtectedRoute>} />
              <Route path="/pichangas/:id" element={<PichangaDetalle />} />
              <Route path="/pichangas/:id/editar" element={<ProtectedRoute><Editar /></ProtectedRoute>} />
              <Route path="/jugadores" element={<ProtectedRoute><Jugadores /></ProtectedRoute>} />
              <Route path="/jugadores/:id" element={<JugadorPerfil />} />
              <Route path="/ayuda" element={<Ayuda />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
