import React from 'react'
import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'

/**
 * Article Card Component
 * Displays article thumbnail, title, source, and time.
 * Hover shows summary overlay.
 */
function ArticleCard({ article, isLoading = false }) {
  if (isLoading) {
    return <ArticleCardSkeleton />
  }

  const timeAgo = formatTimeAgo(article?.published_at)

  return (
    <Link
      to={`/article/${article?.id}`}
      className="group card-interactive block overflow-hidden aspect-video bg-surface-secondary hover:shadow-level-3"
    >
      <div className="relative w-full h-full">
        {/* Background Image */}
        {article?.thumbnail_url && (
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-overlay-dark"></div>

        {/* Content */}
        <div className="absolute inset-0 p-lg flex flex-col justify-end">
          {/* Title */}
          <h3 className="text-title-md font-manrope font-bold text-on-surface line-clamp-2 mb-sm">
            {article?.title}
          </h3>

          {/* Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-xs">
              <p className="text-label-md text-on-surface-variant">{article?.source}</p>
              <p className="text-label-sm text-on-surface-muted">{timeAgo}</p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
              }}
              className="p-sm rounded-small bg-surface-primary hover:bg-primary hover:text-on-primary text-on-surface-variant transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Bookmark article"
            >
              <Bookmark size={16} />
            </button>
          </div>
        </div>

        {/* Summary Overlay (Hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-lg">
          <p className="text-body-sm text-on-surface line-clamp-3">{article?.summary}</p>
        </div>
      </div>
    </Link>
  )
}

/**
 * Skeleton Loader Variant
 */
export function ArticleCardSkeleton() {
  return (
    <div className="card-interactive aspect-video bg-surface-secondary animate-pulse">
      <div className="w-full h-full bg-gradient-to-r from-surface-secondary via-surface-tertiary to-surface-secondary"></div>
    </div>
  )
}

/**
 * Format time ago string
 */
function formatTimeAgo(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  return date.toLocaleDateString()
}

export default ArticleCard
