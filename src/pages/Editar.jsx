import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

export default function Editar() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(null)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [geocoding, setGeocoding] = useState(false)
  const [geoMsg, setGeoMsg]     = useState('')

  useEffect(() => {
    api.get(`/pichangas/${id}`)
      .then(p => setForm({
        nombre:    p.nombre,
        fecha:     toLocalInput(p.fecha),
        distrito:  p.distrito,
        lat:       p.lat  ?? '',
        lng:       p.lng  ?? '',
        publica:   p.publica,
        capacidad: p.capacidad,
      }))
      .catch(() => setError('No se pudo cargar la pichanga'))
  }, [id])

  function toLocalInput(iso) {
    const d = new Date(iso)
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function geocode() {
    if (!form.distrito.trim()) return
    setGeocoding(true); setGeoMsg('')
    try {
      const q   = encodeURIComponent(`${form.distrito.trim()}, Arequipa, Peru`)
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`, { headers: { 'Accept-Language': 'es' } })
      const data = await res.json()
      if (!data.length) { setGeoMsg('No se encontró el distrito.'); return }
      setForm(prev => ({ ...prev, lat: data[0].lat, lng: data[0].lon }))
      setGeoMsg(`✓ Coordenadas actualizadas`)
    } catch {
      setGeoMsg('Error al buscar coordenadas.')
    } finally {
      setGeocoding(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await api.put(`/pichangas/${id}`, {
        nombre:    form.nombre,
        fecha:     new Date(form.fecha).toISOString(),
        distrito:  form.distrito,
        lat:       form.lat  ? Number(form.lat)  : null,
        lng:       form.lng  ? Number(form.lng)  : null,
        publica:   form.publica,
        capacidad: Number(form.capacidad),
      })
      navigate(`/pichangas/${id}`)
    } catch (err) {
      setError(err.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  if (!form && !error) return <p className="text-center py-10 text-gray-500">Cargando...</p>
  if (error && !form)  return <p className="text-center py-10 text-red-500">{error}</p>

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6">Editar pichanga</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input type="text" required className="input" value={form.nombre}
            onChange={e => set('nombre', e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora</label>
          <input type="datetime-local" required className="input" value={form.fecha}
            onChange={e => set('fecha', e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
          <div className="flex gap-2">
            <input type="text" required className="input flex-1" value={form.distrito}
              onChange={e => { set('distrito', e.target.value); setGeoMsg('') }} />
            <button type="button" onClick={geocode} disabled={geocoding || !form.distrito.trim()}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-lg text-sm font-medium text-gray-700 transition-colors whitespace-nowrap">
              {geocoding ? '...' : '📍 Buscar'}
            </button>
          </div>
          {geoMsg && <p className={`text-xs mt-1 ${geoMsg.startsWith('✓') ? 'text-green-600' : 'text-amber-600'}`}>{geoMsg}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
            <input type="number" step="any" className="input" value={form.lat}
              onChange={e => set('lat', e.target.value)} placeholder="-16.409" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
            <input type="number" step="any" className="input" value={form.lng}
              onChange={e => set('lng', e.target.value)} placeholder="-71.537" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad (jugadores)</label>
          <input type="number" min={2} max={30} required className="input" value={form.capacidad}
            onChange={e => set('capacidad', e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="publica" checked={form.publica}
            onChange={e => set('publica', e.target.checked)}
            className="w-4 h-4 accent-blue-600" />
          <label htmlFor="publica" className="text-sm font-medium text-gray-700">
            Pichanga pública (aparece en el mapa)
          </label>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
