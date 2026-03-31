import { useState, useEffect } from 'react'
import type { AnalysisResult } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { jsPDF } from 'jspdf'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { useNavigate } from 'react-router-dom'

export function ResultsDashboard({ result }: { result: AnalysisResult }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const navigate = useNavigate()

  // 1. Número grande animado (0 a result.score en 1.5s)
  useEffect(() => {
    let startTime: number
    const duration = 1500
    const finalScore = result.score

    const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4)

    const animate = (time: number) => {
      if (!startTime) startTime = time
      const progress = time - startTime
      const percent = Math.min(progress / duration, 1)
      setAnimatedScore(Math.floor(finalScore * easeOutQuart(percent)))

      if (progress < duration) {
        requestAnimationFrame(animate)
      } else {
        setAnimatedScore(finalScore)
      }
    }
    requestAnimationFrame(animate)
  }, [result.score])

  // Lógica de colores del score rating  
  const getScoreColor = (score: number) => {
    if (score <= 30) return 'text-red-500'
    if (score <= 60) return 'text-amber-500'
    if (score <= 85) return 'text-emerald-500'
    return 'text-blue-500'
  }

  // Estilos visuales por tipo de leak severity
  const getSeverityClasses = (severity: string) => {
    if (severity === 'high') return 'bg-red-50 text-red-700 border-red-200'
    if (severity === 'medium') return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  // Colores absolutos para el SVG del BarChart de Recharts
  const getSeverityHexColor = (severity: string) => {
    if (severity === 'high') return '#ef4444'   // red-500
    if (severity === 'medium') return '#f59e0b' // amber-500
    return '#10b981'                            // emerald-500
  }

  const generatePDF = async () => {
    setIsGeneratingPdf(true)
    try {
      const doc = new jsPDF()

      doc.setFont('helvetica', 'normal')
      
      // Título
      doc.setFontSize(22)
      doc.text('RevLeak — Diagnóstico de Ingresos', 20, 20)
      
      // Fecha
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30)

      // Score
      doc.setFontSize(18)
      doc.setTextColor(0)
      doc.text(`Score: ${result.score} / 100 (${result.scoreLabel})`, 20, 45)

      // Total mensual
      doc.setFontSize(16)
      doc.setTextColor(220, 38, 38)
      doc.text(`Total estimado en fugas: -$${result.totalMonthlyLeak.toLocaleString('en-US')} / mes`, 20, 55)

      // Resumen
      doc.setFontSize(11)
      doc.setTextColor(50)
      const splitSummary = doc.splitTextToSize(`Resumen: ${result.summary}`, 170)
      doc.text(splitSummary, 20, 65)

      let yPos = 65 + (splitSummary.length * 6) + 10

      // Fugas detectadas
      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text('1. Fugas detectadas', 20, yPos)
      yPos += 10

      doc.setFontSize(11)
      result.leaks.forEach((leak, idx) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        doc.setTextColor(0)
        doc.setFont('helvetica', 'bold')
        doc.text(`${idx + 1}. ${leak.name} (-$${leak.monthlyLoss.toLocaleString('en-US')})`, 20, yPos)
        yPos += 6
        
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80)
        doc.text(`Severidad: ${leak.severity.toUpperCase()} | Categoría: ${leak.category}`, 20, yPos)
        yPos += 6

        const splitDesc = doc.splitTextToSize(leak.description, 170)
        doc.text(splitDesc, 20, yPos)
        yPos += (splitDesc.length * 5) + 5
      })

      yPos += 5

      // Plan de acción
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.setFont('helvetica', 'bold')
      doc.text('2. Plan de acción prioritario', 20, yPos)
      yPos += 10

      doc.setFontSize(11)
      const sortedActions = [...result.actions].sort((a,b)=>a.priority-b.priority)
      sortedActions.forEach((action) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        doc.setTextColor(0)
        doc.setFont('helvetica', 'bold')
        doc.text(`Prioridad ${action.priority}: ${action.title}`, 20, yPos)
        yPos += 6

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80)
        doc.text(`Impacto: ${action.estimatedImpact} | Tiempo: ${action.timeToImplement}`, 20, yPos)
        yPos += 6

        const splitActionDesc = doc.splitTextToSize(action.description, 170)
        doc.text(splitActionDesc, 20, yPos)
        yPos += (splitActionDesc.length * 5) + 5
      })

      // Footer
      const pageCount = doc.getNumberOfPages()
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(9)
        doc.setTextColor(150)
        doc.text('Generado por RevLeak — revleak.app', 105, 290, { align: 'center' })
      }

      doc.save('revleak-diagnostico.pdf')
    } catch (error) {
      console.error('Error generando PDF:', error)
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  // Preparar fugas ordenadas por monto de pérdida (descendente)
  const sortedLeaks = [...result.leaks].sort((a, b) => b.monthlyLoss - a.monthlyLoss)

  return (
    <div id="diagnosis-report" className="max-w-5xl mx-auto space-y-16 p-4 md:p-8 animate-in fade-in zoom-in duration-500">
      
      {/* SECCION 1 — Score header */}
      <section className="text-center space-y-4 pt-8">
        <div className={`text-8xl md:text-9xl font-extrabold tabular-nums tracking-tighter ${getScoreColor(result.score)}`}>
          {animatedScore}
        </div>
        <div className="text-xl md:text-2xl font-bold text-slate-700 tracking-tight uppercase">
          {result.scoreLabel}
        </div>
        <div className="text-2xl md:text-4xl font-extrabold text-red-600 mt-8 tracking-tight">
          - ${result.totalMonthlyLeak.toLocaleString('en-US')} perdidos por mes
        </div>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed mt-4">
          {result.summary}
        </p>
      </section>

      {/* SECCION 2 — Fugas detectadas */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">1</div>
          <h2 className="text-2xl font-bold text-slate-900">Mapeo de fugas exactas</h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {sortedLeaks.map((leak, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">{leak.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider ${getSeverityClasses(leak.severity)}`}>
                    {leak.severity}
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{leak.description}</p>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  {leak.category}
                </div>
                <div className="text-xl font-black text-red-500">
                  - ${leak.monthlyLoss.toLocaleString('en-US')} <span className="text-sm font-medium text-red-400">/ mes</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart visualizando fugas */}
        <div className="h-[350px] w-full mt-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hidden md:block">
          <h4 className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-6">Proporción de pérdidas mensuales</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={sortedLeaks}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis type="number" tickFormatter={(val) => `$${val.toLocaleString()}`} stroke="#94a3b8" fontSize={12} />
              <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 12, fill: '#334155', fontWeight: 500 }} />
              <Tooltip 
                formatter={(value: unknown) => [`$${(value as number).toLocaleString()}`, 'Pérdida mensual por fuga']}
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="monthlyLoss" radius={[0, 6, 6, 0]} maxBarSize={40}>
                {sortedLeaks.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getSeverityHexColor(entry.severity)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* SECCION 3 — Plan de accion */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">2</div>
          <h2 className="text-2xl font-bold text-slate-900">Plan de acción prioritario</h2>
        </div>
        
        <div className="space-y-4">
          {result.actions.sort((a,b)=>a.priority-b.priority).map((action, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:border-blue-200 transition-colors">
              {/* Acordeon decorativo priority */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-700 font-black text-xl border border-blue-100">
                {action.priority}
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-bold text-lg text-slate-900">{action.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{action.description}</p>
                
                <div className="flex flex-wrap gap-3 pt-3">
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
                    Impacto: {action.estimatedImpact}
                  </span>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">
                    Tiempo de impl.: {action.timeToImplement}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCION 4 — CTA */}
      <section className="flex flex-col sm:flex-row gap-4 pt-12 border-t border-slate-200 justify-center" data-html2canvas-ignore="true">
        <Button variant="outline" size="lg" onClick={generatePDF} disabled={isGeneratingPdf} className="w-full sm:w-auto h-14 px-10 text-base font-semibold border-slate-300">
          {isGeneratingPdf ? (
            <><Loader2 className="w-5 h-5 mr-3 text-slate-500 animate-spin" /> Generando PDF...</>
          ) : (
            <><Download className="w-5 h-5 mr-3 text-slate-500" /> Descargar diagnóstico PDF</>
          )}
        </Button>
        <Button size="lg" onClick={() => navigate('/')} className="w-full sm:w-auto h-14 px-10 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white border-0">
          Realizar nuevo diagnóstico
        </Button>
      </section>
      
    </div>
  )
}
