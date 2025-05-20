import { useState, useCallback, useEffect } from "react";
import { InteractionType } from "@azure/msal-browser";
import { useMsalAuthentication } from "@azure/msal-react";
import { apiRequest } from "../lib/msal";
import { authenticatedFetch } from "../lib/queryClient";

export interface RequestConfig {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

// A function that can create a request configuration, optionally with parameters
export type RequestConfigFactory<P = void> = 
  P extends void 
    ? () => RequestConfig 
    : (params: P) => RequestConfig;

interface FetchResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: (params?: any) => Promise<void>;
}

export function useFetchWithMsal<T, P = void>(
  requestConfigOrFactory: RequestConfig | RequestConfigFactory<P> | null,
  options?: {
    immediate?: boolean; // Whether to fetch data immediately
    dependencies?: any[]; // Dependencies for refetching
    initialParams?: P; // Initial parameters for the request factory
  }
): FetchResult<T> {
  // Use the useMsalAuthentication hook to acquire tokens silently
  const { result, error: authError, acquireToken } = useMsalAuthentication(
    InteractionType.Silent,
    { scopes: apiRequest.scopes }
  );
  
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentParams, setCurrentParams] = useState<P | undefined>(options?.initialParams);

  // Helper to get the current request config
  const getRequestConfig = useCallback(
    (params?: P): RequestConfig | null => {
      if (!requestConfigOrFactory) return null;
      
      // If it's a direct RequestConfig object
      if ('url' in requestConfigOrFactory) {
        return requestConfigOrFactory;
      }
      
      // It's a factory function - call it with params or currentParams
      const effectiveParams = params !== undefined ? params : currentParams;
      
      // For factories that don't need params (P extends void)
      if (typeof effectiveParams === 'undefined' && typeof requestConfigOrFactory === 'function') {
        return (requestConfigOrFactory as any)();
      }
      
      // For factories that need params
      return (requestConfigOrFactory as any)(effectiveParams);
    },
    [requestConfigOrFactory, currentParams]
  );

  // Function to make API request with token
  const makeRequest = useCallback(async (params?: P) => {
    // If params are provided, update the current params
    if (params !== undefined) {
      setCurrentParams(params);
    }
    
    const requestConfig = getRequestConfig(params);
    if (!requestConfig || !requestConfig.url) return;

    setLoading(true);
    setError(null);

    try {
      // Check if we have a valid authentication result with an access token
      if (!result?.accessToken) {
        // If no token, try to acquire one
        const authResult = await acquireToken();
        if (!authResult?.accessToken) {
          throw new Error("Failed to acquire access token");
        }
      }

      // Use our utility function to make the authenticated request
      // At this point we should have an access token from either result or acquireToken
      const accessToken = result?.accessToken || '';
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
  }, [getRequestConfig, result, authError, acquireToken]);

  // Function to manually trigger a refetch, optionally with new params
  const refetch = useCallback(async (params?: P) => {
    await makeRequest(params);
  }, [makeRequest]);

  // Effect to fetch data on mount or when dependencies change
  useEffect(() => {
    const requestConfig = getRequestConfig();
    if (options?.immediate !== false && requestConfig && result?.accessToken) {
      makeRequest();
    }
  }, [makeRequest, getRequestConfig, options?.immediate, result, ...(options?.dependencies || [])]);

  return { data, error, loading, refetch };
}
