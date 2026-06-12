import { useNavigate } from 'react-router-dom'

export default function PichangaCard({ pichanga, isMine, isAdmin }) {
  const navigate = useNavigate()
  const fecha = new Date(pichanga.fecha).toLocaleDateString('es-PE', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div
      className="card hover:shadow-md cursor-pointer transition-shadow"
      onClick={() => navigate(`/pichangas/${pichanga.id}`)}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-semibold text-gray-900 leading-snug">{pichanga.nombre}</h3>
        <div className="flex gap-1 flex-shrink-0 ml-2">
          {isAdmin && (
            <span className="badge bg-blue-100 text-blue-700">admin</span>
          )}
          {isMine && !isAdmin && (
            <span className="badge bg-purple-100 text-purple-700">miembro</span>
          )}
          <span className={`badge ${pichanga.publica ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {pichanga.publica ? 'Pública' : 'Privada'}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-500">{pichanga.distrito}</p>
      <p className="text-sm text-blue-600 mt-1">{fecha}</p>
      <p className="text-xs text-gray-400 mt-1">Capacidad: {pichanga.capacidad}</p>
    </div>
  )
}
