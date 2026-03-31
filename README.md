# RevLeak — Diagnóstico de Fugas de Ingresos

![Demo RevLeak](assets/demo.gif)

[![Demo Live](https://img.shields.io/badge/Demo%20Live-144.225.147.104-blue?style=for-the-badge)](http://144.225.147.104)

RevLeak es una herramienta web donde cualquier dueño de PYME ingresa métricas básicas de su negocio y recibe un **diagnóstico generado por IA** que identifica sus principales fugas de ingresos, las cuantifica en dinero mensual perdido, y entrega un plan de acción priorizado.

---

## 🚀 Demo en vivo

**[http://144.225.147.104](http://144.225.147.104)**

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 19 + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui (Base UI) |
| **Backend** | Hono + Node.js + TypeScript |
| **IA** | Google Gemini 2.5 Flash |
| **Base de datos** | Supabase (PostgreSQL) |
| **Infraestructura** | CubePath VPS (Miami) |

---

## 📊 Flujo de uso

```
1. Formulario (3 pasos)     →  El usuario ingresa métricas de su negocio
2. IA analiza                →  Gemini evalúa los datos y detecta fugas
3. Dashboard de resultados   →  Score, fugas cuantificadas y plan de acción
4. Descarga PDF              →  Reporte profesional descargable
```

**Paso 1 — Tu Negocio:** Industria, ingreso mensual, canal de adquisición.

**Paso 2 — Tus Clientes:** Tasa de churn, ticket promedio, costo de adquisición (CAC).

**Paso 3 — Tu Proceso:** Ciclo de ventas en días, si tiene procesos documentados.

Al enviar, la IA genera un diagnóstico con:
- 📈 **Score de salud** (0–100) con clasificación: Crítico, En riesgo, Saludable u Óptimo
- 💸 **Fugas detectadas** con monto mensual perdido por cada una
- ✅ **Plan de acción** con 3 recomendaciones priorizadas por ROI
- 📄 **Descarga PDF** del diagnóstico completo

---

## 🏗️ Cómo se usa CubePath

RevLeak corre en un **VPS gp.nano** de [CubePath](https://cubepath.io) ubicado en Miami:

- **Nginx** como reverse proxy — sirve el frontend estático y redirige `/api/*` al servidor Node
- **PM2** como process manager — mantiene el backend corriendo y lo reinicia automáticamente
- **DDoS protection** incluida en el plan
- **Control total del servidor** — acceso root vía SSH para configuración completa

---

## ⚙️ Setup local

### Prerrequisitos

- Node.js 18+
- npm
- Una API Key de [Google AI Studio](https://aistudio.google.com/apikey)
- Un proyecto en [Supabase](https://supabase.com)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/revleak.git
cd revleak

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Configurar variables de entorno del backend
# Crear/editar backend/.env con:
#   GEMINI_API_KEY=tu_api_key_de_google
#   SUPABASE_URL=https://tu-proyecto.supabase.co
#   SUPABASE_ANON_KEY=tu_anon_key
#   PORT=3001

# 4. Instalar dependencias del frontend
cd ../frontend
npm install

# 5. Configurar variables de entorno del frontend
# Crear/editar frontend/.env con:
#   VITE_API_URL=http://localhost:3001
```

### Ejecución

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5174` y el backend en `http://localhost:3001`.

---

## 📁 Estructura del proyecto

```
revleak/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Servidor Hono + endpoints API
│   │   └── lib/
│   │       ├── claude.ts         # Integración con Google Gemini
│   │       ├── supabase.ts       # Cliente de Supabase
│   │       └── types.ts          # Interfaces compartidas
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── OnboardingForm.tsx     # Wizard de 3 pasos
│   │   │   ├── ResultsDashboard.tsx   # Dashboard + generación PDF
│   │   │   ├── LoadingScreen.tsx      # Pantalla de carga
│   │   │   └── ui/                    # Componentes shadcn/ui
│   │   ├── pages/
│   │   │   ├── Home.tsx               # Landing page
│   │   │   ├── Analyze.tsx            # Página del formulario
│   │   │   └── Results.tsx            # Página de resultados
│   │   ├── lib/
│   │   │   ├── api.ts                 # Funciones de API
│   │   │   └── types.ts              # Tipos TypeScript
│   │   ├── App.tsx                    # Router principal
│   │   └── main.tsx                   # Entry point
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🔌 API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/analyze` | Recibe métricas del negocio, genera diagnóstico con IA y lo persiste en Supabase |
| `GET` | `/api/results/:id` | Obtiene un diagnóstico previamente generado por su ID |
| `GET` | `/api/health` | Health check del servidor |

---

## 👤 Autor

**Armando Dávila**
Gabano SpA · Iquique, Chile
**HYBRIDNA** · [https://hybridna.cl](https://hybridna.cl)
