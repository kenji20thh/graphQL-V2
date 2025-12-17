export function renderUserInfo(user){
  const el = document.createElement('div');
  el.className = 'card profile-card';
  el.innerHTML = `
    <h3>${user.name}</h3>
    <p class="muted">${user.email}</p>
    <p>XP: ${user.xp ?? 0}</p>
  `;
  return el;
}
