import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BookmarksPage from './BookmarksPage'

// Mock the useBookmarks hook
vi.mock('@hooks/useBookmarks', () => ({
  useBookmarks: vi.fn(),
}))

// Mock ArticleCard to simplify tests
vi.mock('@components/articles/ArticleCard', () => ({
  default: ({ article }) => (
    <div data-testid={`article-card-${article.id}`}>
      <span>{article.title}</span>
    </div>
  ),
}))

import { useBookmarks } from '@hooks/useBookmarks'

const mockBookmarks = [
  {
    id: '1',
    title: 'First Article',
    summary: 'Summary 1',
    source: 'Source 1',
    thumbnail_url: 'https://example.com/1.jpg',
    bookmarkedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Alpha Article',
    summary: 'Summary 2',
    source: 'Source 2',
    thumbnail_url: 'https://example.com/2.jpg',
    bookmarkedAt: '2024-01-02T10:00:00Z',
  },
  {
    id: '3',
    title: 'Zebra Article',
    summary: 'Summary 3',
    source: 'Source 3',
    thumbnail_url: 'https://example.com/3.jpg',
    bookmarkedAt: '2024-01-03T10:00:00Z',
  },
]

const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <BookmarksPage />
    </MemoryRouter>
  )
}

describe('BookmarksPage', () => {
  const mockRemoveBookmark = vi.fn()
  const mockGetSortedBookmarks = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSortedBookmarks.mockReturnValue(mockBookmarks)

    useBookmarks.mockReturnValue({
      bookmarks: mockBookmarks,
      bookmarkCount: mockBookmarks.length,
      removeBookmark: mockRemoveBookmark,
      getSortedBookmarks: mockGetSortedBookmarks,
    })
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  describe('with bookmarks', () => {
    it('renders page title', () => {
      renderWithRouter()
      expect(screen.getByText('Bookmarks')).toBeInTheDocument()
    })

    it('displays bookmark count', () => {
      renderWithRouter()
      expect(screen.getByText('3 saved articles')).toBeInTheDocument()
    })

    it('displays singular form for one bookmark', () => {
      useBookmarks.mockReturnValue({
        bookmarks: [mockBookmarks[0]],
        bookmarkCount: 1,
        removeBookmark: mockRemoveBookmark,
        getSortedBookmarks: vi.fn().mockReturnValue([mockBookmarks[0]]),
      })

      renderWithRouter()
      expect(screen.getByText('1 saved article')).toBeInTheDocument()
    })

    it('renders article cards', () => {
      renderWithRouter()
      expect(screen.getByTestId('article-card-1')).toBeInTheDocument()
      expect(screen.getByTestId('article-card-2')).toBeInTheDocument()
      expect(screen.getByTestId('article-card-3')).toBeInTheDocument()
    })

    it('renders sort dropdown', () => {
      renderWithRouter()
      expect(screen.getByLabelText('Sort bookmarks')).toBeInTheDocument()
    })

    it('has default sort option selected', () => {
      renderWithRouter()
      const select = screen.getByLabelText('Sort bookmarks')
      expect(select.value).toBe('newest')
    })

    it('calls getSortedBookmarks when sort changes', () => {
      renderWithRouter()
      const select = screen.getByLabelText('Sort bookmarks')

      fireEvent.change(select, { target: { value: 'alphabetical' } })

      expect(mockGetSortedBookmarks).toHaveBeenCalledWith('alphabetical')
    })

    it('renders remove buttons for each article', () => {
      renderWithRouter()
      const removeButtons = screen.getAllByTitle('Remove from bookmarks')
      expect(removeButtons).toHaveLength(3)
    })

    it('opens confirmation dialog on remove click', () => {
      renderWithRouter()
      const removeButtons = screen.getAllByTitle('Remove from bookmarks')

      fireEvent.click(removeButtons[0])

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Remove Bookmark')).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument()
    })

    it('shows article title in confirmation dialog', () => {
      renderWithRouter()
      const removeButtons = screen.getAllByTitle('Remove from bookmarks')

      fireEvent.click(removeButtons[0])

      // Check for the full dialog message which includes the article title
      expect(screen.getByText(/Are you sure you want to remove "First Article"/)).toBeInTheDocument()
    })

    it('removes bookmark on confirm', () => {
      renderWithRouter()
      const removeButtons = screen.getAllByTitle('Remove from bookmarks')

      fireEvent.click(removeButtons[0])
      fireEvent.click(screen.getByText('Remove'))

      expect(mockRemoveBookmark).toHaveBeenCalledWith('1')
    })

    it('closes dialog on cancel', () => {
      renderWithRouter()
      const removeButtons = screen.getAllByTitle('Remove from bookmarks')

      fireEvent.click(removeButtons[0])
      fireEvent.click(screen.getByText('Cancel'))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('closes dialog on Escape key', () => {
      renderWithRouter()
      const removeButtons = screen.getAllByTitle('Remove from bookmarks')

      fireEvent.click(removeButtons[0])
      fireEvent.keyDown(document, { key: 'Escape' })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('closes dialog on backdrop click', () => {
      renderWithRouter()
      const removeButtons = screen.getAllByTitle('Remove from bookmarks')

      fireEvent.click(removeButtons[0])
      const dialog = screen.getByRole('dialog')
      fireEvent.click(dialog)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('does not close dialog when clicking inside', () => {
      renderWithRouter()
      const removeButtons = screen.getAllByTitle('Remove from bookmarks')

      fireEvent.click(removeButtons[0])
      const dialogContent = screen.getByText('Remove Bookmark')
      fireEvent.click(dialogContent)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('has close button in dialog', () => {
      renderWithRouter()
      const removeButtons = screen.getAllByTitle('Remove from bookmarks')

      fireEvent.click(removeButtons[0])
      const closeButton = screen.getByLabelText('Close dialog')

      fireEvent.click(closeButton)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    beforeEach(() => {
      useBookmarks.mockReturnValue({
        bookmarks: [],
        bookmarkCount: 0,
        removeBookmark: mockRemoveBookmark,
        getSortedBookmarks: vi.fn().mockReturnValue([]),
      })
    })

    it('renders empty state heading', () => {
      renderWithRouter()
      expect(screen.getByText('No Bookmarks Yet')).toBeInTheDocument()
    })

    it('renders empty state description', () => {
      renderWithRouter()
      expect(screen.getByText(/Save articles you want to read later/)).toBeInTheDocument()
    })

    it('renders Browse Articles link', () => {
      renderWithRouter()
      const link = screen.getByRole('link', { name: /Browse Articles/i })
      expect(link).toHaveAttribute('href', '/')
    })

    it('does not render sort dropdown', () => {
      renderWithRouter()
      expect(screen.queryByLabelText('Sort bookmarks')).not.toBeInTheDocument()
    })
  })
})
