import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@api/client'
import { queryKeys } from '@api/queryClient'

/**
 * Fetch all categories
 *
 * @param {object} options - Query options
 * @param {boolean} options.enabled - Enable/disable query (default: true)
 * @returns {object} - Query result with data, isLoading, error
 */
export function useCategories({ enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => apiGet('/api/categories'),
    enabled,
    staleTime: 30 * 60 * 1000, // Categories change rarely, cache for 30 minutes
  })
}

/**
 * Fetch a single category by slug
 *
 * @param {string} slug - Category slug (e.g., 'technology', 'health')
 * @param {object} options - Query options
 * @param {boolean} options.enabled - Enable/disable query (default: true)
 * @returns {object} - Query result with data, isLoading, error
 */
export function useCategory(slug, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.categories.detail(slug),
    queryFn: () => apiGet(`/api/categories/${slug}`),
    enabled: enabled && !!slug,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export default useCategories
