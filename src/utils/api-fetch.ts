type FetchOptions = RequestInit & {
  fetchBody?: unknown;
};

export async function apiFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    body: options.fetchBody ? JSON.stringify(options.fetchBody) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
