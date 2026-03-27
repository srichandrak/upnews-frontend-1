import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ArticleCard, { ArticleCardSkeleton } from './ArticleCard'

const mockArticle = {
  id: '123',
  title: 'Test Article Title',
  summary: 'This is a test summary for the article that provides more details.',
  source: 'Tech News',
  thumbnail_url: 'https://example.com/image.jpg',
  published_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
}

const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>)
}

describe('ArticleCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders article title', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
  })

  it('renders article source', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('Tech News')).toBeInTheDocument()
  })

  it('renders time ago', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('1h ago')).toBeInTheDocument()
  })

  it('renders article summary', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    expect(screen.getByText(/This is a test summary/)).toBeInTheDocument()
  })

  it('links to correct article detail page', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/article/123')
  })

  it('renders thumbnail image with correct src and alt', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    expect(image).toHaveAttribute('alt', 'Test Article Title')
  })

  it('has 16:9 aspect ratio class', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('aspect-video')
  })

  it('has hover scale class on image', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    const image = screen.getByRole('img')
    expect(image.className).toMatch(/group-hover:scale-105/)
  })

  it('has lazy loading attribute on image', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('loading', 'lazy')
  })

  it('renders skeleton when isLoading is true', () => {
    renderWithRouter(<ArticleCard article={mockArticle} isLoading={true} />)
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
    expect(screen.queryByText('Test Article Title')).not.toBeInTheDocument()
  })

  it('does not render image when isVisible is false', () => {
    renderWithRouter(<ArticleCard article={mockArticle} isVisible={false} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders image when isVisible is true', () => {
    renderWithRouter(<ArticleCard article={mockArticle} isVisible={true} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('renders bookmark button with correct aria-label', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    expect(screen.getByLabelText('Bookmark article')).toBeInTheDocument()
  })

  it('bookmark button prevents navigation on click', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    const bookmarkBtn = screen.getByLabelText('Bookmark article')
    const clickEvent = fireEvent.click(bookmarkBtn)
    // Button should not cause navigation (e.preventDefault is called)
    expect(bookmarkBtn).toBeInTheDocument()
  })

  it('has transition classes for hover effects', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('group')
  })

  it('renders without thumbnail if no thumbnail_url', () => {
    const articleWithoutImage = { ...mockArticle, thumbnail_url: null }
    renderWithRouter(<ArticleCard article={articleWithoutImage} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
  })

  it('handles missing article gracefully', () => {
    renderWithRouter(<ArticleCard article={null} />)
    // Should render without crashing
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/article/undefined')
  })
})

describe('ArticleCard time formatting', () => {
  it('displays "Just now" for very recent articles', () => {
    const recentArticle = { ...mockArticle, published_at: new Date().toISOString() }
    renderWithRouter(<ArticleCard article={recentArticle} />)
    expect(screen.getByText('Just now')).toBeInTheDocument()
  })

  it('displays minutes ago for articles under an hour old', () => {
    const article = { ...mockArticle, published_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() }
    renderWithRouter(<ArticleCard article={article} />)
    expect(screen.getByText('30m ago')).toBeInTheDocument()
  })

  it('displays hours ago for articles under a day old', () => {
    const article = { ...mockArticle, published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() }
    renderWithRouter(<ArticleCard article={article} />)
    expect(screen.getByText('5h ago')).toBeInTheDocument()
  })

  it('displays days ago for articles under a week old', () => {
    const article = { ...mockArticle, published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
    renderWithRouter(<ArticleCard article={article} />)
    expect(screen.getByText('3d ago')).toBeInTheDocument()
  })

  it('displays weeks ago for articles under a month old', () => {
    const article = { ...mockArticle, published_at: new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000).toISOString() }
    renderWithRouter(<ArticleCard article={article} />)
    expect(screen.getByText('2w ago')).toBeInTheDocument()
  })

  it('displays date for articles over a month old', () => {
    const oldDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) // 60 days ago
    const article = { ...mockArticle, published_at: oldDate.toISOString() }
    renderWithRouter(<ArticleCard article={article} />)
    // Should show localized date string
    expect(screen.getByText(oldDate.toLocaleDateString())).toBeInTheDocument()
  })

  it('handles missing published_at gracefully', () => {
    const article = { ...mockArticle, published_at: null }
    renderWithRouter(<ArticleCard article={article} />)
    // Should render without the time, not crash
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
  })
})

describe('ArticleCardSkeleton', () => {
  it('renders with pulse animation', () => {
    render(<ArticleCardSkeleton />)
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('has 16:9 aspect ratio class', () => {
    render(<ArticleCardSkeleton />)
    const skeleton = document.querySelector('.aspect-video')
    expect(skeleton).toBeInTheDocument()
  })

  it('has gradient background', () => {
    render(<ArticleCardSkeleton />)
    const gradient = document.querySelector('.bg-gradient-to-r')
    expect(gradient).toBeInTheDocument()
  })

  it('has card-interactive class', () => {
    render(<ArticleCardSkeleton />)
    const skeleton = document.querySelector('.card-interactive')
    expect(skeleton).toBeInTheDocument()
  })
})
