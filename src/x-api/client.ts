export interface XApiClient {
  getJson<T>(
    path: string,
    query?: Record<string, string | number | undefined>,
  ): Promise<T>;
}

export function createXApiClient(
  accessToken: string,
  baseUrl = "https://api.x.com",
): XApiClient {
  async function getJson<T>(
    path: string,
    query: Record<string, string | number | undefined> = {},
  ): Promise<T> {
    const url = new URL(path, baseUrl);
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`X API request failed with ${response.status}: ${text}`);
    }

    return (await response.json()) as T;
  }

  return { getJson };
}
