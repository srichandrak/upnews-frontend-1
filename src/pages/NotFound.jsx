import React from 'react'
import { Link } from 'react-router-dom'

/**
 * 404 Not Found Page
 */
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-lg">
      <div className="text-center max-w-md">
        <h1 className="text-display-lg font-manrope font-bold text-primary mb-lg">404</h1>
        <h2 className="text-headline-md font-manrope font-bold text-on-surface mb-md">
          Page Not Found
        </h2>
        <p className="text-body-md text-on-surface-variant mb-2xl">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
