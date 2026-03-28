import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useInfiniteScroll } from './useInfiniteScroll'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
const mockDisconnect = vi.fn()
const mockObserve = vi.fn()

beforeEach(() => {
  mockIntersectionObserver.mockImplementation((callback) => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: vi.fn(),
  }))
  global.IntersectionObserver = mockIntersectionObserver
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useInfiniteScroll', () => {
  it('returns a sentinelRef', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore: vi.fn(),
        hasMore: true,
        isLoading: false,
      })
    )

    expect(result.current.sentinelRef).toBeDefined()
    expect(result.current.sentinelRef.current).toBeNull()
  })

  it('creates IntersectionObserver with correct options', () => {
    // Create a mock DOM element
    const mockElement = document.createElement('div')

    renderHook(() => {
      const hook = useInfiniteScroll({
        onLoadMore: vi.fn(),
        hasMore: true,
        isLoading: false,
        threshold: 0.5,
        rootMargin: '200px',
      })
      // Simulate ref assignment
      hook.sentinelRef.current = mockElement
      return hook
    })

    // Re-render to trigger effect
    expect(mockIntersectionObserver).toHaveBeenCalled()
    const observerOptions = mockIntersectionObserver.mock.calls[0][1]
    expect(observerOptions.threshold).toBe(0.5)
    expect(observerOptions.rootMargin).toBe('200px')
  })

  it('calls onLoadMore when sentinel is intersecting', () => {
    const onLoadMore = vi.fn()
    let intersectionCallback

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
      }
    })

    const mockElement = document.createElement('div')

    renderHook(() => {
      const hook = useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
      hook.sentinelRef.current = mockElement
      return hook
    })

    // Simulate intersection
    intersectionCallback([{ isIntersecting: true }])

    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })

  it('does not call onLoadMore when not intersecting', () => {
    const onLoadMore = vi.fn()
    let intersectionCallback

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
      }
    })

    const mockElement = document.createElement('div')

    renderHook(() => {
      const hook = useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
      hook.sentinelRef.current = mockElement
      return hook
    })

    // Simulate non-intersection
    intersectionCallback([{ isIntersecting: false }])

    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('does not call onLoadMore when hasMore is false', () => {
    const onLoadMore = vi.fn()
    let intersectionCallback

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
      }
    })

    const mockElement = document.createElement('div')

    renderHook(() => {
      const hook = useInfiniteScroll({
        onLoadMore,
        hasMore: false,
        isLoading: false,
      })
      hook.sentinelRef.current = mockElement
      return hook
    })

    // Simulate intersection
    intersectionCallback([{ isIntersecting: true }])

    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('does not call onLoadMore when isLoading is true', () => {
    const onLoadMore = vi.fn()
    let intersectionCallback

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
      }
    })

    const mockElement = document.createElement('div')

    renderHook(() => {
      const hook = useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: true,
      })
      hook.sentinelRef.current = mockElement
      return hook
    })

    // Simulate intersection
    intersectionCallback([{ isIntersecting: true }])

    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('disconnects observer on unmount', () => {
    const { unmount } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore: vi.fn(),
        hasMore: true,
        isLoading: false,
      })
    )

    unmount()

    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('uses default options when not provided', () => {
    const mockElement = document.createElement('div')

    renderHook(() => {
      const hook = useInfiniteScroll()
      hook.sentinelRef.current = mockElement
      return hook
    })

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.1,
        rootMargin: '100px',
      })
    )
  })
})
