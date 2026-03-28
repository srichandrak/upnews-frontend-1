import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CategoryPage from './CategoryPage'

// Mock the hooks
vi.mock('@hooks/useArticles', () => ({
  useInfiniteArticles: vi.fn(),
}))

vi.mock('@hooks/useInfiniteScroll', () => ({
  useInfiniteScroll: vi.fn(() => ({
    sentinelRef: { current: null },
  })),
}))

// Mock ArticleCard
vi.mock('@components/articles/ArticleCard', () => ({
  default: ({ article }) => (
    <div data-testid={`article-card-${article.id}`}>
      <span>{article.title}</span>
    </div>
  ),
  ArticleCardSkeleton: () => <div data-testid="article-skeleton">Loading...</div>,
}))

import { useInfiniteArticles } from '@hooks/useArticles'
import { useInfiniteScroll } from '@hooks/useInfiniteScroll'

const mockArticles = [
  { id: '1', title: 'Tech Article 1', summary: 'Summary 1' },
  { id: '2', title: 'Tech Article 2', summary: 'Summary 2' },
  { id: '3', title: 'Tech Article 3', summary: 'Summary 3' },
]

const createWrapper = (initialRoute = '/category/technology') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/category/:category" element={children} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('CategoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useInfiniteScroll.mockReturnValue({ sentinelRef: { current: null } })

    // Mock window.scrollTo
    window.scrollTo = vi.fn()
  })

  describe('with articles', () => {
    beforeEach(() => {
      useInfiniteArticles.mockReturnValue({
        data: {
          pages: [
            { articles: mockArticles, total: 3, page: 1, limit: 12 },
          ],
        },
        isLoading: false,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: vi.fn(),
        isError: false,
        error: null,
      })
    })

    it('renders category title', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })
      expect(screen.getByText('Technology')).toBeInTheDocument()
    })

    it('renders article count', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })
      expect(screen.getByText('3 articles')).toBeInTheDocument()
    })

    it('renders article cards', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })
      expect(screen.getByTestId('article-card-1')).toBeInTheDocument()
      expect(screen.getByTestId('article-card-2')).toBeInTheDocument()
      expect(screen.getByTestId('article-card-3')).toBeInTheDocument()
    })

    it('renders back link to home', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })
      const backLink = screen.getByLabelText('Back to home')
      expect(backLink).toHaveAttribute('href', '/')
    })

    it('renders filter toggle button', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })
      expect(screen.getByLabelText('Toggle filters')).toBeInTheDocument()
    })

    it('toggles filter panel', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })

      const filterButton = screen.getByLabelText('Toggle filters')
      expect(screen.queryByLabelText('Sort articles')).not.toBeInTheDocument()

      fireEvent.click(filterButton)
      expect(screen.getByLabelText('Sort articles')).toBeInTheDocument()

      fireEvent.click(filterButton)
      expect(screen.queryByLabelText('Sort articles')).not.toBeInTheDocument()
    })

    it('has sort dropdown with options', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })

      fireEvent.click(screen.getByLabelText('Toggle filters'))

      const sortSelect = screen.getByLabelText('Sort articles')
      expect(sortSelect).toBeInTheDocument()

      const options = sortSelect.querySelectorAll('option')
      expect(options).toHaveLength(3)
      expect(options[0]).toHaveValue('newest')
      expect(options[1]).toHaveValue('oldest')
      expect(options[2]).toHaveValue('popular')
    })

    it('changes sort order', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })

      fireEvent.click(screen.getByLabelText('Toggle filters'))

      const sortSelect = screen.getByLabelText('Sort articles')
      fireEvent.change(sortSelect, { target: { value: 'oldest' } })

      expect(sortSelect.value).toBe('oldest')
    })

    it('calls useInfiniteArticles with category', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })

      expect(useInfiniteArticles).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'technology',
        })
      )
    })

    it('calls useInfiniteArticles with sort params', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })

      expect(useInfiniteArticles).toHaveBeenCalledWith(
        expect.objectContaining({
          sort: 'published_at',
          order: 'desc',
        })
      )
    })

    it('scrolls to top on mount', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    })
  })

  describe('loading state', () => {
    beforeEach(() => {
      useInfiniteArticles.mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: vi.fn(),
        isError: false,
        error: null,
      })
    })

    it('renders skeletons while loading', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })
      const skeletons = screen.getAllByTestId('article-skeleton')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  describe('loading more state', () => {
    beforeEach(() => {
      useInfiniteArticles.mockReturnValue({
        data: {
          pages: [{ articles: mockArticles, total: 20, page: 1, limit: 12 }],
        },
        isLoading: false,
        isFetchingNextPage: true,
        hasNextPage: true,
        fetchNextPage: vi.fn(),
        isError: false,
        error: null,
      })
    })

    it('renders articles and loading skeletons when fetching next page', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })

      // Should have both articles and skeletons
      expect(screen.getByTestId('article-card-1')).toBeInTheDocument()
      const skeletons = screen.getAllByTestId('article-skeleton')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  describe('empty state', () => {
    beforeEach(() => {
      useInfiniteArticles.mockReturnValue({
        data: { pages: [{ articles: [], total: 0 }] },
        isLoading: false,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: vi.fn(),
        isError: false,
        error: null,
      })
    })

    it('renders empty state message', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })
      expect(screen.getByText('No Articles Found')).toBeInTheDocument()
    })

    it('renders link to browse articles', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })
      const link = screen.getByRole('link', { name: /Browse All Articles/i })
      expect(link).toHaveAttribute('href', '/')
    })
  })

  describe('error state', () => {
    beforeEach(() => {
      useInfiniteArticles.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: vi.fn(),
        isError: true,
        error: new Error('Failed to fetch'),
      })
    })

    it('renders error message', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument()
    })

    it('renders try again button', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })
  })

  describe('end of results', () => {
    beforeEach(() => {
      useInfiniteArticles.mockReturnValue({
        data: {
          pages: [{ articles: mockArticles, total: 3, page: 1, limit: 12 }],
        },
        isLoading: false,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: vi.fn(),
        isError: false,
        error: null,
      })
    })

    it('renders end of results message', () => {
      render(<CategoryPage />, { wrapper: createWrapper() })
      expect(screen.getByText("You've reached the end")).toBeInTheDocument()
    })
  })

  describe('category display names', () => {
    it('displays Technology for technology slug', () => {
      useInfiniteArticles.mockReturnValue({
        data: { pages: [{ articles: mockArticles, total: 3 }] },
        isLoading: false,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: vi.fn(),
        isError: false,
        error: null,
      })

      render(<CategoryPage />, { wrapper: createWrapper('/category/technology') })
      expect(screen.getByText('Technology')).toBeInTheDocument()
    })

    it('displays Inspiring Stories for inspiring slug', () => {
      useInfiniteArticles.mockReturnValue({
        data: { pages: [{ articles: mockArticles, total: 3 }] },
        isLoading: false,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: vi.fn(),
        isError: false,
        error: null,
      })

      render(<CategoryPage />, { wrapper: createWrapper('/category/inspiring') })
      expect(screen.getByText('Inspiring Stories')).toBeInTheDocument()
    })
  })

  describe('infinite scroll integration', () => {
    it('sets up infinite scroll hook', () => {
      const mockFetchNextPage = vi.fn()

      useInfiniteArticles.mockReturnValue({
        data: { pages: [{ articles: mockArticles, total: 20 }] },
        isLoading: false,
        isFetchingNextPage: false,
        hasNextPage: true,
        fetchNextPage: mockFetchNextPage,
        isError: false,
        error: null,
      })

      render(<CategoryPage />, { wrapper: createWrapper() })

      expect(useInfiniteScroll).toHaveBeenCalledWith(
        expect.objectContaining({
          onLoadMore: mockFetchNextPage,
          hasMore: true,
          isLoading: false,
        })
      )
    })
  })
})
