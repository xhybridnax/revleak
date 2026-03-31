import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getResults } from '@/lib/api'
import type { AnalysisResult } from '@/lib/types'
import { LoadingScreen } from '@/components/LoadingScreen'
import { ResultsDashboard } from '@/components/ResultsDashboard'
import { Button } from '@/components/ui/button'

export function Results() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return;
    
    getResults(id)
      .then(data => {
        setResult(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError(true)
        setLoading(false)
      })
  }, [id])

  if (loading) return <LoadingScreen />

  if (error || !result) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Análisis no encontrado</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">
          El diagnóstico que intentas buscar no existe o está inaccesible en este momento.
        </p>
        <Button onClick={() => navigate('/')} size="lg" className="h-14 px-8 font-bold">
          Volver al inicio
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ResultsDashboard result={result} />
    </div>
  )
}
