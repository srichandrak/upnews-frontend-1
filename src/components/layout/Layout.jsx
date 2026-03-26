import React from 'react'
import Navbar from './Navbar'
import MobileNav from './MobileNav'
import Footer from './Footer'

/**
 * Main Layout Component
 * Provides consistent structure across all pages
 */
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Desktop Navbar */}
      <div className="hidden md:block sticky top-0 z-40 bg-surface border-b border-outline-variant">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-outline-variant">
        <MobileNav />
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block bg-surface-secondary border-t border-outline-variant mt-3xl">
        <Footer />
      </div>
    </div>
  )
}

export default Layout
