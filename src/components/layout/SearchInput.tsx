import React, { useState, useCallback } from 'react';
import { SearchIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useSearchParamsState } from '@/hooks/use-search-params';
import { useDebounce } from '@/hooks/use-debounce';
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
  const { getParam, setParam } = useSearchParamsState();
  const [isFocused, setIsFocused] = useState(false);
  
  // ✅ Separate state for each variant to avoid conflicts
  const [headerValue, setHeaderValue] = useState('');
  const [pageValue, setPageValue] = useState(() => getParam('search'));
  
  // ✅ Use different values based on variant
  const currentValue = variant === 'header' ? headerValue : pageValue;
  
  // ✅ Debounce only for page variant (header navigates immediately)
  const debouncedPageValue = useDebounce(pageValue, 500);
  
  // ✅ Update URL params when page search is debounced
  React.useEffect(() => {
    if (variant === 'page') {
      setParam('search', debouncedPageValue);
      onSearch?.(debouncedPageValue);
    }
  }, [debouncedPageValue, variant, setParam, onSearch]);

  // ✅ Sync page input with URL params (but not header)
  React.useEffect(() => {
    if (variant === 'page') {
      const urlSearch = getParam('search');
      if (urlSearch !== pageValue) {
        setPageValue(urlSearch);
      }
    }
  }, [getParam, variant, pageValue]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (variant === 'header') {
      setHeaderValue(value);
    } else {
      setPageValue(value);
    }
  }, [variant]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (variant === 'header') {
        // ✅ Header: Navigate to explore with search param
        if (headerValue.trim()) {
          navigate(`/courses?search=${encodeURIComponent(headerValue.trim())}`);
        } else {
          navigate('/courses');
        }
      } else {
        // ✅ Page: Update URL immediately
        setParam('search', currentValue.trim());
        onSearch?.(currentValue.trim());
      }
    }
    
    if (e.key === 'Escape') {
      e.currentTarget.blur();
      setIsFocused(false);
    }
  }, [variant, headerValue, currentValue, navigate, setParam, onSearch]);

  const handleClear = useCallback(() => {
    if (variant === 'header') {
      setHeaderValue('');
    } else {
      setPageValue('');
      setParam('search', '');
      onSearch?.('');
    }
  }, [variant, setParam, onSearch]);

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
        value={currentValue}
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

      {/* Loading indicator for page variant */}
      {variant === 'page' && pageValue !== debouncedPageValue && (
        <div className="absolute inset-y-0 right-12 flex items-center">
          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Clear Button */}
      <AnimatePresence>
        {currentValue && (
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