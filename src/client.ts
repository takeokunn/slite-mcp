import type { SliteConfig } from './types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface SliteClient {
  get<T>(endpoint: string, params?: RequestOptions['params']): Promise<T>;
  post<T>(endpoint: string, body?: unknown, params?: RequestOptions['params']): Promise<T>;
  put<T>(endpoint: string, body?: unknown, params?: RequestOptions['params']): Promise<T>;
  delete<T>(endpoint: string, params?: RequestOptions['params']): Promise<T>;
}

export function createSliteClient(config?: Partial<SliteConfig>): SliteClient {
  const apiToken = config?.apiToken ?? process.env.SLITE_API_TOKEN;

  if (!apiToken) {
    throw new Error('SLITE_API_TOKEN is required');
  }

  const baseUrl = 'https://api.slite.com/v1';

  function buildUrl(endpoint: string, params?: RequestOptions['params']): string {
    const fullUrl = new URL(`${baseUrl}${endpoint}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          fullUrl.searchParams.append(key, String(value));
        }
      }
    }
    return fullUrl.toString();
  }

  async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params } = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const requestUrl = buildUrl(endpoint, params);
      const response = await fetch(requestUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        const truncatedError =
          errorText.length > 200 ? `${errorText.substring(0, 200)}...` : errorText;
        throw new Error(`Slite API error (${response.status}): ${truncatedError}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return response.json() as Promise<T>;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    get<T>(endpoint: string, params?: RequestOptions['params']): Promise<T> {
      return request<T>(endpoint, { method: 'GET', params });
    },
    post<T>(endpoint: string, body?: unknown, params?: RequestOptions['params']): Promise<T> {
      return request<T>(endpoint, { method: 'POST', body, params });
    },
    put<T>(endpoint: string, body?: unknown, params?: RequestOptions['params']): Promise<T> {
      return request<T>(endpoint, { method: 'PUT', body, params });
    },
    delete<T>(endpoint: string, params?: RequestOptions['params']): Promise<T> {
      return request<T>(endpoint, { method: 'DELETE', params });
    },
  };
}
