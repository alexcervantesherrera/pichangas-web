import { useEffect, useState } from 'react'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import SkillSlider from '../components/SkillSlider'

const POSICIONES = ['Armador', 'Central', 'Punta', 'Opuesto', 'Líbero']

const DEFAULT_SKILLS = { saque: 5, ataque: 5, bloqueo: 5, recepcion: 5, defensa: 5, colocacion: 5 }

export default function Perfil() {
  const { user } = useAuth()
  const [perfil, setPerfil]       = useState(null)
  const [posiciones, setPosiciones] = useState([])
  const [skills, setSkills]       = useState(DEFAULT_SKILLS)
  const [tallaCm, setTallaCm]     = useState('')
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [msg, setMsg]             = useState('')

  useEffect(() => {
    api.get(`/jugadores/${user.userId}`)
      .then(data => {
        setPerfil(data)
        setPosiciones(data.posiciones || [])
        setTallaCm(data.tallaCm || '')
        setSkills({
          saque:     data.saque     ?? 5,
          ataque:    data.ataque    ?? 5,
          bloqueo:   data.bloqueo   ?? 5,
          recepcion: data.recepcion ?? 5,
          defensa:   data.defensa   ?? 5,
          colocacion:data.colocacion?? 5,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user.userId])

  function togglePos(p) {
    setPosiciones(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  function setSkill(name, value) {
    setSkills(prev => ({ ...prev, [name]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (posiciones.length === 0) { setMsg('Selecciona al menos una posición'); return }
    setSaving(true); setMsg('')
    try {
      await api.put('/jugadores/me/capacidades', {
        posiciones,
        ...skills,
        tallaCm: tallaCm ? Number(tallaCm) : null,
      })
      setMsg('¡Guardado!')
    } catch (err) {
      setMsg(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-center py-10 text-gray-500">Cargando...</p>

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6">Mi perfil</h1>

      {perfil && (
        <div className="card mb-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
            {perfil.nombre?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{perfil.nombre}</p>
            <p className="text-sm text-gray-500">{perfil.email}</p>
            {perfil.rating && (
              <p className="text-xs text-blue-600 mt-0.5">
                Rating: <strong>{perfil.rating.rating}</strong> · {perfil.rating.bestPos}
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="card space-y-5">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Posiciones</p>
          <div className="flex flex-wrap gap-2">
            {POSICIONES.map(p => (
              <button
                key={p} type="button"
                onClick={() => togglePos(p)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  posiciones.includes(p)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Habilidades</p>
          <div className="space-y-3">
            {Object.entries(skills).map(([name, val]) => (
              <SkillSlider key={name} label={name} name={name} value={val} onChange={setSkill} />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Talla (cm)</label>
          <input type="number" min={140} max={230} className="input" value={tallaCm}
            onChange={e => setTallaCm(e.target.value)} placeholder="ej. 178" />
        </div>

        {msg && (
          <p className={`text-sm p-3 rounded-lg ${msg === '¡Guardado!' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {msg}
          </p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar capacidades'}
        </button>
      </form>
    </div>
  )
}
