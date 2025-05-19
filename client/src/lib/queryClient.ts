// Helper function to check if response is ok
export async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
      throw new Error(errorData.message || `HTTP error ${res.status}`);
    } catch (e) {
      if (e instanceof Error && e.message) {
        throw e;
      }
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }
  }
}

// Simple fetch API wrapper for authenticated requests
export async function authenticatedFetch(
  url: string,
  token: string,
  method = "GET",
  body?: any
) {
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
  
  const options: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {})
  };
  
  const response = await fetch(url, options);
  await throwIfResNotOk(response);
  
  if (response.headers.get("Content-Type")?.includes("json")) {
    return await response.json();
  }
  
  return await response.text();
}
