import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu, X, User, Settings, LogOut } from 'lucide-react'

/**
 * Desktop Navigation Bar
 * Shows logo, category links, search, and user menu
 */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const categories = [
    { name: 'All', href: '/' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'Health', href: '/category/health' },
    { name: 'Environment', href: '/category/environment' },
    { name: 'Science', href: '/category/science' },
    { name: 'Inspiring', href: '/category/inspiring' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-outline-variant">
      <div className="max-w-7xl mx-auto px-lg md:px-2xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-md text-headline-sm font-manrope font-bold text-primary hover:text-primary-container transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-small flex items-center justify-center text-white">
              ↑
            </div>
            <span>UpNews</span>
          </Link>

          {/* Category Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-lg ml-3xl">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.href}
                className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Right Section: Search + User Menu */}
          <div className="flex items-center gap-md ml-auto">
            {/* Search Button */}
            <button
              className="p-sm rounded-small hover:bg-surface-secondary transition-colors text-on-surface-variant hover:text-on-surface"
              title="Search articles (press /)"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* User Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-sm rounded-small hover:bg-surface-secondary transition-colors text-on-surface-variant hover:text-on-surface"
                aria-label="User menu"
              >
                {isMenuOpen ? <X size={20} /> : <User size={20} />}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-sm bg-surface-primary border border-outline-variant rounded-medium shadow-level-3 overflow-hidden min-w-max">
                  <button className="w-full px-lg py-md text-left text-body-md text-on-surface hover:bg-surface-secondary transition-colors flex items-center gap-md">
                    <Settings size={16} />
                    Settings
                  </button>
                  <button className="w-full px-lg py-md text-left text-body-md text-on-surface hover:bg-surface-secondary transition-colors flex items-center gap-md border-t border-outline-variant">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
