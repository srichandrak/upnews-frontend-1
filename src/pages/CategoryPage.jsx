import React, { useState, useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, SlidersHorizontal } from 'lucide-react'
import ArticleCard, { ArticleCardSkeleton } from '@components/articles/ArticleCard'
import { useInfiniteArticles } from '@hooks/useArticles'
import { useInfiniteScroll } from '@hooks/useInfiniteScroll'

/**
 * Category Page
 * Displays all articles in a category with infinite scroll
 */
function CategoryPage() {
  const { category } = useParams()
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Map URL slug to display name
  const categoryDisplayName = useMemo(() => {
    const names = {
      technology: 'Technology',
      health: 'Health',
      environment: 'Environment',
      science: 'Science',
      inspiring: 'Inspiring Stories',
    }
    return names[category?.toLowerCase()] || category || 'All Articles'
  }, [category])

  // Determine sort parameters
  const sortParams = useMemo(() => {
    switch (sortBy) {
      case 'oldest':
        return { sort: 'published_at', order: 'asc' }
      case 'popular':
        return { sort: 'views', order: 'desc' }
      case 'newest':
      default:
        return { sort: 'published_at', order: 'desc' }
    }
  }, [sortBy])

  // Fetch articles with infinite query
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useInfiniteArticles({
    category: category || undefined,
    limit: 12,
    ...sortParams,
  })

  // Flatten pages into single array of articles
  const articles = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => page.articles || page || [])
  }, [data])

  // Infinite scroll hook
  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: hasNextPage,
    isLoading: isFetchingNextPage,
  })

  // Scroll to top when category or sort changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [category, sortBy])

  // Loading skeleton count
  const skeletonCount = 12

  return (
    <div className="min-h-screen pb-24 md:pb-lg">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-surface border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-lg md:px-2xl py-lg">
          <div className="flex items-center justify-between">
            {/* Back link and title */}
            <div className="flex items-center gap-md">
              <Link
                to="/"
                className="p-sm rounded-small hover:bg-surface-secondary transition-colors text-on-surface-variant hover:text-on-surface"
                aria-label="Back to home"
              >
                <ChevronLeft size={24} />
              </Link>
              <div>
                <h1 className="text-headline-sm font-manrope font-bold text-on-surface">
                  {categoryDisplayName}
                </h1>
                {data?.pages?.[0]?.total && (
                  <p className="text-body-sm text-on-surface-variant">
                    {data.pages[0].total} articles
                  </p>
                )}
              </div>
            </div>

            {/* Filter/Sort toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-sm rounded-small transition-colors ${
                showFilters
                  ? 'bg-primary text-on-primary'
                  : 'hover:bg-surface-secondary text-on-surface-variant hover:text-on-surface'
              }`}
              aria-label="Toggle filters"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>

          {/* Filter options */}
          {showFilters && (
            <div className="mt-lg pt-lg border-t border-outline-variant">
              <div className="flex flex-wrap items-center gap-lg">
                <label className="flex items-center gap-sm">
                  <span className="text-body-sm text-on-surface-variant">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-surface-secondary border border-outline-variant rounded-small px-md py-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Sort articles"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-lg md:px-2xl py-xl">
        {/* Error state */}
        {isError && (
          <div className="text-center py-3xl">
            <p className="text-body-lg text-error mb-md">
              {error?.message || 'Failed to load articles'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-lg py-sm bg-primary text-on-primary rounded-small hover:bg-primary-container transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && articles.length === 0 && (
          <div className="text-center py-3xl">
            <p className="text-headline-sm font-manrope text-on-surface mb-md">
              No Articles Found
            </p>
            <p className="text-body-md text-on-surface-variant mb-xl">
              There are no articles in this category yet.
            </p>
            <Link
              to="/"
              className="inline-block px-lg py-sm bg-primary text-on-primary rounded-small hover:bg-primary-container transition-colors"
            >
              Browse All Articles
            </Link>
          </div>
        )}

        {/* Articles grid */}
        {(isLoading || articles.length > 0) && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg"
            role="list"
            aria-label={`${categoryDisplayName} articles`}
          >
            {/* Loading skeletons for initial load */}
            {isLoading &&
              articles.length === 0 &&
              Array.from({ length: skeletonCount }).map((_, index) => (
                <div key={`skeleton-${index}`} role="listitem">
                  <ArticleCardSkeleton />
                </div>
              ))}

            {/* Article cards */}
            {articles.map((article) => (
              <div key={article.id} role="listitem">
                <ArticleCard article={article} />
              </div>
            ))}

            {/* Loading skeletons for next page */}
            {isFetchingNextPage &&
              Array.from({ length: 4 }).map((_, index) => (
                <div key={`loading-${index}`} role="listitem">
                  <ArticleCardSkeleton />
                </div>
              ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        {hasNextPage && !isError && (
          <div
            ref={sentinelRef}
            className="h-px"
            aria-hidden="true"
          />
        )}

        {/* End of results */}
        {!hasNextPage && articles.length > 0 && !isLoading && (
          <div className="text-center py-xl mt-xl border-t border-outline-variant">
            <p className="text-body-md text-on-surface-variant">
              You've reached the end
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage
