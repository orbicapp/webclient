import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SearchIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

import { useDebounce } from '@/hooks/use-debounce';
import { useSearchParamsState } from '@/hooks/use-search-params';
import { cn } from '@/lib/utils/class.utils';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  variant?: 'header' | 'page';
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search courses, topics...",
  className,
  variant = 'header',
  onSearch,
  autoFocus = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getParam, setParam } = useSearchParamsState();
  const isInitializedRef = useRef(false);
  
  // Get initial search value from URL params
  const urlSearch = getParam('search');
  const [searchValue, setSearchValue] = useState(urlSearch);
  const [isFocused, setIsFocused] = useState(false);
  
  // Debounce search value to avoid excessive API calls
  const debouncedSearch = useDebounce(searchValue, 500);

  // Initialize search value from URL on mount
  useEffect(() => {
    if (!isInitializedRef.current) {
      setSearchValue(urlSearch);
      isInitializedRef.current = true;
    }
  }, [urlSearch]);

  // Update URL params when debounced search changes (but not on initial load)
  useEffect(() => {
    if (!isInitializedRef.current) return;

    // Only update if the debounced value is different from URL
    if (debouncedSearch !== urlSearch) {
      setParam('search', debouncedSearch);
      
      // Call onSearch callback if provided
      onSearch?.(debouncedSearch);
      
      // If we're not on courses page and have a search, navigate there
      if (location.pathname !== '/courses' && debouncedSearch) {
        navigate(`/courses?search=${encodeURIComponent(debouncedSearch)}`);
      }
    }
  }, [debouncedSearch, urlSearch, location.pathname, setParam, onSearch, navigate]);

  // Sync with URL params when they change externally (but don't override user input)
  useEffect(() => {
    if (!isFocused && urlSearch !== searchValue) {
      setSearchValue(urlSearch);
    }
  }, [urlSearch, isFocused, searchValue]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
  }, []);

  const handleClear = useCallback(() => {
    setSearchValue('');
    setParam('search', '');
    onSearch?.('');
  }, [setParam, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Trigger immediate search on Enter
      setParam('search', searchValue);
      onSearch?.(searchValue);
      
      // Navigate to courses if not already there
      if (location.pathname !== '/courses' && searchValue) {
        navigate(`/courses?search=${encodeURIComponent(searchValue)}`);
      }
    }
    
    if (e.key === 'Escape') {
      e.currentTarget.blur();
      setIsFocused(false);
    }
  }, [searchValue, setParam, onSearch, location.pathname, navigate]);

  const variantStyles = {
    header: "rounded-2xl pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
    page: "rounded-xl pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
  };

  return (
    <div className={cn("relative", className)}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <SearchIcon className={cn(
          "w-5 h-5 transition-colors duration-200",
          isFocused 
            ? "text-primary-500 dark:text-primary-400" 
            : "text-gray-400 dark:text-gray-500"
        )} />
      </div>

      {/* Input Field */}
      <input
        type="search"
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          "block w-full text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0 transition-all duration-200 placeholder:text-gray-500 dark:placeholder:text-gray-400",
          variantStyles[variant],
          isFocused 
            ? "border-primary-500 dark:border-primary-400 shadow-lg shadow-primary-500/10" 
            : "hover:border-primary-400 dark:hover:border-primary-500"
        )}
      />

      {/* Clear Button */}
      <AnimatePresence>
        {searchValue && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Focus Ring */}
      {isFocused && (
        <motion.div
          className="absolute inset-0 rounded-2xl ring-2 ring-primary-500/20 dark:ring-primary-400/20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        />
      )}
    </div>
  );
};