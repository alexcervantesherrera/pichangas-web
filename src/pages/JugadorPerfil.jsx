import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'

const SKILLS = [
  { key: 'saque',      label: 'Saque',      color: 'bg-blue-500' },
  { key: 'ataque',     label: 'Ataque',     color: 'bg-red-500' },
  { key: 'bloqueo',    label: 'Bloqueo',    color: 'bg-orange-500' },
  { key: 'recepcion',  label: 'Recepción',  color: 'bg-green-500' },
  { key: 'defensa',    label: 'Defensa',    color: 'bg-teal-500' },
  { key: 'colocacion', label: 'Colocación', color: 'bg-purple-500' },
]

export default function JugadorPerfil() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/jugadores/${id}`)
      .then(setData)
      .catch(() => setError('Jugador no encontrado'))
  }, [id])

  if (!data && !error) return <p className="text-center py-10 text-gray-500">Cargando...</p>
  if (error)           return <p className="text-center py-10 text-red-500">{error}</p>

  const r      = data.rating          // PlayerRating object
  const skills = r?.skills ?? {}
  const rating = r?.rating  ?? 0
  const bestPos = r?.bestPos ?? '—'
  const posRatings = r?.posRatings ?? {}

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline">← Volver</button>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">{data.nombre}</h1>
            {data.posiciones?.length > 0 && (
              <p className="text-sm text-gray-500 mt-0.5">{data.posiciones.join(' · ')}</p>
            )}
            {data.tallaCm && (
              <p className="text-xs text-gray-400 mt-0.5">{data.tallaCm} cm</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">{rating}</p>
            <p className="text-xs text-gray-400">rating</p>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-gray-800">{bestPos}</p>
            <p className="text-xs text-gray-400">posición principal</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-gray-800">{data.validacionCount ?? 0}</p>
            <p className="text-xs text-gray-400">validacione{data.validacionCount !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {!data.evaluado && (
          <p className="text-xs text-amber-500 mt-3 bg-amber-50 p-2 rounded-lg">
            Este jugador aún no ha completado su perfil de habilidades.
          </p>
        )}
      </div>

      {/* Skills */}
      <div className="card">
        <h2 className="font-semibold mb-4">Habilidades</h2>
        <div className="space-y-3">
          {SKILLS.map(s => {
            const val = skills[s.key] ?? 0
            return (
              <div key={s.key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{s.label}</span>
                  <span className="font-semibold text-gray-800">{val.toFixed(1)}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all`}
                    style={{ width: `${(val / 10) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Per-position ratings */}
      {Object.keys(posRatings).length > 1 && (
        <div className="card">
          <h2 className="font-semibold mb-3">Rating por posición</h2>
          <div className="space-y-2">
            {Object.entries(posRatings)
              .sort(([, a], [, b]) => b - a)
              .map(([pos, val]) => (
                <div key={pos} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{pos}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.min(100, val)}%` }} />
                    </div>
                    <span className="font-semibold text-gray-800 w-10 text-right">{val}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
