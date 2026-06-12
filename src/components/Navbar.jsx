import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const link = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        pathname === to ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg tracking-tight">🏐 Pichangas</Link>

        {user ? (
          <div className="flex items-center gap-1">
            {link('/', 'Inicio')}
            {link('/mapa', 'Mapa')}
            {link('/jugadores', 'Jugadores')}
            {link('/perfil', 'Perfil')}
            {link('/crear', '+ Nueva')}
            {link('/ayuda', '?  Ayuda')}
            <button onClick={handleLogout} className="ml-2 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-blue-700 transition-colors">
              Salir
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            {link('/ayuda', '? Ayuda')}
            {link('/login', 'Ingresar')}
            {link('/register', 'Registrarse')}
          </div>
        )}
      </div>
    </nav>
  )
}
