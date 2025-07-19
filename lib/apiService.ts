
const BASE_URL = 'http://192.168.1.102:3000';

interface RequestOptions extends RequestInit {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

export async function apiRequest<T>(method: RequestOptions['method'], path: string, data?: any): Promise<T> {
  const url = `${BASE_URL}${path}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const options: RequestOptions = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `Erro na API: Status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
      } catch (_jsonError) {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);

  } catch (error: any) {
    console.error(`[API Request Error] (${method} ${path}):`, error.message);
    if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
      throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão e a URL da API.');
    }
    throw error;
  }
}