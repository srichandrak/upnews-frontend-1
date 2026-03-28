import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useArticles, useInfiniteArticles, useArticle, useRelatedArticles } from './useArticles'

// Mock the API client
vi.mock('@api/client', () => ({
  apiGet: vi.fn(),
}))

// Mock queryKeys
vi.mock('@api/queryClient', () => ({
  queryKeys: {
    articles: {
      all: ['articles'],
      list: (filters) => ['articles', 'list', filters],
      detail: (id) => ['articles', 'detail', id],
      related: (id, category) => ['articles', 'related', id, category],
    },
  },
}))

import { apiGet } from '@api/client'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useArticles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches articles with default parameters', async () => {
    const mockArticles = {
      results: [
        { id: '1', title: 'Article 1' },
        { id: '2', title: 'Article 2' },
      ],
      total: 2,
    }
    apiGet.mockResolvedValueOnce(mockArticles)

    const { result } = renderHook(() => useArticles(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(apiGet).toHaveBeenCalledWith(
      expect.stringContaining('/api/articles')
    )
    expect(result.current.data).toEqual(mockArticles)
  })

  it('includes category in query when provided', async () => {
    apiGet.mockResolvedValueOnce({ results: [], total: 0 })

    renderHook(() => useArticles({ category: 'Technology' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(apiGet).toHaveBeenCalledWith(
        expect.stringContaining('category=Technology')
      )
    })
  })

  it('includes pagination parameters', async () => {
    apiGet.mockResolvedValueOnce({ results: [], total: 0 })

    renderHook(() => useArticles({ page: 2, limit: 10 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(apiGet).toHaveBeenCalledWith(
        expect.stringMatching(/page=2.*limit=10|limit=10.*page=2/)
      )
    })
  })

  it('can be disabled', () => {
    const { result } = renderHook(() => useArticles({ enabled: false }), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(false)
    expect(apiGet).not.toHaveBeenCalled()
  })

  it('handles API errors', async () => {
    const errorMessage = 'Network error'
    apiGet.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useArticles(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error.message).toBe(errorMessage)
  })

  it('includes source filter when provided', async () => {
    apiGet.mockResolvedValueOnce({ results: [], total: 0 })

    renderHook(() => useArticles({ source: 'BBC' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(apiGet).toHaveBeenCalledWith(
        expect.stringContaining('source=BBC')
      )
    })
  })

  it('includes search query when provided', async () => {
    apiGet.mockResolvedValueOnce({ results: [], total: 0 })

    renderHook(() => useArticles({ q: 'climate' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(apiGet).toHaveBeenCalledWith(
        expect.stringContaining('q=climate')
      )
    })
  })

  it('includes sort order when provided', async () => {
    apiGet.mockResolvedValueOnce({ results: [], total: 0 })

    renderHook(() => useArticles({ order: 'asc' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(apiGet).toHaveBeenCalledWith(
        expect.stringContaining('order=asc')
      )
    })
  })
})

describe('useArticle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches a single article by ID', async () => {
    const mockArticle = { id: '123', title: 'Test Article' }
    apiGet.mockResolvedValueOnce(mockArticle)

    const { result } = renderHook(() => useArticle('123'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(apiGet).toHaveBeenCalledWith('/api/articles/123')
    expect(result.current.data).toEqual(mockArticle)
  })

  it('does not fetch when ID is empty', () => {
    const { result } = renderHook(() => useArticle(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(apiGet).not.toHaveBeenCalled()
  })

  it('does not fetch when ID is null', () => {
    const { result } = renderHook(() => useArticle(null), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(apiGet).not.toHaveBeenCalled()
  })

  it('can be disabled', () => {
    const { result } = renderHook(() => useArticle('123', { enabled: false }), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(apiGet).not.toHaveBeenCalled()
  })
})

describe('useRelatedArticles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches related articles', async () => {
    const mockArticles = {
      articles: [
        { id: '2', title: 'Related 1' },
        { id: '3', title: 'Related 2' },
      ],
    }
    apiGet.mockResolvedValueOnce(mockArticles)

    const { result } = renderHook(
      () => useRelatedArticles('1', 'technology'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(apiGet).toHaveBeenCalledWith(
      expect.stringContaining('category=technology')
    )
    expect(result.current.data).toEqual(mockArticles.articles)
  })

  it('excludes the current article from results', async () => {
    const mockArticles = {
      articles: [
        { id: '1', title: 'Current Article' },
        { id: '2', title: 'Related 1' },
        { id: '3', title: 'Related 2' },
      ],
    }
    apiGet.mockResolvedValueOnce(mockArticles)

    const { result } = renderHook(
      () => useRelatedArticles('1', 'technology'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Should not include article with id '1'
    expect(result.current.data.find(a => a.id === '1')).toBeUndefined()
    expect(result.current.data).toHaveLength(2)
  })

  it('respects the limit parameter', async () => {
    const mockArticles = {
      articles: [
        { id: '2', title: 'Related 1' },
        { id: '3', title: 'Related 2' },
        { id: '4', title: 'Related 3' },
        { id: '5', title: 'Related 4' },
        { id: '6', title: 'Related 5' },
      ],
    }
    apiGet.mockResolvedValueOnce(mockArticles)

    const { result } = renderHook(
      () => useRelatedArticles('1', 'technology', { limit: 2 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toHaveLength(2)
  })

  it('does not fetch when articleId is missing', () => {
    const { result } = renderHook(
      () => useRelatedArticles(null, 'technology'),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
    expect(apiGet).not.toHaveBeenCalled()
  })
})

describe('useInfiniteArticles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches first page of articles', async () => {
    const mockPage1 = {
      articles: [{ id: '1', title: 'Article 1' }],
      total: 40,
      page: 1,
      limit: 20,
    }
    apiGet.mockResolvedValueOnce(mockPage1)

    const { result } = renderHook(() => useInfiniteArticles(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(apiGet).toHaveBeenCalledWith(
      expect.stringContaining('page=1')
    )
    expect(result.current.data.pages).toHaveLength(1)
  })

  it('can fetch next page', async () => {
    const mockPage1 = {
      articles: [{ id: '1', title: 'Article 1' }],
      total: 40,
      page: 1,
      limit: 20,
    }
    const mockPage2 = {
      articles: [{ id: '2', title: 'Article 2' }],
      total: 40,
      page: 2,
      limit: 20,
    }
    apiGet.mockResolvedValueOnce(mockPage1).mockResolvedValueOnce(mockPage2)

    const { result } = renderHook(() => useInfiniteArticles(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.hasNextPage).toBe(true)

    result.current.fetchNextPage()

    await waitFor(() => {
      expect(result.current.data.pages).toHaveLength(2)
    })
  })

  it('determines hasNextPage correctly', async () => {
    const mockLastPage = {
      articles: [{ id: '40', title: 'Article 40' }],
      total: 40,
      page: 2,
      limit: 20,
    }
    apiGet.mockResolvedValueOnce(mockLastPage)

    const { result } = renderHook(() => useInfiniteArticles(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.hasNextPage).toBe(false)
  })

  it('includes filters in query', async () => {
    apiGet.mockResolvedValueOnce({ articles: [], total: 0, page: 1, limit: 20 })

    renderHook(
      () => useInfiniteArticles({ category: 'tech', source: 'BBC' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(apiGet).toHaveBeenCalledWith(
        expect.stringMatching(/category=tech.*source=BBC|source=BBC.*category=tech/)
      )
    })
  })

  it('can be disabled', () => {
    const { result } = renderHook(
      () => useInfiniteArticles({ enabled: false }),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
    expect(apiGet).not.toHaveBeenCalled()
  })
})
