import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Bookmark, User } from 'lucide-react'

function MobileNav({ onSearchClick }) {
  const location = useLocation()

  const tabs = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search', onClick: onSearchClick },
    { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
    { icon: User, label: 'Profile', href: '/profile' },
  ]

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  const getTabClasses = (active) => {
    const base = 'flex flex-col items-center justify-center gap-xs flex-1 h-full transition-colors relative'
    return active ? base + ' text-primary' : base + ' text-on-surface-variant hover:text-on-surface'
  }

  return (
    <nav className="flex items-center justify-around h-16 bg-surface border-t border-outline-variant" role="navigation" aria-label="Mobile navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = isActive(tab.href)
        
        if (tab.onClick) {
          return (
            <button key={tab.label} onClick={tab.onClick} className="flex flex-col items-center justify-center gap-xs flex-1 h-full transition-colors text-on-surface-variant hover:text-on-surface" aria-label={tab.label}>
              <Icon size={24} />
              <span className="text-label-sm">{tab.label}</span>
            </button>
          )
        }

        return (
          <Link key={tab.label} to={tab.href} className={getTabClasses(active)} aria-current={active ? 'page' : undefined}>
            {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />}
            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
            <span className={active ? 'text-label-sm font-medium' : 'text-label-sm'}>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default MobileNav
