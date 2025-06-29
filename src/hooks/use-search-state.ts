import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useDebounce } from './use-debounce';

interface UseSearchStateOptions {
  debounceMs?: number;
  navigateToSearch?: boolean;
  onSearch?: (query: string) => void;
}

/**
 * Centralized search state management to avoid conflicts between multiple search inputs
 */
export function useSearchState(options: UseSearchStateOptions = {}) {
  const {
    debounceMs = 500,
    navigateToSearch = false,
    onSearch
  } = options;

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitializedRef = useRef(false);
  const lastUrlSearchRef = useRef('');
  
  // Get search from URL
  const urlSearch = searchParams.get('search') || '';
  
  // Local state for immediate UI updates
  const [localSearch, setLocalSearch] = useState(urlSearch);
  
  // Debounced value for API calls and URL updates
  const debouncedSearch = useDebounce(localSearch, debounceMs);

  // Initialize on mount
  useEffect(() => {
    if (!isInitializedRef.current) {
      setLocalSearch(urlSearch);
      lastUrlSearchRef.current = urlSearch;
      isInitializedRef.current = true;
    }
  }, [urlSearch]);

  // Update URL when debounced search changes
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    // Only update URL if the debounced value is different from current URL
    if (debouncedSearch !== urlSearch) {
      const newParams = new URLSearchParams(searchParams);
      
      if (debouncedSearch.trim()) {
        newParams.set('search', debouncedSearch.trim());
      } else {
        newParams.delete('search');
      }
      
      setSearchParams(newParams, { replace: true });
      
      // Navigate to search page if needed
      if (navigateToSearch && debouncedSearch.trim() && location.pathname !== '/courses') {
        navigate(`/courses?search=${encodeURIComponent(debouncedSearch.trim())}`);
      }
    }
  }, [debouncedSearch, urlSearch, searchParams, setSearchParams, navigateToSearch, location.pathname, navigate]);

  // Call onSearch callback when debounced search changes
  useEffect(() => {
    if (isInitializedRef.current && debouncedSearch !== lastUrlSearchRef.current) {
      onSearch?.(debouncedSearch);
      lastUrlSearchRef.current = debouncedSearch;
    }
  }, [debouncedSearch, onSearch]);

  // Sync with external URL changes (but don't override user input during typing)
  useEffect(() => {
    if (urlSearch !== lastUrlSearchRef.current) {
      setLocalSearch(urlSearch);
      lastUrlSearchRef.current = urlSearch;
    }
  }, [urlSearch]);

  const updateSearch = useCallback((value: string) => {
    setLocalSearch(value);
  }, []);

  const clearSearch = useCallback(() => {
    setLocalSearch('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams, { replace: true });
    onSearch?.('');
  }, [searchParams, setSearchParams, onSearch]);

  const submitSearch = useCallback(() => {
    const trimmedSearch = localSearch.trim();
    const newParams = new URLSearchParams(searchParams);
    
    if (trimmedSearch) {
      newParams.set('search', trimmedSearch);
    } else {
      newParams.delete('search');
    }
    
    setSearchParams(newParams, { replace: true });
    onSearch?.(trimmedSearch);
    
    // Navigate to search page if needed
    if (navigateToSearch && trimmedSearch && location.pathname !== '/courses') {
      navigate(`/courses?search=${encodeURIComponent(trimmedSearch)}`);
    }
  }, [localSearch, searchParams, setSearchParams, onSearch, navigateToSearch, location.pathname, navigate]);

  return {
    searchValue: localSearch,
    debouncedSearch,
    urlSearch,
    updateSearch,
    clearSearch,
    submitSearch,
    isSearching: debouncedSearch !== localSearch
  };
}