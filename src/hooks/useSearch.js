import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@api/client'

const RECENT_SEARCHES_KEY = 'upnews_recent_searches'
const MAX_RECENT_SEARCHES = 5
const DEBOUNCE_DELAY = 300

/**
 * Custom hook for searching articles with debounce
 *
 * @param {string} query - Search query string
 * @param {object} options - Query options
 * @param {boolean} options.enabled - Enable/disable query (default: true)
 * @returns {object} - Query result with data, isLoading, error
 */
export function useSearchArticles(query, { enabled = true } = {}) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [query])

  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => apiGet(`/api/search?q=${encodeURIComponent(debouncedQuery)}`),
    enabled: enabled && debouncedQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Custom hook for managing recent searches in localStorage
 *
 * @returns {object} - { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches }
 */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const saveToStorage = useCallback((searches) => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches))
    } catch {
      // localStorage might be full or disabled
    }
  }, [])

  const addRecentSearch = useCallback((query) => {
    if (!query || query.trim().length < 2) return

    const trimmedQuery = query.trim()
    setRecentSearches((prev) => {
      // Remove duplicates and add to front
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmedQuery.toLowerCase())
      const updated = [trimmedQuery, ...filtered].slice(0, MAX_RECENT_SEARCHES)
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  const removeRecentSearch = useCallback((query) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== query)
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
    } catch {
      // Ignore errors
    }
  }, [])

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  }
}

/**
 * Highlight matching text in a string
 *
 * @param {string} text - Text to search in
 * @param {string} query - Query to highlight
 * @returns {Array} - Array of { text, highlight } objects
 */
export function highlightMatches(text, query) {
  if (!query || query.length < 2 || !text) {
    return [{ text, highlight: false }]
  }

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, index) => ({
    text: part,
    highlight: part.toLowerCase() === query.toLowerCase(),
    key: index,
  }))
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default useSearchArticles
