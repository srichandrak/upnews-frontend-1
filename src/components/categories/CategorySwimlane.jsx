import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ArticleCard from '@components/articles/ArticleCard'

/**
 * Category Swimlane Component
 * Horizontal scrolling row of articles for a specific category
 */
function CategorySwimlane({ category, articles = [], isLoading = false }) {
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 400
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === 'left' ? -scrollAmount : scrollAmount)

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })

    setTimeout(checkScroll, 300)
  }

  React.useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [articles])

  return (
    <section className="py-2xl">
      {/* Header */}
      <div className="container-safe flex items-center justify-between mb-lg">
        <h2 className="text-headline-sm font-manrope font-bold text-on-surface capitalize">
          {category}
        </h2>
        <Link
          to={`/category/${category}`}
          className="text-body-md text-primary hover:text-primary-container transition-colors"
        >
          See All →
        </Link>
      </div>

      {/* Scrollable Container */}
      <div className="relative px-lg md:px-2xl">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-sm rounded-full bg-surface-primary hover:bg-surface-secondary border border-outline-variant transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-on-surface" />
          </button>
        )}

        {/* Articles Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="overflow-x-auto scrollbar-hide scroll-smooth px-0 md:px-3xl"
        >
          <div className="flex gap-lg pb-md">
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-full md:w-1/4">
                  <ArticleCard isLoading={true} />
                </div>
              ))
            ) : articles.length > 0 ? (
              // Article Cards
              articles.map((article) => (
                <div key={article.id} className="flex-shrink-0 w-full md:w-1/4">
                  <ArticleCard article={article} />
                </div>
              ))
            ) : (
              // Empty State
              <div className="w-full py-2xl flex flex-col items-center justify-center">
                <p className="text-body-md text-on-surface-variant">No articles yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-sm rounded-full bg-surface-primary hover:bg-surface-secondary border border-outline-variant transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-on-surface" />
          </button>
        )}
      </div>
    </section>
  )
}

export default CategorySwimlane
