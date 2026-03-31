import { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'

const MESSAGES = [
  'Calculando fugas potenciales...',
  'Evaluando costo de adquisicion de clientes...',
  'Identificando oportunidades de mejora...',
  'Cuantificando el impacto financiero...',
  'Preparando tu diagnostico personalizado...'
]

export function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length)
    }, 2200)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white px-4 selection:bg-blue-900 selection:text-blue-50">
      
      <div className="flex flex-col items-center max-w-md w-full space-y-10">
        
        {/* Icono Central con Efecto */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-[40px] opacity-25 animate-pulse"></div>
          <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-3xl relative backdrop-blur-xl shrink-0">
            <BarChart3 className="w-16 h-16 text-blue-500 animate-pulse" strokeWidth={1.5} />
          </div>
        </div>

        {/* Textos */}
        <div className="space-y-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
            Analizando tu modelo de ingresos
          </h2>
          
          <div className="h-6 overflow-hidden flex items-center justify-center">
            {/* Animación que combina fade con el render del mensaje */}
            <p className="text-blue-300 text-sm md:text-base animate-pulse">
              {MESSAGES[msgIndex]}
            </p>
          </div>
        </div>

        {/* Progress Bar Indeterminada (Pulse Effect) */}
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/80 relative">
          <div className="absolute inset-y-0 w-[50%] animate-[pulse_1.5s_ease-in-out_infinite] bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          <div className="absolute inset-y-0 right-0 w-[50%] animate-[pulse_1.5s_ease-in-out_infinite_0.75s] bg-blue-400/50 rounded-full blur-[2px]"></div>
        </div>
        
      </div>
      
      {/* Pie de pantalla */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs font-medium text-slate-500">
          El analisis tarda 5-10 segundos
        </p>
      </div>
      
    </div>
  )
}
