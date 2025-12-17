import { isAuthenticated } from './auth/token-manager.js';
import { renderLogin } from './auth/login.js';
import { graphql } from './api/graphql-client.js';
import { GET_COMPLETE_PROFILE } from './api/queries.js';
import { renderProfile } from './components/profile.js';

const app = document.getElementById('app');
app.className = 'container';

/**
 * Bootstrap the application
 */
async function boot() {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    renderLogin(app);
    return;
  }

  // Show loading state
  app.innerHTML = '<div class="card">Loading profile...</div>';

  try {
    // Fetch profile data
    const response = await graphql(GET_COMPLETE_PROFILE);
    
    // Extract data from response
    const userData = response.data.user[0]; // Get first user (authenticated user)
    const totalXP = response.data.transaction_aggregate.aggregate.sum.amount || 0;
    const xpTransactions = response.data.transaction || [];
    const progressData = response.data.progress || [];
    
    // Build profile object
    const profile = {
      id: userData?.id,
      login: userData?.login || 'Unknown',
      name: userData?.login || 'Unknown', // Use login as name
      email: '', // Not available in basic query
      xp: totalXP,
      xpTransactions: xpTransactions,
      progress: progressData,
      projects: progressData.map(p => ({
        name: p.path.split('/').pop(), // Extract project name from path
        status: p.grade >= 1 ? 'PASS' : 'FAIL',
        grade: p.grade,
        path: p.path,
        date: p.createdAt
      }))
    };
    
    // Render profile
    renderProfile(app, profile);
    
  } catch (error) {
    console.error('Failed to load profile:', error);
    
    // Show error message
    app.innerHTML = `
      <div class="card">
        <h3>Failed to load profile</h3>
        <p class="muted">${error.message}</p>
        <button id="retry-btn" class="btn">Retry</button>
        <button id="logout-btn" class="btn">Logout</button>
      </div>
    `;
    
    // Add retry handler
    document.getElementById('retry-btn').addEventListener('click', () => {
      boot();
    });
    
    // Add logout handler
    document.getElementById('logout-btn').addEventListener('click', () => {
      import('./auth/token-manager.js').then(({ removeToken }) => {
        removeToken();
        window.location.reload();
      });
    });
  }
}

// Start the app
boot();