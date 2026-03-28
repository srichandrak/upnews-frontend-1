import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCategories, useCategory } from './useCategories'

// Mock the API client
vi.mock('@api/client', () => ({
  apiGet: vi.fn(),
}))

// Mock queryKeys
vi.mock('@api/queryClient', () => ({
  queryKeys: {
    categories: {
      list: () => ['categories', 'list'],
      detail: (slug) => ['categories', 'detail', slug],
    },
  },
}))

import { apiGet } from '@api/client'

const mockCategories = [
  { id: '1', name: 'Technology', slug: 'technology', article_count: 42 },
  { id: '2', name: 'Health', slug: 'health', article_count: 35 },
  { id: '3', name: 'Environment', slug: 'environment', article_count: 28 },
]

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches categories successfully', async () => {
    apiGet.mockResolvedValueOnce(mockCategories)

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockCategories)
    expect(apiGet).toHaveBeenCalledWith('/api/categories')
  })

  it('can be disabled', () => {
    const { result } = renderHook(() => useCategories({ enabled: false }), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.fetchStatus).toBe('idle')
    expect(apiGet).not.toHaveBeenCalled()
  })

  it('handles API errors', async () => {
    const error = new Error('API Error')
    apiGet.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBe(error)
  })
})

describe('useCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches a single category by slug', async () => {
    const category = mockCategories[0]
    apiGet.mockResolvedValueOnce(category)

    const { result } = renderHook(() => useCategory('technology'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(category)
    expect(apiGet).toHaveBeenCalledWith('/api/categories/technology')
  })

  it('does not fetch when slug is empty', () => {
    const { result } = renderHook(() => useCategory(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(apiGet).not.toHaveBeenCalled()
  })

  it('does not fetch when slug is null', () => {
    const { result } = renderHook(() => useCategory(null), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(apiGet).not.toHaveBeenCalled()
  })

  it('can be disabled', () => {
    const { result } = renderHook(
      () => useCategory('technology', { enabled: false }),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
    expect(apiGet).not.toHaveBeenCalled()
  })

  it('handles API errors', async () => {
    const error = new Error('Category not found')
    apiGet.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useCategory('invalid'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBe(error)
  })
})
