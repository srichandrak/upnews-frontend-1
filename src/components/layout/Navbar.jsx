import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, User, Settings, LogOut, Info } from 'lucide-react'

function Navbar({ onSearchClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef(null)

  const categories = [
    { name: 'All', href: '/' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'Health', href: '/category/health' },
    { name: 'Environment', href: '/category/environment' },
    { name: 'Science', href: '/category/science' },
    { name: 'Inspiring', href: '/category/inspiring' },
  ]

  const isActiveCategory = (href) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  useEffect(() => { setIsMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '/' && !event.target.closest('input, textarea')) {
        event.preventDefault()
        onSearchClick?.()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSearchClick])

  const getCategoryClasses = (isActive) => {
    const base = 'text-body-md transition-colors relative py-sm'
    return isActive ? base + ' text-primary font-medium' : base + ' text-on-surface-variant hover:text-on-surface'
  }

  const getMenuButtonClasses = () => {
    const base = 'p-sm rounded-small transition-colors'
    return isMenuOpen ? base + ' bg-surface-secondary text-on-surface' : base + ' hover:bg-surface-secondary text-on-surface-variant hover:text-on-surface'
  }

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-outline-variant" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-lg md:px-2xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-md text-headline-sm font-manrope font-bold text-primary hover:text-primary-container transition-colors" aria-label="UpNews Home">
            <div className="w-8 h-8 bg-primary rounded-small flex items-center justify-center text-white" aria-hidden="true">↑</div>
            <span>UpNews</span>
          </Link>

          <div className="hidden lg:flex items-center gap-lg ml-3xl" role="menubar">
            {categories.map((cat) => {
              const isActive = isActiveCategory(cat.href)
              return (
                <Link key={cat.name} to={cat.href} role="menuitem" aria-current={isActive ? 'page' : undefined} className={getCategoryClasses(isActive)}>
                  {cat.name}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-md ml-auto">
            <button onClick={onSearchClick} className="p-sm rounded-small hover:bg-surface-secondary transition-colors text-on-surface-variant hover:text-on-surface" title="Search articles (press /)" aria-label="Search articles">
              <Search size={20} />
            </button>

            <div className="relative" ref={menuRef}>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={getMenuButtonClasses()} aria-label="User menu" aria-expanded={isMenuOpen} aria-haspopup="true">
                <User size={20} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-sm bg-surface-primary border border-outline-variant rounded-medium shadow-level-3 overflow-hidden min-w-[160px]" role="menu" aria-orientation="vertical">
                  <button className="w-full px-lg py-md text-left text-body-md text-on-surface hover:bg-surface-secondary transition-colors flex items-center gap-md" role="menuitem">
                    <Settings size={16} aria-hidden="true" />Settings
                  </button>
                  <button className="w-full px-lg py-md text-left text-body-md text-on-surface hover:bg-surface-secondary transition-colors flex items-center gap-md" role="menuitem">
                    <Info size={16} aria-hidden="true" />About
                  </button>
                  <button className="w-full px-lg py-md text-left text-body-md text-on-surface hover:bg-surface-secondary transition-colors flex items-center gap-md border-t border-outline-variant" role="menuitem">
                    <LogOut size={16} aria-hidden="true" />Logout
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
