const KEY = 'graphql_profile_token';

/**
 * Store JWT token in localStorage
 * @param {string} token - JWT token to store
 */
export function setToken(token) {
  if (!token) {
    console.error('Cannot set empty token')
    return
  }
  // Clean token (remove quotes if present)
  const cleanToken = token.trim().replace(/^["']|["']$/g, '')
  localStorage.setItem(KEY, cleanToken)
}

/**
 * Retrieve JWT token from localStorage
 * @returns {string|null} - The stored token or null
 */
export function getToken() {
  const token = localStorage.getItem(KEY)
  if (!token) return null
  
  return token.trim().replace(/^["']|["']$/g, '')
}

/**
 * Remove JWT token from localStorage
 */
export function removeToken() {
  localStorage.removeItem(KEY)
}

/**
 * Check if user is authenticated with a valid JWT
 * @returns {boolean} - True if authenticated with valid token
 */
export function isAuthenticated() {
  const token = getToken()
  
  if (!token) {
    return false
  }
  
  const parts = token.split('.')
  if (parts.length !== 3) {
    console.warn('Invalid JWT format')
    removeToken()
    return false
  }
  
  try {
    // Decode JWT payload (middle part)
    const payload = JSON.parse(atob(parts[1]))
    
    // Check if token has expired
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000)
      if (payload.exp < currentTime) {
        console.warn('JWT token has expired')
        removeToken() // Clean up expired token
        return false
      }
    }
    
    // Token is valid
    return true
    
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    removeToken() // Clean up invalid token
    return false
  }
}

/**
 * Get user ID from JWT token
 * @returns {string|null} - User ID from token payload
 */
export function getUserIdFromToken() {
  const token = getToken()
  if (!token) return null
  
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))    
    // Common JWT claims for user ID: sub, userId, id, user_id
    return payload.sub || payload.userId || payload.id || payload.user_id || null
    
  } catch (error) {
    console.error('Failed to extract user ID from JWT:', error)
    return null
  }
}

/**
 * Get full decoded JWT payload
 * @returns {object|null} - Decoded JWT payload or null
 */
export function getTokenPayload() {
  const token = getToken()
  if (!token) return null
  
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    return JSON.parse(atob(parts[1]))
    
  } catch (error) {
    console.error('Failed to decode JWT payload:', error)
    return null
  }
}