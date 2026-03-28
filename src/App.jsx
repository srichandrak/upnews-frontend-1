import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@api/queryClient'

// Layout
import Layout from '@components/layout/Layout'

// Pages
import Home from '@pages/Home'
import ArticleDetail from '@pages/ArticleDetail'
import BookmarksPage from '@pages/BookmarksPage'
import NotFound from '@pages/NotFound'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<Home />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
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
