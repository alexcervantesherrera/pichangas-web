import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import PichangaCard from '../components/PichangaCard'

const TABS = ['Todas', 'Mis pichangas']

export default function Home() {
  const { user } = useAuth()
  const [todas, setTodas]   = useState([])
  const [mias, setMias]     = useState([])
  const [tab, setTab]       = useState('Todas')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/pichangas'),
      api.get('/pichangas/mias'),
    ])
      .then(([all, mine]) => { setTodas(all); setMias(mine) })
      .catch(() => setError('No se pudieron cargar las pichangas'))
      .finally(() => setLoading(false))
  }, [])

  const miasIds = new Set(mias.map(p => p.id))

  const base = tab === 'Mis pichangas' ? mias : todas

  const filtered = base.filter(p => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return p.nombre.toLowerCase().includes(q) || p.distrito.toLowerCase().includes(q)
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Pichangas</h1>
        <button onClick={() => navigate('/crear')} className="btn-primary text-sm">
          + Nueva
        </button>
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder="Buscar por nombre o distrito..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="input mb-3"
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
            {t === 'Mis pichangas' && mias.length > 0 && (
              <span className="ml-1.5 bg-blue-100 text-blue-700 rounded-full text-xs px-1.5">{mias.length}</span>
            )}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-gray-500 py-10">Cargando...</p>}
      {error   && <p className="text-center text-red-500 py-10">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🏐</p>
          <p className="font-medium">
            {search ? 'Sin resultados' : tab === 'Mis pichangas' ? 'Aún no estás en ninguna pichanga' : 'No hay pichangas aún'}
          </p>
          {!search && tab === 'Todas' && <p className="text-sm mt-1">¡Crea la primera!</p>}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p => (
          <PichangaCard
            key={p.id}
            pichanga={p}
            isMine={miasIds.has(p.id)}
            isAdmin={p.adminId === user?.userId}
          />
        ))}
      </div>
    </div>
  )
}
