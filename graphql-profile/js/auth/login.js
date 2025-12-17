import { setToken } from './token-manager.js';

const SIGNIN_ENDPOINT = 'https://learn.zone01oujda.ma/api/auth/signin'

/**
 * Render the login form
 * @param {HTMLElement} target - Container to render login form
 */
export function renderLogin(target) {
  target.innerHTML = `
    <div class="login-wrap">
      <div class="login-box card">
        <h1>Sign in</h1>
        <form id="login-form">
          <div class="field">
            <input 
              id="username" 
              type="text"
              placeholder="Username or Email" 
              required
              autocomplete="username"
            />
          </div>
          <div class="field">
            <input 
              id="password" 
              type="password" 
              placeholder="Password" 
              required
              autocomplete="current-password"
            />
          </div>
          <div id="error-message" class="error-message" style="display: none;"></div>
          <div>
            <button id="loginBtn" class="btn" type="submit">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Add form submit handler
  document.getElementById('login-form').addEventListener('submit', handleLogin)
}

/**
 * Handle login form submission
 * @param {Event} event - Form submit event
 */
async function handleLogin(event) {
  event.preventDefault()
  
  const usernameInput = document.getElementById('username')
  const passwordInput = document.getElementById('password')
  const loginBtn = document.getElementById('loginBtn')
  const errorDiv = document.getElementById('error-message')
  
  const username = usernameInput.value.trim()
  const password = passwordInput.value.trim()
  
  // Validate inputs
  if (!username || !password) {
    showError('Please enter both username and password')
    return
  }
  
  // Disable button and show loading state
  loginBtn.disabled = true
  loginBtn.textContent = 'Signing in...'
  hideError()
  
  try {
    // Fetch JWT token using Basic Auth
    const token = await fetchJWTToken(username, password)
    
    if (token) {
      // Store token
      setToken(token)
      
      // Redirect to profile
      window.location.reload()
    } else {
      showError('Login failed. Please check your credentials.')
    }
    
  } catch (error) {
    console.error('Login error:', error)
    showError(error.message || 'Login failed. Please try again.')
    
  } finally {
    // Re-enable button
    loginBtn.disabled = false
    loginBtn.textContent = 'Sign in'
  }
}

/**
 * Fetch JWT token from signin endpoint
 * @param {string} identifier - Username or email
 * @param {string} password - User password
 * @returns {Promise<string|null>} - JWT token or null if failed
 */
async function fetchJWTToken(identifier, password) {
  // Encode credentials in base64 for Basic Auth
  const credentials = btoa(`${identifier}:${password}`)
  
  try {
    const response = await fetch(SIGNIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    })
    
    // Check if response is OK (status 200-299)
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid username or password')
      } else if (response.status === 403) {
        throw new Error('Access forbidden')
      } else {
        throw new Error(`Login failed with status: ${response.status}`)
      }
    }
    
    // Get token from response (it's returned as plain text)
    const token = await response.text()
    
    // Clean and validate token
    const cleanToken = token.trim().replace(/^["']|["']$/g, '')
    
    if (!cleanToken || cleanToken.split('.').length !== 3) {
      throw new Error('Invalid token received from server')
    }
    
    return cleanToken
    
  } catch (error) {
    console.error('Failed to fetch JWT:', error)
    throw error
  }
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  const errorDiv = document.getElementById('error-message')
  if (errorDiv) {
    errorDiv.textContent = message
    errorDiv.style.display = 'block'
  }
}

/**
 * Hide error message
 */
function hideError() {
  const errorDiv = document.getElementById('error-message')
  if (errorDiv) {
    errorDiv.style.display = 'none'
  }
}