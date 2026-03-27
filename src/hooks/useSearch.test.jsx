import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSearchArticles, useRecentSearches, highlightMatches } from './useSearch'

// Mock the API client
vi.mock('@api/client', () => ({
  apiGet: vi.fn(),
}))

import { apiGet } from '@api/client'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useSearchArticles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  it('does not fetch when query is less than 2 characters', () => {
    renderHook(() => useSearchArticles('a'), { wrapper })
    expect(apiGet).not.toHaveBeenCalled()
  })

  it('fetches search results after debounce', async () => {
    const mockResults = { articles: [{ id: '1', title: 'Test Article' }] }
    apiGet.mockResolvedValue(mockResults)

    const { result } = renderHook(() => useSearchArticles('test'), { wrapper })

    // Wait for debounce
    await waitFor(() => {
      expect(apiGet).toHaveBeenCalledWith('/api/search?q=test')
    }, { timeout: 500 })

    await waitFor(() => {
      expect(result.current.data).toEqual(mockResults)
    })
  })

  it('does not fetch when disabled', () => {
    renderHook(() => useSearchArticles('test', { enabled: false }), { wrapper })
    expect(apiGet).not.toHaveBeenCalled()
  })
})

describe('useRecentSearches', () => {
  const STORAGE_KEY = 'upnews_recent_searches'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('returns empty array when no recent searches', () => {
    const { result } = renderHook(() => useRecentSearches())
    expect(result.current.recentSearches).toEqual([])
  })

  it('loads recent searches from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['test', 'query']))
    const { result } = renderHook(() => useRecentSearches())
    expect(result.current.recentSearches).toEqual(['test', 'query'])
  })

  it('adds a recent search', () => {
    const { result } = renderHook(() => useRecentSearches())

    act(() => {
      result.current.addRecentSearch('new search')
    })

    expect(result.current.recentSearches).toContain('new search')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toContain('new search')
  })

  it('moves duplicate search to front', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['old', 'search']))
    const { result } = renderHook(() => useRecentSearches())

    act(() => {
      result.current.addRecentSearch('search')
    })

    expect(result.current.recentSearches[0]).toBe('search')
    expect(result.current.recentSearches[1]).toBe('old')
    expect(result.current.recentSearches.length).toBe(2)
  })

  it('limits to 5 recent searches', () => {
    const { result } = renderHook(() => useRecentSearches())

    act(() => {
      for (let i = 1; i <= 7; i++) {
        result.current.addRecentSearch(`search ${i}`)
      }
    })

    expect(result.current.recentSearches.length).toBe(5)
    expect(result.current.recentSearches[0]).toBe('search 7')
  })

  it('removes a recent search', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['test', 'query']))
    const { result } = renderHook(() => useRecentSearches())

    act(() => {
      result.current.removeRecentSearch('test')
    })

    expect(result.current.recentSearches).not.toContain('test')
    expect(result.current.recentSearches).toContain('query')
  })

  it('clears all recent searches', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['test', 'query']))
    const { result } = renderHook(() => useRecentSearches())

    act(() => {
      result.current.clearRecentSearches()
    })

    expect(result.current.recentSearches).toEqual([])
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('ignores empty or short queries', () => {
    const { result } = renderHook(() => useRecentSearches())

    act(() => {
      result.current.addRecentSearch('')
      result.current.addRecentSearch('a')
      result.current.addRecentSearch('  ')
    })

    expect(result.current.recentSearches).toEqual([])
  })
})

describe('highlightMatches', () => {
  it('returns original text when query is empty', () => {
    const result = highlightMatches('Hello world', '')
    expect(result).toEqual([{ text: 'Hello world', highlight: false }])
  })

  it('returns original text when query is too short', () => {
    const result = highlightMatches('Hello world', 'a')
    expect(result).toEqual([{ text: 'Hello world', highlight: false }])
  })

  it('highlights matching text case-insensitively', () => {
    const result = highlightMatches('Hello World', 'world')
    expect(result.some(p => p.highlight && p.text.toLowerCase() === 'world')).toBe(true)
  })

  it('handles multiple matches', () => {
    const result = highlightMatches('test test test', 'test')
    const highlightedParts = result.filter(p => p.highlight)
    expect(highlightedParts.length).toBe(3)
  })

  it('handles text with no matches', () => {
    const result = highlightMatches('Hello world', 'xyz')
    expect(result.every(p => !p.highlight)).toBe(true)
  })

  it('handles null or undefined text', () => {
    expect(highlightMatches(null, 'test')).toEqual([{ text: null, highlight: false }])
    expect(highlightMatches(undefined, 'test')).toEqual([{ text: undefined, highlight: false }])
  })

  it('escapes regex special characters', () => {
    const result = highlightMatches('Test (brackets) here', '(brackets)')
    expect(result.some(p => p.highlight && p.text === '(brackets)')).toBe(true)
  })
})
