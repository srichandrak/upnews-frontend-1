import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useArticles } from './useArticles'

// Mock the API client
vi.mock('@api/client', () => ({
  apiGet: vi.fn(),
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
})
