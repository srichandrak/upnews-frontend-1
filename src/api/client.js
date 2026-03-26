/**
 * API Client
 *
 * Configures HTTP requests to the upnews-api backend.
 * Uses the VITE_API_URL environment variable for base URL.
 * Defaults to http://localhost:8000 for development.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Fetch wrapper with error handling
 * @param {string} endpoint - API endpoint (e.g., '/api/articles')
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - Response JSON
 */
export async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, mergedOptions)

    if (!response.ok) {
      const error = new Error(`API Error: ${response.status} ${response.statusText}`)
      error.status = response.status
      error.response = response

      // Try to parse error details from response
      try {
        error.data = await response.json()
      } catch {
        error.data = null
      }

      throw error
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error)
    throw error
  }
}

/**
 * GET request
 */
export function apiGet(endpoint, options = {}) {
  return apiClient(endpoint, {
    ...options,
    method: 'GET',
  })
}

/**
 * POST request
 */
export function apiPost(endpoint, body, options = {}) {
  return apiClient(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * PUT request
 */
export function apiPut(endpoint, body, options = {}) {
  return apiClient(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

/**
 * DELETE request
 */
export function apiDelete(endpoint, options = {}) {
  return apiClient(endpoint, {
    ...options,
    method: 'DELETE',
  })
}

/**
 * PATCH request
 */
export function apiPatch(endpoint, body, options = {}) {
  return apiClient(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export default apiClient
