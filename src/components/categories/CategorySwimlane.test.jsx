import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CategorySwimlane from './CategorySwimlane'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})
window.IntersectionObserver = mockIntersectionObserver

const mockArticles = [
  {
    id: '1',
    title: 'First Article',
    summary: 'Summary of first article',
    source: 'Tech News',
    thumbnail_url: 'https://example.com/image1.jpg',
    published_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    title: 'Second Article',
    summary: 'Summary of second article',
    source: 'Health Today',
    thumbnail_url: 'https://example.com/image2.jpg',
    published_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    title: 'Third Article',
    summary: 'Summary of third article',
    source: 'Science Daily',
    thumbnail_url: 'https://example.com/image3.jpg',
    published_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>)
}

describe('CategorySwimlane', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders category name as header', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={mockArticles} />)
    expect(screen.getByText('technology')).toBeInTheDocument()
  })

  it('renders "See All" link with correct href', () => {
    renderWithRouter(<CategorySwimlane category="science" articles={mockArticles} />)
    const seeAllLink = screen.getByText('See All →')
    expect(seeAllLink).toBeInTheDocument()
    expect(seeAllLink).toHaveAttribute('href', '/category/science')
  })

  it('renders article cards when articles are provided', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={mockArticles} />)
    expect(screen.getByText('First Article')).toBeInTheDocument()
    expect(screen.getByText('Second Article')).toBeInTheDocument()
    expect(screen.getByText('Third Article')).toBeInTheDocument()
  })

  it('renders loading skeletons when isLoading is true', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={[]} isLoading={true} />)
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders empty state when no articles and not loading', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={[]} isLoading={false} />)
    expect(screen.getByText('No articles yet')).toBeInTheDocument()
  })

  it('scroll buttons are hidden by default in JSDOM (no scroll width)', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={mockArticles} />)
    // In JSDOM, scrollWidth equals clientWidth (both 0), so buttons are hidden
    // This tests the conditional rendering logic
    expect(screen.queryByLabelText('Scroll right')).not.toBeInTheDocument()
  })

  it('has snap scroll classes on container', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={mockArticles} />)
    const scrollContainer = document.querySelector('.snap-x')
    expect(scrollContainer).toBeInTheDocument()
    expect(scrollContainer).toHaveClass('snap-mandatory')
  })

  it('article cards have snap-start class', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={mockArticles} />)
    const cards = document.querySelectorAll('.snap-start')
    expect(cards.length).toBe(mockArticles.length)
  })

  it('article cards have data-card-id attribute for Intersection Observer', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={mockArticles} />)
    const card1 = document.querySelector('[data-card-id="1"]')
    const card2 = document.querySelector('[data-card-id="2"]')
    expect(card1).toBeInTheDocument()
    expect(card2).toBeInTheDocument()
  })

  it('initializes IntersectionObserver', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={mockArticles} />)
    expect(mockIntersectionObserver).toHaveBeenCalled()
  })

  it('has responsive width classes on cards', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={mockArticles} />)
    const cards = document.querySelectorAll('[data-card-id]')
    cards.forEach((card) => {
      // Check for responsive width classes (2 mobile, 4 tablet, 6 desktop)
      expect(card.className).toMatch(/w-\[calc\(50%/)  // mobile: 2 cards
      expect(card.className).toMatch(/md:w-\[calc\(25%/)  // tablet: 4 cards
      expect(card.className).toMatch(/lg:w-\[calc\(16\.666%/)  // desktop: 6 cards
    })
  })

  it('renders correct number of loading skeletons', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={[]} isLoading={true} />)
    const skeletonCards = document.querySelectorAll('.snap-start')
    expect(skeletonCards.length).toBe(6) // Shows 6 skeletons for desktop view
  })
})

describe('CategorySwimlane scroll behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('scroll container has smooth scroll behavior class', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={mockArticles} />)
    const scrollContainer = document.querySelector('.snap-x')
    expect(scrollContainer).toHaveClass('scroll-smooth')
  })

  it('checkScroll updates button visibility based on scroll position', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={mockArticles} />)

    const scrollContainer = document.querySelector('.snap-x')

    // Mock scroll dimensions to simulate scrollable content
    Object.defineProperty(scrollContainer, 'scrollLeft', { value: 100, configurable: true })
    Object.defineProperty(scrollContainer, 'scrollWidth', { value: 1000, configurable: true })
    Object.defineProperty(scrollContainer, 'clientWidth', { value: 500, configurable: true })

    fireEvent.scroll(scrollContainer)

    // After setting scroll dimensions and triggering scroll, buttons should appear
    expect(screen.getByLabelText('Scroll left')).toBeInTheDocument()
    expect(screen.getByLabelText('Scroll right')).toBeInTheDocument()
  })

  it('scroll left button appears when scrolled right', () => {
    renderWithRouter(<CategorySwimlane category="technology" articles={mockArticles} />)

    const scrollContainer = document.querySelector('.snap-x')

    // Initially at scroll position 0, left button should not be visible
    expect(screen.queryByLabelText('Scroll left')).not.toBeInTheDocument()

    // Mock scroll dimensions
    Object.defineProperty(scrollContainer, 'scrollLeft', { value: 100, configurable: true })
    Object.defineProperty(scrollContainer, 'scrollWidth', { value: 1000, configurable: true })
    Object.defineProperty(scrollContainer, 'clientWidth', { value: 500, configurable: true })

    fireEvent.scroll(scrollContainer)

    // After scrolling, left button should appear
    expect(screen.getByLabelText('Scroll left')).toBeInTheDocument()
  })
})
