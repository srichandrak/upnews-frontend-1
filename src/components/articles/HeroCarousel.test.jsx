import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HeroCarousel, { HeroCarouselSkeleton } from './HeroCarousel'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

const mockArticles = [
  {
    id: '1',
    title: 'First Article Title',
    summary: 'Summary of the first article',
    source: 'Tech News',
    thumbnail_url: 'https://example.com/image1.jpg',
    published_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: '2',
    title: 'Second Article Title',
    summary: 'Summary of the second article',
    source: 'Health Today',
    thumbnail_url: 'https://example.com/image2.jpg',
    published_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    title: 'Third Article Title',
    summary: 'Summary of the third article',
    source: 'Science Daily',
    thumbnail_url: 'https://example.com/image3.jpg',
    published_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
]

const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>)
}

describe('HeroCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders skeleton when loading', () => {
    renderWithRouter(<HeroCarousel articles={[]} isLoading={true} />)
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('renders skeleton when no articles provided', () => {
    renderWithRouter(<HeroCarousel articles={[]} isLoading={false} />)
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('renders first article by default', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)
    expect(screen.getByText('First Article Title')).toBeInTheDocument()
    expect(screen.getByText('Summary of the first article')).toBeInTheDocument()
    expect(screen.getByText('Tech News')).toBeInTheDocument()
  })

  it('displays article source and time ago', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)
    expect(screen.getByText('Tech News')).toBeInTheDocument()
    expect(screen.getByText('1h ago')).toBeInTheDocument()
  })

  it('renders navigation arrows', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)
    expect(screen.getByLabelText('Previous article')).toBeInTheDocument()
    expect(screen.getByLabelText('Next article')).toBeInTheDocument()
  })

  it('renders progress dots matching article count', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)
    const dots = screen.getAllByRole('button', { name: /Go to slide/i })
    expect(dots).toHaveLength(3)
  })

  it('limits display to 5 articles maximum', () => {
    const manyArticles = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      title: `Article ${i + 1}`,
      summary: `Summary ${i + 1}`,
      source: `Source ${i + 1}`,
      thumbnail_url: `https://example.com/image${i + 1}.jpg`,
      published_at: new Date().toISOString(),
    }))
    renderWithRouter(<HeroCarousel articles={manyArticles} />)
    const dots = screen.getAllByRole('button', { name: /Go to slide/i })
    expect(dots).toHaveLength(5)
  })

  it('navigates to next article when next button is clicked', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)
    expect(screen.getByText('First Article Title')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Next article'))
    expect(screen.getByText('Second Article Title')).toBeInTheDocument()
  })

  it('navigates to previous article when prev button is clicked', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)

    // Go to second article first
    fireEvent.click(screen.getByLabelText('Next article'))
    expect(screen.getByText('Second Article Title')).toBeInTheDocument()

    // Go back to first
    fireEvent.click(screen.getByLabelText('Previous article'))
    expect(screen.getByText('First Article Title')).toBeInTheDocument()
  })

  it('wraps to last article when clicking prev on first article', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)
    expect(screen.getByText('First Article Title')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Previous article'))
    expect(screen.getByText('Third Article Title')).toBeInTheDocument()
  })

  it('wraps to first article when clicking next on last article', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)

    // Navigate to last article
    fireEvent.click(screen.getByLabelText('Next article'))
    fireEvent.click(screen.getByLabelText('Next article'))
    expect(screen.getByText('Third Article Title')).toBeInTheDocument()

    // Click next again should wrap to first
    fireEvent.click(screen.getByLabelText('Next article'))
    expect(screen.getByText('First Article Title')).toBeInTheDocument()
  })

  it('navigates to specific article when clicking progress dot', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)

    const dots = screen.getAllByRole('button', { name: /Go to slide/i })
    fireEvent.click(dots[2]) // Click third dot

    expect(screen.getByText('Third Article Title')).toBeInTheDocument()
  })

  it('auto-rotates to next article after 5 seconds', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)
    expect(screen.getByText('First Article Title')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.getByText('Second Article Title')).toBeInTheDocument()
  })

  it('pauses auto-rotation on mouse enter', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)
    const carousel = document.querySelector('.rounded-large')

    fireEvent.mouseEnter(carousel)

    act(() => {
      vi.advanceTimersByTime(10000)
    })

    // Should still be on first article
    expect(screen.getByText('First Article Title')).toBeInTheDocument()
  })

  it('resumes auto-rotation on mouse leave', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)
    const carousel = document.querySelector('.rounded-large')

    fireEvent.mouseEnter(carousel)
    fireEvent.mouseLeave(carousel)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.getByText('Second Article Title')).toBeInTheDocument()
  })

  it('article title links to article detail page', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/article/1')
  })

  it('renders thumbnail image with correct src', () => {
    renderWithRouter(<HeroCarousel articles={mockArticles} />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg')
    expect(image).toHaveAttribute('alt', 'First Article Title')
  })

  it('does not show navigation arrows for single article', () => {
    renderWithRouter(<HeroCarousel articles={[mockArticles[0]]} />)
    expect(screen.queryByLabelText('Previous article')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Next article')).not.toBeInTheDocument()
  })

  it('does not show progress dots for single article', () => {
    renderWithRouter(<HeroCarousel articles={[mockArticles[0]]} />)
    const dots = screen.queryAllByRole('button', { name: /Go to slide/i })
    expect(dots).toHaveLength(0)
  })
})

describe('HeroCarouselSkeleton', () => {
  it('renders skeleton with pulse animation', () => {
    render(<HeroCarouselSkeleton />)
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('has correct responsive height', () => {
    render(<HeroCarouselSkeleton />)
    const skeleton = document.querySelector('.aspect-video')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('md:h-[600px]')
  })
})
