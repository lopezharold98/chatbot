# Chatbot Full-Stack

Una aplicación de chatbot inteligente construida con Next.js (frontend) y Node.js con Serverless Framework (backend). El chatbot puede responder preguntas sobre envíos, devoluciones, precios y estado de pedidos utilizando reglas predefinidas y opcionalmente OpenAI.

## 🏗️ Arquitectura

```
chatbot-fullstack/
├── frontend/                 # Aplicación Next.js (Puerto 3000)
│   ├── app/
│   │   ├── chat/
│   │   │   └── page.tsx     # Página principal del chat
│   │   ├── api/
│   │   │   └── health/
│   │   │       └── route.ts # Health check del frontend
│   │   └── layout.tsx
│   ├── components/
│   │   └── ChatInterface.tsx # Componente principal del chat
│   ├── types/
│   │   └── chat.ts          # Tipos TypeScript
│   └── .env.local           # Variables de entorno del frontend
├── backend/                 # Lógica serverless (Puerto 3001)
│   ├── src/
│   │   ├── handlers/
│   │   │   ├── chat.ts      # Handler principal del chat
│   │   │   └── health.ts    # Handler de health check
│   │   ├── services/
│   │   │   ├── chatService.ts
│   │   │   └── llmService.ts
│   │   └── utils/
│   │       └── logger.ts
│   ├── serverless.yml       # Configuración serverless
│   └── .env                 # Variables de entorno del backend
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** versión 18 o superior
- **npm** o **yarn**
- **Clave de OpenAI** (opcional, para respuestas con IA)

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd chatbot-fullstack
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

#### Instalar Serverless Framework globalmente:
```bash
npm install -g serverless
```

#### Crear archivo `.env` en la carpeta `backend`:
```bash
# backend/.env
OPENAI_API_KEY=tu_clave_de_openai_aqui
NODE_ENV=development
```

> **Nota**: La clave de OpenAI es opcional. Sin ella, el chatbot funcionará solo con reglas predefinidas.

### 3. Configurar el Frontend

```bash
cd frontend
npm install
```

#### Crear archivo `.env.local` en la carpeta `frontend`:
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🎯 Ejecutar la Aplicación

### 1. Iniciar el Backend (Puerto 3001)

```bash
cd backend
serverless offline
```

Deberías ver:
```
Starting Offline at stage dev (us-east-1)
Offline [http for lambda] listening on http://localhost:3001

┌─────────────────────────────────────────────────────────────────────────────┐
│   POST    | http://localhost:3001/dev/api/chat                              │
│   OPTIONS | http://localhost:3001/dev/api/chat                              │
│   GET     | http://localhost:3001/dev/api/health                            │
└─────────────────────────────────────────────────────────────────────────────┘
Server ready: http://localhost:3001 🚀
```

### 2. Iniciar el Frontend (Puerto 3000)

En una nueva terminal:
```bash
cd frontend
npm run dev
```

### 3. Acceder a la Aplicación

Abre tu navegador en: **http://localhost:3000/chat**

## 📋 Funcionalidades

### Respuestas Automáticas por Reglas

El chatbot responde automáticamente a estas preguntas (insensible a mayúsculas/acentos):

- **Envío**: "¿Cómo funciona el envío?" → _"Los pedidos tardan 2–3 días hábiles a ciudades principales."_
- **Devolución**: "¿Puedo devolver un producto?" → _"Tienes 30 días para devolver; aplica política de estado y factura."_
- **Precio**: "¿Cuánto cuesta este producto?" → _"Los precios se actualizan a diario; verifica la ficha del producto."_
- **Estado de Pedido**: "¿Cuál es el estado de mi pedido?" → _Devuelve información de tracking mock_

### Respuestas con IA (OpenAI)

Para preguntas que no coinciden con las reglas, el sistema puede usar OpenAI para generar respuestas más inteligentes.

### ID de Cliente

Para consultas de estado de pedido, puedes ingresar un ID de cliente en el campo opcional para obtener información de tracking simulada.

## 🔧 Endpoints de la API

### Backend (Puerto 3001)

- **POST** `/dev/api/chat` - Procesar preguntas del chatbot
- **GET** `/dev/api/health` - Health check del backend

### Frontend (Puerto 3000)

- **GET** `/api/health` - Health check del frontend
- **GET** `/chat` - Interfaz principal del chat

## 📝 Estructura de Datos

### Petición al Chat
```json
{
  "question": "¿Cómo funciona el envío?",
  "customerId": "12345"
}
```

### Respuesta del Chat
```json
{
  "answer": "Los pedidos tardan 2–3 días hábiles a ciudades principales.",
  "source": "rules",
  "timestamp": "2025-08-28T19:30:00.000Z",
  "tracking": {
    "status": "EN_CAMINO",
    "eta": "48h",
    "carrier": "MockExpress"
  }
}
```

## 🧪 Pruebas

### Probar el Backend directamente

```bash
# Health check
curl http://localhost:3001/dev/api/health

# Enviar pregunta
curl -X POST http://localhost:3001/dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Cómo funciona el envío?"}'
```

### Preguntas de Ejemplo

1. **"¿Cómo funciona el envío?"** - Respuesta por reglas
2. **"¿Puedo devolver un producto?"** - Respuesta por reglas  
3. **"¿Cuánto cuesta?"** - Respuesta por reglas
4. **"estado de mi pedido"** (con Customer ID) - Información de tracking
5. **"¿Qué productos recomiendan?"** - Respuesta por IA (si OpenAI está configurado)

## 🚨 Solución de Problemas

### Error "Method not allowed"
- Verificar que el backend esté corriendo en puerto 3001
- Confirmar que la variable `NEXT_PUBLIC_API_URL` esté configurada correctamente

### Error "Variables resolution errored"
- Verificar que el archivo `.env` exista en la carpeta `backend`
- Confirmar que `OPENAI_API_KEY` esté definida (o comentar esa línea en `serverless.yml`)

### Puerto ya en uso
```bash
custom:
  serverless-offline:
    httpPort: 3001 
```

### Frontend no se conecta al backend
- Verificar que `NEXT_PUBLIC_API_URL` en `.env.local` apunte al puerto correcto
- Confirmar que ambos servidores estén corriendo

## Desarrollo

### Estructura del Proyecto

- **Frontend**: Next.js 13+ con App Router, TypeScript, Tailwind CSS
- **Backend**: Node.js, TypeScript, Serverless Framework, OpenAI API
- **Base de datos**: No requiere (usa datos mock)

### Scripts Disponibles

**Backend:**
```bash
npm run dev          # serverless offline
npm run build        # Compilar TypeScript
npm run deploy       # Deploy a AWS (si está configurado)
```

**Frontend:**
```bash
npm run dev          # Next.js desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # ESLint
```

## Tecnologías

### Frontend
- **Next.js 13+** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos

### Backend
- **Node.js** - Runtime
- **TypeScript** - Tipado estático
- **Serverless Framework** - Despliegue serverless
- **OpenAI API** - Inteligencia artificial (opcional)

## Seguridad

- Variables de entorno para configuración sensible
- Validación de entrada en el backend
- CORS configurado correctamente
- Rate limiting y timeouts configurados
- Logging estructurado para auditoría

## Licencia

Este proyecto está bajo la licencia MIT.

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

Copyright © Todos los derechos reservados