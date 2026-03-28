import { useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook for infinite scroll using Intersection Observer
 *
 * @param {object} options - Hook options
 * @param {Function} options.onLoadMore - Callback when sentinel is visible
 * @param {boolean} options.hasMore - Whether more items are available
 * @param {boolean} options.isLoading - Whether currently loading
 * @param {number} options.threshold - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Root margin for early triggering
 * @returns {object} - { sentinelRef }
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore = true,
  isLoading = false,
  threshold = 0.1,
  rootMargin = '100px',
} = {}) {
  const sentinelRef = useRef(null)
  const observerRef = useRef(null)

  const handleIntersection = useCallback(
    (entries) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore?.()
      }
    },
    [onLoadMore, hasMore, isLoading]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    // Cleanup existing observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    })

    observerRef.current.observe(sentinel)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection, threshold, rootMargin])

  return { sentinelRef }
}

export default useInfiniteScroll
