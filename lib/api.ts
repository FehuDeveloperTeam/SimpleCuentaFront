// lib/api.ts
import axios from 'axios';

// ¡¡¡IMPORTANTE: REEMPLAZA ESTO CON LA URL DE TU BACKEND DESPLEGADO EN RENDER!!!
// Debe empezar con 'https://'
const API_URL = 'https://finanzasparatodos-api.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de tiempo de espera
});

export default api;