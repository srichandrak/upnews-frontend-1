import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Clock, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSearchArticles, useRecentSearches, highlightMatches } from '@hooks/useSearch'
import ArticleCard from '@components/articles/ArticleCard'

/**
 * SearchOverlay Component
 * Full-screen search interface with debounced search, keyboard navigation, and recent searches
 */
function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const resultsRef = useRef(null)
  const navigate = useNavigate()

  const { data: searchResults, isLoading, error } = useSearchArticles(query, { enabled: isOpen })
  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useRecentSearches()

  // Extract articles from response
  const articles = searchResults?.articles || searchResults || []

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setQuery('')
      setSelectedIndex(-1)
    }
  }, [isOpen])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return

    const items = query.length >= 2 ? articles : recentSearches

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        onClose()
        break

      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < items.length - 1 ? prev + 1 : prev
        )
        break

      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break

      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          if (query.length >= 2) {
            // Navigate to article
            const article = articles[selectedIndex]
            if (article) {
              addRecentSearch(query)
              navigate(`/article/${article.id}`)
              onClose()
            }
          } else {
            // Use recent search
            const recentQuery = recentSearches[selectedIndex]
            if (recentQuery) {
              setQuery(recentQuery)
              setSelectedIndex(-1)
            }
          }
        } else if (query.length >= 2 && articles.length > 0) {
          // Select first result
          addRecentSearch(query)
          navigate(`/article/${articles[0].id}`)
          onClose()
        }
        break

      default:
        break
    }
  }, [isOpen, query, articles, recentSearches, selectedIndex, navigate, onClose, addRecentSearch])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [articles, query])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll('[data-result-item]')
      if (items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex])

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const handleRecentSearchClick = (recentQuery) => {
    setQuery(recentQuery)
  }

  const handleArticleClick = (article) => {
    if (query.length >= 2) {
      addRecentSearch(query)
    }
    navigate(`/article/${article.id}`)
    onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const showRecentSearches = query.length < 2 && recentSearches.length > 0
  const showResults = query.length >= 2 && articles.length > 0
  const showNoResults = query.length >= 2 && !isLoading && articles.length === 0
  const showEmptyState = query.length < 2 && recentSearches.length === 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-surface/95 backdrop-blur-sm"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Search articles"
        >
          <div className="flex flex-col h-full max-w-4xl mx-auto px-lg py-xl">
            {/* Search Header */}
            <div className="flex items-center gap-lg mb-xl">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-lg top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                  size={24}
                  aria-hidden="true"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Search articles..."
                  className="w-full h-14 pl-14 pr-14 bg-surface-secondary border border-outline-variant rounded-large text-headline-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  aria-label="Search input"
                  autoComplete="off"
                />
                {query && (
                  <button
                    onClick={handleClear}
                    className="absolute right-lg top-1/2 -translate-y-1/2 p-sm text-on-surface-variant hover:text-on-surface transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-md rounded-medium bg-surface-secondary hover:bg-surface-tertiary text-on-surface-variant hover:text-on-surface transition-colors"
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>

            {/* Keyboard hints */}
            <div className="flex items-center gap-lg mb-lg text-label-sm text-on-surface-variant">
              <span className="flex items-center gap-xs">
                <kbd className="px-sm py-xs bg-surface-secondary rounded text-label-sm">↑↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-xs">
                <kbd className="px-sm py-xs bg-surface-secondary rounded text-label-sm">Enter</kbd>
                <span>Select</span>
              </span>
              <span className="flex items-center gap-xs">
                <kbd className="px-sm py-xs bg-surface-secondary rounded text-label-sm">Esc</kbd>
                <span>Close</span>
              </span>
            </div>

            {/* Results Area */}
            <div ref={resultsRef} className="flex-1 overflow-y-auto">
              {/* Loading State */}
              {isLoading && query.length >= 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ArticleCard key={i} isLoading={true} />
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              {showRecentSearches && (
                <div>
                  <div className="flex items-center justify-between mb-lg">
                    <h2 className="text-title-md font-manrope font-bold text-on-surface flex items-center gap-md">
                      <Clock size={20} className="text-on-surface-variant" />
                      Recent Searches
                    </h2>
                    <button
                      onClick={clearRecentSearches}
                      className="text-label-md text-on-surface-variant hover:text-error transition-colors flex items-center gap-xs"
                      aria-label="Clear all recent searches"
                    >
                      <Trash2 size={16} />
                      Clear all
                    </button>
                  </div>
                  <ul className="space-y-sm">
                    {recentSearches.map((recentQuery, index) => (
                      <li key={recentQuery}>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => handleRecentSearchClick(recentQuery)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleRecentSearchClick(recentQuery)
                            }
                          }}
                          data-result-item
                          className={`w-full flex items-center justify-between px-lg py-md rounded-medium transition-colors cursor-pointer ${
                            selectedIndex === index
                              ? 'bg-primary/20 text-on-surface'
                              : 'bg-surface-secondary hover:bg-surface-tertiary text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          <span className="flex items-center gap-md">
                            <Search size={16} />
                            {recentQuery}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeRecentSearch(recentQuery)
                            }}
                            className="p-xs text-on-surface-variant hover:text-error transition-colors"
                            aria-label={`Remove "${recentQuery}" from recent searches`}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Search Results */}
              {showResults && (
                <div>
                  <h2 className="text-title-md font-manrope font-bold text-on-surface mb-lg">
                    {articles.length} result{articles.length !== 1 ? 's' : ''} for "{query}"
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
                    {articles.map((article, index) => (
                      <div
                        key={article.id}
                        data-result-item
                        className={`rounded-large transition-all ${
                          selectedIndex === index ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''
                        }`}
                      >
                        <SearchResultCard
                          article={article}
                          query={query}
                          onClick={() => handleArticleClick(article)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {showNoResults && (
                <div className="flex flex-col items-center justify-center py-3xl text-center">
                  <Search size={48} className="text-on-surface-variant mb-lg" />
                  <h2 className="text-headline-sm font-manrope font-bold text-on-surface mb-md">
                    No results found
                  </h2>
                  <p className="text-body-lg text-on-surface-variant max-w-md">
                    We couldn't find any articles matching "{query}". Try different keywords or check your spelling.
                  </p>
                </div>
              )}

              {/* Empty State (no recent searches) */}
              {showEmptyState && (
                <div className="flex flex-col items-center justify-center py-3xl text-center">
                  <Search size={48} className="text-on-surface-variant mb-lg" />
                  <h2 className="text-headline-sm font-manrope font-bold text-on-surface mb-md">
                    Search for articles
                  </h2>
                  <p className="text-body-lg text-on-surface-variant max-w-md">
                    Start typing to search through our collection of uplifting news stories.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Search Result Card with highlighting
 */
function SearchResultCard({ article, query, onClick }) {
  const titleParts = highlightMatches(article.title, query)

  return (
    <button
      onClick={onClick}
      className="w-full text-left block rounded-large overflow-hidden bg-surface-secondary hover:bg-surface-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden">
        {article.thumbnail_url ? (
          <img
            src={article.thumbnail_url}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-surface-tertiary" />
        )}
      </div>

      {/* Content */}
      <div className="p-md">
        {/* Title with highlighting */}
        <h3 className="text-title-sm font-manrope font-bold text-on-surface line-clamp-2 mb-sm">
          {titleParts.map((part, index) => (
            part.highlight ? (
              <mark key={index} className="bg-primary/30 text-on-surface rounded px-xs">
                {part.text}
              </mark>
            ) : (
              <span key={index}>{part.text}</span>
            )
          ))}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-md text-label-sm text-on-surface-variant">
          <span>{article.source}</span>
          {article.category && (
            <>
              <span className="text-outline">•</span>
              <span className="capitalize">{article.category}</span>
            </>
          )}
        </div>
      </div>
    </button>
  )
}

export default SearchOverlay
