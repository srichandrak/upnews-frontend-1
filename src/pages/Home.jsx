import React from 'react'
import HeroCarousel from '@components/articles/HeroCarousel'
import CategorySwimlane from '@components/categories/CategorySwimlane'
import { useArticles } from '@hooks/useArticles'

/**
 * Home Page
 * Displays hero carousel and category swimlanes
 */
function Home() {
  const { data, isLoading } = useArticles({ limit: 50 })

  const categories = [
    'Technology',
    'Health',
    'Environment',
    'Science',
    'Inspiring',
  ]

  // Mock data for demo purposes (replace with actual API calls)
  const mockArticles = data?.results || [
    {
      id: '1',
      title: 'Revolutionary Solar Technology Breakthrough',
      summary: 'Scientists develop new solar cells with unprecedented efficiency',
      source: 'Science Today',
      thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=450&fit=crop',
      published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Global Health Initiative Saves Thousands',
      summary: 'New medical program reaches remote communities with essential care',
      source: 'Health Report',
      thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
      published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'Forest Restoration Project Expands Across Continents',
      summary: 'Unprecedented effort to restore ecosystems shows promising results',
      source: 'Environmental News',
      thumbnail_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop',
      published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      title: 'Renewable Energy Reaches Record Milestone',
      summary: 'Clean energy now accounts for over 50% of global capacity',
      source: 'Energy Weekly',
      thumbnail_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
      published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      title: 'Student-Led Initiative Transforms Community',
      summary: 'Young innovators create sustainable solutions for local challenges',
      source: 'Inspiring Stories',
      thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
      published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Carousel */}
      <div className="px-lg md:px-2xl pt-lg">
        <HeroCarousel articles={mockArticles} isLoading={isLoading} />
      </div>

      {/* Category Swimlanes */}
      <div className="space-y-0">
        {categories.map((category) => (
          <CategorySwimlane
            key={category}
            category={category}
            articles={mockArticles}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Spacing for mobile nav */}
      <div className="h-lg md:h-0"></div>
    </div>
  )
}

export default Home
