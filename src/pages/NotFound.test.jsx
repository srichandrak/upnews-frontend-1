import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NotFound from './NotFound'

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('NotFound Page', () => {
  it('renders 404 heading', () => {
    renderWithRouter(<NotFound />)
    
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders "Page Not Found" message', () => {
    renderWithRouter(<NotFound />)
    
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })

  it('renders descriptive message', () => {
    renderWithRouter(<NotFound />)
    
    expect(screen.getByText(/page you're looking for doesn't exist/i)).toBeInTheDocument()
  })

  it('renders link to home page', () => {
    renderWithRouter(<NotFound />)
    
    const homeLink = screen.getByRole('link', { name: /go back home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('applies correct styling classes', () => {
    renderWithRouter(<NotFound />)
    
    const heading = screen.getByText('404')
    expect(heading).toHaveClass('text-primary')
  })
})
