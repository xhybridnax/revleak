import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Clock, BrainCircuit, DollarSign } from 'lucide-react'

export function Home() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="max-w-4xl w-full space-y-12">
        
        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter drop-shadow-sm">
            RevLeak
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto">
            Descubre cuánto dinero está perdiendo tu negocio silenciosamente cada mes.
          </p>
        </div>

        <div className="pt-4">
          <Button 
            size="lg" 
            className="h-16 px-10 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-blue-500/20 transition-all hover:-translate-y-1 rounded-2xl" 
            onClick={() => navigate('/analyze')}
          >
            Empezar diagnóstico gratis
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pt-16 mt-8 border-t border-slate-200">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight">Diagnóstico en 2 minutos</h3>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-sm">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight">Análisis con Inteligencia Artificial</h3>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-sm">
              <DollarSign className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight">Resultados cuantificados en dinero</h3>
          </div>
        </div>
        
      </div>
    </main>
  )
}
