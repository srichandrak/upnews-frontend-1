import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// Mock the components to isolate App testing
vi.mock('@components/layout/Layout', () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}))

vi.mock('@pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}))

vi.mock('@pages/NotFound', () => ({
  default: () => <div data-testid="not-found-page">404 Not Found</div>,
}))

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByTestId('layout')).toBeInTheDocument()
  })

  it('renders home page at root route', () => {
    render(<App />)
    expect(screen.getByTestId('home-page')).toBeInTheDocument()
  })

  it('wraps content with QueryClientProvider', () => {
    // App should render without throwing errors related to QueryClient
    expect(() => render(<App />)).not.toThrow()
  })
})
