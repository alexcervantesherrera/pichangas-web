import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'

const SKILLS = [
  { key: 'saque',      label: 'Saque' },
  { key: 'ataque',     label: 'Ataque' },
  { key: 'bloqueo',    label: 'Bloqueo' },
  { key: 'recepcion',  label: 'Recepción' },
  { key: 'defensa',    label: 'Defensa' },
  { key: 'colocacion', label: 'Colocación' },
]

function ValidarInline({ jugadorId, onDone }) {
  const [vals, setVals]   = useState({ saque:5, ataque:5, bloqueo:5, recepcion:5, defensa:5, colocacion:5 })
  const [saving, setSaving] = useState(false)
  const [err, setErr]     = useState('')

  async function submit(e) {
    e.preventDefault()
    setSaving(true); setErr('')
    try {
      await api.post(`/jugadores/${jugadorId}/validaciones`, vals)
      onDone()
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 bg-blue-50 rounded-xl p-4 space-y-3">
      {SKILLS.map(s => (
        <div key={s.key}>
          <div className="flex justify-between text-xs text-gray-600 mb-0.5">
            <span>{s.label}</span>
            <span className="font-semibold text-blue-700">{vals[s.key]}</span>
          </div>
          <input
            type="range" min={0} max={10} step={1}
            value={vals[s.key]}
            onChange={e => setVals(prev => ({ ...prev, [s.key]: Number(e.target.value) }))}
            className="w-full accent-blue-600"
          />
        </div>
      ))}
      {err && <p className="text-xs text-red-600">{err}</p>}
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onDone} className="btn-secondary text-xs flex-1 py-1.5">Cancelar</button>
        <button type="submit" className="btn-primary text-xs flex-1 py-1.5" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

function JugadorRow({ j, currentUserId, navigate }) {
  const [open, setOpen]           = useState(false)
  const [validado, setValidado]   = useState(false)
  const isSelf = j.id === currentUserId

  if (isSelf) return null

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          className="text-left flex-1"
          onClick={() => navigate(`/jugadores/${j.id}`)}
        >
          <p className="font-medium text-blue-700 hover:underline text-sm">{j.nombre}</p>
          {j.posiciones?.length > 0
            ? <p className="text-xs text-gray-400 mt-0.5">{j.posiciones.join(' · ')}</p>
            : <p className="text-xs text-gray-300 mt-0.5">sin posición</p>
          }
        </button>
        <div className="ml-3 flex-shrink-0">
          {validado
            ? <span className="text-xs text-green-600 font-medium">✓ Validado</span>
            : (
              <button
                onClick={() => setOpen(o => !o)}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                {open ? 'Cancelar' : 'Calificar'}
              </button>
            )
          }
        </div>
      </div>
      {open && !validado && (
        <ValidarInline
          jugadorId={j.id}
          onDone={() => { setValidado(true); setOpen(false) }}
        />
      )}
    </div>
  )
}

export default function Jugadores() {
  const { user }       = useAuth()
  const navigate       = useNavigate()
  const [search, setSearch] = useState('')
  const [jugadores, setJugadores] = useState([])
  const [loading, setLoading]     = useState(false)

  const load = useCallback(async (q) => {
    setLoading(true)
    try {
      const data = await api.get(`/jugadores${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      setJugadores(data)
    } catch {
      setJugadores([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load('') }, [load])

  useEffect(() => {
    const t = setTimeout(() => load(search), 300)
    return () => clearTimeout(t)
  }, [search, load])

  const others = jugadores.filter(j => j.id !== user?.userId)

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-1">Jugadores</h1>
      <p className="text-sm text-gray-500 mb-4">Califica a tus compañeros para mejorar el balanceo de equipos.</p>

      <input
        type="search"
        placeholder="Buscar por nombre..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="input mb-4"
      />

      {loading && <p className="text-center text-gray-400 py-6 text-sm">Buscando...</p>}

      {!loading && others.length === 0 && (
        <p className="text-center text-gray-400 py-10 text-sm">
          {search ? 'No se encontraron jugadores' : 'Aún no hay otros jugadores registrados'}
        </p>
      )}

      <div className="space-y-2">
        {others.map(j => (
          <JugadorRow
            key={j.id}
            j={j}
            currentUserId={user?.userId}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  )
}
