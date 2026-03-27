import { useState, useEffect, useCallback, useMemo } from 'react'

const BOOKMARKS_KEY = 'upnews_bookmarks'

/**
 * Custom hook for managing bookmarked articles with localStorage persistence
 *
 * @returns {object} - { bookmarks, addBookmark, removeBookmark, isBookmarked, clearBookmarks, sortBookmarks }
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Persist to localStorage whenever bookmarks change
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
    } catch {
      // localStorage might be full or disabled
    }
  }, [bookmarks])

  /**
   * Add an article to bookmarks
   * @param {object} article - Article object to bookmark
   */
  const addBookmark = useCallback((article) => {
    if (!article || !article.id) return

    setBookmarks((prev) => {
      // Check if already bookmarked
      if (prev.some((b) => b.id === article.id)) {
        return prev
      }

      // Add with timestamp for sorting
      const bookmarkedArticle = {
        ...article,
        bookmarkedAt: new Date().toISOString(),
      }

      return [bookmarkedArticle, ...prev]
    })
  }, [])

  /**
   * Remove an article from bookmarks
   * @param {string} articleId - ID of article to remove
   */
  const removeBookmark = useCallback((articleId) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== articleId))
  }, [])

  /**
   * Check if an article is bookmarked
   * @param {string} articleId - Article ID to check
   * @returns {boolean}
   */
  const isBookmarked = useCallback(
    (articleId) => {
      return bookmarks.some((b) => b.id === articleId)
    },
    [bookmarks]
  )

  /**
   * Toggle bookmark state for an article
   * @param {object} article - Article object
   */
  const toggleBookmark = useCallback(
    (article) => {
      if (isBookmarked(article.id)) {
        removeBookmark(article.id)
      } else {
        addBookmark(article)
      }
    },
    [isBookmarked, removeBookmark, addBookmark]
  )

  /**
   * Clear all bookmarks
   */
  const clearBookmarks = useCallback(() => {
    setBookmarks([])
  }, [])

  /**
   * Get sorted bookmarks
   * @param {string} sortBy - Sort option: 'newest', 'oldest', 'alphabetical'
   * @returns {array}
   */
  const getSortedBookmarks = useCallback(
    (sortBy = 'newest') => {
      const sorted = [...bookmarks]

      switch (sortBy) {
        case 'oldest':
          return sorted.sort(
            (a, b) => new Date(a.bookmarkedAt) - new Date(b.bookmarkedAt)
          )
        case 'alphabetical':
          return sorted.sort((a, b) =>
            (a.title || '').localeCompare(b.title || '')
          )
        case 'newest':
        default:
          return sorted.sort(
            (a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt)
          )
      }
    },
    [bookmarks]
  )

  return {
    bookmarks,
    bookmarkCount: bookmarks.length,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    clearBookmarks,
    getSortedBookmarks,
  }
}

export default useBookmarks
