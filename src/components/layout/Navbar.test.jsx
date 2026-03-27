import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

const renderWithRouter = (component, { route = '/' } = {}) => {
  return render(<MemoryRouter initialEntries={[route]}>{component}</MemoryRouter>)
}

describe('Navbar', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders logo with link to home', () => {
    renderWithRouter(<Navbar />)
    const logoLink = screen.getByLabelText('UpNews Home')
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('renders all category links', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Health')).toBeInTheDocument()
    expect(screen.getByText('Environment')).toBeInTheDocument()
    expect(screen.getByText('Science')).toBeInTheDocument()
    expect(screen.getByText('Inspiring')).toBeInTheDocument()
  })

  it('highlights active category based on current route', () => {
    renderWithRouter(<Navbar />, { route: '/category/technology' })
    const techLink = screen.getByText('Technology')
    expect(techLink).toHaveClass('text-primary')
  })

  it('highlights All when on home route', () => {
    renderWithRouter(<Navbar />, { route: '/' })
    const allLink = screen.getByText('All')
    expect(allLink).toHaveClass('text-primary')
  })

  it('renders search button', () => {
    renderWithRouter(<Navbar />)
    const searchButton = screen.getByLabelText('Search articles')
    expect(searchButton).toBeInTheDocument()
  })

  it('calls onSearchClick when search button is clicked', () => {
    const onSearchClick = vi.fn()
    renderWithRouter(<Navbar onSearchClick={onSearchClick} />)
    const searchButton = screen.getByLabelText('Search articles')
    fireEvent.click(searchButton)
    expect(onSearchClick).toHaveBeenCalledTimes(1)
  })

  it('renders user menu button', () => {
    renderWithRouter(<Navbar />)
    const userMenuButton = screen.getByLabelText('User menu')
    expect(userMenuButton).toBeInTheDocument()
  })

  it('opens user menu dropdown when clicked', () => {
    renderWithRouter(<Navbar />)
    const userMenuButton = screen.getByLabelText('User menu')
    fireEvent.click(userMenuButton)
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('closes user menu when clicking outside', () => {
    renderWithRouter(<Navbar />)
    const userMenuButton = screen.getByLabelText('User menu')
    fireEvent.click(userMenuButton)
    expect(screen.getByText('Settings')).toBeInTheDocument()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByText('Settings')).not.toBeInTheDocument()
  })

  it('has proper ARIA attributes for accessibility', () => {
    renderWithRouter(<Navbar />)
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')
    const userMenuButton = screen.getByLabelText('User menu')
    expect(userMenuButton).toHaveAttribute('aria-haspopup', 'true')
    expect(userMenuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('updates aria-expanded when menu is open', () => {
    renderWithRouter(<Navbar />)
    const userMenuButton = screen.getByLabelText('User menu')
    fireEvent.click(userMenuButton)
    expect(userMenuButton).toHaveAttribute('aria-expanded', 'true')
  })
})
