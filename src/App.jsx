import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

// Layout
import Layout from '@components/layout/Layout'

// Pages
import Home from '@pages/Home'
import ArticleDetail from '@pages/ArticleDetail'
import NotFound from '@pages/NotFound'

// Create Tanstack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<Home />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/bookmarks" element={<div className="p-lg">Bookmarks - Coming Soon</div>} />
            <Route path="/search" element={<div className="p-lg">Search - Coming Soon</div>} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  )
}

export default App
