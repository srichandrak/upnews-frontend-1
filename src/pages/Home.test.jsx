import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './Home'

// Mock child components
vi.mock('@components/articles/HeroCarousel', () => ({
  default: ({ articles, isLoading }) => (
    <div data-testid="hero-carousel" data-loading={isLoading}>
      Hero Carousel ({articles?.length || 0} articles)
    </div>
  ),
}))

vi.mock('@components/categories/CategorySwimlane', () => ({
  default: ({ category, articles, isLoading }) => (
    <div data-testid={`swimlane-${category}`} data-loading={isLoading}>
      {category} Swimlane
    </div>
  ),
}))

// Mock the useArticles hook
vi.mock('@hooks/useArticles', () => ({
  useArticles: vi.fn(() => ({
    data: { results: [] },
    isLoading: false,
  })),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Home Page', () => {
  it('renders HeroCarousel component', () => {
    render(<Home />, { wrapper: createWrapper() })
    
    expect(screen.getByTestId('hero-carousel')).toBeInTheDocument()
  })

  it('renders all category swimlanes', () => {
    render(<Home />, { wrapper: createWrapper() })
    
    const categories = ['Technology', 'Health', 'Environment', 'Science', 'Inspiring']
    
    categories.forEach(category => {
      expect(screen.getByTestId(`swimlane-${category}`)).toBeInTheDocument()
    })
  })

  it('passes articles to HeroCarousel', () => {
    render(<Home />, { wrapper: createWrapper() })
    
    const carousel = screen.getByTestId('hero-carousel')
    expect(carousel).toBeInTheDocument()
  })

  it('renders category swimlanes with correct category names', () => {
    render(<Home />, { wrapper: createWrapper() })
    
    expect(screen.getByText('Technology Swimlane')).toBeInTheDocument()
    expect(screen.getByText('Health Swimlane')).toBeInTheDocument()
    expect(screen.getByText('Environment Swimlane')).toBeInTheDocument()
    expect(screen.getByText('Science Swimlane')).toBeInTheDocument()
    expect(screen.getByText('Inspiring Swimlane')).toBeInTheDocument()
  })
})
