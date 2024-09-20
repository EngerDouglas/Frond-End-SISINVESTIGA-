import cors from 'cors'

const ACCEPTED_ORIGINS = [ 
  'http://localhost:3000'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },

  credentials: true,
  // Metodos HTTP que permitiremos
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  // Cabecera o headers que permitiremos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  // Cabeceras expuestas en las respuestas al cliente
  exposedHeaders: ['X-Auth-Token', 'Content-Type', 'Accept'],
  // Tiempo en segundos del response de una solicituf preflight puede ser cahe
  maxAge: 86400, // 24 horas
})