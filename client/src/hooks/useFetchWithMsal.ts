import { useState, useCallback, useEffect } from "react";
import { InteractionType } from "@azure/msal-browser";
import { useMsalAuthentication } from "@azure/msal-react";
import { protectedResources } from "../lib/msal";
import { authenticatedFetch } from "../lib/queryClient";

interface RequestConfig {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

interface FetchResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useFetchWithMsal<T>(
  requestConfig: RequestConfig | null,
  options?: {
    immediate?: boolean; // Whether to fetch data immediately
    dependencies?: any[]; // Dependencies for refetching
  }
): FetchResult<T> {
  // Use the useMsalAuthentication hook to acquire tokens silently
  const { result, error: authError, acquireToken } = useMsalAuthentication(
    InteractionType.Silent,
    { scopes: protectedResources.PWMAPI.scopes }
  );
  
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to make API request with token
  const makeRequest = useCallback(async () => {
    if (!requestConfig || !requestConfig.url) return;

    setLoading(true);
    setError(null);

    try {
      // Check if we have a valid authentication result with an access token
      let accessToken: string;
      
      if (!result?.accessToken) {
        // If no token, try to acquire one
        const authResult = await acquireToken();
        if (!authResult?.accessToken) {
          throw new Error("Failed to acquire access token");
        }
        accessToken = authResult.accessToken;
      } else {
        accessToken = result.accessToken;
      }

      // Use our utility function to make the authenticated request
      const responseData = await authenticatedFetch(
        requestConfig.url,
        accessToken,
        requestConfig.method || 'GET',
        requestConfig.body
      );
      
      setData(responseData as T);
    } catch (err) {
      // Handle authentication errors
      if (authError) {
        setError(authError);
      } else {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      setLoading(false);
    }
  }, [requestConfig, result, authError, acquireToken]);

  // Function to manually trigger a refetch
  const refetch = useCallback(async () => {
    await makeRequest();
  }, [makeRequest]);

  // Effect to fetch data on mount or when dependencies change
  useEffect(() => {
    if (options?.immediate !== false && requestConfig) {
      makeRequest();
    }
  }, [makeRequest, options?.immediate, ...(options?.dependencies || [])]);

  return { data, error, loading, refetch };
}
