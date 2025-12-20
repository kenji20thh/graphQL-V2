import { createSVG } from './graph-utils.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Render Project Results chart (Grades)
 * @param {HTMLElement} container - Container element
 * @param {Array} projects - Array of project objects {name, grade, status, date}
 */
export function renderProjectChart(container, projects = []) {
  if (!projects || projects.length === 0) {
    container.innerHTML = '<p class="muted">No project data available</p>';
    return;
  }

  // Filter valid projects and sort by date (recent last)
  const validProjects = projects
    .filter(p => p.grade > 0) // Only show projects with grades
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-15); // Show last 15 projects to avoid crowding

  if (validProjects.length === 0) {
    container.innerHTML = '<p class="muted">No graded projects found</p>';
    return;
  }

  // Chart dimensions
  const width = 600;
  const height = 300;
  const padding = { top: 40, right: 20, bottom: 100, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Create SVG
  const svg = createSVG(width, height);
  svg.style.background = '#0a0f1a';
  svg.style.borderRadius = '8px';

  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);

  // Calculate scales
  const maxGrade = Math.max(...validProjects.map(p => p.grade), 1);
  const barWidth = Math.min(40, (chartWidth / validProjects.length) - 10);
  const spacing = (chartWidth - (validProjects.length * barWidth)) / (validProjects.length + 1);

  // Draw Y-axis grid
  const gridCount = 5;
  for (let i = 0; i <= gridCount; i++) {
    const y = (chartHeight / gridCount) * i;
    const value = (maxGrade - (maxGrade / gridCount) * i).toFixed(1);
    
    // Grid line
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', 0);
    line.setAttribute('y1', y);
    line.setAttribute('x2', chartWidth);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', '#1f2937');
    line.setAttribute('stroke-dasharray', '4');
    g.appendChild(line);

    // Label
    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', -10);
    text.setAttribute('y', y + 4);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('fill', '#9ca3af');
    text.setAttribute('font-size', '10');
    text.textContent = value;
    g.appendChild(text);
  }

  // Draw bars
  validProjects.forEach((project, i) => {
    const x = spacing + (i * (barWidth + spacing));
    const barHeight = (project.grade / maxGrade) * chartHeight;
    const y = chartHeight - barHeight;

    // Bar Group
    const barGroup = document.createElementNS(SVG_NS, 'g');
    
    // Bar
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', chartHeight); // Start from bottom for animation
    rect.setAttribute('width', barWidth);
    rect.setAttribute('height', 0);
    // Color based on grade (good grades = green, lower = yellow/orange)
    const hue = Math.min(120, (project.grade * 20)); // simple color scale
    rect.setAttribute('fill', `hsl(${hue}, 70%, 50%)`);
    rect.setAttribute('rx', '4');
    
    // Animation
    setTimeout(() => {
      rect.style.transition = 'all 0.8s ease-out';
      rect.setAttribute('y', y);
      rect.setAttribute('height', barHeight);
    }, i * 100);

    barGroup.appendChild(rect);

    // Hover tooltip
    const title = document.createElementNS(SVG_NS, 'title');
    title.textContent = `${project.name}\nGrade: ${project.grade.toFixed(2)}\nDate: ${new Date(project.date).toLocaleDateString()}`;
    barGroup.appendChild(title);

    // Hover effect
    barGroup.addEventListener('mouseenter', () => {
      rect.setAttribute('opacity', '0.8');
    });
    barGroup.addEventListener('mouseleave', () => {
      rect.setAttribute('opacity', '1');
    });

    g.appendChild(barGroup);

    // X-axis Label (Project Name) - Rotated
    const text = document.createElementNS(SVG_NS, 'text');
    const textX = x + barWidth / 2;
    const textY = chartHeight + 20;
    
    text.setAttribute('x', textX);
    text.setAttribute('y', textY);
    text.setAttribute('transform', `rotate(-45, ${textX}, ${textY})`);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('fill', '#9ca3af');
    text.setAttribute('font-size', '11');
    // Truncate long names
    const displayName = project.name.length > 15 ? project.name.substring(0, 12) + '...' : project.name;
    text.textContent = displayName;
    
    g.appendChild(text);
  });

  svg.appendChild(g);
  container.appendChild(svg);
}
