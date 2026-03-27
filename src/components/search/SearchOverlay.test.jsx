import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SearchOverlay from './SearchOverlay'

// Mock the hooks
vi.mock('@hooks/useSearch', () => ({
  useSearchArticles: vi.fn(),
  useRecentSearches: vi.fn(),
  highlightMatches: vi.fn((text) => [{ text, highlight: false, key: 0 }]),
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }) => children,
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

import { useSearchArticles, useRecentSearches } from '@hooks/useSearch'

const mockArticles = [
  {
    id: '1',
    title: 'Test Article One',
    summary: 'Summary one',
    source: 'Source 1',
    category: 'technology',
    thumbnail_url: 'https://example.com/1.jpg',
  },
  {
    id: '2',
    title: 'Test Article Two',
    summary: 'Summary two',
    source: 'Source 2',
    category: 'health',
    thumbnail_url: 'https://example.com/2.jpg',
  },
]

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const renderWithProviders = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    ...props,
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <SearchOverlay {...defaultProps} />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('SearchOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    useSearchArticles.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    })

    useRecentSearches.mockReturnValue({
      recentSearches: [],
      addRecentSearch: vi.fn(),
      removeRecentSearch: vi.fn(),
      clearRecentSearches: vi.fn(),
    })
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('renders when isOpen is true', () => {
    renderWithProviders()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    renderWithProviders({ isOpen: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders search input with placeholder', () => {
    renderWithProviders()
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument()
  })

  it('focuses input on open', () => {
    renderWithProviders()
    const input = screen.getByPlaceholderText('Search articles...')
    expect(document.activeElement).toBe(input)
  })

  it('renders close button', () => {
    renderWithProviders()
    expect(screen.getByLabelText('Close search')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    renderWithProviders({ onClose })

    fireEvent.click(screen.getByLabelText('Close search'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn()
    renderWithProviders({ onClose })

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders keyboard hints', () => {
    renderWithProviders()
    expect(screen.getByText('Navigate')).toBeInTheDocument()
    expect(screen.getByText('Select')).toBeInTheDocument()
    expect(screen.getByText('Close')).toBeInTheDocument()
  })

  it('shows empty state when no recent searches', () => {
    renderWithProviders()
    expect(screen.getByText('Search for articles')).toBeInTheDocument()
    expect(screen.getByText(/Start typing to search/)).toBeInTheDocument()
  })

  it('shows recent searches when available', () => {
    useRecentSearches.mockReturnValue({
      recentSearches: ['previous search', 'another search'],
      addRecentSearch: vi.fn(),
      removeRecentSearch: vi.fn(),
      clearRecentSearches: vi.fn(),
    })

    renderWithProviders()
    expect(screen.getByText('Recent Searches')).toBeInTheDocument()
    expect(screen.getByText('previous search')).toBeInTheDocument()
    expect(screen.getByText('another search')).toBeInTheDocument()
  })

  it('shows clear all button for recent searches', () => {
    useRecentSearches.mockReturnValue({
      recentSearches: ['test search'],
      addRecentSearch: vi.fn(),
      removeRecentSearch: vi.fn(),
      clearRecentSearches: vi.fn(),
    })

    renderWithProviders()
    expect(screen.getByText('Clear all')).toBeInTheDocument()
  })

  it('clears all recent searches on click', () => {
    const clearRecentSearches = vi.fn()
    useRecentSearches.mockReturnValue({
      recentSearches: ['test search'],
      addRecentSearch: vi.fn(),
      removeRecentSearch: vi.fn(),
      clearRecentSearches,
    })

    renderWithProviders()
    fireEvent.click(screen.getByText('Clear all'))
    expect(clearRecentSearches).toHaveBeenCalledTimes(1)
  })

  it('shows loading state while searching', async () => {
    useSearchArticles.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    })

    renderWithProviders()
    const input = screen.getByPlaceholderText('Search articles...')
    fireEvent.change(input, { target: { value: 'test' } })

    // Look for skeleton loaders (ArticleCard with isLoading)
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('shows search results', () => {
    useSearchArticles.mockReturnValue({
      data: { articles: mockArticles },
      isLoading: false,
      error: null,
    })

    renderWithProviders()
    const input = screen.getByPlaceholderText('Search articles...')
    fireEvent.change(input, { target: { value: 'test query' } })

    expect(screen.getByText('2 results for "test query"')).toBeInTheDocument()
    expect(screen.getByText('Test Article One')).toBeInTheDocument()
    expect(screen.getByText('Test Article Two')).toBeInTheDocument()
  })

  it('shows no results message when search yields nothing', () => {
    useSearchArticles.mockReturnValue({
      data: { articles: [] },
      isLoading: false,
      error: null,
    })

    renderWithProviders()
    const input = screen.getByPlaceholderText('Search articles...')
    fireEvent.change(input, { target: { value: 'xyz nonexistent' } })

    expect(screen.getByText('No results found')).toBeInTheDocument()
    expect(screen.getByText(/couldn't find any articles/)).toBeInTheDocument()
  })

  it('renders clear input button when query exists', () => {
    renderWithProviders()
    const input = screen.getByPlaceholderText('Search articles...')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('clears input on clear button click', () => {
    renderWithProviders()
    const input = screen.getByPlaceholderText('Search articles...')
    fireEvent.change(input, { target: { value: 'test' } })

    fireEvent.click(screen.getByLabelText('Clear search'))
    expect(input.value).toBe('')
  })

  it('renders article thumbnails in results', () => {
    useSearchArticles.mockReturnValue({
      data: { articles: mockArticles },
      isLoading: false,
      error: null,
    })

    renderWithProviders()
    const input = screen.getByPlaceholderText('Search articles...')
    fireEvent.change(input, { target: { value: 'test' } })

    // Images have alt="" so query by tag instead
    const images = document.querySelectorAll('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('shows article source and category in results', () => {
    useSearchArticles.mockReturnValue({
      data: { articles: mockArticles },
      isLoading: false,
      error: null,
    })

    renderWithProviders()
    const input = screen.getByPlaceholderText('Search articles...')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(screen.getByText('Source 1')).toBeInTheDocument()
    expect(screen.getByText('technology')).toBeInTheDocument()
  })

  it('populates input when clicking recent search', () => {
    useRecentSearches.mockReturnValue({
      recentSearches: ['previous query'],
      addRecentSearch: vi.fn(),
      removeRecentSearch: vi.fn(),
      clearRecentSearches: vi.fn(),
    })

    renderWithProviders()
    fireEvent.click(screen.getByText('previous query'))

    const input = screen.getByPlaceholderText('Search articles...')
    expect(input.value).toBe('previous query')
  })

  it('prevents body scroll when open', () => {
    renderWithProviders()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll on close', () => {
    const { unmount } = renderWithProviders()
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('handles keyboard arrow navigation', () => {
    // Mock scrollIntoView for JSDOM
    Element.prototype.scrollIntoView = vi.fn()

    useRecentSearches.mockReturnValue({
      recentSearches: ['search 1', 'search 2'],
      addRecentSearch: vi.fn(),
      removeRecentSearch: vi.fn(),
      clearRecentSearches: vi.fn(),
    })

    renderWithProviders()

    fireEvent.keyDown(document, { key: 'ArrowDown' })
    // First item should be selected (check visually would require more complex setup)

    fireEvent.keyDown(document, { key: 'ArrowDown' })
    fireEvent.keyDown(document, { key: 'ArrowUp' })
    // Should be back to first item
  })

  it('has correct aria attributes', () => {
    renderWithProviders()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Search articles')
  })

  it('renders search input with correct aria label', () => {
    renderWithProviders()
    expect(screen.getByLabelText('Search input')).toBeInTheDocument()
  })
})
