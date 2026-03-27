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

/**
 * Fetch a single article by ID
 *
 * @param {string} id - Article ID
 * @param {object} options - Query options
 * @param {boolean} options.enabled - Enable/disable query (default: true)
 * @returns {object} - Query result with data, isLoading, error
 */
export function useArticle(id, { enabled = true } = {}) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => apiGet(`/api/articles/${id}`),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Fetch related articles for a given article
 *
 * @param {string} articleId - Current article ID
 * @param {string} category - Article category for finding related articles
 * @param {object} options - Query options
 * @param {number} options.limit - Number of related articles (default: 4)
 * @param {boolean} options.enabled - Enable/disable query (default: true)
 * @returns {object} - Query result with data, isLoading, error
 */
export function useRelatedArticles(articleId, category, { limit = 4, enabled = true } = {}) {
  const params = new URLSearchParams({
    limit: String(limit + 1), // Fetch one extra to exclude current article
    category: category || '',
  })

  return useQuery({
    queryKey: ['relatedArticles', articleId, category, limit],
    queryFn: async () => {
      const data = await apiGet(`/api/articles?${params}`)
      // Filter out the current article and limit to requested count
      const filtered = (data.articles || data || [])
        .filter(article => article.id !== articleId)
        .slice(0, limit)
      return filtered
    },
    enabled: enabled && !!articleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export default useArticles
