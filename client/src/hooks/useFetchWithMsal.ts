import { useState, useCallback, useEffect } from "react";
import { 
  InteractionRequiredAuthError, 
  InteractionStatus,
  SilentRequest
} from "@azure/msal-browser";
import { useMsal, useAccount } from "@azure/msal-react";
import { apiRequest } from "../lib/msal";
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
  const { instance, inProgress } = useMsal();
  const account = useAccount();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to acquire token and make API request
  const makeRequest = useCallback(async () => {
    if (!requestConfig || !requestConfig.url) return;

    setLoading(true);
    setError(null);

    try {
      // Wait for any existing interaction to complete
      if (inProgress !== InteractionStatus.None) {
        return;
      }

      // Get token silently
      const tokenRequest: SilentRequest = {
        account: account || undefined,
        scopes: apiRequest.scopes,
      };

      let authResult;
      try {
        authResult = await instance.acquireTokenSilent(tokenRequest);
      } catch (silentError) {
        // If silent token acquisition fails, try with interaction
        if (silentError instanceof InteractionRequiredAuthError) {
          authResult = await instance.acquireTokenPopup(tokenRequest);
        } else {
          throw silentError;
        }
      }

      // Use our utility function to make the authenticated request
      const responseData = await authenticatedFetch(
        requestConfig.url,
        authResult.accessToken,
        requestConfig.method || 'GET',
        requestConfig.body
      );
      
      setData(responseData as T);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [requestConfig, instance, account, inProgress]);

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
