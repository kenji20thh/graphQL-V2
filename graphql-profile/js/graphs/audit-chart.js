import { createSVG } from './graph-utils.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Render audit ratio chart (audits done vs received)
 * @param {HTMLElement} container - Container element
 * @param {Object} auditData - Object with auditRatio, totalUp, totalDown
 */
export function renderAuditChart(container, auditData = {}) {
  const { auditRatio = 0, totalUp = 0, totalDown = 0 } = auditData;

  // Chart dimensions
  const width = 400;
  const height = 300;
  const padding = { top: 50, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Create SVG
  const svg = createSVG(width, height);
  svg.style.background = '#0a0f1a';
  svg.style.borderRadius = '8px';

  // Main group
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);

  // Title
  const title = document.createElementNS(SVG_NS, 'text');
  title.setAttribute('x', chartWidth / 2);
  title.setAttribute('y', '-20');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('fill', '#e6eef8');
  title.setAttribute('font-size', '16');
  title.setAttribute('font-weight', 'bold');
  title.textContent = 'Audit Ratio';
  g.appendChild(title);

  // Data for bars
  const data = [
    { label: 'Done', value: totalUp, color: '#10b981' },
    { label: 'Received', value: totalDown, color: '#3b82f6' }
  ];

  const maxValue = Math.max(totalUp, totalDown, 1);
  const barWidth = 60;
  const barSpacing = 100;

  // Draw bars
  data.forEach((item, i) => {
    const x = (chartWidth / 2) - (data.length * barSpacing / 2) + (i * barSpacing) + (barSpacing - barWidth) / 2;
    const barHeight = (item.value / maxValue) * chartHeight;
    const y = chartHeight - barHeight;

    // Bar group
    const barGroup = document.createElementNS(SVG_NS, 'g');
    barGroup.style.cursor = 'pointer';

    // Bar background
    const bgRect = document.createElementNS(SVG_NS, 'rect');
    bgRect.setAttribute('x', x);
    bgRect.setAttribute('y', 0);
    bgRect.setAttribute('width', barWidth);
    bgRect.setAttribute('height', chartHeight);
    bgRect.setAttribute('fill', '#1a2332');
    bgRect.setAttribute('rx', '4');
    barGroup.appendChild(bgRect);

    // Animated bar
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', chartHeight);
    rect.setAttribute('width', barWidth);
    rect.setAttribute('height', 0);
    rect.setAttribute('fill', item.color);
    rect.setAttribute('rx', '4');

    setTimeout(() => {
      rect.style.transition = 'all 0.8s ease-out';
      rect.setAttribute('y', y);
      rect.setAttribute('height', barHeight);
    }, i * 200);

    barGroup.addEventListener('mouseenter', () => {
      rect.setAttribute('opacity', '0.8');
    });
    barGroup.addEventListener('mouseleave', () => {
      rect.setAttribute('opacity', '1');
    });

    barGroup.appendChild(rect);

    // Value label
    const valueText = document.createElementNS(SVG_NS, 'text');
    valueText.setAttribute('x', x + barWidth / 2);
    valueText.setAttribute('y', y - 10);
    valueText.setAttribute('text-anchor', 'middle');
    valueText.setAttribute('fill', '#e6eef8');
    valueText.setAttribute('font-size', '14');
    valueText.setAttribute('font-weight', 'bold');
    valueText.textContent = item.value;
    valueText.style.opacity = '0';
    setTimeout(() => {
      valueText.style.transition = 'opacity 0.5s';
      valueText.style.opacity = '1';
    }, i * 200 + 800);
    barGroup.appendChild(valueText);

    // X-axis label
    const labelText = document.createElementNS(SVG_NS, 'text');
    labelText.setAttribute('x', x + barWidth / 2);
    labelText.setAttribute('y', chartHeight + 25);
    labelText.setAttribute('text-anchor', 'middle');
    labelText.setAttribute('fill', '#9ca3af');
    labelText.setAttribute('font-size', '12');
    labelText.textContent = item.label;
    barGroup.appendChild(labelText);

    g.appendChild(barGroup);
  });

  // Audit ratio display
  const ratioGroup = document.createElementNS(SVG_NS, 'g');
  
  const ratioBox = document.createElementNS(SVG_NS, 'rect');
  ratioBox.setAttribute('x', chartWidth / 2 - 60);
  ratioBox.setAttribute('y', chartHeight + 40);
  ratioBox.setAttribute('width', '120');
  ratioBox.setAttribute('height', '35');
  ratioBox.setAttribute('fill', '#1a2332');
  ratioBox.setAttribute('rx', '6');
  ratioGroup.appendChild(ratioBox);

  const ratioLabel = document.createElementNS(SVG_NS, 'text');
  ratioLabel.setAttribute('x', chartWidth / 2);
  ratioLabel.setAttribute('y', chartHeight + 55);
  ratioLabel.setAttribute('text-anchor', 'middle');
  ratioLabel.setAttribute('fill', '#9ca3af');
  ratioLabel.setAttribute('font-size', '10');
  ratioLabel.textContent = 'Audit Ratio';
  ratioGroup.appendChild(ratioLabel);

  const ratioValue = document.createElementNS(SVG_NS, 'text');
  ratioValue.setAttribute('x', chartWidth / 2);
  ratioValue.setAttribute('y', chartHeight + 70);
  ratioValue.setAttribute('text-anchor', 'middle');
  ratioValue.setAttribute('font-size', '14');
  ratioValue.setAttribute('font-weight', 'bold');
  
  if (auditRatio >= 1) {
    ratioValue.setAttribute('fill', '#10b981');
  } else if (auditRatio >= 0.7) {
    ratioValue.setAttribute('fill', '#f59e0b');
  } else {
    ratioValue.setAttribute('fill', '#ef4444');
  }
  
  ratioValue.textContent = auditRatio.toFixed(2);
  ratioGroup.appendChild(ratioValue);

  g.appendChild(ratioGroup);
  svg.appendChild(g);
  container.appendChild(svg);
}

/**
 * Render XP by project bar chart
 * @param {HTMLElement} container - Container element
 * @param {Array} xpData - Array of XP transactions with paths
 */
export function renderXPByProjectChart(container, xpData = []) {
  if (!xpData || xpData.length === 0) {
    container.innerHTML = '<p class="muted">No XP data available</p>';
    return;
  }

  // Group XP by project path
  const projectXP = {};
  xpData.forEach(item => {
    const projectName = item.path.split('/').pop() || 'Unknown';
    if (!projectXP[projectName]) {
      projectXP[projectName] = 0;
    }
    projectXP[projectName] += item.amount;
  });

  // Get top 5 projects by XP
  const sortedProjects = Object.entries(projectXP)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (sortedProjects.length === 0) {
    container.innerHTML = '<p class="muted">No project data</p>';
    return;
  }

  // Chart dimensions
  const width = 500;
  const height = 300;
  const padding = { top: 50, right: 40, bottom: 80, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Create SVG
  const svg = createSVG(width, height);
  svg.style.background = '#0a0f1a';
  svg.style.borderRadius = '8px';

  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);

  // Title
  const title = document.createElementNS(SVG_NS, 'text');
  title.setAttribute('x', chartWidth / 2);
  title.setAttribute('y', '-20');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('fill', '#e6eef8');
  title.setAttribute('font-size', '16');
  title.setAttribute('font-weight', 'bold');
  title.textContent = 'Top 5 Projects by XP';
  g.appendChild(title);

  const maxXP = Math.max(...sortedProjects.map(p => p[1]));
  const barWidth = chartWidth / sortedProjects.length - 20;

  // Draw bars
  sortedProjects.forEach(([name, xp], i) => {
    const x = (chartWidth / sortedProjects.length) * i + 10;
    const barHeight = (xp / maxXP) * chartHeight;
    const y = chartHeight - barHeight;

    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', chartHeight);
    rect.setAttribute('width', barWidth);
    rect.setAttribute('height', 0);
    rect.setAttribute('fill', `hsl(${200 + i * 30}, 70%, 50%)`);
    rect.setAttribute('rx', '4');

    setTimeout(() => {
      rect.style.transition = 'all 0.8s ease-out';
      rect.setAttribute('y', y);
      rect.setAttribute('height', barHeight);
    }, i * 150);

    g.appendChild(rect);

    // Value label
    const valueText = document.createElementNS(SVG_NS, 'text');
    valueText.setAttribute('x', x + barWidth / 2);
    valueText.setAttribute('y', y - 5);
    valueText.setAttribute('text-anchor', 'middle');
    valueText.setAttribute('fill', '#e6eef8');
    valueText.setAttribute('font-size', '12');
    valueText.textContent = formatNumber(xp);
    g.appendChild(valueText);

    // Project name
    const nameText = document.createElementNS(SVG_NS, 'text');
    nameText.setAttribute('x', x + barWidth / 2);
    nameText.setAttribute('y', chartHeight + 20);
    nameText.setAttribute('text-anchor', 'end');
    nameText.setAttribute('transform', `rotate(-45, ${x + barWidth / 2}, ${chartHeight + 20})`);
    nameText.setAttribute('fill', '#9ca3af');
    nameText.setAttribute('font-size', '11');
    nameText.textContent = name.length > 15 ? name.substring(0, 15) + '...' : name;
    g.appendChild(nameText);
  });

  svg.appendChild(g);
  container.appendChild(svg);
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}