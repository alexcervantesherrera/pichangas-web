export default function Ayuda() {
  const steps = [
    {
      num: 1,
      title: 'Crea tu cuenta',
      desc: 'Toca "Registrarse", ingresa tu nombre, email y contraseña. Puedes agregar tu posición favorita.',
      mock: (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
          <p className="text-center font-semibold text-sm text-gray-700">🏐 Crear cuenta</p>
          <div className="bg-gray-100 rounded-lg h-7 w-full" />
          <div className="bg-gray-100 rounded-lg h-7 w-full" />
          <div className="bg-gray-100 rounded-lg h-7 w-full" />
          <div className="bg-blue-500 rounded-lg h-8 w-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">Crear cuenta</span>
          </div>
        </div>
      ),
    },
    {
      num: 2,
      title: 'Inicia sesión',
      desc: 'Si ya tienes cuenta, toca "Ingresar", pon tu email y contraseña y entra a la app.',
      mock: (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
          <p className="text-center font-semibold text-sm text-gray-700">Ingresar</p>
          <div className="bg-gray-100 rounded-lg h-7 w-full" />
          <div className="bg-gray-100 rounded-lg h-7 w-full" />
          <div className="bg-blue-500 rounded-lg h-8 w-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">Ingresar</span>
          </div>
          <p className="text-center text-xs text-blue-500">¿No tienes cuenta? Regístrate</p>
        </div>
      ),
    },
    {
      num: 3,
      title: 'Explora las pichangas',
      desc: 'En Inicio verás todas las pichangas disponibles. Filtra por nombre o distrito. La pestaña "Mis pichangas" muestra solo las tuyas.',
      mock: (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
          <div className="bg-gray-100 rounded-lg h-7 w-full" />
          <div className="flex gap-2">
            <div className="bg-blue-100 rounded-full px-3 py-1 text-xs text-blue-700 font-medium">Todas</div>
            <div className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-500">Mis pichangas</div>
          </div>
          {['Gran Pichanga · Miraflores', 'Pichanga Los Olivos · SJL'].map(n => (
            <div key={n} className="border border-gray-100 rounded-lg px-3 py-2 text-xs text-gray-600 flex justify-between">
              <span>{n}</span>
              <span className="text-green-600 font-medium">Pública</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      num: 4,
      title: 'Únete a una pichanga',
      desc: 'Toca una pichanga y presiona "Pedir unirse". El organizador recibirá tu solicitud y te aceptará.',
      mock: (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
          <p className="font-bold text-sm">Gran Pichanga</p>
          <p className="text-xs text-gray-400">Miraflores · dom. 21 jun.</p>
          <p className="text-xs text-gray-400">10 / 12 jugadores</p>
          <div className="bg-blue-500 rounded-lg h-8 w-full flex items-center justify-center mt-1">
            <span className="text-white text-xs font-semibold">Pedir unirse</span>
          </div>
          <p className="text-xs text-center text-gray-400">Espera que el admin te acepte</p>
        </div>
      ),
    },
    {
      num: 5,
      title: 'Crea tu propia pichanga',
      desc: 'Toca "+ Nueva", llena el nombre, distrito, fecha y cuántos jugadores necesitas. Puedes buscar la ubicación automáticamente.',
      mock: (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
          <p className="text-center font-semibold text-sm text-gray-700">Nueva pichanga</p>
          <div className="bg-gray-100 rounded-lg h-7 w-full" />
          <div className="flex gap-2">
            <div className="bg-gray-100 rounded-lg h-7 flex-1" />
            <div className="bg-blue-100 rounded-lg px-2 h-7 flex items-center">
              <span className="text-blue-700 text-xs">📍 Buscar</span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg h-7 w-full" />
          <div className="bg-blue-500 rounded-lg h-8 w-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">Crear pichanga</span>
          </div>
        </div>
      ),
    },
    {
      num: 6,
      title: 'Acepta o rechaza jugadores',
      desc: 'Como organizador, en tu pichanga verás las solicitudes pendientes. Aprueba o rechaza a cada jugador.',
      mock: (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">Solicitudes</p>
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">2</span>
          </div>
          {['Carlos Mamani', 'Diego Quispe'].map(n => (
            <div key={n} className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2">
              <span className="text-xs font-medium">{n}</span>
              <div className="flex gap-1">
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-lg">✓</span>
                <span className="bg-red-400 text-white text-xs px-2 py-0.5 rounded-lg">✗</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      num: 7,
      title: 'Valida a tus compañeros',
      desc: 'En la lista de jugadores de una pichanga, puedes calificar del 0 al 10 las habilidades de cada compañero. Eso mejora el balance de los equipos.',
      mock: (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
          <p className="font-semibold text-sm">Jugadores (3)</p>
          <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-medium text-blue-700">Carlos Mamani · Armador</span>
            <button className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-lg">Validar</button>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 space-y-1">
            {['Saque', 'Ataque', 'Bloqueo'].map(s => (
              <div key={s} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-12">{s}</span>
                <div className="flex-1 bg-gray-200 rounded h-1.5">
                  <div className="bg-blue-500 rounded h-1.5 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: 8,
      title: 'Arma los equipos',
      desc: 'Cuando la pichanga esté llena, como organizador elige cuántos equipos quieres. "Auto" los balancea por nivel, "Manual" los armas tú.',
      mock: (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
          <p className="font-semibold text-sm">Armar equipos</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Equipos:</span>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
              <span className="text-xs font-bold text-blue-700 px-1">−</span>
              <span className="text-xs font-bold w-4 text-center">3</span>
              <span className="text-xs font-bold text-blue-700 px-1">+</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-blue-600 rounded-lg py-1.5 text-center text-xs text-white font-medium">Auto ✨</div>
            <div className="flex-1 bg-gray-100 rounded-lg py-1.5 text-center text-xs text-gray-600">Manual</div>
          </div>
        </div>
      ),
    },
    {
      num: 9,
      title: 'Comparte los equipos',
      desc: 'Cuando los equipos estén listos, compártelos por WhatsApp o copia el link. Cada equipo tiene su color para identificarse fácil.',
      mock: (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
          <div className="flex gap-2">
            {[
              { color: 'bg-red-500', name: 'Equipo Rojo', players: ['Carlos M.', 'Diego Q.', 'Mario C.'] },
              { color: 'bg-blue-500', name: 'Equipo Azul', players: ['Roberto S.', 'Juan P.', 'Luis F.'] },
            ].map(t => (
              <div key={t.name} className={`flex-1 rounded-lg p-2 ${t.color} bg-opacity-10 border-2 ${t.color.replace('bg-', 'border-')}`}>
                <p className="text-xs font-bold mb-1">{t.name}</p>
                {t.players.map(p => <p key={p} className="text-xs text-gray-600">{p}</p>)}
              </div>
            ))}
          </div>
          <div className="bg-green-500 rounded-lg h-7 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">Compartir por WhatsApp</span>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">🏐 Cómo usar Pichangas</h1>
        <p className="text-gray-500 text-sm mt-2">Todo lo que necesitas saber para organizar tu pichanga perfecta</p>
      </div>

      <div className="space-y-6">
        {steps.map(step => (
          <div key={step.num} className="card flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {step.num}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-800 mb-1">{step.title}</h2>
              <p className="text-sm text-gray-500 mb-3">{step.desc}</p>
              <div className="max-w-xs">{step.mock}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 card bg-blue-50 border border-blue-100 text-center space-y-2">
        <p className="font-semibold text-blue-800">¿Listo para jugar?</p>
        <a href="/" className="btn-primary inline-block px-6">Ver pichangas disponibles</a>
      </div>
    </div>
  )
}
