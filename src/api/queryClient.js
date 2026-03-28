import { QueryClient } from '@tanstack/react-query'

/**
 * Centralized Tanstack Query client configuration
 *
 * Default options:
 * - staleTime: 5 minutes - data is fresh for 5 minutes before refetching
 * - gcTime: 30 minutes - unused data is garbage collected after 30 minutes
 * - retry: 1 - retry failed requests once
 * - refetchOnWindowFocus: false - don't refetch when window regains focus
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

/**
 * Query key factory for consistent cache key generation
 */
export const queryKeys = {
  // Articles
  articles: {
    all: ['articles'],
    list: (filters) => ['articles', 'list', filters],
    detail: (id) => ['articles', 'detail', id],
    related: (id, category) => ['articles', 'related', id, category],
  },

  // Categories
  categories: {
    all: ['categories'],
    list: () => ['categories', 'list'],
    detail: (slug) => ['categories', 'detail', slug],
  },

  // Search
  search: {
    all: ['search'],
    query: (q) => ['search', 'query', q],
  },

  // Bookmarks (API-backed)
  bookmarks: {
    all: ['bookmarks'],
    list: () => ['bookmarks', 'list'],
  },
}

export default queryClient
