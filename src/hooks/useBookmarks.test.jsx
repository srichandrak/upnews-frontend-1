import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBookmarks } from './useBookmarks'

const STORAGE_KEY = 'upnews_bookmarks'

const mockArticle1 = {
  id: '1',
  title: 'Test Article 1',
  summary: 'Summary 1',
  source: 'Source 1',
  thumbnail_url: 'https://example.com/1.jpg',
  published_at: '2024-01-01T10:00:00Z',
}

const mockArticle2 = {
  id: '2',
  title: 'Alpha Article',
  summary: 'Summary 2',
  source: 'Source 2',
  thumbnail_url: 'https://example.com/2.jpg',
  published_at: '2024-01-02T10:00:00Z',
}

const mockArticle3 = {
  id: '3',
  title: 'Zebra Article',
  summary: 'Summary 3',
  source: 'Source 3',
  thumbnail_url: 'https://example.com/3.jpg',
  published_at: '2024-01-03T10:00:00Z',
}

describe('useBookmarks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('returns empty array when no bookmarks exist', () => {
    const { result } = renderHook(() => useBookmarks())
    expect(result.current.bookmarks).toEqual([])
    expect(result.current.bookmarkCount).toBe(0)
  })

  it('loads bookmarks from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([mockArticle1]))
    const { result } = renderHook(() => useBookmarks())
    expect(result.current.bookmarks).toHaveLength(1)
    expect(result.current.bookmarks[0].id).toBe('1')
  })

  it('adds a bookmark', () => {
    const { result } = renderHook(() => useBookmarks())

    act(() => {
      result.current.addBookmark(mockArticle1)
    })

    expect(result.current.bookmarks).toHaveLength(1)
    expect(result.current.bookmarks[0].id).toBe('1')
    expect(result.current.bookmarks[0].bookmarkedAt).toBeDefined()
  })

  it('persists bookmark to localStorage', () => {
    const { result } = renderHook(() => useBookmarks())

    act(() => {
      result.current.addBookmark(mockArticle1)
    })

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('1')
  })

  it('does not add duplicate bookmarks', () => {
    const { result } = renderHook(() => useBookmarks())

    act(() => {
      result.current.addBookmark(mockArticle1)
      result.current.addBookmark(mockArticle1)
    })

    expect(result.current.bookmarks).toHaveLength(1)
  })

  it('removes a bookmark', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([mockArticle1, mockArticle2]))
    const { result } = renderHook(() => useBookmarks())

    act(() => {
      result.current.removeBookmark('1')
    })

    expect(result.current.bookmarks).toHaveLength(1)
    expect(result.current.bookmarks[0].id).toBe('2')
  })

  it('checks if article is bookmarked', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([mockArticle1]))
    const { result } = renderHook(() => useBookmarks())

    expect(result.current.isBookmarked('1')).toBe(true)
    expect(result.current.isBookmarked('2')).toBe(false)
  })

  it('toggles bookmark state', () => {
    const { result } = renderHook(() => useBookmarks())

    // Add bookmark
    act(() => {
      result.current.toggleBookmark(mockArticle1)
    })
    expect(result.current.isBookmarked('1')).toBe(true)

    // Remove bookmark
    act(() => {
      result.current.toggleBookmark(mockArticle1)
    })
    expect(result.current.isBookmarked('1')).toBe(false)
  })

  it('clears all bookmarks', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([mockArticle1, mockArticle2]))
    const { result } = renderHook(() => useBookmarks())

    act(() => {
      result.current.clearBookmarks()
    })

    expect(result.current.bookmarks).toHaveLength(0)
  })

  it('sorts bookmarks by newest first (default)', () => {
    // Use pre-set timestamps
    const bookmarks = [
      { ...mockArticle1, bookmarkedAt: '2024-01-01T10:00:00Z' },
      { ...mockArticle2, bookmarkedAt: '2024-01-02T10:00:00Z' },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))

    const { result } = renderHook(() => useBookmarks())
    const sorted = result.current.getSortedBookmarks('newest')

    expect(sorted[0].id).toBe('2') // Most recently bookmarked
    expect(sorted[1].id).toBe('1')
  })

  it('sorts bookmarks by oldest first', () => {
    // Use pre-set timestamps
    const bookmarks = [
      { ...mockArticle1, bookmarkedAt: '2024-01-01T10:00:00Z' },
      { ...mockArticle2, bookmarkedAt: '2024-01-02T10:00:00Z' },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))

    const { result } = renderHook(() => useBookmarks())
    const sorted = result.current.getSortedBookmarks('oldest')

    expect(sorted[0].id).toBe('1') // First bookmarked
    expect(sorted[1].id).toBe('2')
  })

  it('sorts bookmarks alphabetically', () => {
    const { result } = renderHook(() => useBookmarks())

    act(() => {
      result.current.addBookmark(mockArticle3) // Zebra
      result.current.addBookmark(mockArticle1) // Test
      result.current.addBookmark(mockArticle2) // Alpha
    })

    const sorted = result.current.getSortedBookmarks('alphabetical')
    expect(sorted[0].title).toBe('Alpha Article')
    expect(sorted[1].title).toBe('Test Article 1')
    expect(sorted[2].title).toBe('Zebra Article')
  })

  it('ignores invalid articles', () => {
    const { result } = renderHook(() => useBookmarks())

    act(() => {
      result.current.addBookmark(null)
      result.current.addBookmark({})
      result.current.addBookmark({ title: 'No ID' })
    })

    expect(result.current.bookmarks).toHaveLength(0)
  })

  it('returns correct bookmark count', () => {
    const { result } = renderHook(() => useBookmarks())

    expect(result.current.bookmarkCount).toBe(0)

    act(() => {
      result.current.addBookmark(mockArticle1)
      result.current.addBookmark(mockArticle2)
    })

    expect(result.current.bookmarkCount).toBe(2)
  })
})
