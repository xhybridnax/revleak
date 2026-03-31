import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'

const app = new Hono()

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
  // Por ahora es un stub que pasará el rate limit.
  return c.json({ message: 'Petición recibida correctamente (sin límite de tasa alcanzado).' });
})

const port = parseInt(process.env.PORT || '3001');

console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
