import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon   from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { api } from '../api'

// Fix Leaflet default marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow })

// Center: Arequipa, Peru
const CENTER = [-16.409, -71.537]

// Approximate coordinates for Arequipa urban districts
const DISTRITO_COORDS = {
  'arequipa':              [-16.3988, -71.5369],
  'cercado':               [-16.3988, -71.5369],
  'alto selva alegre':     [-16.3739, -71.5146],
  'cayma':                 [-16.3721, -71.5638],
  'cerro colorado':        [-16.3600, -71.5817],
  'characato':             [-16.4608, -71.4788],
  'jacobo hunter':         [-16.4335, -71.5575],
  'hunter':                [-16.4335, -71.5575],
  'jose luis bustamante':  [-16.4274, -71.5253],
  'jlbyr':                 [-16.4274, -71.5253],
  'bustamante':            [-16.4274, -71.5253],
  'mariano melgar':        [-16.3919, -71.5096],
  'miraflores':            [-16.3973, -71.5261],
  'mollebaya':             [-16.4747, -71.5164],
  'paucarpata':            [-16.4218, -71.5006],
  'sabandia':              [-16.4500, -71.5007],
  'sachaca':               [-16.4258, -71.5766],
  'socabaya':              [-16.4458, -71.5161],
  'tiabaya':               [-16.4275, -71.5961],
  'uchumayo':              [-16.4533, -71.6300],
  'yanahuara':             [-16.3893, -71.5547],
  'yarabamba':             [-16.5028, -71.5394],
  'yura':                  [-16.2453, -71.6814],
}

function resolveCoords(p) {
  if (p.lat && p.lng) return [p.lat, p.lng]
  if (!p.distrito) return null
  const key = p.distrito.toLowerCase().trim()
  return DISTRITO_COORDS[key] ?? null
}

export default function Mapa() {
  const [pichangas, setPichangas] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/pichangas?soloPublicas=true').then(setPichangas).catch(() => {})
  }, [])

  const withCoords = pichangas
    .map(p => ({ ...p, _coords: resolveCoords(p) }))
    .filter(p => p._coords)

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
      <div className="px-4 py-2 bg-white border-b text-sm text-gray-500">
        {withCoords.length} de {pichangas.length} pichanga{pichangas.length !== 1 ? 's' : ''} en el mapa
      </div>
      <MapContainer center={CENTER} zoom={13} className="flex-1">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        />
        {withCoords.map(p => (
          <Marker key={p.id} position={p._coords}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{p.nombre}</p>
                <p className="text-gray-500">{p.distrito}</p>
                <p className="text-gray-500">
                  {new Date(p.fecha).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
                {!p.lat && (
                  <p className="text-xs text-amber-500 mt-1">Ubicación aproximada</p>
                )}
                <button
                  onClick={() => navigate(`/pichangas/${p.id}`)}
                  className="mt-2 text-blue-600 hover:underline text-xs font-medium"
                >
                  Ver detalle →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
