import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Hook to manage search parameters with type safety
 */
export function useSearchParamsState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = useCallback((key: string): string => {
    return searchParams.get(key) || '';
  }, [searchParams]);

  const setParam = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const setParams = useCallback((params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return {
    getParam,
    setParam,
    setParams,
    searchParams
  };
}