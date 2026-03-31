import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import 'dotenv/config'
import { analyzeBusinessMetrics } from './lib/claude'
import { supabase } from './lib/supabase'
import { BusinessInput, AnalysisResult } from './lib/types'

const app = new Hono()

// CORS genérico para cualquier origen
app.use('*', cors())

// Manejador de errores global
app.onError((err, c) => {
  console.error('[Global Error]:', err)
  return c.json({ error: err.message || 'Internal Server Error' }, 500)
})

// Endpoint Health
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/', (c) => c.text('Hello Hono!'))

// Estructura para el Rate Limiter
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitInfo>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 5;

// Middleware de rate limit para /api/analyze
app.use('/api/analyze', async (c, next) => {
  const ip = c.req.header('x-real-ip') || 'unknown';
  const now = Date.now();
  
  const limitInfo = rateLimitMap.get(ip);
  
  if (limitInfo) {
    if (now > limitInfo.resetTime) {
      // El tiempo expiró, reseteamos contador
      rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    } else {
      // Dentro de la ventana de tiempo
      if (limitInfo.count >= MAX_REQUESTS) {
        return c.json({ error: 'Too many requests, try again later' }, 429);
      }
      limitInfo.count++;
    }
  } else {
    // Primer request para esta IP
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
  }
  
  await next();
});

// Endpoint base para el análisis
app.post('/api/analyze', async (c) => {
  try {
    const input: BusinessInput = await c.req.json();
    
    // Validación básica de campos de BusinessInput
    const isValid = 
      typeof input.industry === 'string' &&
      typeof input.monthlyRevenue === 'number' &&
      typeof input.churnRate === 'number' &&
      typeof input.avgTicket === 'number' &&
      typeof input.acquisitionChannel === 'string' &&
      typeof input.cac === 'number' &&
      typeof input.salesCycleDays === 'number' &&
      typeof input.hasDocumentedProcess === 'boolean';

    if (!isValid) {
      return c.json({ error: 'Faltan campos obligatorios o el formato de BusinessInput es incorrecto.' }, 400);
    }

    // Ejecuta el análisis LLM
    const result = await analyzeBusinessMetrics(input);

    // Guardar en la tabla 'analyses' de Supabase
    const { data, error } = await supabase
      .from('analyses')
      .insert([{
        input,
        output: result,
        score: result.score,
        industry: input.industry
      }])
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    // Retornar resultado sumando el id generado en Supabase
    return c.json({ ...result, id: data.id });
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      return c.json({ error: 'JSON mal formado en el cuerpo de la petición.' }, 400);
    }
    throw error;
  }
})

// Endpoint para consultar resultados previos
app.get('/api/results/:id', async (c) => {
  const id = c.req.param('id');
  
  const { data, error } = await supabase
    .from('analyses')
    .select('output, id')
    .eq('id', id)
    .single();

  if (error || !data) {
    return c.json({ error: 'Analysis not found' }, 404);
  }

  // Devolver el output combinando el id
  return c.json({ ...(data.output as AnalysisResult), id: data.id });
})

const port = parseInt(process.env.PORT || '3001');

console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
