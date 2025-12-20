import { createSVG } from './graph-utils.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Render XP progression chart (Cumulative XP over time)
 * @param {HTMLElement} container - Container element
 * @param {Array} xpData - Array of XP transactions
 */
export function renderXPChart(container, xpData = []) {
  if (!xpData || xpData.length === 0) {
    container.innerHTML = '<p class="muted">No XP data available</p>';
    return;
  }

  // Calculate cumulative XP
  let currentXP = 0;
  const dataPoints = xpData.map(tx => {
    currentXP += tx.amount;
    return {
      date: new Date(tx.createdAt),
      amount: currentXP,
      projectName: tx.path.split('/').pop()
    };
  });

  // Chart dimensions
  const width = 600;
  const height = 300;
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Create SVG
  const svg = createSVG(width, height);
  svg.style.background = '#0a0f1a';
  svg.style.borderRadius = '8px';

  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);

  // Scales
  const maxXP = dataPoints[dataPoints.length - 1].amount;
  const minDate = dataPoints[0].date;
  const maxDate = dataPoints[dataPoints.length - 1].date;
  const timeSpan = maxDate - minDate;

  // Helper to scale values
  const getX = date => ((date - minDate) / timeSpan) * chartWidth;
  const getY = xp => chartHeight - ((xp / maxXP) * chartHeight);

  // Draw Grid Lines (Y-axis)
  const gridCount = 5;
  for (let i = 0; i <= gridCount; i++) {
    const y = (chartHeight / gridCount) * i;
    const value = Math.round(maxXP - (maxXP / gridCount) * i);
    
    // Grid line
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', 0);
    line.setAttribute('y1', y);
    line.setAttribute('x2', chartWidth);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', '#1f2937');
    line.setAttribute('stroke-dasharray', '4');
    g.appendChild(line);

    // Y-axis label
    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', -10);
    text.setAttribute('y', y + 4);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('fill', '#9ca3af');
    text.setAttribute('font-size', '10');
    text.textContent = formatNumber(value);
    g.appendChild(text);
  }

  // Generate Path
  let pathD = `M 0 ${chartHeight}`; // Start at bottom-left
  dataPoints.forEach(point => {
    pathD += ` L ${getX(point.date)} ${getY(point.amount)}`;
  });
  
  // Fill area under the line
  const areaPath = document.createElementNS(SVG_NS, 'path');
  areaPath.setAttribute('d', `${pathD} L ${chartWidth} ${chartHeight} Z`);
  areaPath.setAttribute('fill', 'rgba(16, 185, 129, 0.1)');
  g.appendChild(areaPath);

  // Line
  const linePath = document.createElementNS(SVG_NS, 'path');
  linePath.setAttribute('d', pathD);
  linePath.setAttribute('fill', 'none');
  linePath.setAttribute('stroke', '#10b981');
  linePath.setAttribute('stroke-width', '2');
  g.appendChild(linePath);

  // Interactive dots
  dataPoints.forEach((point, i) => {
    // Only show dots for significant jumps or if there are few points, 
    // otherwise it gets too crowded. showing last 20 points
    if (dataPoints.length > 20 && i < dataPoints.length - 20) return;

    const cx = getX(point.date);
    const cy = getY(point.amount);

    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', '3');
    circle.setAttribute('fill', '#10b981');
    circle.setAttribute('stroke', '#0a0f1a');
    circle.setAttribute('stroke-width', '1');
    
    // Tooltip behavior
    const title = document.createElementNS(SVG_NS, 'title');
    title.textContent = `${point.projectName}\nXP: ${formatNumber(point.amount)}\nDate: ${point.date.toLocaleDateString()}`;
    circle.appendChild(title);

    // Hover effect
    circle.addEventListener('mouseenter', () => {
      circle.setAttribute('r', '6');
      circle.setAttribute('fill', '#fff');
    });
    circle.addEventListener('mouseleave', () => {
      circle.setAttribute('r', '3');
      circle.setAttribute('fill', '#10b981');
    });

    g.appendChild(circle);
  });

  // X-axis labels (Dates)
  const dateCount = 4;
  for (let i = 0; i <= dateCount; i++) {
    const x = (chartWidth / dateCount) * i;
    const time = minDate.getTime() + (timeSpan / dateCount) * i;
    const date = new Date(time);
    
    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', chartHeight + 20);
    text.setAttribute('text-anchor', i === 0 ? 'start' : (i === dateCount ? 'end' : 'middle'));
    text.setAttribute('fill', '#9ca3af');
    text.setAttribute('font-size', '10');
    text.textContent = date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
    g.appendChild(text);
  }

  svg.appendChild(g);
  container.appendChild(svg);
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
  return num.toString();
}
