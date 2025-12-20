import { renderXPChart } from '../graphs/xp-chart.js';
import { renderProjectChart } from '../graphs/project-chart.js';
import { renderAuditChart, renderXPByProjectChart } from '../graphs/audit-chart.js';

/**
 * Render statistics section with SVG graphs
 * @param {Object} profile - User profile data
 * @returns {HTMLElement} - Statistics section element
 */
export function renderStats(profile) {
  const el = document.createElement('div');
  el.className = 'stats-container';
  
  // Statistics overview
  const statsOverview = document.createElement('div');
  statsOverview.className = 'card profile-card stats-overview';
  statsOverview.innerHTML = `
    <h4>Statistics Overview</h4>
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-value">${formatNumber(profile.xp || 0)}</div>
        <div class="stat-label">Total XP</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${profile.projects?.length || 0}</div>
        <div class="stat-label">Projects</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${calculatePassRate(profile.projects)}%</div>
        <div class="stat-label">Pass Rate</div>
      </div>
    </div>
  `;
  el.appendChild(statsOverview);

  // XP Chart
  const xpChartContainer = document.createElement('div');
  xpChartContainer.className = 'card profile-card chart-container';
  xpChartContainer.innerHTML = '<h4>XP Progression</h4>';
  const xpChartDiv = document.createElement('div');
  xpChartDiv.className = 'chart-wrapper';
  renderXPChart(xpChartDiv, profile.xpTransactions || []);
  xpChartContainer.appendChild(xpChartDiv);
  el.appendChild(xpChartContainer);

  // Project Pass/Fail Chart
  const projectChartContainer = document.createElement('div');
  projectChartContainer.className = 'card profile-card chart-container';
  projectChartContainer.innerHTML = '<h4>Project Results</h4>';
  const projectChartDiv = document.createElement('div');
  projectChartDiv.className = 'chart-wrapper';
  renderProjectChart(projectChartDiv, profile.projects || []);
  projectChartContainer.appendChild(projectChartDiv);
  el.appendChild(projectChartContainer);

  // Optional: XP by Project Chart (if you want a third chart)
  if (profile.xpTransactions && profile.xpTransactions.length > 0) {
    const xpByProjectContainer = document.createElement('div');
    xpByProjectContainer.className = 'card profile-card chart-container';
    xpByProjectContainer.innerHTML = '<h4>XP by Project</h4>';
    const xpByProjectDiv = document.createElement('div');
    xpByProjectDiv.className = 'chart-wrapper';
    renderXPByProjectChart(xpByProjectDiv, profile.xpTransactions);
    xpByProjectContainer.appendChild(xpByProjectDiv);
    el.appendChild(xpByProjectContainer);
  }

  // Optional: Audit Ratio Chart (if audit data is available)
  if (profile.auditRatio !== undefined) {
    const auditChartContainer = document.createElement('div');
    auditChartContainer.className = 'card profile-card chart-container';
    auditChartContainer.innerHTML = '<h4>Audit Statistics</h4>';
    const auditChartDiv = document.createElement('div');
    auditChartDiv.className = 'chart-wrapper';
    renderAuditChart(auditChartDiv, {
      auditRatio: profile.auditRatio,
      totalUp: profile.totalUp,
      totalDown: profile.totalDown
    });
    auditChartContainer.appendChild(auditChartDiv);
    el.appendChild(auditChartContainer);
  }

  return el;
}

/**
 * Calculate pass rate percentage
 * @param {Array} projects - Array of projects
 * @returns {number} - Pass rate percentage
 */
function calculatePassRate(projects = []) {
  if (!projects || projects.length === 0) return 0;
  
  const passed = projects.filter(p => 
    p.grade >= 1 || p.status === 'PASS'
  ).length;
  
  return Math.round((passed / projects.length) * 100);
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}