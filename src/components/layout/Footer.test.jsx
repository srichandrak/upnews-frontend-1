import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Footer from './Footer'

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Footer', () => {
  it('renders logo and brand name', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByText('UpNews')).toBeInTheDocument()
  })

  it('renders brand description', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByText(/Uplifting news delivered daily/i)).toBeInTheDocument()
  })

  it('renders Product section links', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Bookmarks' })).toBeInTheDocument()
  })

  it('renders Company section links', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByText('Company')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
  })

  it('renders social media links', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByText('Follow Us')).toBeInTheDocument()
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('renders copyright with current year', () => {
    renderWithRouter(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument()
  })

  it('renders Made with love message', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByText(/Made with/i)).toBeInTheDocument()
    expect(screen.getByText(/by News Uplifters/i)).toBeInTheDocument()
  })

  it('external links open in new tab', () => {
    renderWithRouter(<Footer />)
    const githubLink = screen.getByLabelText('GitHub')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
