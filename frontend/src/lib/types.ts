export interface BusinessInput {
  industry: string
  monthlyRevenue: number
  churnRate: number        // 0-100
  avgTicket: number
  acquisitionChannel: string
  cac: number
  salesCycleDays: number
  hasDocumentedProcess: boolean
}

export interface RevenueLeak {
  name: string
  description: string
  monthlyLoss: number
  severity: 'high' | 'medium' | 'low'
  category: 'retention' | 'conversion' | 'pricing' | 'cac' | 'process'
}

export interface ActionItem {
  title: string
  description: string
  estimatedImpact: string
  timeToImplement: string
  priority: 1 | 2 | 3
}

export interface AnalysisResult {
  id: string
  score: number
  scoreLabel: 'Critico' | 'En riesgo' | 'Saludable' | 'Optimo'
  totalMonthlyLeak: number
  leaks: RevenueLeak[]
  actions: ActionItem[]
  summary: string
}
