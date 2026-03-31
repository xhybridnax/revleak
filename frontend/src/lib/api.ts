import type { BusinessInput, AnalysisResult } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function analyzeMetrics(input: BusinessInput): Promise<AnalysisResult> {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || 'Ocurrió un error al analizar tus métricas')
  }
  
  return response.json()
}

export async function getResults(id: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_URL}/api/results/${id}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Analysis not found')
    }
    throw new Error('Ocurrió un error al cargar los resultados')
  }
  
  return response.json()
}
