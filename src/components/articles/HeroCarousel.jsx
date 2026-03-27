import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ROTATION_INTERVAL = 5000 // 5 seconds
const SWIPE_THRESHOLD = 50 // minimum swipe distance in pixels

/**
 * Hero Carousel Component
 * Auto-rotating carousel of featured articles with progress dots and swipe support
 */
function HeroCarousel({ articles = [], isLoading = false }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const displayArticles = articles.slice(0, 5) // Only show top 5

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayArticles.length)
    setAnimationKey((prev) => prev + 1)
  }, [displayArticles.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + displayArticles.length) % displayArticles.length)
    setAnimationKey((prev) => prev + 1)
  }, [displayArticles.length])

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isPaused || displayArticles.length === 0) return

    const interval = setInterval(() => {
      goToNext()
    }, ROTATION_INTERVAL)

    return () => clearInterval(interval)
  }, [displayArticles.length, isPaused, goToNext])

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index)
    setAnimationKey((prev) => prev + 1)
  }, [])

  // Handle swipe gestures
  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info
    // Swipe left (next) or right (prev) based on offset or velocity
    if (offset.x < -SWIPE_THRESHOLD || velocity.x < -500) {
      goToNext()
    } else if (offset.x > SWIPE_THRESHOLD || velocity.x > 500) {
      goToPrev()
    }
  }

  if (isLoading || displayArticles.length === 0) {
    return <HeroCarouselSkeleton />
  }

  const article = displayArticles[currentIndex]

  return (
    <div
      className="relative w-full aspect-video md:aspect-auto md:h-[600px] overflow-hidden rounded-large bg-surface-secondary"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          {/* Background Image */}
          {article?.thumbnail_url && (
            <img
              src={article.thumbnail_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-overlay-dark"></div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-lg md:p-3xl">
            <Link
              to={`/article/${article.id}`}
              className="group cursor-pointer max-w-3xl"
            >
              <h2 className="text-headline-sm md:text-display-sm font-manrope font-bold text-on-surface mb-lg group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              <p className="text-body-md text-on-surface-variant mb-xl group-hover:text-on-surface transition-colors">
                {article.summary}
              </p>
              <div className="flex items-center gap-lg">
                <span className="text-label-md text-on-surface-variant">{article.source}</span>
                <span className="text-label-md text-on-surface-variant">•</span>
                <span className="text-label-md text-on-surface-variant">
                  {formatTimeAgo(article.published_at)}
                </span>
              </div>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows (Desktop) */}
      {displayArticles.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="hidden md:flex absolute left-lg top-1/2 -translate-y-1/2 z-20 p-md rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-on-surface transition-colors"
            aria-label="Previous article"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={goToNext}
            className="hidden md:flex absolute right-lg top-1/2 -translate-y-1/2 z-20 p-md rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-on-surface transition-colors"
            aria-label="Next article"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Progress Dots with Countdown */}
      {displayArticles.length > 1 && (
        <div className="absolute bottom-lg left-1/2 -translate-x-1/2 z-20 flex items-center gap-sm">
          {displayArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-on-surface-variant bg-opacity-30 w-8'
                  : 'bg-on-surface-variant bg-opacity-50 w-2 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : undefined}
            >
              {index === currentIndex && (
                <span
                  key={animationKey}
                  className="absolute inset-0 bg-primary rounded-full origin-left"
                  style={{
                    animation: isPaused ? 'none' : `progress ${ROTATION_INTERVAL}ms linear forwards`,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Progress animation keyframes */}
      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  )
}

/**
 * Skeleton Loader Variant
 */
export function HeroCarouselSkeleton() {
  return (
    <div className="w-full aspect-video md:aspect-auto md:h-[600px] rounded-large bg-gradient-to-r from-surface-secondary via-surface-tertiary to-surface-secondary animate-pulse">
      <div className="w-full h-full"></div>
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

export default HeroCarousel
