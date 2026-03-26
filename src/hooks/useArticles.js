import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@api/client'

/**
 * Fetch articles with optional filtering and pagination
 *
 * @param {object} options - Query options
 * @param {string} options.category - Filter by category (optional)
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {string} options.sort - Sort field (default: 'published_at')
 * @param {boolean} options.enabled - Enable/disable query (default: true)
 * @returns {object} - Query result with data, isLoading, error
 */
export function useArticles({
  category = null,
  page = 1,
  limit = 20,
  sort = 'published_at',
  enabled = true,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  })

  if (category) {
    params.append('category', category)
  }

  return useQuery({
    queryKey: ['articles', { category, page, limit, sort }],
    queryFn: () => apiGet(`/api/articles?${params}`),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export default useArticles
