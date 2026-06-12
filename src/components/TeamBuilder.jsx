import { useState } from 'react'
import { api } from '../api'

export const TEAM_COLORS = [
  { name: 'Rojo',     emoji: '🔴', bg: 'bg-red-50',     border: 'border-red-300',     text: 'text-red-700',    dot: 'bg-red-500',     btn: 'bg-red-500 hover:bg-red-600' },
  { name: 'Azul',     emoji: '🔵', bg: 'bg-blue-50',    border: 'border-blue-300',    text: 'text-blue-700',   dot: 'bg-blue-500',    btn: 'bg-blue-500 hover:bg-blue-600' },
  { name: 'Verde',    emoji: '🟢', bg: 'bg-green-50',   border: 'border-green-300',   text: 'text-green-700',  dot: 'bg-green-500',   btn: 'bg-green-500 hover:bg-green-600' },
  { name: 'Amarillo', emoji: '🟡', bg: 'bg-yellow-50',  border: 'border-yellow-300',  text: 'text-yellow-700', dot: 'bg-yellow-400',  btn: 'bg-yellow-400 hover:bg-yellow-500' },
  { name: 'Morado',   emoji: '🟣', bg: 'bg-purple-50',  border: 'border-purple-300',  text: 'text-purple-700', dot: 'bg-purple-500',  btn: 'bg-purple-500 hover:bg-purple-600' },
  { name: 'Naranja',  emoji: '🟠', bg: 'bg-orange-50',  border: 'border-orange-300',  text: 'text-orange-700', dot: 'bg-orange-500',  btn: 'bg-orange-500 hover:bg-orange-600' },
  { name: 'Rosa',     emoji: '🩷', bg: 'bg-pink-50',    border: 'border-pink-300',    text: 'text-pink-700',   dot: 'bg-pink-500',    btn: 'bg-pink-500 hover:bg-pink-600' },
  { name: 'Cian',     emoji: '🩵', bg: 'bg-cyan-50',    border: 'border-cyan-300',    text: 'text-cyan-700',   dot: 'bg-cyan-500',    btn: 'bg-cyan-500 hover:bg-cyan-600' },
  { name: 'Lima',     emoji: '🟩', bg: 'bg-lime-50',    border: 'border-lime-300',    text: 'text-lime-700',   dot: 'bg-lime-500',    btn: 'bg-lime-500 hover:bg-lime-600' },
  { name: 'Índigo',   emoji: '💙', bg: 'bg-indigo-50',  border: 'border-indigo-300',  text: 'text-indigo-700', dot: 'bg-indigo-500',  btn: 'bg-indigo-500 hover:bg-indigo-600' },
]

// ── Final teams display ───────────────────────────────────────────────────────

function TeamsResult({ teams, pichangaNombre, onReset }) {
  function shareWhatsApp() {
    const lines = [`🏐 *Equipos — ${pichangaNombre}*\n`]
    teams.forEach(t => {
      lines.push(`${t.color.emoji} *Equipo ${t.color.name}*`)
      t.players.forEach(p => {
        const pos    = p.bestPos || (p.posiciones?.[0] ?? '')
        const rating = p.rating  != null ? ` · ${p.rating}` : ''
        lines.push(`• ${p.nombre}${pos ? ` (${pos})` : ''}${rating}`)
      })
      if (t.totalRating) lines.push(`_Rating total: ${t.totalRating}_`)
      lines.push('')
    })
    window.open(`https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`, '_blank')
  }

  return (
    <div className="space-y-3">
      {teams.map(t => (
        <div key={t.color.name} className={`rounded-2xl border-2 ${t.color.border} ${t.color.bg} p-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-bold text-base ${t.color.text}`}>
              {t.color.emoji} Equipo {t.color.name}
            </h3>
            {t.totalRating > 0 && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.color.dot} text-white`}>
                {t.totalRating} pts
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            {t.players.map((p, i) => (
              <div key={p.userId ?? p.id ?? i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.color.dot}`} />
                  <span className="font-medium">{p.nombre}</span>
                  {(p.bestPos || p.posiciones?.[0]) && (
                    <span className="text-gray-400 text-xs">{p.bestPos ?? p.posiciones[0]}</span>
                  )}
                </div>
                {p.rating != null && (
                  <span className={`text-xs font-bold ${t.color.text}`}>{p.rating}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-2 pt-1">
        <button onClick={onReset} className="btn-secondary flex-1 text-sm">
          Volver a armar
        </button>
        <button
          onClick={shareWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          Compartir equipos
        </button>
      </div>
    </div>
  )
}

// ── Manual builder ────────────────────────────────────────────────────────────

function ManualBuilder({ miembros, numEquipos, onDone }) {
  // assignments: { [jugadorId]: teamIndex (0-based) | null }
  const [assignments, setAssignments] = useState(
    Object.fromEntries(miembros.map(m => [m.id, null]))
  )

  function assign(jugadorId, teamIdx) {
    setAssignments(prev => ({ ...prev, [jugadorId]: prev[jugadorId] === teamIdx ? null : teamIdx }))
  }

  const colors = TEAM_COLORS.slice(0, numEquipos)

  const unassigned = miembros.filter(m => assignments[m.id] === null)
  const teamPlayers = colors.map((_, i) => miembros.filter(m => assignments[m.id] === i))

  function confirm() {
    const teams = colors.map((color, i) => ({
      color,
      players: teamPlayers[i].map(m => ({ id: m.id, nombre: m.nombre, posiciones: m.posiciones })),
      totalRating: 0,
    }))
    onDone(teams)
  }

  const allAssigned = unassigned.length === 0

  return (
    <div className="space-y-4">
      {/* Unassigned pool */}
      {unassigned.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Sin equipo ({unassigned.length})
          </p>
          <div className="space-y-2">
            {unassigned.map(m => (
              <div key={m.id} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{m.nombre}</p>
                  {m.posiciones?.length > 0 && (
                    <p className="text-xs text-gray-400">{m.posiciones.join(' · ')}</p>
                  )}
                </div>
                <div className="flex gap-1.5">
                  {colors.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => assign(m.id, i)}
                      title={`Equipo ${c.name}`}
                      className={`w-7 h-7 rounded-full ${c.btn} text-white text-xs font-bold transition-transform hover:scale-110`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teams preview */}
      <div className={`grid gap-3 ${numEquipos <= 3 ? `grid-cols-${numEquipos}` : 'grid-cols-2 sm:grid-cols-3'}`}>
        {colors.map((c, i) => (
          <div key={c.name} className={`rounded-xl border-2 ${c.border} ${c.bg} p-3 min-h-[80px]`}>
            <p className={`text-xs font-bold ${c.text} mb-2`}>{c.emoji} {c.name}</p>
            {teamPlayers[i].length === 0
              ? <p className="text-xs text-gray-300 italic">vacío</p>
              : teamPlayers[i].map(m => (
                  <div key={m.id} className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium truncate">{m.nombre}</span>
                    <button
                      onClick={() => assign(m.id, null)}
                      className="text-gray-300 hover:text-red-400 ml-1 flex-shrink-0"
                      title="Quitar"
                    >
                      ×
                    </button>
                  </div>
                ))
            }
          </div>
        ))}
      </div>

      <button
        onClick={confirm}
        disabled={!allAssigned}
        className="btn-primary w-full disabled:opacity-40"
      >
        {allAssigned ? 'Ver equipos finales' : `Faltan ${unassigned.length} por asignar`}
      </button>
    </div>
  )
}

// ── Main TeamBuilder ──────────────────────────────────────────────────────────

export default function TeamBuilder({ pichangaId, pichangaNombre, miembros, isFull }) {
  const [mode, setMode]           = useState(null)      // 'auto' | 'manual'
  const [numEquipos, setNumEquipos] = useState(2)
  const [teams, setTeams]         = useState(null)
  const [warnings, setWarnings]   = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  async function runAuto() {
    setLoading(true); setError('')
    try {
      const res = await api.post(`/pichangas/${pichangaId}/balancear?equipos=${numEquipos}`)
      const colors = TEAM_COLORS.slice(0, numEquipos)
      setTeams(res.teams.map((t, i) => ({
        color: colors[i],
        players: t.players,
        totalRating: t.totalRating,
      })))
      setWarnings(res.warnings || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setTeams(null); setWarnings([]); setError(''); setMode(null)
  }

  if (teams) {
    return (
      <div className="space-y-3">
        {warnings.map((w, i) => (
          <p key={i} className="text-sm bg-yellow-50 text-yellow-700 p-3 rounded-lg">⚠️ {w}</p>
        ))}
        <TeamsResult teams={teams} pichangaNombre={pichangaNombre} onReset={reset} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {isFull && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
          <span className="text-lg">✅</span>
          <p className="text-sm font-medium text-green-700">¡Pichanga completa! Lista para armar equipos.</p>
        </div>
      )}

      {/* Number of teams */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 font-medium">Equipos:</span>
        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => { if (numEquipos > 2) { setNumEquipos(n => n - 1); setMode(null) } }}
            disabled={numEquipos <= 2}
            className="w-9 h-9 text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >−</button>
          <span className="w-10 text-center font-bold text-blue-600 text-base">{numEquipos}</span>
          <button
            type="button"
            onClick={() => { if (numEquipos < Math.min(TEAM_COLORS.length, miembros.length)) { setNumEquipos(n => n + 1); setMode(null) } }}
            disabled={numEquipos >= Math.min(TEAM_COLORS.length, miembros.length)}
            className="w-9 h-9 text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >+</button>
        </div>
        <div className="flex gap-1 flex-wrap">
          {TEAM_COLORS.slice(0, numEquipos).map(c => (
            <span key={c.name} className={`w-5 h-5 rounded-full ${c.dot}`} title={c.name} />
          ))}
        </div>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMode('auto')}
          className={`rounded-xl border-2 p-4 text-left transition-colors ${
            mode === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
          }`}
        >
          <p className="text-2xl mb-1">🤖</p>
          <p className="font-semibold text-sm">Automático</p>
          <p className="text-xs text-gray-500 mt-0.5">IA balancea por rating y posición</p>
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`rounded-xl border-2 p-4 text-left transition-colors ${
            mode === 'manual' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-300'
          }`}
        >
          <p className="text-2xl mb-1">✋</p>
          <p className="font-semibold text-sm">Manual</p>
          <p className="text-xs text-gray-500 mt-0.5">Tú decides quién va en cada equipo</p>
        </button>
      </div>

      {/* Auto mode */}
      {mode === 'auto' && (
        <div className="space-y-3">
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-2 flex-wrap">
            {TEAM_COLORS.slice(0, numEquipos).map(c => (
              <span key={c.name} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${c.bg} ${c.text} border ${c.border}`}>
                {c.emoji} Equipo {c.name}
              </span>
            ))}
          </div>
          <button onClick={runAuto} className="btn-primary w-full" disabled={loading}>
            {loading ? 'Calculando...' : '🤖 Balancear con IA'}
          </button>
        </div>
      )}

      {/* Manual mode */}
      {mode === 'manual' && (
        <ManualBuilder
          miembros={miembros}
          numEquipos={numEquipos}
          onDone={setTeams}
        />
      )}
    </div>
  )
}
