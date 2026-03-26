import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Bookmark, User } from 'lucide-react'

/**
 * Mobile Bottom Navigation
 * Shows 4 main tabs: Home, Search, Bookmarks, Profile
 */
function MobileNav() {
  const location = useLocation()

  const tabs = [
    { icon: Home, label: 'Home', href: '/', isActive: location.pathname === '/' },
    { icon: Search, label: 'Search', href: '/search', isActive: location.pathname === '/search' },
    { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks', isActive: location.pathname === '/bookmarks' },
    { icon: User, label: 'Profile', href: '/profile', isActive: location.pathname === '/profile' },
  ]

  return (
    <div className="flex items-center justify-around h-16 bg-surface border-t border-outline-variant">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <Link
            key={tab.label}
            to={tab.href}
            className={`flex flex-col items-center justify-center gap-xs flex-1 h-full transition-colors ${
              tab.isActive
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon size={24} />
            <span className="text-label-sm">{tab.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

export default MobileNav
