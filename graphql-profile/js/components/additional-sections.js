// ===== AUDIT SECTION =====

/**
 * Render audit information section
 * @param {Object} auditData - Audit ratio, totalUp, totalDown
 * @returns {HTMLElement}
 */
export function renderAuditSection(auditData = {}) {
  const { auditRatio = 0, totalUp = 0, totalDown = 0 } = auditData;
  
  const el = document.createElement('div');
  el.className = 'card profile-card';
  
  // Determine status color
  let statusColor = '#ef4444'; // red
  let statusText = 'Low';
  if (auditRatio >= 1) {
    statusColor = '#10b981'; // green
    statusText = 'Excellent';
  } else if (auditRatio >= 0.7) {
    statusColor = '#f59e0b'; // yellow
    statusText = 'Good';
  }
  
  el.innerHTML = `
    <h4>📊 Audit Statistics</h4>
    <div class="audit-stats">
      <div class="audit-ratio-display">
        <div class="audit-ratio-value" style="color: ${statusColor}">
          ${auditRatio.toFixed(2)}
        </div>
        <div class="audit-ratio-label">Audit Ratio</div>
        <div class="audit-ratio-status" style="color: ${statusColor}">
          ${statusText}
        </div>
      </div>
      
      <div class="audit-details">
        <div class="audit-detail-item">
          <div class="audit-detail-icon" style="background: #10b981">✓</div>
          <div>
            <div class="audit-detail-value">${formatBytes(totalUp)}</div>
            <div class="audit-detail-label">Audits Done</div>
          </div>
        </div>
        
        <div class="audit-detail-item">
          <div class="audit-detail-icon" style="background: #3b82f6">↓</div>
          <div>
            <div class="audit-detail-value">${formatBytes(totalDown)}</div>
            <div class="audit-detail-label">Audits Received</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return el;
}

// ===== GRADES/LEVEL SECTION =====

/**
 * Render grades and level section
 * @param {Object} gradeData - Level, average grade, etc.
 * @returns {HTMLElement}
 */
export function renderGradesSection(gradeData = {}) {
  const { level = 0, averageGrade = 0, passedProjects = 0, totalProjects = 0 } = gradeData;
  const passRate = totalProjects > 0 ? ((passedProjects / totalProjects) * 100).toFixed(1) : 0;
  
  const el = document.createElement('div');
  el.className = 'card profile-card';
  
  el.innerHTML = `
    <h4>📈 Academic Performance</h4>
    <div class="grades-container">
      <div class="grade-item highlight">
        <div class="grade-icon">🎓</div>
        <div class="grade-content">
          <div class="grade-value">${level}</div>
          <div class="grade-label">Current Level</div>
        </div>
      </div>
      
      <div class="grade-item">
        <div class="grade-icon">✨</div>
        <div class="grade-content">
          <div class="grade-value">${averageGrade.toFixed(1)}</div>
          <div class="grade-label">Average Grade</div>
        </div>
      </div>
      
      <div class="grade-item">
        <div class="grade-icon">🎯</div>
        <div class="grade-content">
          <div class="grade-value">${passRate}%</div>
          <div class="grade-label">Success Rate</div>
        </div>
      </div>
      
      <div class="grade-item">
        <div class="grade-icon">📚</div>
        <div class="grade-content">
          <div class="grade-value">${passedProjects}/${totalProjects}</div>
          <div class="grade-label">Completed</div>
        </div>
      </div>
    </div>
  `;
  
  return el;
}

// ===== RECENT ACTIVITY SECTION =====

/**
 * Render recent activity/timeline
 * @param {Array} activities - Array of recent activities
 * @returns {HTMLElement}
 */
export function renderRecentActivity(activities = []) {
  const el = document.createElement('div');
  el.className = 'card profile-card';
  
  el.innerHTML = `
    <h4>⏱️ Recent Activity</h4>
    <div class="activity-timeline">
      ${activities.slice(0, 5).map(activity => `
        <div class="activity-item">
          <div class="activity-dot ${activity.type}"></div>
          <div class="activity-content">
            <div class="activity-title">${activity.title}</div>
            <div class="activity-meta">
              <span class="activity-amount">+${formatNumber(activity.amount)} XP</span>
              <span class="activity-date">${formatTimeAgo(activity.date)}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  return el;
}

// ===== PISCINE STATS SECTION =====

/**
 * Render Piscine statistics
 * @param {Object} piscineData - Piscine Go/JS data
 * @returns {HTMLElement}
 */
export function renderPiscineSection(piscineData = {}) {
  const { piscineGo = [], piscineJs = [] } = piscineData;
  
  if (piscineGo.length === 0 && piscineJs.length === 0) {
    return null; // Don't show if no piscine data
  }
  
  const el = document.createElement('div');
  el.className = 'card profile-card';
  
  const calculatePiscineStats = (data) => {
    if (!data || data.length === 0) return { total: 0, passed: 0, passRate: 0 };
    const passed = data.filter(p => p.grade >= 1).length;
    return {
      total: data.length,
      passed,
      passRate: ((passed / data.length) * 100).toFixed(1)
    };
  };
  
  const goStats = calculatePiscineStats(piscineGo);
  const jsStats = calculatePiscineStats(piscineJs);
  
  el.innerHTML = `
    <h4>🏊 Piscine Statistics</h4>
    <div class="piscine-stats">
      ${piscineGo.length > 0 ? `
        <div class="piscine-item">
          <div class="piscine-header">
            <span class="piscine-name">Go Piscine</span>
            <span class="piscine-badge">${goStats.passRate}%</span>
          </div>
          <div class="piscine-progress">
            <div class="piscine-bar" style="width: ${goStats.passRate}%; background: #00ADD8"></div>
          </div>
          <div class="piscine-details">
            ${goStats.passed} / ${goStats.total} exercises passed
          </div>
        </div>
      ` : ''}
      
      ${piscineJs.length > 0 ? `
        <div class="piscine-item">
          <div class="piscine-header">
            <span class="piscine-name">JS Piscine</span>
            <span class="piscine-badge">${jsStats.passRate}%</span>
          </div>
          <div class="piscine-progress">
            <div class="piscine-bar" style="width: ${jsStats.passRate}%; background: #F7DF1E"></div>
          </div>
          <div class="piscine-details">
            ${jsStats.passed} / ${jsStats.total} exercises passed
          </div>
        </div>
      ` : ''}
    </div>
  `;
  
  return el;
}

// ===== UTILITY FUNCTIONS =====

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatTimeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}