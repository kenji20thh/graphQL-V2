import { createHeader } from './header.js';
import { renderUserInfo } from './user-info.js';
import { renderStats } from './stats-section.js';

export function renderProfile(target, profile){
  target.innerHTML = '';
  target.appendChild(createHeader(profile.name || 'Profile'));
  const grid = document.createElement('div');
  grid.className = 'profile-grid container';
  const left = document.createElement('div');
  left.appendChild(renderUserInfo(profile));
  left.appendChild(renderStats(profile));
  const right = document.createElement('div');
  right.className = 'card profile-card';
  right.innerHTML = '<h3>Projects</h3>' + (profile.projects?.map(p=>`<div>${p.name} — ${p.status}</div>`).join('') || '<div>No projects</div>');
  grid.appendChild(left);
  grid.appendChild(right);
  target.appendChild(grid);
}
