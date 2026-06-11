import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || 'https://postos-combustivel-3.onrender.com';
const baseURL = rawBaseURL.replace(/\/+$|\s+$/g, '');

export const api = axios.create({
  baseURL,
  timeout: 60000, // 60s — necessário porque o Render hiberna e demora ~30-50s pra acordar
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry automático: tenta até 3 vezes em caso de timeout ou erro de rede
api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;

    // Só faz retry em timeout ou erro de rede (sem resposta do servidor)
    const isTimeout = error.code === 'ECONNABORTED';
    const isNetworkError = !error.response;

    if ((isTimeout || isNetworkError) && !config._retryCount) {
      config._retryCount = 0;
    }

    if ((isTimeout || isNetworkError) && config._retryCount < 2) {
      config._retryCount += 1;

      // Espera 3s antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.warn(`[API] Tentativa ${config._retryCount} de 2 para ${config.url}`);
      return api(config);
    }

    console.error('[API Error]', error.code, error.message);
    return Promise.reject(error);
  }
);