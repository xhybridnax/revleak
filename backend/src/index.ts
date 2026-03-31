import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

const port = parseInt(process.env.PORT || '3001');

console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
