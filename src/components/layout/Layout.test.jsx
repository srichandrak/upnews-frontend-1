import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from './Layout'

// Mock child components
vi.mock('./Navbar', () => ({
  default: ({ onSearchClick }) => <nav data-testid="navbar">Navbar</nav>,
}))

vi.mock('./MobileNav', () => ({
  default: ({ onSearchClick }) => <nav data-testid="mobile-nav">MobileNav</nav>,
}))

vi.mock('./Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}))

vi.mock('@components/search/SearchOverlay', () => ({
  default: ({ isOpen, onClose }) => isOpen ? <div data-testid="search-overlay">SearchOverlay</div> : null,
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Layout', () => {
  it('renders children content', () => {
    renderWithRouter(
      <Layout>
        <div data-testid="child-content">Test Content</div>
      </Layout>
    )
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders Navbar component', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    )
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })

  it('renders MobileNav component', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    )
    
    expect(screen.getByTestId('mobile-nav')).toBeInTheDocument()
  })

  it('renders Footer component', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    )
    
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('has correct structure with main content area', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    )
    
    const mainElement = screen.getByRole('main')
    expect(mainElement).toBeInTheDocument()
  })

  it('applies dark theme background class', () => {
    const { container } = renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    )
    
    const layoutWrapper = container.firstChild
    expect(layoutWrapper).toHaveClass('bg-surface')
  })
})
