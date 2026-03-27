import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ArticleDetail, { ArticleDetailSkeleton } from './ArticleDetail'

// Mock the hooks
vi.mock('@hooks/useArticles', () => ({
  useArticle: vi.fn(),
  useRelatedArticles: vi.fn(),
}))

import { useArticle, useRelatedArticles } from '@hooks/useArticles'

const mockArticle = {
  id: '123',
  title: 'Test Article Title',
  summary: 'This is a detailed summary of the test article with all the important information.',
  source: 'Tech News',
  category: 'technology',
  thumbnail_url: 'https://example.com/image.jpg',
  url: 'https://example.com/full-article',
  published_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
}

const mockRelatedArticles = [
  {
    id: '456',
    title: 'Related Article 1',
    summary: 'Summary 1',
    source: 'Source 1',
    thumbnail_url: 'https://example.com/related1.jpg',
    published_at: new Date().toISOString(),
  },
  {
    id: '789',
    title: 'Related Article 2',
    summary: 'Summary 2',
    source: 'Source 2',
    thumbnail_url: 'https://example.com/related2.jpg',
    published_at: new Date().toISOString(),
  },
]

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const renderWithProviders = (articleId = '123') => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/article/${articleId}`]}>
        <Routes>
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/" element={<div>Home</div>} />
          <Route path="/category/:category" element={<div>Category</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('ArticleDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useArticle.mockReturnValue({
      data: mockArticle,
      isLoading: false,
      error: null,
    })
    useRelatedArticles.mockReturnValue({
      data: mockRelatedArticles,
      isLoading: false,
    })
  })

  it('renders article title', () => {
    renderWithProviders()
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
  })

  it('renders article source', () => {
    renderWithProviders()
    expect(screen.getByText('Tech News')).toBeInTheDocument()
  })

  it('renders article summary', () => {
    renderWithProviders()
    expect(screen.getByText(/This is a detailed summary/)).toBeInTheDocument()
  })

  it('renders time ago', () => {
    renderWithProviders()
    expect(screen.getByText('1h ago')).toBeInTheDocument()
  })

  it('renders hero image with correct src', () => {
    renderWithProviders()
    const image = screen.getByRole('img', { name: 'Test Article Title' })
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('renders back button', () => {
    renderWithProviders()
    expect(screen.getByLabelText('Go back')).toBeInTheDocument()
  })

  it('renders bookmark button', () => {
    renderWithProviders()
    // Main page bookmark button (not the ones in related article cards)
    const bookmarkButtons = screen.getAllByLabelText('Bookmark article')
    expect(bookmarkButtons.length).toBeGreaterThan(0)
  })

  it('toggles bookmark state on click', () => {
    // Disable related articles to avoid multiple bookmark buttons
    useRelatedArticles.mockReturnValue({
      data: [],
      isLoading: false,
    })

    renderWithProviders()
    const bookmarkBtn = screen.getByLabelText('Bookmark article')
    expect(screen.getByText('Bookmark')).toBeInTheDocument()

    fireEvent.click(bookmarkBtn)
    expect(screen.getByText('Bookmarked')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Remove bookmark'))
    expect(screen.getByText('Bookmark')).toBeInTheDocument()
  })

  it('renders Read Full Article button with external link', () => {
    renderWithProviders()
    const link = screen.getByRole('link', { name: /Read Full Article/i })
    expect(link).toHaveAttribute('href', 'https://example.com/full-article')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders category link', () => {
    renderWithProviders()
    const categoryLink = screen.getByRole('link', { name: 'technology' })
    expect(categoryLink).toHaveAttribute('href', '/category/technology')
  })

  it('renders share buttons', () => {
    renderWithProviders()
    expect(screen.getByText('Share:')).toBeInTheDocument()
    expect(screen.getByLabelText('Share on Twitter')).toBeInTheDocument()
  })

  it('renders related articles section', () => {
    renderWithProviders()
    expect(screen.getByText('Related Articles')).toBeInTheDocument()
    expect(screen.getByText('Related Article 1')).toBeInTheDocument()
    expect(screen.getByText('Related Article 2')).toBeInTheDocument()
  })

  it('renders skeleton while loading', () => {
    useArticle.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    })

    renderWithProviders()
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('renders 404 state when article not found', () => {
    useArticle.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Not found'),
    })

    renderWithProviders()
    expect(screen.getByText('Article Not Found')).toBeInTheDocument()
    expect(screen.getByText(/doesn't exist or has been removed/)).toBeInTheDocument()
  })

  it('renders Back to Home link in 404 state', () => {
    useArticle.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Not found'),
    })

    renderWithProviders()
    const homeLink = screen.getByRole('link', { name: 'Back to Home' })
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('does not render Read Full Article button if no URL', () => {
    useArticle.mockReturnValue({
      data: { ...mockArticle, url: null },
      isLoading: false,
      error: null,
    })

    renderWithProviders()
    expect(screen.queryByText('Read Full Article')).not.toBeInTheDocument()
  })

  it('renders placeholder when no thumbnail', () => {
    useArticle.mockReturnValue({
      data: { ...mockArticle, thumbnail_url: null },
      isLoading: false,
      error: null,
    })

    renderWithProviders()
    // Should still render the title
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    // No img element
    expect(screen.queryByRole('img', { name: 'Test Article Title' })).not.toBeInTheDocument()
  })
})

describe('ArticleDetailSkeleton', () => {
  it('renders with pulse animation', () => {
    render(<ArticleDetailSkeleton />)
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('renders hero image placeholder', () => {
    render(<ArticleDetailSkeleton />)
    const heroPlaceholder = document.querySelector('.aspect-video')
    expect(heroPlaceholder).toBeInTheDocument()
  })

  it('renders action bar placeholders', () => {
    render(<ArticleDetailSkeleton />)
    const placeholders = document.querySelectorAll('.bg-surface-secondary')
    expect(placeholders.length).toBeGreaterThan(0)
  })
})
