import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import TeamBuilder from '../components/TeamBuilder'

const SKILLS = [
  { key: 'saque',     label: 'Saque' },
  { key: 'ataque',    label: 'Ataque' },
  { key: 'bloqueo',   label: 'Bloqueo' },
  { key: 'recepcion', label: 'Recepción' },
  { key: 'defensa',   label: 'Defensa' },
  { key: 'colocacion',label: 'Colocación' },
]

function ValidarForm({ jugadorId, onDone }) {
  const [vals, setVals] = useState({ saque:5, ataque:5, bloqueo:5, recepcion:5, defensa:5, colocacion:5 })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

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
        <button type="button" onClick={onDone} className="btn-secondary text-xs flex-1 py-1.5">
          Cancelar
        </button>
        <button type="submit" className="btn-primary text-xs flex-1 py-1.5" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar validación'}
        </button>
      </div>
    </form>
  )
}

function MiembroRow({ m, currentUserId, onValidated }) {
  const [open, setOpen] = useState(false)
  const isSelf      = !!currentUserId && m.id === currentUserId
  const canValidate = !!currentUserId && !isSelf

  function handleDone() {
    setOpen(false)
    onValidated(m.id)
  }

  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={`/jugadores/${m.id}`}
            className="font-medium text-sm text-blue-700 hover:underline"
            onClick={e => e.stopPropagation()}
          >
            {m.nombre}
          </Link>
          {m.posiciones?.length > 0 && (
            <span className="text-gray-400 text-xs ml-2">{m.posiciones.join(' · ')}</span>
          )}
          {!m.evaluado && (
            <span className="ml-2 text-xs text-amber-500">sin evaluar</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {m.rating > 0 && (
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {m.rating}
            </span>
          )}
          {isSelf && <span className="text-xs text-gray-400">tú</span>}
          {canValidate && (
            m.yaValidado
              ? <span className="text-xs text-green-600 font-medium">✓ Validado</span>
              : <button
                  type="button"
                  onClick={() => setOpen(o => !o)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  {open ? 'Cancelar' : 'Validar'}
                </button>
          )}
        </div>
      </div>
      {open && !isSelf && !m.yaValidado && (
        <ValidarForm jugadorId={m.id} onDone={handleDone} />
      )}
    </div>
  )
}

export default function PichangaDetalle() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [pichanga, setPichanga]   = useState(null)
  const [miembros, setMiembros]   = useState([])
  const [pending, setPending]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [msg, setMsg]             = useState('')

  const isAdmin = pichanga?.adminId === user?.userId

  async function load() {
    try {
      // Try new single-item endpoint; fall back to list if API not yet restarted
      let p
      try {
        p = await api.get(`/pichangas/${id}`)
      } catch {
        const list = await api.get('/pichangas')
        p = list.find(x => x.id === id)
      }
      if (!p) { setLoading(false); return }
      setPichanga(p)

      // Try members endpoint; gracefully skip if not yet available
      try {
        const mbs = await api.get(`/pichangas/${id}/miembros`)
        setMiembros(mbs)
      } catch { /* endpoint not yet live */ }

      if (p.adminId === user?.userId) {
        try {
          const sols = await api.get(`/pichangas/${id}/solicitudes`)
          setPending(sols)
        } catch { /* not admin or endpoint unavailable */ }
      }
    } catch {
      setMsg('Error al cargar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  function handleValidated(jugadorId) {
    setMiembros(prev => prev.map(m => m.id === jugadorId ? { ...m, yaValidado: true } : m))
  }

  async function handleJoin() {
    setMsg('')
    try {
      await api.post(`/pichangas/${id}/solicitudes`)
      setMsg('Solicitud enviada. Espera aprobación del admin.')
    } catch (err) {
      setMsg(err.message)
    }
  }

  async function handleResolve(solId, accion) {
    try {
      await api.post(`/pichangas/${id}/solicitudes/${solId}/${accion}`)
      setPending(prev => prev.filter(s => s.id !== solId))
      setMsg(accion === 'aprobar' ? 'Jugador aprobado ✓' : 'Solicitud rechazada')
      if (accion === 'aprobar') load()
    } catch (err) {
      setMsg(err.message)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar "${pichanga.nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.delete(`/pichangas/${id}`)
      navigate('/')
    } catch (err) {
      setMsg(err.message)
    }
  }


  if (loading) return <p className="text-center py-10 text-gray-500">Cargando...</p>
  if (!pichanga) return <p className="text-center py-10 text-red-500">Pichanga no encontrada</p>

  const fecha = new Date(pichanga.fecha).toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const isMember = miembros.some(m => m.id === user?.userId)

  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline">← Volver</button>

      <div className="card">
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-bold">{pichanga.nombre}</h1>
          <span className={`badge ${pichanga.publica ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {pichanga.publica ? 'Pública' : 'Privada'}
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-1">{pichanga.distrito} · {fecha}</p>
        <p className="text-sm text-gray-400 mt-1">
          Capacidad: {pichanga.capacidad} jugadores · {miembros.length} confirmado{miembros.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {isAdmin && (
            <>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Eres el admin</span>
              <button
                onClick={() => navigate(`/pichangas/${id}/editar`)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-medium transition-colors"
              >
                ✏️ Editar
              </button>
              <button
                onClick={handleDelete}
                className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-full font-medium transition-colors"
              >
                🗑 Eliminar
              </button>
            </>
          )}
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-medium transition-colors"
          >
            {copied ? '✓ Copiado' : '🔗 Copiar link'}
          </button>
          <button
            onClick={shareWhatsApp}
            className="flex items-center gap-1.5 text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full font-medium transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </button>
        </div>
      </div>

      {msg && (
        <p className={`text-sm p-3 rounded-lg ${msg.includes('Error') || msg.includes('error') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'}`}>
          {msg}
        </p>
      )}

      {!user && (
        <div className="card text-center space-y-3">
          <p className="text-sm text-gray-600">Regístrate para unirte a esta pichanga</p>
          <div className="flex gap-3">
            <a href="/register" className="btn-primary flex-1 text-center">Crear cuenta</a>
            <a href="/login"    className="btn-secondary flex-1 text-center">Iniciar sesión</a>
          </div>
        </div>
      )}

      {user && !isMember && !isAdmin && (
        <button onClick={handleJoin} className="btn-primary w-full">
          Pedir unirse
        </button>
      )}

      {isAdmin && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold flex items-center gap-2">
              Solicitudes para unirse
              {pending.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pending.length}
                </span>
              )}
            </h2>
            <button onClick={load} className="text-xs text-blue-600 hover:underline">Actualizar</button>
          </div>
          {pending.length === 0 ? (
            <p className="text-sm text-gray-400 py-2 text-center">No hay solicitudes pendientes</p>
          ) : (
            <div className="space-y-2">
              {pending.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl p-3">
                  <div>
                    <p className="font-medium text-sm">{s.jugadorNombre}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString('es-PE', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleResolve(s.id, 'aprobar')} className="btn-green text-xs py-1.5 px-3">✓ Aprobar</button>
                    <button onClick={() => handleResolve(s.id, 'rechazar')} className="btn-danger text-xs py-1.5 px-3">✗ Rechazar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members list with inline validation */}
      {miembros.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-3">Jugadores ({miembros.length})</h2>
          {user && (
            <p className="text-xs text-gray-400 mb-3">
              Valida las habilidades de tus compañeros — tu opinión ajusta su rating.
            </p>
          )}
          <div className="space-y-2">
            {miembros.map(m => (
              <MiembroRow
                key={m.id}
                m={m}
                currentUserId={user?.userId}
                onValidated={handleValidated}
              />
            ))}
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="card">
          <h2 className="font-semibold mb-4">Armar equipos</h2>
          <TeamBuilder
            pichangaId={id}
            pichangaNombre={pichanga.nombre}
            miembros={miembros}
            isFull={miembros.length >= pichanga.capacidad}
          />
        </div>
      )}
    </div>
  )
}
