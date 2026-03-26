import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MobileNav from './MobileNav'

const renderWithRouter = (component, { route = '/' } = {}) => {
  return render(<MemoryRouter initialEntries={[route]}>{component}</MemoryRouter>)
}

describe('MobileNav', () => {
  it('renders all navigation tabs', () => {
    renderWithRouter(<MobileNav />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Bookmarks')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('highlights Home tab when on home route', () => {
    renderWithRouter(<MobileNav />, { route: '/' })
    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveClass('text-primary')
  })

  it('highlights Bookmarks tab when on bookmarks route', () => {
    renderWithRouter(<MobileNav />, { route: '/bookmarks' })
    const bookmarksLink = screen.getByText('Bookmarks').closest('a')
    expect(bookmarksLink).toHaveClass('text-primary')
  })

  it('calls onSearchClick when Search tab is clicked', () => {
    const onSearchClick = vi.fn()
    renderWithRouter(<MobileNav onSearchClick={onSearchClick} />)
    const searchButton = screen.getByText('Search').closest('button')
    fireEvent.click(searchButton)
    expect(onSearchClick).toHaveBeenCalledTimes(1)
  })

  it('has proper navigation role', () => {
    renderWithRouter(<MobileNav />)
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Mobile navigation')
  })

  it('marks active tab with aria-current', () => {
    renderWithRouter(<MobileNav />, { route: '/' })
    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveAttribute('aria-current', 'page')
  })

  it('does not mark inactive tabs with aria-current', () => {
    renderWithRouter(<MobileNav />, { route: '/' })
    const bookmarksLink = screen.getByText('Bookmarks').closest('a')
    expect(bookmarksLink).not.toHaveAttribute('aria-current')
  })
})
