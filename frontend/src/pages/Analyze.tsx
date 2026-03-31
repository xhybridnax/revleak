import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingForm } from '@/components/OnboardingForm'
import { LoadingScreen } from '@/components/LoadingScreen'
import { analyzeMetrics } from '@/lib/api'
import type { BusinessInput } from '@/lib/types'

export function Analyze() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (data: BusinessInput) => {
    setIsLoading(true)
    try {
      const result = await analyzeMetrics(data)
      navigate(`/results/${result.id}`)
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Error desconocido al analizar.')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 animate-in fade-in duration-500">
      <OnboardingForm onSubmit={handleSubmit} isLoading={isLoading} />
    </main>
  )
}
