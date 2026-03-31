import { useState } from 'react'
import type { BusinessInput } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Building2, DollarSign, Megaphone, Users, Ticket, Target, Calendar, FileCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'

export interface OnboardingFormProps {
  onSubmit: (data: BusinessInput) => void
  isLoading: boolean
}

const INDUSTRIES = [
  'Retail',
  'SaaS/Tech',
  'Servicios',
  'Gastronomia',
  'Construccion/Mineria',
  'Salud',
  'Educacion',
  'Otro'
]

const CHANNELS = [
  'Referidos',
  'Redes sociales',
  'Publicidad pagada',
  'Ventas directas',
  'SEO',
  'Otro'
]

export function OnboardingForm({ onSubmit, isLoading }: OnboardingFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [formData, setFormData] = useState<Partial<BusinessInput>>({
    churnRate: 10,
    hasDocumentedProcess: false
  })

  // Validaciones
  const isStep1Valid = !!formData.industry && !!formData.monthlyRevenue && !!formData.acquisitionChannel;
  const isStep2Valid = typeof formData.churnRate === 'number' && !!formData.avgTicket && !!formData.cac;
  const isStep3Valid = !!formData.salesCycleDays && typeof formData.hasDocumentedProcess === 'boolean';

  const progressValue = step === 1 ? 33 : step === 2 ? 66 : 100

  const handleNext = () => setStep((p) => Math.min(p + 1, 3) as 1 | 2 | 3)
  const handlePrev = () => setStep((p) => Math.max(p - 1, 1) as 1 | 2 | 3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isStep1Valid && isStep2Valid && isStep3Valid) {
      onSubmit(formData as BusinessInput)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <div className="mb-6">
        <Progress value={progressValue} className="h-2" />
        <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
          <span>Tu Negocio</span>
          <span>Tus Clientes</span>
          <span>Tu Proceso</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative overflow-hidden min-h-[500px] flex flex-col justify-between">
        <div className="relative flex-1">
          {/* PASO 1 */}
          <div className={`space-y-6 transition-opacity duration-300 relative ${step === 1 ? 'block opacity-100 pointer-events-auto' : 'hidden opacity-0 pointer-events-none'}`}>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tu Negocio</h2>
            <p className="text-slate-500 text-sm">Empecemos con la estructura general de tu empresa.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-500" /> Industria</Label>
                <Select value={formData.industry as string} onValueChange={(val: string | null) => { if (val) setFormData({ ...formData, industry: val }) }}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Selecciona tu industria" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">El sector principal donde opera tu negocio.</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-slate-500" /> Ingreso Mensual (USD)</Label>
                <Input type="number" min={0} placeholder="Ej. 50000" className="h-12" value={formData.monthlyRevenue || ''} onChange={(e) => setFormData({ ...formData, monthlyRevenue: Number(e.target.value) })} />
                <p className="text-xs text-slate-500 mt-1">Total facturado en un mes promedio, antes de gastos. Ej: si vendes $3.000.000 CLP al mes, convierte a USD según el tipo de cambio.</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Megaphone className="w-4 h-4 text-slate-500" /> Canal de Adquisición</Label>
                <Select value={formData.acquisitionChannel as string} onValueChange={(val: string | null) => { if (val) setFormData({ ...formData, acquisitionChannel: val }) }}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Canal principal" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map(ch => <SelectItem key={ch} value={ch}>{ch}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">Cómo llega la mayoría de tus clientes nuevos. Ej: si el 70% te encuentra por Instagram, elige Redes sociales.</p>
              </div>
            </div>
          </div>

          {/* PASO 2 */}
          <div className={`space-y-6 transition-opacity duration-300 relative ${step === 2 ? 'block opacity-100 pointer-events-auto' : 'hidden opacity-0 pointer-events-none'}`}>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tus Clientes</h2>
            <p className="text-slate-500 text-sm">Ayúdanos a entender cuánto te cuesta ganar y retener cada cliente.</p>

            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-500" /> Tasa de Churn (Rotación)</Label>
                  <span className="font-semibold text-sm text-blue-600">{formData.churnRate}%</span>
                </div>
                <Slider 
                  value={formData.churnRate ?? 0} 
                  onValueChange={(val: number | readonly number[]) => setFormData({ ...formData, churnRate: Array.isArray(val) ? val[0] : val })} 
                  max={100} step={1} className="py-2" 
                />
                <p className="text-xs text-slate-500 mt-1">Porcentaje de clientes que no vuelven a comprarte. Ej: si de 100 clientes del mes pasado, 20 no repitieron, tu churn es 20%.</p>
              </div>

              <div className="space-y-2 mt-4">
                <Label className="flex items-center gap-2"><Ticket className="w-4 h-4 text-slate-500" /> Ticket Promedio (USD)</Label>
                <Input type="number" min={0} placeholder="Ej. 1500" className="h-12" value={formData.avgTicket || ''} onChange={(e) => setFormData({ ...formData, avgTicket: Number(e.target.value) })} />
                <p className="text-xs text-slate-500 mt-1">Cuánto gasta en promedio cada cliente por compra o servicio. Ej: si vendes servicios de $150.000 CLP, equivale a ~$160 USD.</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Target className="w-4 h-4 text-slate-500" /> CAC (Costo Adquisición USD)</Label>
                <Input type="number" min={0} placeholder="Ej. 300" className="h-12" value={formData.cac || ''} onChange={(e) => setFormData({ ...formData, cac: Number(e.target.value) })} />
                <p className="text-xs text-slate-500 mt-1">Cuánto gastas en marketing y ventas para conseguir un cliente nuevo. Ej: si gastas $200.000 CLP en ads y consigues 10 clientes, tu CAC es $20.000 CLP (~$22 USD).</p>
              </div>
            </div>
          </div>

          {/* PASO 3 */}
          <div className={`space-y-6 transition-opacity duration-300 relative ${step === 3 ? 'block opacity-100 pointer-events-auto' : 'hidden opacity-0 pointer-events-none'}`}>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tu Proceso</h2>
            <p className="text-slate-500 text-sm">Detalles sobre cómo tu equipo de ventas cierra negocios.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-500" /> Ciclo de Ventas (Días)</Label>
                <Input type="number" min={0} placeholder="Ej. 45" className="h-12" value={formData.salesCycleDays || ''} onChange={(e) => setFormData({ ...formData, salesCycleDays: Number(e.target.value) })} />
                <p className="text-xs text-slate-500 mt-1">Días promedio desde que un cliente potencial te contacta hasta que paga. Ej: una venta por Instagram puede cerrarse en 1-2 días; un contrato B2B puede tardar 30-60 días.</p>
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm mt-4">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2"><FileCheck className="w-4 h-4 text-slate-500"/> Proceso Documentado</Label>
                  <p className="text-sm text-slate-500">¿Cuentas con un playbook de ventas estandarizado?</p>
                </div>
                <Switch 
                  checked={formData.hasDocumentedProcess} 
                  onCheckedChange={(checked) => setFormData({ ...formData, hasDocumentedProcess: checked })} 
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Si tienes un guión, protocolo o paso a paso escrito de cómo vendes. Ej: un script de WhatsApp, un proceso en Notion, o un CRM configurado cuentan como proceso documentado.</p>
            </div>
          </div>
        </div>

        {/* CONTROLES */}
        <div className="flex gap-4 mt-8 pt-4 border-t border-slate-100">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handlePrev} className="w-12 h-12 p-0 flex-shrink-0" disabled={isLoading}>
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          )}

          {step < 3 ? (
            <Button 
              type="button" 
              className="flex-1 h-12 text-md font-medium" 
              onClick={handleNext} 
              disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
            >
              Siguiente <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="flex-1 h-12 text-md font-medium" 
              disabled={!isStep3Valid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Diagnósticando...
                </>
              ) : (
                'Diagnosticar mis ingresos'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
