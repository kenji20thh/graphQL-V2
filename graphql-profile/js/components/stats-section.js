export function renderStats(profile){
  const el = document.createElement('div');
  el.className = 'card profile-card';
  el.innerHTML = `
    <h4>Statistics</h4>
    <div class="stats">
      <div class="chart">Projects: ${profile.projects?.length ?? 0}</div>
      <div class="chart">XP: ${profile.xp ?? 0}</div>
    </div>
  `;
  return el;
}
