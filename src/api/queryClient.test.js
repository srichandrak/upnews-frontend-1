import { describe, it, expect } from 'vitest'
import { queryClient, queryKeys } from './queryClient'

describe('queryClient', () => {
  it('is a QueryClient instance', () => {
    expect(queryClient).toBeDefined()
    expect(typeof queryClient.getQueryCache).toBe('function')
  })

  it('has default staleTime of 5 minutes', () => {
    const defaults = queryClient.getDefaultOptions()
    expect(defaults.queries.staleTime).toBe(5 * 60 * 1000)
  })

  it('has default gcTime of 30 minutes', () => {
    const defaults = queryClient.getDefaultOptions()
    expect(defaults.queries.gcTime).toBe(30 * 60 * 1000)
  })

  it('has retry set to 1 for queries', () => {
    const defaults = queryClient.getDefaultOptions()
    expect(defaults.queries.retry).toBe(1)
  })

  it('has retry set to 0 for mutations', () => {
    const defaults = queryClient.getDefaultOptions()
    expect(defaults.mutations.retry).toBe(0)
  })

  it('has refetchOnWindowFocus disabled', () => {
    const defaults = queryClient.getDefaultOptions()
    expect(defaults.queries.refetchOnWindowFocus).toBe(false)
  })
})

describe('queryKeys', () => {
  describe('articles', () => {
    it('returns all articles key', () => {
      expect(queryKeys.articles.all).toEqual(['articles'])
    })

    it('returns list key with filters', () => {
      const filters = { category: 'tech', page: 1 }
      expect(queryKeys.articles.list(filters)).toEqual(['articles', 'list', filters])
    })

    it('returns detail key with id', () => {
      expect(queryKeys.articles.detail('123')).toEqual(['articles', 'detail', '123'])
    })

    it('returns related key with id and category', () => {
      expect(queryKeys.articles.related('123', 'tech')).toEqual(['articles', 'related', '123', 'tech'])
    })
  })

  describe('categories', () => {
    it('returns all categories key', () => {
      expect(queryKeys.categories.all).toEqual(['categories'])
    })

    it('returns list key', () => {
      expect(queryKeys.categories.list()).toEqual(['categories', 'list'])
    })

    it('returns detail key with slug', () => {
      expect(queryKeys.categories.detail('technology')).toEqual(['categories', 'detail', 'technology'])
    })
  })

  describe('search', () => {
    it('returns all search key', () => {
      expect(queryKeys.search.all).toEqual(['search'])
    })

    it('returns query key', () => {
      expect(queryKeys.search.query('test')).toEqual(['search', 'query', 'test'])
    })
  })

  describe('bookmarks', () => {
    it('returns all bookmarks key', () => {
      expect(queryKeys.bookmarks.all).toEqual(['bookmarks'])
    })

    it('returns list key', () => {
      expect(queryKeys.bookmarks.list()).toEqual(['bookmarks', 'list'])
    })
  })
})
