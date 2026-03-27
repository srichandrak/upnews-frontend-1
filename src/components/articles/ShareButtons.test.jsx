import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ShareButtons from './ShareButtons'

const mockArticle = {
  id: '123',
  title: 'Test Article Title',
  summary: 'This is a test summary',
}

describe('ShareButtons', () => {
  let originalOpen
  let originalClipboard

  beforeEach(() => {
    vi.clearAllMocks()
    originalOpen = window.open
    window.open = vi.fn()

    originalClipboard = navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    })
  })

  afterEach(() => {
    window.open = originalOpen
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    })
  })

  it('renders share label', () => {
    render(<ShareButtons article={mockArticle} />)
    expect(screen.getByText('Share:')).toBeInTheDocument()
  })

  it('renders Twitter share button', () => {
    render(<ShareButtons article={mockArticle} />)
    expect(screen.getByLabelText('Share on Twitter')).toBeInTheDocument()
  })

  it('renders Facebook share button', () => {
    render(<ShareButtons article={mockArticle} />)
    expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument()
  })

  it('renders LinkedIn share button', () => {
    render(<ShareButtons article={mockArticle} />)
    expect(screen.getByLabelText('Share on LinkedIn')).toBeInTheDocument()
  })

  it('renders copy link button', () => {
    render(<ShareButtons article={mockArticle} />)
    expect(screen.getByLabelText('Copy link')).toBeInTheDocument()
  })

  it('opens Twitter share dialog on click', () => {
    render(<ShareButtons article={mockArticle} />)
    fireEvent.click(screen.getByLabelText('Share on Twitter'))

    expect(window.open).toHaveBeenCalledTimes(1)
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('twitter.com/intent/tweet'),
      '_blank',
      expect.any(String)
    )
  })

  it('opens Facebook share dialog on click', () => {
    render(<ShareButtons article={mockArticle} />)
    fireEvent.click(screen.getByLabelText('Share on Facebook'))

    expect(window.open).toHaveBeenCalledTimes(1)
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('facebook.com/sharer'),
      '_blank',
      expect.any(String)
    )
  })

  it('opens LinkedIn share dialog on click', () => {
    render(<ShareButtons article={mockArticle} />)
    fireEvent.click(screen.getByLabelText('Share on LinkedIn'))

    expect(window.open).toHaveBeenCalledTimes(1)
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('linkedin.com/sharing'),
      '_blank',
      expect.any(String)
    )
  })

  it('copies link to clipboard on click', async () => {
    render(<ShareButtons article={mockArticle} />)
    fireEvent.click(screen.getByLabelText('Copy link'))

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
    })
  })

  it('shows copied state after copying link', async () => {
    render(<ShareButtons article={mockArticle} />)
    fireEvent.click(screen.getByLabelText('Copy link'))

    await waitFor(() => {
      expect(screen.getByLabelText('Link copied')).toBeInTheDocument()
    })
  })

  it('includes article title in Twitter share URL', () => {
    render(<ShareButtons article={mockArticle} />)
    fireEvent.click(screen.getByLabelText('Share on Twitter'))

    const [url] = window.open.mock.calls[0]
    expect(url).toContain(encodeURIComponent('Test Article Title'))
  })

  it('applies custom className', () => {
    const { container } = render(<ShareButtons article={mockArticle} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('handles missing article gracefully', () => {
    render(<ShareButtons article={null} />)
    expect(screen.getByText('Share:')).toBeInTheDocument()
  })
})
