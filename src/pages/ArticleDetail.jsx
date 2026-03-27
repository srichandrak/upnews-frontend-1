import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Bookmark, BookmarkCheck, ExternalLink, Clock, Building2 } from 'lucide-react'
import { useArticle, useRelatedArticles } from '@hooks/useArticles'
import ArticleCard from '@components/articles/ArticleCard'
import ShareButtons from '@components/articles/ShareButtons'

/**
 * ArticleDetail Page
 * Full article view with hero image, content, share buttons, and related articles
 */
function ArticleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(false)

  const { data: article, isLoading, error } = useArticle(id)
  const { data: relatedArticles = [], isLoading: relatedLoading } = useRelatedArticles(
    id,
    article?.category,
    { enabled: !!article?.category }
  )

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // TODO: Implement bookmark persistence
  }

  const timeAgo = formatTimeAgo(article?.published_at)

  // Loading state
  if (isLoading) {
    return <ArticleDetailSkeleton />
  }

  // Error/Not found state
  if (error || !article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-lg">
        <h1 className="text-display-sm font-manrope font-bold text-on-surface mb-lg">
          Article Not Found
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-xl">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/"
          className="px-xl py-md bg-primary text-on-primary rounded-medium hover:bg-primary-container transition-colors"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="container-safe py-lg">
        <button
          onClick={handleBack}
          className="flex items-center gap-sm text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-large mx-auto">
        {article.thumbnail_url ? (
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-surface-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-overlay-dark" />

        {/* Title Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-lg md:p-2xl">
          <h1 className="text-headline-md md:text-display-sm font-manrope font-bold text-on-surface mb-md">
            {article.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-lg text-label-md text-on-surface-variant">
            <span className="flex items-center gap-xs">
              <Building2 size={16} />
              {article.source}
            </span>
            <span className="flex items-center gap-xs">
              <Clock size={16} />
              {timeAgo}
            </span>
            {article.category && (
              <Link
                to={`/category/${article.category}`}
                className="px-md py-xs bg-primary/20 text-primary rounded-small hover:bg-primary/30 transition-colors"
              >
                {article.category}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container-safe py-xl">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-lg mb-xl pb-lg border-b border-outline-variant">
          <ShareButtons article={article} />

          <button
            onClick={toggleBookmark}
            className={`flex items-center gap-sm px-lg py-md rounded-medium transition-colors ${
              isBookmarked
                ? 'bg-primary text-on-primary'
                : 'bg-surface-secondary text-on-surface-variant hover:bg-surface-tertiary hover:text-on-surface'
            }`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
        </div>

        {/* Summary */}
        <div className="prose prose-invert max-w-none mb-xl">
          <p className="text-body-lg text-on-surface leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Read Full Article Button */}
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-md px-xl py-lg bg-primary text-on-primary rounded-medium hover:bg-primary-container transition-colors text-body-lg font-medium"
          >
            Read Full Article
            <ExternalLink size={20} />
          </a>
        )}
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="container-safe py-xl border-t border-outline-variant">
          <h2 className="text-headline-sm font-manrope font-bold text-on-surface mb-lg">
            Related Articles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
            {relatedLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <ArticleCard key={i} isLoading={true} />
                ))
              : relatedArticles.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))}
          </div>
        </section>
      )}
    </article>
  )
}

/**
 * Skeleton Loader for ArticleDetail
 */
export function ArticleDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Back Button Placeholder */}
      <div className="container-safe py-lg">
        <div className="w-20 h-6 bg-surface-secondary rounded" />
      </div>

      {/* Hero Image Skeleton */}
      <div className="w-full aspect-video md:aspect-[21/9] bg-surface-secondary rounded-large" />

      {/* Content Skeleton */}
      <div className="container-safe py-xl">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-xl pb-lg border-b border-outline-variant">
          <div className="flex gap-md">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-10 h-10 bg-surface-secondary rounded-medium" />
            ))}
          </div>
          <div className="w-32 h-10 bg-surface-secondary rounded-medium" />
        </div>

        {/* Summary Skeleton */}
        <div className="space-y-md mb-xl">
          <div className="w-full h-6 bg-surface-secondary rounded" />
          <div className="w-full h-6 bg-surface-secondary rounded" />
          <div className="w-3/4 h-6 bg-surface-secondary rounded" />
        </div>

        {/* Button Skeleton */}
        <div className="w-48 h-14 bg-surface-secondary rounded-medium" />
      </div>
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

export default ArticleDetail
