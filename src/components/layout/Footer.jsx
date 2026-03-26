import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

/**
 * Desktop Footer
 * Shows links, about, and social media
 */
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-lg md:px-2xl py-3xl md:py-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3xl mb-3xl">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-md text-title-lg font-manrope font-bold text-primary hover:text-primary-container transition-colors mb-lg"
            >
              <div className="w-8 h-8 bg-primary rounded-small flex items-center justify-center text-white">
                ↑
              </div>
              UpNews
            </Link>
            <p className="text-body-sm text-on-surface-variant">
              Uplifting news delivered daily. Stay positive, stay informed.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-title-sm font-manrope font-bold text-on-surface mb-lg">Product</h3>
            <ul className="space-y-sm">
              <li>
                <Link to="/" className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                  Bookmarks
                </Link>
              </li>
              <li>
                <a href="#" className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-title-sm font-manrope font-bold text-on-surface mb-lg">Company</h3>
            <ul className="space-y-sm">
              <li>
                <a href="#" className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-title-sm font-manrope font-bold text-on-surface mb-lg">Follow Us</h3>
            <div className="flex gap-md">
              <a
                href="https://github.com/News-Uplifters/upnews-frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="p-sm rounded-small bg-surface-primary hover:bg-primary hover:text-on-primary text-on-surface-variant transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-sm rounded-small bg-surface-primary hover:bg-primary hover:text-on-primary text-on-surface-variant transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="mailto:hello@upnews.com"
                className="p-sm rounded-small bg-surface-primary hover:bg-primary hover:text-on-primary text-on-surface-variant transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-outline-variant my-2xl"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-lg">
          <p className="text-body-sm text-on-surface-variant">
            © {currentYear} UpNews. All rights reserved.
          </p>
          <p className="text-body-sm text-on-surface-variant flex items-center gap-sm">
            Made with
            <Heart size={16} className="text-error" fill="currentColor" />
            by News Uplifters
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
