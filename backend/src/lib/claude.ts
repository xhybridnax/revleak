import { GoogleGenerativeAI } from '@google/generative-ai';
import { BusinessInput, AnalysisResult } from './types';

const systemPrompt = `You are an expert Revenue Operations analyst specializing in identifying and quantifying revenue leaks in small and medium businesses. Given business metrics, identify 3-5 specific revenue leaks, estimate monthly money lost per leak based on the input data, and provide 3 actionable recommendations prioritized by ROI. Scoring: 0-30 Critico, 31-60 En riesgo, 61-85 Saludable, 86-100 Optimo. ALWAYS respond with valid JSON only. No markdown, no explanation.
JSON structure:
{
  "score": number,
  "scoreLabel": string,
  "totalMonthlyLeak": number,
  "summary": string (3-4 sentences in Spanish),
  "leaks": [{"name": string, "description": string, "monthlyLoss": number, "severity": "high"|"medium"|"low", "category": "retention"|"conversion"|"pricing"|"cac"|"process"}],
  "actions": [{"title": string, "description": string, "estimatedImpact": string, "timeToImplement": string, "priority": 1|2|3}]
}`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function analyzeBusinessMetrics(input: BusinessInput): Promise<AnalysisResult> {
  const userMessage = `Por favor, evalúa las siguientes métricas de negocio y detecta fugas de ingresos:
- Industria: ${input.industry}
- Ingresos Mensuales: $${input.monthlyRevenue}
- Tasa de Churn: ${input.churnRate}%
- Ticket Promedio: $${input.avgTicket}
- Canal de Adquisición principal: ${input.acquisitionChannel}
- Costo de Adquisición de Cliente (CAC): $${input.cac}
- Días del Ciclo de Ventas: ${input.salesCycleDays}
- ¿Tiene procesos documentados?: ${input.hasDocumentedProcess ? 'Sí' : 'No'}`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    systemInstruction: systemPrompt,
  });

  const response = await model.generateContent(userMessage);
  const messageContent = response.response.text();

  try {
    // Intentar limpiar posibles backticks de markdown que el modelo agregue a pesar de las instrucciones
    const jsonStr = messageContent.trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
    const result: AnalysisResult = JSON.parse(jsonStr);
    return result;
  } catch (error) {
    throw new Error(`Excepción procesando JSON: ${(error as Error).message}. Respuesta de la IA: ${messageContent}`);
  }
}
