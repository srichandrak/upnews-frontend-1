import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { apiGet } from '@api/client'
import { queryKeys } from '@api/queryClient'

/**
 * Build query params for articles endpoint
 */
function buildArticleParams({ page, limit, sort, order, category, source, q }) {
  const params = new URLSearchParams()
  if (page) params.append('page', String(page))
  if (limit) params.append('limit', String(limit))
  if (sort) params.append('sort', sort)
  if (order) params.append('order', order)
  if (category) params.append('category', category)
  if (source) params.append('source', source)
  if (q) params.append('q', q)
  return params
}

/**
 * Fetch articles with optional filtering and pagination
 *
 * @param {object} options - Query options
 * @param {string} options.category - Filter by category (optional)
 * @param {string} options.source - Filter by source (optional)
 * @param {string} options.q - Search query (optional)
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {string} options.sort - Sort field (default: 'published_at')
 * @param {string} options.order - Sort order 'asc' or 'desc' (default: 'desc')
 * @param {boolean} options.enabled - Enable/disable query (default: true)
 * @returns {object} - Query result with data, isLoading, error
 */
export function useArticles({
  category = null,
  source = null,
  q = null,
  page = 1,
  limit = 20,
  sort = 'published_at',
  order = 'desc',
  enabled = true,
} = {}) {
  const filters = { category, source, q, page, limit, sort, order }
  const params = buildArticleParams(filters)

  return useQuery({
    queryKey: queryKeys.articles.list(filters),
    queryFn: () => apiGet(`/api/articles?${params}`),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Fetch articles with infinite scrolling support
 *
 * @param {object} options - Query options
 * @param {string} options.category - Filter by category (optional)
 * @param {string} options.source - Filter by source (optional)
 * @param {string} options.q - Search query (optional)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {string} options.sort - Sort field (default: 'published_at')
 * @param {string} options.order - Sort order 'asc' or 'desc' (default: 'desc')
 * @param {boolean} options.enabled - Enable/disable query (default: true)
 * @returns {object} - Infinite query result with data, fetchNextPage, hasNextPage, etc.
 */
export function useInfiniteArticles({
  category = null,
  source = null,
  q = null,
  limit = 20,
  sort = 'published_at',
  order = 'desc',
  enabled = true,
} = {}) {
  const filters = { category, source, q, limit, sort, order }

  return useInfiniteQuery({
    queryKey: ['articles', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => {
      const params = buildArticleParams({ ...filters, page: pageParam })
      return apiGet(`/api/articles?${params}`)
    },
    getNextPageParam: (lastPage, allPages) => {
      // API returns { articles: [], total: number, page: number, limit: number }
      const currentPage = lastPage.page || allPages.length
      const totalPages = Math.ceil((lastPage.total || 0) / limit)
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
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
    queryKey: queryKeys.articles.detail(id),
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
  const params = buildArticleParams({
    limit: limit + 1, // Fetch one extra to exclude current article
    category: category || undefined,
  })

  return useQuery({
    queryKey: queryKeys.articles.related(articleId, category),
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
