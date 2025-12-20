import { isAuthenticated } from './auth/token-manager.js';
import { renderLogin } from './auth/login.js';
import { graphql } from './api/graphql-client.js';
import { GET_ENHANCED_PROFILE } from './api/queries.js';
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
    const response = await graphql(GET_ENHANCED_PROFILE);
    
    // Extract data from response
    const userData = response.data.user[0];
    const totalXP = response.data.transaction_aggregate.aggregate.sum.amount || 0;
    const xpTransactions = response.data.transaction || [];
    const progressData = response.data.progress || [];
    const totalUp = response.data.audit_up.aggregate.sum.amount || 0;
    const totalDown = response.data.audit_down.aggregate.sum.amount || 0;
    const auditRatio = totalDown > 0 ? totalUp / totalDown : 0;
    
    // Process projects
    const projects = progressData.map(p => ({
      name: p.path.split('/').pop(),
      status: p.grade >= 1 ? 'PASS' : 'FAIL',
      grade: p.grade,
      path: p.path,
      date: p.createdAt
    }));
    
    // Calculate grades data
    const passedProjects = projects.filter(p => p.grade >= 1).length;
    const totalProjects = projects.length;
    const grades = progressData.map(p => p.grade).filter(g => g > 0);
    const averageGrade = grades.length > 0 
      ? grades.reduce((a, b) => a + b, 0) / grades.length 
      : 0;
    
    // Process recent activity
    const recentActivity = xpTransactions
      .slice(-10)
      .reverse()
      .map(tx => ({
        title: tx.path.split('/').pop() || 'Project',
        amount: tx.amount,
        date: tx.createdAt,
        type: 'xp'
      }));
    
    // Process piscine data
    const piscineGo = progressData.filter(p => 
      p.path.toLowerCase().includes('piscine-go')
    );
    const piscineJs = progressData.filter(p => 
      p.path.toLowerCase().includes('piscine-js')
    );
    
    // Build complete profile object
    const profile = {
      // Basic info
      id: userData?.id,
      login: userData?.login || 'Unknown',
      name: userData?.login || 'Unknown',
      email: userData?.attrs?.email || '',
      
      // XP data
      xp: totalXP,
      xpTransactions: xpTransactions,
      
      // Projects
      projects: projects,
      
      // Audit data
      auditRatio: auditRatio,
      totalUp: totalUp,
      totalDown: totalDown,
      
      // Grades
      gradeData: {
        level: 0,
        averageGrade: averageGrade,
        passedProjects: passedProjects,
        totalProjects: totalProjects
      },
      
      // Activity
      recentActivity: recentActivity,
      
      // Piscine
      piscineData: {
        piscineGo: piscineGo,
        piscineJs: piscineJs
      }
    };
    
    // Render profile
    renderProfile(app, profile);
    
  } catch (error) {
    console.error('Failed to load profile:', error);
    
    // Show error message with details
    app.innerHTML = `
      <div class="card">
        <h3>Failed to load profile</h3>
        <p class="muted">${error.message}</p>
        <details style="margin-top: 12px; color: var(--muted); font-size: 12px;">
          <summary style="cursor: pointer;">Error Details</summary>
          <pre style="margin-top: 8px; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; overflow-x: auto;">${error.stack || error.message}</pre>
        </details>
        <div style="margin-top: 16px; display: flex; gap: 12px;">
          <button id="retry-btn" class="btn">Retry</button>
          <button id="logout-btn" class="btn">Logout</button>
        </div>
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