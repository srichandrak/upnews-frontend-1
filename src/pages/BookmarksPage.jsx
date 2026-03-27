import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Trash2, ArrowUpDown, Home, X } from 'lucide-react'
import { useBookmarks } from '@hooks/useBookmarks'
import ArticleCard from '@components/articles/ArticleCard'

/**
 * BookmarksPage Component
 * Displays grid of saved articles with sort options and remove functionality
 */
function BookmarksPage() {
  const [sortBy, setSortBy] = useState('newest')
  const [articleToRemove, setArticleToRemove] = useState(null)
  const { bookmarks, getSortedBookmarks, removeBookmark, bookmarkCount } = useBookmarks()

  const sortedBookmarks = getSortedBookmarks(sortBy)

  const handleRemoveClick = useCallback((e, article) => {
    e.preventDefault()
    e.stopPropagation()
    setArticleToRemove(article)
  }, [])

  const confirmRemove = useCallback(() => {
    if (articleToRemove) {
      removeBookmark(articleToRemove.id)
      setArticleToRemove(null)
    }
  }, [articleToRemove, removeBookmark])

  const cancelRemove = useCallback(() => {
    setArticleToRemove(null)
  }, [])

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'alphabetical', label: 'A-Z' },
  ]

  // Empty state
  if (bookmarkCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-lg text-center">
        <div className="w-20 h-20 bg-surface-secondary rounded-full flex items-center justify-center mb-xl">
          <Bookmark size={40} className="text-on-surface-variant" />
        </div>
        <h1 className="text-headline-md font-manrope font-bold text-on-surface mb-md">
          No Bookmarks Yet
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-md mb-xl">
          Save articles you want to read later by clicking the bookmark icon on any article.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-md px-xl py-md bg-primary text-on-primary rounded-medium hover:bg-primary-container transition-colors"
        >
          <Home size={20} />
          Browse Articles
        </Link>
      </div>
    )
  }

  return (
    <div className="container-safe py-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-lg mb-xl">
        <div>
          <h1 className="text-headline-md font-manrope font-bold text-on-surface mb-xs">
            Bookmarks
          </h1>
          <p className="text-body-md text-on-surface-variant">
            {bookmarkCount} saved article{bookmarkCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-md">
          <ArrowUpDown size={18} className="text-on-surface-variant" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface-secondary border border-outline-variant rounded-medium px-lg py-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            aria-label="Sort bookmarks"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
        {sortedBookmarks.map((article) => (
          <div key={article.id} className="relative group/card">
            <ArticleCard article={article} />

            {/* Remove Button Overlay */}
            <button
              onClick={(e) => handleRemoveClick(e, article)}
              className="absolute top-md right-md p-sm bg-error/90 hover:bg-error text-on-primary rounded-medium opacity-0 group-hover/card:opacity-100 transition-opacity z-10"
              aria-label={`Remove "${article.title}" from bookmarks`}
              title="Remove from bookmarks"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {articleToRemove && (
        <ConfirmationDialog
          title="Remove Bookmark"
          message={`Are you sure you want to remove "${articleToRemove.title}" from your bookmarks?`}
          confirmLabel="Remove"
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
        />
      )}
    </div>
  )
}

/**
 * Confirmation Dialog Component
 */
function ConfirmationDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  // Handle Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  // Prevent body scroll
  React.useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-lg bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="bg-surface border border-outline-variant rounded-large shadow-level-3 max-w-md w-full p-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-lg">
          <h2 id="dialog-title" className="text-title-lg font-manrope font-bold text-on-surface">
            {title}
          </h2>
          <button
            onClick={onCancel}
            className="p-sm text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <p className="text-body-md text-on-surface-variant mb-xl">
          {message}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-md">
          <button
            onClick={onCancel}
            className="px-xl py-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-xl py-md bg-error text-on-primary rounded-medium hover:bg-error/80 transition-colors text-body-md font-medium"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookmarksPage
